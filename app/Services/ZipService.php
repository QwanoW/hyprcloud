<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\File;
use ZipArchive;
use Illuminate\Support\Collection;

class ZipService
{
    /**
     * Create a zip archive from files and folders
     */
    public function createZipFromFiles(Collection $files, string $zipPath): bool
    {
        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            return false;
        }

        $allFilesToZip = collect();
        $allFoldersToZip = collect();
        $addedItems = 0;
        
        foreach ($files as $file) {
            if ($file->isFolder()) {
                $this->collectFilesFromFolder($file, '', $allFilesToZip, $allFoldersToZip);
                // Add the root folder itself
                $allFoldersToZip->push($file->name . '/');
            } else {
                $allFilesToZip->push([
                    'file' => $file,
                    'zip_path' => $file->name
                ]);
            }
        }
        
        // Add folders to zip first
        foreach ($allFoldersToZip->unique() as $folderPath) {
            $zip->addEmptyDir($folderPath);
            $addedItems++;
        }
        
        // Add files to zip
        foreach ($allFilesToZip as $item) {
            $file = $item['file'];
            $zipEntryPath = $item['zip_path'];
            
            if (!$file->isFolder()) {
                $filePath = storage_path("app/private/" . $file->path);
                if (file_exists($filePath)) {
                    $zip->addFile($filePath, $zipEntryPath);
                    $addedItems++;
                }
            }
        }
        
        $zip->close();
        
        // Return true if zip file was created (even if empty)
        return file_exists($zipPath);
    }

    /**
     * Recursively collect all files from a folder and its subfolders
     */
    private function collectFilesFromFolder(File $folder, string $basePath, Collection $collection, Collection $foldersCollection): void
    {
        $currentPath = $basePath ? $basePath . '/' . $folder->name : $folder->name;
        
        $children = File::where('parent_folder_id', $folder->id)
                       ->where('user_id', $folder->user_id)
                       ->get();
        
        foreach ($children as $child) {
            if ($child->isFolder()) {
                // Add folder path to folders collection
                $childPath = $currentPath . '/' . $child->name . '/';
                $foldersCollection->push($childPath);
                $this->collectFilesFromFolder($child, $currentPath, $collection, $foldersCollection);
            } else {
                $collection->push([
                    'file' => $child,
                    'zip_path' => $currentPath . '/' . $child->name
                ]);
            }
        }
    }

    /**
     * Generate unique zip filename
     */
    public function generateZipFileName(string $prefix = 'files'): string
    {
        return $prefix . '_' . time() . '.zip';
    }

    /**
     * Get zip file path in storage
     */
    public function getZipPath(string $fileName): string
    {
        return storage_path("app/public/{$fileName}");
    }

    /**
     * Clean up old zip file
     */
    public function cleanupZipFile(string $fileName): void
    {
        $zipPath = $this->getZipPath($fileName);
        if (file_exists($zipPath)) {
            unlink($zipPath);
        }
    }
}