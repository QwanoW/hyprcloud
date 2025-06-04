<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use App\Enum\FileTypeEnum;
use App\Services\ActivityLoggerService;
use App\Http\Resources\FileResource;
use App\Models\File;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class FileController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
        $sort = $request->input('sort', 'date');
        $direction = $request->input('direction', 'desc');

        $query = File::query()
            ->where('user_id', Auth::id())
            ->whereNull('deleted_at');

        switch ($sort) {
            case 'alphabet':
                $query->orderBy('name', $direction);
                break;
            case 'size':
                $query->orderBy('size', $direction);
                break;
            case 'date':
            default:
                $query->orderBy('created_at', $direction);
                break;
        }

        $files = $query->paginate($perPage);

        return response()->json([
            'data' => FileResource::collection($files->items()),
            'pagination' => [
                'current_page' => $files->currentPage(),
                'last_page' => $files->lastPage(),
                'per_page' => $files->perPage(),
                'total' => $files->total(),
                'has_more_pages' => $files->hasMorePages(),
                'next_page_url' => $files->nextPageUrl(),
            ]
        ]);
    }

    public function gallery(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
        $sort = $request->input('sort', 'date');
        $direction = $request->input('direction', 'desc');

        $query = File::query()
            ->where('user_id', Auth::id())
            ->where('type', FileTypeEnum::IMAGE)
            ->whereNull('deleted_at');

        switch ($sort) {
            case 'alphabet':
                $query->orderBy('name', $direction);
                break;
            case 'size':
                $query->orderBy('size', $direction);
                break;
            case 'date':
            default:
                $query->orderBy('created_at', $direction);
                break;
        }

        $files = $query->paginate($perPage);

        return response()->json([
            'data' => FileResource::collection($files->items()),
            'pagination' => [
                'current_page' => $files->currentPage(),
                'last_page' => $files->lastPage(),
                'per_page' => $files->perPage(),
                'total' => $files->total(),
                'has_more_pages' => $files->hasMorePages(),
                'next_page_url' => $files->nextPageUrl(),
            ]
        ]);
    }

    public function trash(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
        $sort = $request->input('sort', 'date');
        $direction = $request->input('direction', 'desc');

        $query = File::query()
            ->where('user_id', Auth::id())
            ->onlyTrashed();

        switch ($sort) {
            case 'alphabet':
                $query->orderBy('name', $direction);
                break;
            case 'size':
                $query->orderBy('size', $direction);
                break;
            case 'date':
            default:
                $query->orderBy('created_at', $direction);
                break;
        }

        $files = $query->paginate($perPage);

        return response()->json([
            'data' => FileResource::collection($files->items()),
            'pagination' => [
                'current_page' => $files->currentPage(),
                'last_page' => $files->lastPage(),
                'per_page' => $files->perPage(),
                'total' => $files->total(),
                'has_more_pages' => $files->hasMorePages(),
                'next_page_url' => $files->nextPageUrl(),
            ]
        ]);
    }




    public function show(Request $request, $filepath)
    {
        $pathUserId = (int)substr($filepath, 0, strrpos($filepath, '/'));
        $userId = Auth::id();
        $referer = $request->headers->get('referer');
        
        // Parse the referer URL to get just the path
        $refererPath = parse_url($referer, PHP_URL_PATH);

        if (str_starts_with($refererPath, '/shared')) {
            $file = File::where('path', $filepath)->first();
            
            if (!$file || !$file->shared) {
                abort(403);
            }
        } else {
            if ($pathUserId !== $userId) {
                abort(403);
            }
        }

        $path = Storage::disk("local")->path($filepath);
        if (!file_exists($path)) {
            abort(404);
        }

        return response()->file($path);
    }


    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();
        $plan = $user->plan;
        
        // Validate files array
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'file|max:' . ($plan->max_file_size_bytes / 1024), // Convert MB to KB for Laravel validation
        ]);
        
        $uploadedFiles = [];
        $totalUploadSize = 0;
        
        // Calculate total size of files being uploaded
        foreach ($request->file('files') as $uploadedFile) {
            $totalUploadSize += $uploadedFile->getSize();
        }
        
        // Check if user has enough storage space
        if (!$user->hasStorageSpace($totalUploadSize)) {
            return response()->json([
                'message' => 'Insufficient storage space. You need ' . 
                    number_format(($user->storage_used_bytes + $totalUploadSize - $plan->storage_limit_bytes) / (1024 * 1024), 2) . 
                    ' MB more storage.',
                'error' => 'storage_limit_exceeded'
            ], 422);
        }
        
        // Check file count limit
        if ($plan->max_files_count && $user->files()->count() + count($request->file('files')) > $plan->max_files_count) {
            return response()->json([
                'message' => 'File count limit exceeded. Your plan allows maximum ' . $plan->max_files_count . ' files.',
                'error' => 'file_count_limit_exceeded'
            ], 422);
        }
    
        foreach ($request->file('files') as $uploadedFile) {
            $mimeType = $uploadedFile->getMimeType();
            $fileType = FileTypeEnum::OTHER;
    
            if (str_starts_with($mimeType, 'image/')) {
                $fileType = FileTypeEnum::IMAGE;
            } elseif (str_starts_with($mimeType, 'video/')) {
                $fileType = FileTypeEnum::VIDEO;
            } elseif (str_starts_with($mimeType, 'audio/')) {
                $fileType = FileTypeEnum::AUDIO;
            } else {
                $extension = strtolower($uploadedFile->getClientOriginalExtension());
                if (in_array($extension, ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'])) {
                    $fileType = FileTypeEnum::FILE;
                }
            }
    
            $extension = $uploadedFile->getClientOriginalExtension();
            $fileName = Str::random(40) . '.' . $extension;
            
            $path = $uploadedFile->storeAs($user->id, $fileName, 'local');
    
            $file = File::create([
                'user_id' => $user->id,
                'name' => $uploadedFile->getClientOriginalName(),
                'type' => $fileType->value,
                'size' => $uploadedFile->getSize(),
                'path' => $path,
            ]);
    
            ActivityLoggerService::logFileUpload(
                $file->id,
                $file->name,
                $file->size
            );
            
            $uploadedFiles[] = $file;
        }
    
        return response()->json([
            'message' => 'Files uploaded successfully',
            'files' => FileResource::collection($uploadedFiles)
        ], 201);
    }
    



    public function update(Request $request, $id): JsonResponse
    {
        $file = File::findOrFail($id);

        if ($file->user_id !== Auth::id()) {
            return response()->json(['error' => 'Access denied'], 403);
        }

        $rules = [
            'name'   => 'sometimes|string|max:255',
            'shared' => 'sometimes|boolean',
            'trash'  => 'sometimes|boolean',
            'file'   => 'sometimes|file|max:2097152',
        ];

        $validatedData = $request->validate($rules);

        $updateData = [];

        if (array_key_exists('name', $validatedData)) {
            $updateData['name'] = $validatedData['name'];
        }

        if (array_key_exists('shared', $validatedData)) {
            $updateData['shared'] = $validatedData['shared'];
        }

        if (array_key_exists('trash', $validatedData)) {
            $updateData['trash'] = $validatedData['trash'];
        }

        if ($request->hasFile('file')) {
            $uploadedFile = $request->file('file');
            $mimeType = $uploadedFile->getMimeType();

            $fileType = FileTypeEnum::OTHER;
            if (str_starts_with($mimeType, 'image/')) {
                $fileType = FileTypeEnum::IMAGE;
            } elseif (str_starts_with($mimeType, 'video/')) {
                $fileType = FileTypeEnum::VIDEO;
            } elseif (str_starts_with($mimeType, 'audio/')) {
                $fileType = FileTypeEnum::AUDIO;
            } else {
                $extension = strtolower($uploadedFile->getClientOriginalExtension());
                if (in_array($extension, ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'])) {
                    $fileType = FileTypeEnum::FILE;
                }
            }

            $user = Auth::user();
            $path = $uploadedFile->store($user->id, 'local');

            $updateData['name'] = $uploadedFile->getClientOriginalName();
            $updateData['type'] = $fileType->value;
            $updateData['size'] = $uploadedFile->getSize();
            $updateData['path'] = $path;
        }

        $file->update($updateData);

        return response()->json([
            'message' => 'File updated successfully',
            'file' => new FileResource($file)
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $file = File::findOrFail($id);

        if ($file->user_id !== Auth::id()) {
            return response()->json(['error' => 'Access denied'], 403);
        }

        ActivityLoggerService::logFileDelete(
            $file->id,
            $file->name,
            $file->size
        );

        $file->delete();

        return response()->json([
            'message' => 'File deleted successfully'
        ]);
    }



    public function destroyMultiple(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer',
        ]);

        $ids = $validated['ids'];
        $userId = Auth::id();

        $filesForDeletion = File::whereIn('id', $ids);

        $ownedFilesCount = $filesForDeletion
            ->where('user_id', $userId)
            ->count();

        if ($ownedFilesCount !== count($ids)) {
            return response()->json(['error' => 'Access denied'], 403);
        }

        $files = File::whereIn('id', $ids)->get();
        foreach ($files as $file) {
            ActivityLoggerService::logFileDelete(
                $file->id,
                $file->name,
                $file->size
            );
        }

        $filesForDeletion->delete();

        return response()->json([
            'message' => 'Files moved to trash successfully'
        ]);
    }



    public function destroyPermanentlyMultiple(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer',
        ]);

        $ids = $validated['ids'];
        $userId = Auth::id();

        $fileForMovingToTrash = File::withTrashed()->whereIn('id', $ids);

        $ownedFilesCount = $fileForMovingToTrash
            ->where('user_id', $userId)
            ->count();

        if ($ownedFilesCount !== count($ids)) {
            return response()->json(['error' => 'Access denied'], 403);
        }

        $fileForMovingToTrash->each(function (File $file) {
            ActivityLoggerService::logFileDelete(
                $file->id,
                $file->name,
                $file->size,
                true
            );
            $file->forceDelete();
        });

        return response()->json([
            'message' => 'Files permanently deleted successfully'
        ]);
    }



    public function restoreMultiple(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer',
        ]);

        $ids = $validated['ids'];
        $userId = Auth::id();

        $filesForRestore = File::withTrashed()->whereIn('id', $ids);

        $ownedFilesCount = $filesForRestore
            ->where('user_id', $userId)
            ->count();

        if ($ownedFilesCount !== count($ids)) {
            return response()->json(['error' => 'Access denied'], 403);
        }

        $filesForRestore->each(function (File $file) {
            ActivityLoggerService::logFileRestore(
                $file->id,
                $file->name,
                $file->size
            );
            $file->restore();
        });

        return response()->json([
            'message' => 'Files restored successfully'
        ]);
    }

    public function downloadZip(Request $request)
    {
        if (session()->has('last_zip_file')) {
            $previousZipFile = session('last_zip_file');
            $prevZipPath = storage_path("app/public/{$previousZipFile}");
            if (file_exists($prevZipPath)) {
                unlink($prevZipPath);
            }
            session()->forget('last_zip_file');
        }
    
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer',
        ]);
    
        $ids = $validated['ids'];
        $userId = Auth::id();
    
        $files = File::whereIn('id', $ids)->where('user_id', $userId)->get();
        
        if ($files->isEmpty()) {
            return response()->json(['error' => 'Файлы не найдены'], 404);
        }
    
        $zipFileName = "files_" . time() . ".zip";
        $zipPath = storage_path("app/public/{$zipFileName}");
    
        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            return response()->json(['error' => 'Не удалось создать архив'], 500);
        }
    
        foreach ($files as $file) {
            $filePath = storage_path("app/private/" . $file->path);
            if (file_exists($filePath)) {
                $zip->addFile($filePath, $file->name);
            }
        }
        
        $zip->close();
        
        $zipSize = filesize($zipPath);

        ActivityLoggerService::logZipDownload($ids, $zipSize);
    
        session(['last_zip_file' => $zipFileName]);
    
        $downloadUrl = asset("storage/{$zipFileName}");
    
        return response()->json([
            'download_url' => $downloadUrl
        ]);
    }
    
    public function search(Request $request)
    {
        $validated = $request->validate([
            'q' => 'required|string',
        ]);

        $query = $validated['q'];
        $userId = Auth::id();

        $files = File::query()
            ->where('user_id', $userId)
            ->where('name', 'like', '%' . $query . '%')
            ->limit(10)
            ->get();

        return response()->json([
            'data' => FileResource::collection($files),
        ]);
    }
}
