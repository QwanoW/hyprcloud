<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PaymentResource\Pages;
use App\Filament\Resources\PaymentResource\RelationManagers;
use App\Models\Payment;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PaymentResource extends Resource
{
    protected static ?string $model = Payment::class;

    protected static ?string $navigationIcon = 'heroicon-o-banknotes';

    protected static ?string $navigationLabel = 'Платежи';
    
    protected static ?string $navigationGroup = 'Финансы';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Информация о платеже')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('Пользователь')
                            ->relationship('user', 'name')
                            ->required(),
                        Forms\Components\Select::make('plan_id')
                            ->label('Тарифный план')
                            ->relationship('plan', 'en_name')
                            ->required(),
                        Forms\Components\Select::make('payment_method')
                            ->label('Метод оплаты')
                            ->options([
                                'card' => 'Банковская карта',
                                'paypal' => 'PayPal',
                                'bank_transfer' => 'Банковский перевод',
                                'crypto' => 'Криптовалюта',
                            ])
                            ->required(),
                        Forms\Components\Select::make('billing_cycle')
                            ->label('Цикл биллинга')
                            ->options([
                                'monthly' => 'Ежемесячно',
                                'yearly' => 'Ежегодно',
                            ])
                            ->default('monthly')
                            ->required(),
                        Forms\Components\Select::make('status')
                            ->label('Статус')
                            ->options([
                                'pending' => 'Ожидает оплаты',
                                'completed' => 'Завершен',
                                'failed' => 'Ошибка',
                                'refunded' => 'Возврат',
                            ])
                            ->default('pending')
                            ->required(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Пользователь')
                    ->searchable(),
                Tables\Columns\TextColumn::make('plan.en_name')
                    ->label('Тарифный план')
                    ->sortable(),
                Tables\Columns\TextColumn::make('payment_method')
                    ->label('Метод оплаты')
                    ->formatStateUsing(fn (string $state): string => match($state) {
                        'card' => 'Банковская карта',
                        'paypal' => 'PayPal',
                        'bank_transfer' => 'Банковский перевод',
                        'crypto' => 'Криптовалюта',
                        default => $state,
                    }),
                Tables\Columns\TextColumn::make('billing_cycle')
                    ->label('Цикл биллинга')
                    ->formatStateUsing(fn (string $state): string => match($state) {
                        'monthly' => 'Ежемесячно',
                        'yearly' => 'Ежегодно',
                        default => $state,
                    }),
                Tables\Columns\TextColumn::make('status')
                    ->label('Статус')
                    ->badge()
                    ->color(fn (string $state): string => match($state) {
                        'pending' => 'warning',
                        'completed' => 'success',
                        'failed' => 'danger',
                        'refunded' => 'info',
                        default => 'secondary',
                    })
                    ->formatStateUsing(fn (string $state): string => match($state) {
                        'pending' => 'Ожидает оплаты',
                        'completed' => 'Завершен',
                        'failed' => 'Ошибка',
                        'refunded' => 'Возврат',
                        default => $state,
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Создан')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Обновлен')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPayments::route('/'),
            'create' => Pages\CreatePayment::route('/create'),
            'edit' => Pages\EditPayment::route('/{record}/edit'),
        ];
    }
}
