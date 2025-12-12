<?php

namespace Tests\Feature;

use App\Models\File;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileDuplicateCheckTest extends TestCase
{
    use RefreshDatabase;

    public function test_allows_same_filename_in_different_folders()
    {
        Storage::fake('local');

        $plan = \App\Models\Plan::create([
            'name_en' => 'Free',
            'description_en' => 'Free plan',
            'name_ru' => 'Бесплатный',
            'description_ru' => 'Бесплатный тариф',
            'icon' => 'free.png',
            'monthly_usd_price' => 0,
            'monthly_rub_price' => 0,
            'yearly_usd_price' => 0,
            'yearly_rub_price' => 0,
            'storage_limit_bytes' => 1024 * 1024 * 1024, // 1GB
            'max_file_size_bytes' => 1024 * 1024 * 10, // 10MB
            'can_share_files' => true,
            'can_download_zip' => true,
            'max_shared_links' => 10,
            'shared_link_expiry_days' => 7,
        ]);

        $user = User::factory()->create(['plan_id' => $plan->id]);

        $folder1 = File::factory()->create([
            'user_id' => $user->id,
            'type' => 'folder',
            'name' => 'Folder 1',
        ]);

        $folder2 = File::factory()->create([
            'user_id' => $user->id,
            'type' => 'folder',
            'name' => 'Folder 2',
        ]);

        $response = $this->actingAs($user)->postJson(route('files.store'), [
            'files' => [UploadedFile::fake()->create('document.pdf', 100)],
            'parent_folder_id' => $folder1->id,
        ]);
        $response->assertStatus(201);

        $response = $this->actingAs($user)->postJson(route('files.store'), [
            'files' => [UploadedFile::fake()->create('document.pdf', 100)],
            'parent_folder_id' => $folder2->id,
        ]);

        $response->assertStatus(201);
    }
}
