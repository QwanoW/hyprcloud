<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enum\RolesEnum;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $guarded = [];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'storage_used_bytes' => 'integer',
            'files_count' => 'integer',
            'storage_stats_updated_at' => 'datetime',
        ];
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function files()
    {
        return $this->hasMany(File::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function getStorageUsedBytesAttribute(): int
    {
        // Use cached value if available and recent, otherwise calculate and cache
        if ($this->storage_stats_updated_at && $this->storage_stats_updated_at->diffInMinutes(now()) < 5) {
            return $this->attributes['storage_used_bytes'] ?? 0;
        }
        
        $this->updateStorageStatistics();
        return $this->attributes['storage_used_bytes'] ?? 0;
    }

    public function getStorageUsedGbAttribute(): float
    {
        return $this->storage_used_bytes / (1024 * 1024 * 1024);
    }

    public function getStorageUsedMbAttribute(): float
    {
        return $this->storage_used_bytes / (1024 * 1024);
    }

    public function getFormattedStorageUsedAttribute(): string
    {
        $gb = $this->storage_used_gb;
        if ($gb >= 1) {
            return round($gb, 2) . ' GB';
        } else {
            return round($this->storage_used_mb, 0) . ' MB';
        }
    }

    public function getStorageUsagePercentageAttribute(): float
    {
        if (!$this->plan || $this->plan->storage_limit_bytes === 0) {
            return 0;
        }
        return min(100, ($this->storage_used_bytes / $this->plan->storage_limit_bytes) * 100);
    }

    public function canUploadFile(int $fileSizeBytes): bool
    {
        if (!$this->plan) {
            return false;
        }

        // Check file size limit
        if (!$this->plan->canUploadFile($fileSizeBytes)) {
            return false;
        }

        // Check storage space
        return $this->hasStorageSpace($fileSizeBytes);
    }

    public function getRemainingStorageBytesAttribute(): int
    {
        if (!$this->plan) {
            return 0;
        }
        return max(0, $this->plan->storage_limit_bytes - $this->storage_used_bytes);
    }

    public function isStorageFull(): bool
    {
        return $this->remaining_storage_bytes <= 0;
    }

    public function hasStorageSpace(int $fileSizeBytes): bool
    {
        if (!$this->plan) {
            return false;
        }
        return ($this->storage_used_bytes + $fileSizeBytes) <= $this->plan->storage_limit_bytes;
    }

    public function canAccessPanel(\Filament\Panel $panel): bool
    {
        return $this->getRoleNames()->contains(RolesEnum::Admin->value);
    }

    public function getFilesCountAttribute(): int
    {
        // Use cached value if available and recent, otherwise calculate and cache
        if ($this->storage_stats_updated_at && $this->storage_stats_updated_at->diffInMinutes(now()) < 5) {
            return $this->attributes['files_count'] ?? 0;
        }
        
        $this->updateStorageStatistics();
        return $this->attributes['files_count'] ?? 0;
    }

    public function updateStorageStatistics(): void
    {
        $storageUsed = $this->files()->sum('size') ?? 0;
        $filesCount = $this->files()->count() ?? 0;
        
        $this->update([
            'storage_used_bytes' => $storageUsed,
            'files_count' => $filesCount,
            'storage_stats_updated_at' => now(),
        ]);
    }

    public static function boot()
    {
        parent::boot();
        
        // Update storage statistics when files are added/removed
        static::created(function ($user) {
            $user->updateStorageStatistics();
        });
    }
}
