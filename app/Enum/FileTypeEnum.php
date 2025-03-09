<?php

namespace App\Enum;

enum FileTypeEnum: string
{
    case IMAGE = 'image';
    case VIDEO = 'video';
    case AUDIO = 'audio';
    case FILE = 'file';
    case OTHER = 'other';

    public static function values(): array
    {
        return [
            self::IMAGE->value,
            self::VIDEO->value,
            self::AUDIO->value,
            self::FILE->value,
            self::OTHER->value,
        ];
    }
}
