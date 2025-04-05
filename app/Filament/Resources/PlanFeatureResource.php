<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PlanFeatureResource\Pages;
use App\Filament\Resources\PlanFeatureResource\RelationManagers;
use App\Models\PlanFeature;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PlanFeatureResource extends Resource
{
    protected static ?string $model = PlanFeature::class;

    protected static ?string $navigationIcon = 'heroicon-o-list-bullet';
    
    protected static ?string $navigationLabel = 'Функции планов';
    
    protected static ?string $navigationGroup = 'Управление планами';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('plan_id')
                    ->relationship('plan', 'en_name')
                    ->label('План')
                    ->required(),
                Forms\Components\TextInput::make('en_name')
                    ->label('Название (EN)')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('ru_name')
                    ->label('Название (RU)')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Toggle::make('included')
                    ->label('Включено в план')
                    ->default(true),
                Forms\Components\Toggle::make('popular')
                    ->label('Популярная функция')
                    ->default(false),
                Forms\Components\TextInput::make('group')
                    ->label('Группа')
                    ->maxLength(255),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('plan.en_name')
                    ->label('План')
                    ->sortable(),
                Tables\Columns\TextColumn::make('en_name')
                    ->label('Название (EN)')
                    ->searchable(),
                Tables\Columns\TextColumn::make('ru_name')
                    ->label('Название (RU)')
                    ->searchable(),
                Tables\Columns\IconColumn::make('included')
                    ->label('Включено')
                    ->boolean(),
                Tables\Columns\IconColumn::make('popular')
                    ->label('Популярная')
                    ->boolean(),
                Tables\Columns\TextColumn::make('group')
                    ->label('Группа')
                    ->searchable(),
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
            'index' => Pages\ListPlanFeatures::route('/'),
            'create' => Pages\CreatePlanFeature::route('/create'),
            'edit' => Pages\EditPlanFeature::route('/{record}/edit'),
        ];
    }
}
