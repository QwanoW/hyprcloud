<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FileResource\Pages;
use App\Filament\Resources\FileResource\RelationManagers;
use App\Models\File;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class FileResource extends Resource
{
    protected static ?string $model = File::class;

    protected static ?string $navigationIcon = 'heroicon-o-document';

    protected static ?string $navigationLabel = 'Файлы';
    
    protected static ?string $navigationGroup = 'Управление файлами';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Информация о файле')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Имя файла')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Select::make('type')
                            ->label('Тип файла')
                            ->options(\App\Enum\FileTypeEnum::class)
                            ->required(),
                        Forms\Components\TextInput::make('size')
                            ->label('Размер (байт)')
                            ->numeric()
                            ->required(),
                        Forms\Components\TextInput::make('path')
                            ->label('Путь к файлу')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Select::make('user_id')
                            ->label('Пользователь')
                            ->relationship('user', 'name')
                            ->required(),
                        Forms\Components\Toggle::make('shared')
                            ->label('Общий доступ')
                            ->default(false),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Имя файла')
                    ->searchable(),
                Tables\Columns\TextColumn::make('type')
                    ->label('Тип файла')
                    ->badge()
                    ->sortable(),
                Tables\Columns\TextColumn::make('size')
                    ->label('Размер')
                    ->formatStateUsing(fn (int $state): string => number_format($state / 1024, 2) . ' KB')
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Пользователь')
                    ->sortable(),
                Tables\Columns\IconColumn::make('shared')
                    ->label('Общий доступ')
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
            'index' => Pages\ListFiles::route('/'),
            'create' => Pages\CreateFile::route('/create'),
            'edit' => Pages\EditFile::route('/{record}/edit'),
        ];
    }
}
