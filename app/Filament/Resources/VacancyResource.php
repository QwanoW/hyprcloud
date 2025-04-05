<?php

namespace App\Filament\Resources;

use App\Filament\Resources\VacancyResource\Pages;
use App\Filament\Resources\VacancyResource\RelationManagers;
use App\Models\Vacancy;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Carbon;

class VacancyResource extends Resource
{
    protected static ?string $model = Vacancy::class;

    protected static ?string $navigationIcon = 'heroicon-o-briefcase';

    protected static ?string $navigationLabel = 'Вакансии';
    
    protected static ?string $navigationGroup = 'Управление вакансиями';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Русская версия')
                    ->schema([
                        Forms\Components\TextInput::make('title_ru')
                            ->label('Название')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('description_ru')
                            ->label('Описание')
                            ->required()
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('requirements_ru')
                            ->label('Требования')
                            ->required()
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('location_ru')
                            ->label('Местоположение')
                            ->maxLength(255),
                    ])
                    ->collapsible(),
                Forms\Components\Section::make('English version')
                    ->schema([
                        Forms\Components\TextInput::make('title_en')
                            ->label('Title')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('description_en')
                            ->label('Description')
                            ->required()
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('requirements_en')
                            ->label('Requirements')
                            ->required()
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('location_en')
                            ->label('Location')
                            ->maxLength(255),
                    ])
                    ->collapsible(),
                Forms\Components\Section::make('Настройки публикации')
                    ->schema([
                        Forms\Components\Toggle::make('is_active')
                            ->label('Активна')
                            ->default(true),
                        Forms\Components\DateTimePicker::make('published_at')
                            ->label('Дата публикации')
                            ->default(now()),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title_ru')
                    ->label('Название')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('description_ru')
                    ->label('Описание')
                    ->limit(50)
                    ->tooltip(function (Tables\Columns\TextColumn $column): ?string {
                        $state = $column->getState();
                        if (strlen($state) <= $column->getCharacterLimit()) {
                            return null;
                        }
                        return $state;
                    }),
                Tables\Columns\TextColumn::make('location_ru')
                    ->label('Местоположение')
                    ->searchable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Статус')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger'),
                Tables\Columns\TextColumn::make('published_at')
                    ->label('Дата публикации')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('published_at', 'desc')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Статус')
                    ->placeholder('Все')
                    ->trueLabel('Активные')
                    ->falseLabel('Неактивные'),
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
            'index' => Pages\ListVacancies::route('/'),
            'create' => Pages\CreateVacancy::route('/create'),
            'edit' => Pages\EditVacancy::route('/{record}/edit'),
        ];
    }
}
