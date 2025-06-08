<?php

namespace App\Http\Controllers;

use App\Enum\FileTypeEnum;
use App\Http\Resources\FileResource;
use App\Models\File;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FileManagerController extends Controller
{
    use AuthorizesRequests;

    /**
     * Get files and folders for a specific location
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 50);
        $sort = $request->input('sort_by', 'date');
        $direction = $request->input('sort_direction', 'desc');
        $collectionId = $request->input('collection_id');
        $parentFolderId = $request->input('parent_folder_id');
        $type = $request->input('type', 'all');

        $query = File::query()
            ->where('user_id', Auth::id());

        // Filter by type
        switch ($type) {
            case 'gallery':
                $query->where('type', FileTypeEnum::IMAGE)
                      ->whereNull('deleted_at');
                break;
            case 'trash':
                $query->onlyTrashed();
                break;
            case 'shared':
                $query->whereHas('activeSharedLinks')
                      ->whereNull('deleted_at');
                break;
            case 'all':
            default:
                $query->whereNull('deleted_at');
                break;
        }

        // Filter by collection if provided
        if ($collectionId) {
            $query->where('collection_id', $collectionId);
        }

        // Filter by parent folder if provided (only for non-trash views)
        if ($type !== 'trash') {
            if ($parentFolderId) {
                $query->where('parent_folder_id', $parentFolderId);
            } else {
                // If no parent folder specified, get root level items
                $query->whereNull('parent_folder_id');
            }
        }

        // Order folders first, then files (except for trash view)
        if ($type !== 'trash') {
            $query->orderByRaw("CASE WHEN type = 'folder' THEN 0 ELSE 1 END");
        }

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

    /**
     * Create a new folder
     */
    public function createFolder(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:files',
            'collection_id' => 'nullable|exists:collections,id',
            'parent_folder_id' => 'nullable|exists:files,id',
        ]);

        // Verify parent folder belongs to user and is actually a folder
        if ($request->parent_folder_id) {
            $parentFolder = File::where('id', $request->parent_folder_id)
                ->where('user_id', Auth::id())
                ->where('type', FileTypeEnum::FOLDER)
                ->first();

            if (!$parentFolder) {
                return response()->json(['error' => 'Invalid parent folder'], 422);
            }
        }

        $folder = File::create([
            'name' => $request->name,
            'type' => FileTypeEnum::FOLDER,
            'size' => 0,
            'path' => null,
            'user_id' => Auth::id(),
            'collection_id' => $request->collection_id,
            'parent_folder_id' => $request->parent_folder_id,
            'shared' => false,
        ]);

        return response()->json(new FileResource($folder), 201);
    }

    /**
     * Get folder tree for move operations
     */
    public function tree(Request $request): JsonResponse
    {
        $collectionId = $request->input('collection_id');

        $query = File::where('user_id', Auth::id())
            ->where('type', FileTypeEnum::FOLDER)
            ->with('allSubfolders')
            ->whereNull('parent_folder_id');

        if ($collectionId) {
            $query->where('collection_id', $collectionId);
        }

        $folders = $query->get();

        return response()->json(FileResource::collection($folders));
    }

    /**
     * Move file or folder to a new location
     */
    public function move(Request $request, $id): JsonResponse
    {
        $request->validate([
            'parent_folder_id' => 'nullable|exists:files,id',
            'collection_id' => 'nullable|exists:collections,id',
        ]);

        $file = File::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Verify parent folder belongs to user and is actually a folder
        if ($request->parent_folder_id) {
            $parentFolder = File::where('id', $request->parent_folder_id)
                ->where('user_id', Auth::id())
                ->where('type', FileTypeEnum::FOLDER)
                ->first();

            if (!$parentFolder) {
                return response()->json(['error' => 'Invalid parent folder'], 422);
            }

            // Prevent moving a folder into itself or its descendants
            if ($file->type === FileTypeEnum::FOLDER) {
                if ($this->isDescendantOf($request->parent_folder_id, $file->id)) {
                    return response()->json(['error' => 'Cannot move folder into itself or its descendants'], 422);
                }
            }
        }

        $file->update([
            'parent_folder_id' => $request->parent_folder_id,
            'collection_id' => $request->collection_id,
        ]);

        return response()->json(new FileResource($file));
    }

    /**
     * Check if a folder is a descendant of another folder
     */
    private function isDescendantOf($potentialDescendantId, $ancestorId): bool
    {
        $current = File::find($potentialDescendantId);
        
        while ($current && $current->parent_folder_id) {
            if ($current->parent_folder_id == $ancestorId) {
                return true;
            }
            $current = File::find($current->parent_folder_id);
        }
        
        return false;
    }

    /**
     * Update file or folder name
     */
    public function updateName(Request $request, $id): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $file = File::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $file->update(['name' => $request->name]);

        return response()->json(new FileResource($file));
    }

    /**
     * Delete file or folder
     */
    public function destroy($id): JsonResponse
    {
        $file = File::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // If it's a folder, delete all contents recursively
        if ($file->type === FileTypeEnum::FOLDER) {
            $this->deleteFolder($file);
        } else {
            $file->delete();
        }

        return response()->json(['message' => 'Item deleted successfully']);
    }

    /**
     * Recursively delete folder and all its contents
     */
    private function deleteFolder(File $folder): void
    {
        // Delete all children (files and subfolders)
        $children = File::where('parent_folder_id', $folder->id)->get();
        
        foreach ($children as $child) {
            if ($child->type === FileTypeEnum::FOLDER) {
                $this->deleteFolder($child);
            } else {
                $child->delete();
            }
        }
        
        // Delete the folder itself
        $folder->delete();
    }
}