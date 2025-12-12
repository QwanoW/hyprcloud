<?php

namespace Tests\Feature;

use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

use App\Models\Plan;

class ChunkedUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_chunked_upload_successful()
    {
        Storage::fake('local');

        $plan = Plan::create([
            'name_en' => 'Free',
            'name_ru' => 'Free',
            'description_en' => 'Free plan',
            'description_ru' => 'Free plan',
            'icon' => 'free',
            'monthly_usd_price' => 0,
            'monthly_rub_price' => 0,
            'yearly_usd_price' => 0,
            'yearly_rub_price' => 0,
            'storage_limit_bytes' => 1024 * 1024 * 1024, // 1GB
            'max_file_size_bytes' => 1024 * 1024 * 100, // 100MB
            'can_share_files' => true,
            'can_download_zip' => true,
            'can_configure_sharing' => true,
            'max_shared_links' => 10,
            'shared_link_expiry_days' => 7,
            'popular' => false,
        ]);

        $user = User::factory()->create(['plan_id' => $plan->id]);

        $fileName = 'test_large_file.txt';
        $fileContent = str_repeat('A', 1024 * 1024 * 5); // 5MB
        $uploadId = 'test_upload_id';

        // Split into 3 chunks (2MB, 2MB, 1MB)
        $chunks = str_split($fileContent, 1024 * 1024 * 2);
        $totalChunks = count($chunks);

        foreach ($chunks as $index => $chunkContent) {
            $chunkFile = UploadedFile::fake()->createWithContent('blob', $chunkContent);

            $response = $this->actingAs($user)->postJson(route('api.files.chunk'), [
                'file' => $chunkFile,
                'chunk_index' => $index,
                'total_chunks' => $totalChunks,
                'upload_id' => $uploadId,
                'original_name' => $fileName,
            ]);

            if ($index < $totalChunks - 1) {
                $response->assertStatus(200)
                    ->assertJson(['completed' => false]);
            } else {
                $response->assertStatus(201)
                    ->assertJson(['completed' => true]);
            }
        }

        // Verify file exists
        $file = File::where('name', $fileName)->first();
        $this->assertNotNull($file);
        $this->assertEquals(strlen($fileContent), $file->size);

        Storage::assertExists($file->path);
        $this->assertEquals($fileContent, Storage::get($file->path));
    }

    public function test_chunked_upload_validation_errors()
    {
        $plan = Plan::create([
            'name_en' => 'Free',
            'name_ru' => 'Free',
            'description_en' => 'Free plan',
            'description_ru' => 'Free plan',
            'icon' => 'free',
            'monthly_usd_price' => 0,
            'monthly_rub_price' => 0,
            'yearly_usd_price' => 0,
            'yearly_rub_price' => 0,
            'storage_limit_bytes' => 1024 * 1024 * 1024, // 1GB
            'max_file_size_bytes' => 1024 * 1024 * 100, // 100MB
            'can_share_files' => true,
            'can_download_zip' => true,
            'can_configure_sharing' => true,
            'max_shared_links' => 10,
            'shared_link_expiry_days' => 7,
            'popular' => false,
        ]);

        $user = User::factory()->create(['plan_id' => $plan->id]);

        $response = $this->actingAs($user)->postJson(route('api.files.chunk'), []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file', 'chunk_index', 'total_chunks', 'upload_id', 'original_name']);
    }
}
