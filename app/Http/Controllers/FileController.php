<?php

namespace App\Http\Controllers;

use App\Enum\FileTypeEnum;
use App\Http\Resources\FileCollection;
use App\Models\File;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FileController extends Controller
{
    public static function getPaginatedFiles(array $options = []): ?LengthAwarePaginator
    {
        $trash = $options['trash'] ?? false;
        $image = $options['image'] ?? false;

        $currentPage = request()->input('page', 1);
        $perPage = request()->input('per_page', 10);

        $query = File::query()
            ->where('user_id', Auth::id())
            ->when($trash, fn($q) => $q->onlyTrashed())
            ->when($image, fn($q) => $q->where('type', FileTypeEnum::IMAGE));

        $manualPartialLoad = request()->header('partial-load');

        if (!request()->header('X-Inertia') || !$manualPartialLoad) {
            $allResults = collect();

            for ($page = 1; $page <= $currentPage; $page++) {
                $pageResults = $query->paginate($perPage, ['*'], 'page', $page);
                $allResults = $allResults->concat($pageResults->items());
            }

            $totalFiles = File::query()
                ->where('user_id', Auth::id())
                ->when($trash, fn($q) => $q->onlyTrashed())
                ->when($image, fn($q) => $q->where('type', FileTypeEnum::IMAGE))
                ->count();

            return new LengthAwarePaginator(
                $allResults,
                $totalFiles,
                $perPage,
                $currentPage
            );
        }

        return $query->paginate($perPage);
    }

    public function index(Request $request)
    {
        $files = $this->getPaginatedFiles();
        return Inertia::render('dashboard', [
            'files' => inertia()->merge(fn() => (new FileCollection($files))->collection),
            'pagination' => Arr::except($files->toArray(), ['data']),
        ]);
    }


    public function show(Request $request, $filepath)
    {
        $pathUserId = (int)substr($filepath, 0, strrpos($filepath, '/'));
        $userId = Auth::id();
        if ($pathUserId !== $userId) {
            abort(403);
        }

        $path = Storage::disk("local")->path($filepath);
        if (!file_exists($path)) {
            abort(404);
        }

        return response()->file($path);
    }


    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'file|max:2097152',
        ]);

        $user = Auth::user();

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

            $path = $uploadedFile->store($user->id, 'local');

            File::create([
                'user_id' => $user->id,
                'name' => $uploadedFile->getClientOriginalName(),
                'type' => $fileType->value,
                'size' => $uploadedFile->getSize(),
                'path' => $path,
            ]);
        }

        return back();
    }

    public function update(Request $request, $id): RedirectResponse
    {
        $file = File::findOrFail($id);

        if ($file->user_id !== Auth::id()) {
            abort(403, 'Доступ запрещен');
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

            $fileType = \App\Enum\FileTypeEnum::OTHER;
            if (str_starts_with($mimeType, 'image/')) {
                $fileType = \App\Enum\FileTypeEnum::IMAGE;
            } elseif (str_starts_with($mimeType, 'video/')) {
                $fileType = \App\Enum\FileTypeEnum::VIDEO;
            } elseif (str_starts_with($mimeType, 'audio/')) {
                $fileType = \App\Enum\FileTypeEnum::AUDIO;
            } else {
                $extension = strtolower($uploadedFile->getClientOriginalExtension());
                if (in_array($extension, ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'])) {
                    $fileType = \App\Enum\FileTypeEnum::FILE;
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

        return back();
    }

    public
    function destroy($id): RedirectResponse
    {
        $file = File::findOrFail($id);

        if ($file->user_id !== Auth::id()) {
            abort(403);
        }

        $file->delete();

        return back();
    }

    public
    function destroyMultiple(Request $request): RedirectResponse
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
            abort(403);
        }

        $filesForDeletion->delete();

        return back();
    }

    public
    function destroyPermanentlyMultiple(Request $request): RedirectResponse
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
            abort(403);
        }

        $fileForMovingToTrash->each(function (File $file) {
            $file->forceDelete();
        });

        return back();
    }

    public
    function restore($id): RedirectResponse
    {
        $file = File::findOrFail($id);

        if ($file->user_id !== Auth::id()) {
            abort(403);
        }

        $file->restore();

        return back();
    }
    public
    function restoreMultiple(Request $request): RedirectResponse
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
            abort(403);
        }

        $filesForRestore->each(function (File $file) {
            $file->restore();
        });

        return back();
    }
}
