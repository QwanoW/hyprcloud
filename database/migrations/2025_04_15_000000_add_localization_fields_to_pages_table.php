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
        Schema::table('pages', function (Blueprint $table) {
            // Переименовываем текущие поля в поля для английского языка
            $table->renameColumn('title', 'title_en');
            $table->renameColumn('content', 'content_en');
            
            // Добавляем поля для русского языка
            $table->string('title_ru')->after('title_en');
            $table->text('content_ru')->after('content_en');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            // Удаляем поля для русского языка
            $table->dropColumn('title_ru');
            $table->dropColumn('content_ru');
            
            // Возвращаем оригинальные имена полей
            $table->renameColumn('title_en', 'title');
            $table->renameColumn('content_en', 'content');
        });
    }
};