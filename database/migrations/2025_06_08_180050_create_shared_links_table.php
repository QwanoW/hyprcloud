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
        Schema::create('shared_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('file_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Owner of the file
            $table->string('token', 64)->unique(); // Unique token for the share link
            $table->string('password')->nullable(); // Optional password protection
            $table->timestamp('expires_at')->nullable(); // Optional expiration date
            $table->boolean('allow_download')->default(true); // Allow file download
            $table->boolean('is_active')->default(true); // Can be disabled without deleting
            $table->integer('access_count')->default(0); // Track how many times accessed
            $table->timestamp('last_accessed_at')->nullable(); // Last access time
            $table->timestamps();
            
            $table->index(['token', 'is_active']);
            $table->index(['file_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shared_links');
    }
};
