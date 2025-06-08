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
            $table->boolean('can_configure_sharing')->default(false)->after('can_share_files');
            $table->dropColumn(['max_files_count', 'has_api_access']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn('can_configure_sharing');
            $table->integer('max_files_count')->nullable()->after('max_file_size_bytes');
            $table->boolean('has_api_access')->default(false)->after('can_download_zip');
        });
    }
};
