<?php

namespace App\Filament\Resources\SharedLinkResource\Pages;

use App\Filament\Resources\SharedLinkResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewSharedLink extends ViewRecord
{
    protected static string $resource = SharedLinkResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
