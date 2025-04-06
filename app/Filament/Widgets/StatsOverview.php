<?php

namespace App\Filament\Widgets;

use App\Models\File;
use App\Models\Payment;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?string $pollingInterval = '30s';
    
    protected function getStats(): array
    {
        return [
            Stat::make('Пользователи', User::count())
                ->description('Общее количество пользователей')
                ->descriptionIcon('heroicon-m-users')
                ->chart(User::query()
                    ->selectRaw('count(*) as count')
                    ->selectRaw('DATE(created_at) as date')
                    ->where('created_at', '>=', now()->subDays(7))
                    ->groupBy('date')
                    ->pluck('count')
                    ->toArray())
                ->color('success'),
                
            Stat::make('Файлы', File::count())
                ->description('Общее количество файлов')
                ->descriptionIcon('heroicon-m-document')
                ->chart(File::query()
                    ->selectRaw('count(*) as count')
                    ->selectRaw('DATE(created_at) as date')
                    ->where('created_at', '>=', now()->subDays(7))
                    ->groupBy('date')
                    ->pluck('count')
                    ->toArray())
                ->color('warning'),
                
            Stat::make('Платежи', Payment::count())
                ->description('Общее количество платежей')
                ->descriptionIcon('heroicon-m-currency-dollar')
                ->chart(Payment::query()
                    ->selectRaw('count(*) as count')
                    ->selectRaw('DATE(created_at) as date')
                    ->where('created_at', '>=', now()->subDays(7))
                    ->groupBy('date')
                    ->pluck('count')
                    ->toArray())
                ->color('danger'),
        ];
    }
}