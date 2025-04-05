<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PlanResource\Pages;
use App\Filament\Resources\PlanResource\RelationManagers;
use App\Models\Plan;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PlanResource extends Resource
{
    protected static ?string $model = Plan::class;

    protected static ?string $navigationIcon = 'heroicon-o-credit-card';
    
    protected static ?string $navigationLabel = 'Тарифные планы';
    
    protected static ?string $navigationGroup = 'Управление планами';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Основная информация')
                    ->schema([
                        Forms\Components\TextInput::make('name_en')
                            ->label('Название (EN)')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('name_ru')
                            ->label('Название (RU)')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('description_en')
                            ->label('Описание (EN)')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('description_ru')
                            ->label('Описание (RU)')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('icon')
                            ->label('Иконка')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Toggle::make('popular')
                            ->label('Популярный план')
                            ->default(false),
                    ])->columns(2),
                Forms\Components\Section::make('Цены')
                    ->schema([
                        Forms\Components\TextInput::make('monthly_usd_price')
                            ->label('Месячная цена (USD)')
                            ->required()
                            ->numeric()
                            ->minValue(0),
                        Forms\Components\TextInput::make('monthly_rub_price')
                            ->label('Месячная цена (RUB)')
                            ->required()
                            ->numeric()
                            ->minValue(0),
                        Forms\Components\TextInput::make('yearly_usd_price')
                            ->label('Годовая цена (USD)')
                            ->required()
                            ->numeric()
                            ->minValue(0),
                        Forms\Components\TextInput::make('yearly_rub_price')
                            ->label('Годовая цена (RUB)')
                            ->required()
                            ->numeric()
                            ->minValue(0),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name_en')
                    ->label('Название (EN)')
                    ->searchable(),
                Tables\Columns\TextColumn::make('name_ru')
                    ->label('Название (RU)')
                    ->searchable(),
                Tables\Columns\TextColumn::make('monthly_usd_price')
                    ->label('Цена USD (мес.)')
                    ->money('USD')
                    ->sortable(),
                Tables\Columns\TextColumn::make('monthly_rub_price')
                    ->label('Цена RUB (мес.)')
                    ->money('RUB')
                    ->sortable(),
                Tables\Columns\IconColumn::make('popular')
                    ->label('Популярный')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Создан')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
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
            'index' => Pages\ListPlans::route('/'),
            'create' => Pages\CreatePlan::route('/create'),
            'edit' => Pages\EditPlan::route('/{record}/edit'),
        ];
    }
}
