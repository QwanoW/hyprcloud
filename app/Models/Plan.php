<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $guarded = [];

    protected $casts = [
        'monthly_usd_price' => 'decimal:2',
        'monthly_rub_price' => 'decimal:2',
        'yearly_usd_price' => 'decimal:2',
        'yearly_rub_price' => 'decimal:2',
        'popular' => 'boolean',
        'storage_limit_bytes' => 'integer',
        'max_file_size_bytes' => 'integer',
        'can_share_files' => 'boolean',
        'can_download_zip' => 'boolean',
        'can_configure_sharing' => 'boolean',
        'max_shared_links' => 'integer',
        'shared_link_expiry_days' => 'integer',
    ];

    public function features() {
        return $this->hasMany(PlanFeature::class);
    }

    public function users() {
        return $this->hasMany(User::class);
    }

    public function getStorageLimitGbAttribute(): float
    {
        return $this->storage_limit_bytes / (1024 * 1024 * 1024);
    }

    public function getStorageLimitMbAttribute(): float
    {
        return $this->storage_limit_bytes / (1024 * 1024);
    }

    public function getFormattedStorageLimitAttribute(): string
    {
        $gb = $this->storage_limit_gb;
        if ($gb >= 1024) {
            return round($gb / 1024, 1) . ' TB';
        } elseif ($gb >= 1) {
            return round($gb, 1) . ' GB';
        } else {
            return round($this->storage_limit_mb, 0) . ' MB';
        }
    }

    public function canUploadFile(int $fileSizeBytes): bool
    {
        $fileSizeMb = $fileSizeBytes / (1024 * 1024);
        return $fileSizeMb <= $this->max_file_size_bytes / (1024 * 1024);
    }
}
