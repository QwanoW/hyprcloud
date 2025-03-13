<?php

namespace App\Http\Controllers;

use App\Http\Resources\FileCollection;
use App\Http\Resources\FileResource;
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
    protected function getPaginatedFiles(): ?LengthAwarePaginator
    {
        $currentPage = request()->input('page', 1);
        $perPage = request()->input('per_page', 10);

        $query = File::query()->where('user_id', Auth::id());

        $manualPartialLoad = request()->header('partial-load');

        if (!request()->header('X-Inertia') || !$manualPartialLoad) {
            $allResults = collect();

            for ($page = 1; $page <= $currentPage; $page++) {
                $pageResults = $query->paginate($perPage, ['*'], 'page', $page);
                $allResults = $allResults->concat($pageResults->items());
            }

            $totalFiles = File::query()->where('user_id', Auth::id())->count();

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

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'file|max:2097152',
        ]);

        $user = Auth::user();

        foreach ($request->file('files') as $uploadedFile) {
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

            $path = $uploadedFile->store('files/' . $user->id, 's3');

            File::create([
                'user_id' => $user->id,
                'name' => $uploadedFile->getClientOriginalName(),
                'type' => $fileType->value,
                'size' => $uploadedFile->getSize(),
                'path' => $path,
                'trash' => false,
                'shared' => false,
            ]);
        }

        return back();
    }

    public function update(Request $request, $id)
    {
        $file = File::findOrFail($id);

        if ($file->user_id !== Auth::id()) {
            abort(403, 'Доступ запрещен');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'path' => 'required|string',
        ]);

        $file->update($request->only('name', 'path'));

        return redirect()->route('files.index')
            ->with('success', 'Файл успешно обновлен!');
    }

    public function destroy($id): RedirectResponse
    {
        $file = File::findOrFail($id);

        if ($file->user_id !== Auth::id()) {
            abort(403);
        }

        $file->delete();

        return back();
    }
}
