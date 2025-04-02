<?php

namespace App\Services;

use App\Models\UserActivity;
use Illuminate\Support\Facades\Auth;

class ActivityLoggerService
{
    /**
     *
     * @param string $actionType
     * @param string|null $entityType
     * @param int|null $entityId
     * @param string|null $entityName
     * @param int|null $size
     * @param array|null $metadata
     * @return UserActivity
     */
    public static function log(
        string $actionType,
        ?string $entityType = null,
        ?int $entityId = null,
        ?string $entityName = null,
        ?int $size = null,
        ?array $metadata = null
    ): UserActivity {
        return UserActivity::create([
            'user_id' => Auth::id(),
            'action_type' => $actionType,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'entity_name' => $entityName,
            'size' => $size,
            'metadata' => $metadata,
        ]);
    }

    /**
     *
     * @param int $fileId
     * @param string $fileName
     * @param int $fileSize
     * @return UserActivity
     */
    public static function logFileUpload(int $fileId, string $fileName, int $fileSize): UserActivity
    {
        return self::log('upload', 'file', $fileId, $fileName, $fileSize);
    }

    /**
     *
     * @param int $fileId
     * @param string $fileName
     * @param int $fileSize
     * @param bool $permanent
     * @return UserActivity
     */
    public static function logFileDelete(int $fileId, string $fileName, int $fileSize, bool $permanent = false): UserActivity
    {
        return self::log(
            $permanent ? 'permanent_delete' : 'delete',
            'file',
            $fileId,
            $fileName,
            $fileSize
        );
    }

    /**
     *
     * @param int $fileId
     * @param string $fileName
     * @param int $fileSize
     * @return UserActivity
     */
    public static function logFileRestore(int $fileId, string $fileName, int $fileSize): UserActivity
    {
        return self::log('restore', 'file', $fileId, $fileName, $fileSize);
    }

    /**
     *
     * @param int $fileId
     * @param string $fileName
     * @param int $fileSize
     * @return UserActivity
     */
    public static function logFileDownload(int $fileId, string $fileName, int $fileSize): UserActivity
    {
        return self::log('download', 'file', $fileId, $fileName, $fileSize);
    }

    /**
     *
     * @param array $fileIds
     * @param int $zipSize
     * @return UserActivity
     */
    public static function logZipDownload(array $fileIds, int $zipSize): UserActivity
    {
        return self::log('zip_download', 'zip', null, 'archive.zip', $zipSize, [
            'file_ids' => $fileIds
        ]);
    }
}