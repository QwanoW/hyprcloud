<?php

namespace App\Models;

use App\Enum\FileTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    /** @use HasFactory<\Database\Factories\FileFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'size',
        'path',
        'user_id',
        'collection_id',
        'parent_folder_id',
    ];

    public $casts = [
        'type' => FileTypeEnum::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class);
    }

    public function parentFolder(): BelongsTo
    {
        return $this->belongsTo(File::class, 'parent_folder_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(File::class, 'parent_folder_id');
    }

    public function folders(): HasMany
    {
        return $this->hasMany(File::class, 'parent_folder_id')
            ->where('type', FileTypeEnum::FOLDER);
    }

    public function files(): HasMany
    {
        return $this->hasMany(File::class, 'parent_folder_id')
            ->where('type', '!=', FileTypeEnum::FOLDER);
    }

    public function sharedLinks(): HasMany
    {
        return $this->hasMany(SharedLink::class);
    }

    public function activeSharedLinks(): HasMany
    {
        return $this->hasMany(SharedLink::class)
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    public function isShared(): bool
    {
        return $this->activeSharedLinks()->exists();
    }

    public function scopeFolders($query)
    {
        return $query->where('type', FileTypeEnum::FOLDER);
    }

    public function scopeFiles($query)
    {
        return $query->where('type', '!=', FileTypeEnum::FOLDER);
    }

    public function isFolder(): bool
    {
        return $this->type === FileTypeEnum::FOLDER;
    }

    public function getUrlAttribute(): ?string
    {
        if (!$this->path) {
            return null;
        }

        return route('files.show', ['filepath' => $this->path]);
    }

    public function getRealSize(): int
    {
        return $this->size;
    }

    public function allSubfolders(): HasMany
    {
        return $this->hasMany(File::class, 'parent_folder_id')
            ->where('type', FileTypeEnum::FOLDER)
            ->with('allSubfolders');
    }

    protected static function booted(): void
    {
        static::forceDeleting(function (File $file) {
            // Only delete physical files from storage, not folders
            if ($file->type !== FileTypeEnum::FOLDER && $file->path) {
                Storage::disk('local')->delete($file->path);
            }
        });

        // Update user storage statistics when files are created
        static::created(function (File $file) {
            // Load the user relationship if not already loaded
            if (!$file->relationLoaded('user')) {
                $file->load('user');
            }

            if ($file->user) {
                $file->user->updateStorageStatistics();
            }

            // Update parent folder size
            if ($file->parent_folder_id) {
                $parent = File::withTrashed()->find($file->parent_folder_id);
                if ($parent) {
                    $parent->update(['size' => $parent->size + $file->size]);
                }
            }
        });

        // Update user storage statistics when files are updated (size might change)
        static::updated(function (File $file) {
            if ($file->wasChanged('size')) {
                if (!$file->relationLoaded('user')) {
                    $file->load('user');
                }

                if ($file->user) {
                    $file->user->updateStorageStatistics();
                }
            }

            // Update parent folder size if size or parent changed
            if ($file->wasChanged('size') || $file->wasChanged('parent_folder_id')) {
                $oldParentId = $file->getOriginal('parent_folder_id');
                $newParentId = $file->parent_folder_id;
                $oldSize = $file->getOriginal('size');
                $newSize = $file->size;

                if ($oldParentId != $newParentId) {
                    if ($oldParentId) {
                        $oldParent = File::withTrashed()->find($oldParentId);
                        if ($oldParent) {
                            $oldParent->update(['size' => $oldParent->size - $oldSize]);
                        }
                    }
                    if ($newParentId) {
                        $newParent = File::withTrashed()->find($newParentId);
                        if ($newParent) {
                            $newParent->update(['size' => $newParent->size + $newSize]);
                        }
                    }
                } else {
                    if ($newParentId) {
                        $diff = $newSize - $oldSize;
                        if ($diff != 0) {
                            $parent = File::withTrashed()->find($newParentId);
                            if ($parent) {
                                $parent->update(['size' => $parent->size + $diff]);
                            }
                        }
                    }
                }
            }
        });

        // Update user storage statistics when files are deleted
        static::deleted(function (File $file) {
            if (!$file->relationLoaded('user')) {
                $file->load('user');
            }

            if ($file->user) {
                $file->user->updateStorageStatistics();
            }

            if (!$file->isForceDeleting() && $file->parent_folder_id) {
                $parent = File::withTrashed()->find($file->parent_folder_id);
                if ($parent) {
                    $parent->update(['size' => $parent->size - $file->size]);
                }
            }
        });

        static::restored(function (File $file) {
            if ($file->parent_folder_id) {
                $parent = File::withTrashed()->find($file->parent_folder_id);
                if ($parent) {
                    $parent->update(['size' => $parent->size + $file->size]);
                }
            }
        });

        // Update user storage statistics when files are force deleted
        static::forceDeleted(function (File $file) {
            if (!$file->relationLoaded('user')) {
                $file->load('user');
            }

            if ($file->user) {
                $file->user->updateStorageStatistics();
            }

            if ($file->parent_folder_id && !$file->getOriginal('deleted_at')) {
                $parent = File::withTrashed()->find($file->parent_folder_id);
                if ($parent) {
                    $parent->update(['size' => $parent->size - $file->size]);
                }
            }
        });
    }
}
