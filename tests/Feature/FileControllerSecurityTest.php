<?php

namespace Tests\Feature;

use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileControllerSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_access_own_file()
    {
        Storage::fake('local');
        $user = User::factory()->create();
        $file = UploadedFile::fake()->create('document.pdf', 100);
        $path = $file->store($user->id, 'local');

        $fileModel = File::create([
            'user_id' => $user->id,
            'name' => 'document.pdf',
            'type' => 'file',
            'size' => 1024,
            'path' => $path,
        ]);

        $response = $this->actingAs($user)->get(route('files.show', ['filepath' => $path]));

        $response->assertStatus(200);
    }

    public function test_user_cannot_access_other_users_file()
    {
        Storage::fake('local');
        $owner = User::factory()->create();
        $attacker = User::factory()->create();

        $file = UploadedFile::fake()->create('secret.pdf', 100);
        $path = $file->store($owner->id, 'local');

        $fileModel = File::create([
            'user_id' => $owner->id,
            'name' => 'secret.pdf',
            'type' => 'file',
            'size' => 1024,
            'path' => $path,
        ]);

        $response = $this->actingAs($attacker)->get(route('files.show', ['filepath' => $path]));

        $response->assertStatus(403);
    }
}
