<?php

namespace App\Http\Controllers;

use App\Enum\RolesEnum;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use App\Enum\FileTypeEnum;
use App\Services\ActivityLoggerService;
use App\Services\ZipService;
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

    public function show(Request $request, $filepath)
    {
        $file = File::where('path', $filepath)->firstOrFail();

        $user = Auth::user();

        if ($file->user_id !== $user->id && !$user->hasRole(RolesEnum::Admin)) {
            abort(403);
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

        $request->validate([
            'files' => 'required|array',
            'files.*' => 'file|max:' . ($plan->max_file_size_bytes / 1024), // Convert MB to KB for Laravel validation
            'collection_id' => 'nullable|exists:collections,id',
            'parent_folder_id' => 'nullable|exists:files,id',
        ]);

        $uploadedFiles = [];
        $totalUploadSize = 0;

        // Calculate total size of files being uploaded
        foreach ($request->file('files') as $uploadedFile) {
            $totalUploadSize += $uploadedFile->getSize();
        }

        // Check if user has enough storage space
        if (!$user->hasStorageSpace($totalUploadSize)) {
            $neededSpace = number_format(($user->storage_used_bytes + $totalUploadSize - $plan->storage_limit_bytes) / (1024 * 1024), 2);
            return response()->json([
                'message' => __('file_manage.insufficient_storage', ['space' => $neededSpace]),
                'error' => 'storage_limit_exceeded'
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
            $originalName = $uploadedFile->getClientOriginalName();

            // Check for duplicate file with same name and extension
            $existingFile = File::withTrashed()->where('user_id', $user->id)
                ->where('name', $originalName)
                ->where('parent_folder_id', $request->input('parent_folder_id'))
                ->first();

            if ($existingFile) {
                return response()->json([
                    'message' => __('file_manage.duplicate_file', ['name' => $originalName]),
                    'error' => 'duplicate_file'
                ], 422);
            }

            $fileName = Str::random(40) . '.' . $extension;

            $path = $uploadedFile->storeAs($user->id, $fileName, 'local');

            $file = File::create([
                'user_id' => $user->id,
                'name' => $uploadedFile->getClientOriginalName(),
                'type' => $fileType->value,
                'size' => $uploadedFile->getSize(),
                'path' => $path,
                'collection_id' => $request->input('collection_id'),
                'parent_folder_id' => $request->input('parent_folder_id'),
            ]);

            ActivityLoggerService::logFileUpload(
                $file->id,
                $file->name,
                $file->size
            );

            $uploadedFiles[] = $file;
        }

        return response()->json([
            'message' => __('file_manage.files_uploaded'),
            'files' => FileResource::collection($uploadedFiles)
        ], 201);
    }

    public function uploadChunk(Request $request): JsonResponse
    {
        $user = Auth::user();
        $plan = $user->plan;

        $request->validate([
            'file' => 'required|file',
            'chunk_index' => 'required|integer',
            'total_chunks' => 'required|integer',
            'upload_id' => 'required|string',
            'original_name' => 'required|string',
            'collection_id' => 'nullable|exists:collections,id',
            'parent_folder_id' => 'nullable|exists:files,id',
        ]);

        $file = $request->file('file');
        $chunkIndex = $request->input('chunk_index');
        $totalChunks = $request->input('total_chunks');
        $uploadId = $request->input('upload_id');
        $originalName = $request->input('original_name');

        // Temporary directory for chunks
        $tempDir = 'chunks/' . $user->id . '/' . $uploadId;

        $file->storeAs($tempDir, "chunk_{$chunkIndex}");

        $allChunksUploaded = true;
        for ($i = 0; $i < $totalChunks; $i++) {
            if (!Storage::exists("{$tempDir}/chunk_{$i}")) {
                $allChunksUploaded = false;
                break;
            }
        }

        if ($allChunksUploaded) {
            $finalPath = $user->id . '/' . Str::random(40) . '.' . pathinfo($originalName, PATHINFO_EXTENSION);
            $fullFinalPath = Storage::path($finalPath);

            Storage::makeDirectory(dirname($finalPath));

            $outputFile = fopen($fullFinalPath, 'wb');

            for ($i = 0; $i < $totalChunks; $i++) {
                $chunkPath = Storage::path("{$tempDir}/chunk_{$i}");
                $chunkFile = fopen($chunkPath, 'rb');
                stream_copy_to_stream($chunkFile, $outputFile);
                fclose($chunkFile);
            }
            fclose($outputFile);

            Storage::deleteDirectory($tempDir);

            $size = Storage::size($finalPath);

            // Check storage limit
            if (!$user->hasStorageSpace($size)) {
                Storage::delete($finalPath);
                $neededSpace = number_format(($user->storage_used_bytes + $size - $plan->storage_limit_bytes) / (1024 * 1024), 2);
                return response()->json([
                    'message' => __('file_manage.insufficient_storage', ['space' => $neededSpace]),
                    'error' => 'storage_limit_exceeded'
                ], 422);
            }

            $mimeType = Storage::mimeType($finalPath);
            $fileType = FileTypeEnum::OTHER;
            if (str_starts_with($mimeType, 'image/')) {
                $fileType = FileTypeEnum::IMAGE;
            } elseif (str_starts_with($mimeType, 'video/')) {
                $fileType = FileTypeEnum::VIDEO;
            } elseif (str_starts_with($mimeType, 'audio/')) {
                $fileType = FileTypeEnum::AUDIO;
            } else {
                $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
                if (in_array($extension, ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'])) {
                    $fileType = FileTypeEnum::FILE;
                }
            }

            // Check for duplicate
            $existingFile = File::withTrashed()->where('user_id', $user->id)
                ->where('name', $originalName)
                ->where('parent_folder_id', $request->input('parent_folder_id'))
                ->first();

            if ($existingFile) {
                Storage::delete($finalPath);
                return response()->json([
                    'message' => __('file_manage.duplicate_file', ['name' => $originalName]),
                    'error' => 'duplicate_file'
                ], 422);
            }

            $fileModel = File::create([
                'user_id' => $user->id,
                'name' => $originalName,
                'type' => $fileType->value,
                'size' => $size,
                'path' => $finalPath,
                'collection_id' => $request->input('collection_id'),
                'parent_folder_id' => $request->input('parent_folder_id'),
            ]);

            ActivityLoggerService::logFileUpload(
                $fileModel->id,
                $fileModel->name,
                $fileModel->size
            );

            return response()->json([
                'message' => __('file_manage.files_uploaded'),
                'file' => new FileResource($fileModel),
                'completed' => true
            ], 201);
        }

        return response()->json([
            'message' => 'Chunk uploaded',
            'completed' => false
        ]);
    }




    public function update(Request $request, $id): JsonResponse
    {
        $file = File::findOrFail($id);

        if ($file->user_id !== Auth::id()) {
            return response()->json(['error' => __('file_manage.access_denied')], 403);
        }

        $rules = [
            'name' => 'sometimes|string|max:255',
            'trash' => 'sometimes|boolean',
            'file' => 'sometimes|file|max:2097152',
        ];

        $validatedData = $request->validate($rules);

        $updateData = [];

        if (array_key_exists('name', $validatedData)) {
            $updateData['name'] = $validatedData['name'];
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
            'message' => __('file_manage.file_updated'),
            'file' => new FileResource($file)
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $file = File::findOrFail($id);

        if ($file->user_id !== Auth::id()) {
            return response()->json(['error' => __('file_manage.access_denied')], 403);
        }

        ActivityLoggerService::logFileDelete(
            $file->id,
            $file->name,
            $file->size
        );

        $file->delete();

        return response()->json([
            'message' => __('file_manage.file_deleted')
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
            return response()->json(['error' => __('file_manage.access_denied')], 403);
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
            'message' => __('file_manage.files_moved_to_trash')
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
            return response()->json(['error' => __('file_manage.access_denied')], 403);
        }

        try {
            $fileForMovingToTrash->each(function (File $file) {
                ActivityLoggerService::logFileDelete(
                    $file->id,
                    $file->name,
                    $file->size,
                    true
                );
                $file->forceDelete();
            });
        } catch (\Exception $e) {
            \Log::error('Error during bulk permanent delete: ' . $e->getMessage(), [
                'user_id' => $userId,
                'file_ids' => $ids,
                'exception' => $e
            ]);

            return response()->json([
                'error' => __('file_manage.delete_error')
            ], 500);
        }

        return response()->json([
            'message' => __('file_manage.files_deleted_permanently')
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
            return response()->json(['error' => __('file_manage.access_denied')], 403);
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
            'message' => __('file_manage.files_restored')
        ]);
    }

    public function downloadZip(Request $request, ZipService $zipService)
    {
        if (session()->has('last_zip_file')) {
            $previousZipFile = session('last_zip_file');
            $zipService->cleanupZipFile($previousZipFile);
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
            return response()->json(['error' => __('file_manage.files_not_found')], 404);
        }

        $zipFileName = $zipService->generateZipFileName();
        $zipPath = $zipService->getZipPath($zipFileName);

        if (!$zipService->createZipFromFiles($files, $zipPath)) {
            return response()->json(['error' => __('file_manage.archive_creation_failed')], 500);
        }

        if (!file_exists($zipPath)) {
            return response()->json(['error' => __('file_manage.archive_creation_failed')], 500);
        }

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
            ->get();

        return response()->json([
            'data' => FileResource::collection($files),
        ]);
    }
}
