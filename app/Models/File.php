<?php

namespace App\Models;

use App\Enum\FileTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    /** @use HasFactory<\Database\Factories\FileFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $guarded = [];

    public $casts = [
        'type' => FileTypeEnum::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted(): void
    {
        static::forceDeleting(function (File $file) {
            Storage::disk('local')->delete($file->path);
        });
        
        // Update user storage statistics when files are created
        static::created(function (File $file) {
            if ($file->user) {
                $file->user->updateStorageStatistics();
            }
        });
        
        // Update user storage statistics when files are updated (size might change)
        static::updated(function (File $file) {
            if ($file->user && $file->wasChanged('size')) {
                $file->user->updateStorageStatistics();
            }
        });
        
        // Update user storage statistics when files are deleted
        static::deleted(function (File $file) {
            if ($file->user) {
                $file->user->updateStorageStatistics();
            }
        });
        
        // Update user storage statistics when files are force deleted
        static::forceDeleted(function (File $file) {
            if ($file->user) {
                $file->user->updateStorageStatistics();
            }
        });
    }
}
