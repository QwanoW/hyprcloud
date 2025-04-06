<?php

namespace App\Filament\Widgets;

use App\Models\File;
use App\Enum\FileTypeEnum;
use Filament\Widgets\ChartWidget;

class FileTypesChart extends ChartWidget
{
    protected static ?string $heading = 'Распределение типов файлов';

    protected int | string | array $columnSpan = 'full';

    protected function getData(): array
    {
        $fileTypes = File::query()
            ->selectRaw('type, count(*) as total')
            ->groupBy('type')
            ->get();

        $labels = $fileTypes->map(fn ($item) => $item->type->name);
        $data = $fileTypes->pluck('total');

        return [
            'datasets' => [
                [
                    'label' => 'Файлы',
                    'data' => $data,
                    'backgroundColor' => ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'],
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'pie';
    }
}