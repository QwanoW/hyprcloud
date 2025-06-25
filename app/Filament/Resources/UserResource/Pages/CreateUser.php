<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Enum\RolesEnum;
use App\Filament\Resources\UserResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;

    protected function afterCreate(): void
    {
        $role = $this->data['role'] ?? RolesEnum::User->value;
        $this->record->assignRole($role);
    }
}
