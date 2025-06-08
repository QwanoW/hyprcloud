<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class SharedLink extends Model
{
    protected $fillable = [
        'file_id',
        'user_id',
        'token',
        'password',
        'expires_at',
        'allow_download',
        'is_active',
        'access_count',
        'last_accessed_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'last_accessed_at' => 'datetime',
        'allow_download' => 'boolean',
        'is_active' => 'boolean',
        'access_count' => 'integer',
    ];

    protected $hidden = [
        'password',
    ];

    public function file(): BelongsTo
    {
        return $this->belongsTo(File::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function generateToken(): string
    {
        return Str::random(32);
    }

    public function setPasswordAttribute($value): void
    {
        $this->attributes['password'] = $value ? Hash::make($value) : null;
    }

    public function checkPassword(string $password): bool
    {
        return $this->password ? Hash::check($password, $this->password) : true;
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function isAccessible(): bool
    {
        return $this->is_active && !$this->isExpired();
    }

    public function incrementAccessCount(): void
    {
        $this->increment('access_count');
        $this->update(['last_accessed_at' => now()]);
    }

    public function getShareUrl(): string
    {
        return url("/shared/{$this->token}");
    }

    protected static function booted(): void
    {
        static::creating(function (SharedLink $sharedLink) {
            if (!$sharedLink->token) {
                $sharedLink->token = self::generateToken();
            }
        });
    }
}
