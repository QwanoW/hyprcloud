<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
        // Check if this is a shared context by looking for token in request
        $sharedToken = $request->route('token');
        
        return [
            'id' => $this->id,
            'name' => $this->name,
            'size' => $this->getRealSize(),
            'type' => $this->type,
            'path' => $this->path,
            'url' => $this->path ? (
                $sharedToken ? 
                route('shared.preview', ['token' => $sharedToken]) : 
                route('files.show', ['filepath' => $this->path])
            ) : null,
            'user_id' => $this->user_id,
            'trash' => $this->trash,
            'shared' => $this->isShared(),
            'shared_url' => $this->isShared() ? route('shared', ['userId' => $this->user_id, 'file' => $this->id]) : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
