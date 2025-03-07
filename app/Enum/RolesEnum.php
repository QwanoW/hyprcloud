<?php

namespace App\Enum;

enum RolesEnum: string
{
    case Admin = 'admin';
    case User = 'user';

    public static function labels(): array
    {
        return [
            self::Admin->value => 'Admin',
            self::User->value => 'User',
        ];
    }

    public function label(): string
    {
        return match($this) {
            self::Admin => 'Admin',
            self::User => 'User',
        };
    }
}
