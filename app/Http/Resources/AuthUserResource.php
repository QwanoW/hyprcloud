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
        ];
    }
}
