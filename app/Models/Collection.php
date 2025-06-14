<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Collection extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'icon',
        'user_id',
    ];

    protected $appends = [
        'files_count',
        'folders_count',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(File::class);
    }

    public function getFilesCountAttribute(): int
    {
        return $this->files()->where('type', '!=', 'folder')->count();
    }

    public function getFoldersCountAttribute(): int
    {
        return $this->files()->where('type', 'folder')->count();
    }
}
