<?php

namespace App\Filament\Widgets;

use App\Models\Payment;
use Filament\Widgets\ChartWidget;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;

class PaymentsChart extends ChartWidget
{
    protected static ?string $heading = 'Ежедневные платежи (рубли)';

    protected int | string | array $columnSpan = 'full';

    protected function getData(): array
    {
        $data = Trend::model(Payment::class)
            ->between(
                start: now()->subDays(30),
                end: now(),
            )
            ->perDay()
            ->count()
            ->map(function (TrendValue $value) {
                $payments = Payment::whereDate('created_at', $value->date)
                    ->with('plan')
                    ->get();
                
                $sum = 0;
                foreach ($payments as $payment) {
                    if ($payment->plan) {
                        if ($payment->billing_cycle === 'yearly') {
                            $sum += $payment->plan->yearly_rub_price / 12;
                        } else {
                            $sum += $payment->plan->monthly_rub_price;
                        }
                    }
                }
                
                $value->aggregate = $sum;
                return $value;
            });

        return [
            'datasets' => [
                [
                    'label' => 'Платежи',
                    'data' => $data->map(fn (TrendValue $value) => $value->aggregate),
                    'borderColor' => '#10b981',
                    'fill' => false,
                ],
            ],
            'labels' => $data->map(fn (TrendValue $value) => $value->date),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}