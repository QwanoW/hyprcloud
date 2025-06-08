<?php

namespace App\Filament\Resources\SharedLinkResource\Pages;

use App\Filament\Resources\SharedLinkResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditSharedLink extends EditRecord
{
    protected static string $resource = SharedLinkResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}
