<?php

namespace App\Filament\Resources\SharedLinkResource\Pages;

use App\Filament\Resources\SharedLinkResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListSharedLinks extends ListRecords
{
    protected static string $resource = SharedLinkResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
