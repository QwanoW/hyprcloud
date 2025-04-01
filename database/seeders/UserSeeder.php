<?php

namespace Database\Seeders;

use App\Enum\RolesEnum;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $userRole = Role::create(['name' => RolesEnum::User->value]);
        $adminRole = Role::create(['name' => RolesEnum::Admin->value]);


        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('password'),
            'plan_id' => 1,
        ])->assignRole($adminRole);

        User::factory()->create([
            'name' => 'User',
            'email' => 'user@user.com',
            'password' => bcrypt('password'),
            'plan_id' => 1,
        ])->assignRole($userRole);
    }
}
