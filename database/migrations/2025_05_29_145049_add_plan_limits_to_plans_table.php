<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->bigInteger('storage_limit_bytes')->default(2147483648); // 2GB default
            $table->bigInteger('max_file_size_bytes')->default(5 * 1024 * 1024); // 5MB default
            $table->integer('max_files_count')->nullable(); // unlimited by default
            $table->boolean('can_share_files')->default(true);
            $table->boolean('can_download_zip')->default(true);
            $table->boolean('has_api_access')->default(false);
            $table->integer('max_shared_links')->nullable(); // unlimited by default
            $table->integer('shared_link_expiry_days')->nullable(); // no expiry by default
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn([
                'storage_limit_bytes',
                'max_file_size_bytes',
                'max_files_count',
                'can_share_files',
                'can_download_zip',
                'has_api_access',
                'max_shared_links',
                'shared_link_expiry_days'
            ]);
        });
    }
};
