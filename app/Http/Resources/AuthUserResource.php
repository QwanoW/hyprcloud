<?php

namespace App\Http\Resources;

use App\Enum\PlansEnum;
use App\Enum\RolesEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthUserResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Преобразует ресурс в массив.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'avatar'            => $this->avatar,
            'email'             => $this->email,
            'email_verified_at' => $this->email_verified_at,
            'created_at'        => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at'        => $this->updated_at->format('Y-m-d H:i:s'),
            'roles'             => $this->getRoleNames(),
            'plan'              => $this->plan,
            'storage_used_bytes' => $this->storage_used_bytes,
            'storage_used_gb' => $this->storage_used_gb,
            'storage_used_mb' => $this->storage_used_mb,
            'formatted_storage_used' => $this->formatted_storage_used,
            'storage_usage_percentage' => $this->storage_usage_percentage,
            'remaining_storage_bytes' => $this->remaining_storage_bytes,
            'files_count' => $this->files_count,
            'storage_stats_updated_at' => $this->storage_stats_updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
