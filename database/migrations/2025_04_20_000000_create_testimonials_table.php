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
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name_en');
            $table->string('name_ru');
            $table->string('position_en');
            $table->string('position_ru');
            $table->text('testimonial_en');
            $table->text('testimonial_ru');
            $table->string('photo')->nullable();
            $table->boolean('show_on_homepage')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};