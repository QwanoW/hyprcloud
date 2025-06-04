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
        Schema::table('users', function (Blueprint $table) {
            $table->bigInteger('storage_used_bytes')->default(0)->after('plan_id');
            $table->integer('files_count')->default(0)->after('storage_used_bytes');
            $table->timestamp('storage_stats_updated_at')->nullable()->after('files_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['storage_used_bytes', 'files_count', 'storage_stats_updated_at']);
        });
    }
};
