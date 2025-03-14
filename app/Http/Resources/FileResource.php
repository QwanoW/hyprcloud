<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class FileResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'size' => $this->size,
            'type' => $this->type,
            'path' => $this->path,
            'url' => route('files.show', ['filepath' => $this->path]),
            'user_id' => $this->user_id,
            'trash' => $this->trash,
            'shared' => $this->shared,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
