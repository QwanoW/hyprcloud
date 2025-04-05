<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserActivityResource\Pages;
use App\Filament\Resources\UserActivityResource\RelationManagers;
use App\Models\UserActivity;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class UserActivityResource extends Resource
{
    protected static ?string $model = UserActivity::class;

    protected static ?string $navigationIcon = 'heroicon-o-clock';    
    protected static ?string $navigationLabel = 'Активность пользователей';
    
    protected static ?string $navigationGroup = 'Управление пользователями';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Информация об активности')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('Пользователь')
                            ->relationship('user', 'name')
                            ->required(),
                        Forms\Components\TextInput::make('action_type')
                            ->label('Тип действия')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('entity_type')
                            ->label('Тип сущности')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('entity_id')
                            ->label('ID сущности')
                            ->numeric(),
                        Forms\Components\TextInput::make('entity_name')
                            ->label('Имя сущности')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('size')
                            ->label('Размер')
                            ->numeric(),
                        Forms\Components\KeyValue::make('metadata')
                            ->label('Метаданные'),
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
                Tables\Columns\TextColumn::make('action_type')
                    ->label('Тип действия')
                    ->badge()
                    ->searchable(),
                Tables\Columns\TextColumn::make('entity_type')
                    ->label('Тип сущности')
                    ->searchable(),
                Tables\Columns\TextColumn::make('entity_name')
                    ->label('Имя сущности')
                    ->searchable(),
                Tables\Columns\TextColumn::make('size')
                    ->label('Размер')
                    ->formatStateUsing(fn ($state) => $state ? number_format($state / 1024, 2) . ' KB' : '-'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Дата')
                    ->dateTime()
                    ->sortable(),
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
            'index' => Pages\ListUserActivities::route('/'),
            'create' => Pages\CreateUserActivity::route('/create'),
            'edit' => Pages\EditUserActivity::route('/{record}/edit'),
        ];
    }
}
