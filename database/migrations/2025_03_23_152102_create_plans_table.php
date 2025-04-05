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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name_en');
            $table->string('description_en');
            $table->string('name_ru');
            $table->string('description_ru');

            $table->string('icon');

            $table->integer('monthly_usd_price');
            $table->integer('monthly_rub_price');

            $table->integer('yearly_usd_price');
            $table->integer('yearly_rub_price');

            $table->boolean('popular')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
