<?php

namespace Database\Factories;

use App\Enum\FileTypeEnum;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\File>
 */
class FileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word() . '.' . fake()->fileExtension(),
            'type' => FileTypeEnum::values()[array_rand(FileTypeEnum::values())],
            'size' => fake()->randomNumber(6),
            'path' => fake()->imageUrl(),
            'user_id' => User::factory(),
        ];
    }
}
