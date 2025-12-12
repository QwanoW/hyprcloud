<?php

namespace Tests\Feature;

use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FolderSizeCalculationTest extends TestCase
{
    use RefreshDatabase;

    public function test_folder_size_increments_when_file_added()
    {
        $user = User::factory()->create();
        $folder = File::factory()->create([
            'user_id' => $user->id,
            'type' => 'folder',
            'size' => 0,
        ]);

        $file = File::factory()->create([
            'user_id' => $user->id,
            'parent_folder_id' => $folder->id,
            'type' => 'file',
            'size' => 1024,
        ]);

        $this->assertEquals(1024, $folder->fresh()->size);
    }

    public function test_folder_size_updates_recursively()
    {
        $user = User::factory()->create();
        $rootFolder = File::factory()->create([
            'user_id' => $user->id,
            'type' => 'folder',
            'size' => 0,
        ]);

        $subFolder = File::factory()->create([
            'user_id' => $user->id,
            'parent_folder_id' => $rootFolder->id,
            'type' => 'folder',
            'size' => 0,
        ]);

        $file = File::factory()->create([
            'user_id' => $user->id,
            'parent_folder_id' => $subFolder->id,
            'type' => 'file',
            'size' => 2048,
        ]);

        $this->assertEquals(2048, $subFolder->fresh()->size);
        $this->assertEquals(2048, $rootFolder->fresh()->size);
    }

    public function test_folder_size_decrements_on_delete()
    {
        $user = User::factory()->create();
        $folder = File::factory()->create([
            'user_id' => $user->id,
            'type' => 'folder',
            'size' => 0,
        ]);

        $file = File::factory()->create([
            'user_id' => $user->id,
            'parent_folder_id' => $folder->id,
            'type' => 'file',
            'size' => 1024,
        ]);

        $this->assertEquals(1024, $folder->fresh()->size);

        $file->delete();

        $this->assertEquals(0, $folder->fresh()->size);
    }

    public function test_folder_size_updates_on_move()
    {
        $user = User::factory()->create();
        $folderA = File::factory()->create([
            'user_id' => $user->id,
            'type' => 'folder',
            'size' => 0,
        ]);
        $folderB = File::factory()->create([
            'user_id' => $user->id,
            'type' => 'folder',
            'size' => 0,
        ]);

        $file = File::factory()->create([
            'user_id' => $user->id,
            'parent_folder_id' => $folderA->id,
            'type' => 'file',
            'size' => 1024,
        ]);

        $this->assertEquals(1024, $folderA->fresh()->size);
        $this->assertEquals(0, $folderB->fresh()->size);

        $file->update(['parent_folder_id' => $folderB->id]);

        $this->assertEquals(0, $folderA->fresh()->size);
        $this->assertEquals(1024, $folderB->fresh()->size);
    }

    public function test_folder_size_updates_on_file_update()
    {
        $user = User::factory()->create();
        $folder = File::factory()->create([
            'user_id' => $user->id,
            'type' => 'folder',
            'size' => 0,
        ]);

        $file = File::factory()->create([
            'user_id' => $user->id,
            'parent_folder_id' => $folder->id,
            'type' => 'file',
            'size' => 1024,
        ]);

        $this->assertEquals(1024, $folder->fresh()->size);

        $file->update(['size' => 2048]);

        $this->assertEquals(2048, $folder->fresh()->size);
    }
}
