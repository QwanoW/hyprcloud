<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\FileTypesChart;
use App\Filament\Widgets\PaymentsChart;
use App\Filament\Widgets\StatsOverview;
use App\Filament\Widgets\UserActivityChart;
use App\Filament\Widgets\UserRegistrationsChart;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected static ?string $title = 'Админ панель';
    
    protected static ?string $navigationLabel = 'Админ панель';
    
    protected static ?string $navigationIcon = 'heroicon-o-home';
    
    protected static ?int $navigationSort = -2;
    
    public function getWidgets(): array
    {
        return [
            StatsOverview::class,
            UserRegistrationsChart::class,
            UserActivityChart::class,
            PaymentsChart::class,
            FileTypesChart::class,
        ];
    }
}