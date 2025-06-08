<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CollectionResource\Pages;
use App\Filament\Resources\CollectionResource\RelationManagers;
use App\Models\Collection;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class CollectionResource extends Resource
{
    protected static ?string $model = Collection::class;

    protected static ?string $navigationIcon = 'heroicon-o-folder';

    public static function getModelLabel(): string
    {
        return __('filament.resources.collection.label');
    }

    public static function getPluralModelLabel(): string
    {
        return __('filament.resources.collection.plural_label');
    }

    public static function getNavigationLabel(): string
    {
        return __('filament.resources.collection.navigation_label');
    }

    public static function getNavigationGroup(): ?string
    {
        return __('filament.navigation_groups.file_management');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label(__('filament.resources.collection.form.name'))
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('icon')
                    ->label(__('filament.resources.collection.form.icon'))
                    ->maxLength(255),
                Forms\Components\Select::make('user_id')
                    ->label(__('filament.resources.collection.form.user'))
                    ->relationship('user', 'name')
                    ->required()
                    ->searchable(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label(__('filament.resources.collection.table.name'))
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('icon')
                    ->label(__('filament.resources.collection.table.icon'))
                    ->searchable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label(__('filament.resources.collection.table.user'))
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('filament.resources.collection.table.created_at'))
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label(__('filament.resources.collection.table.updated_at'))
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('deleted_at')
                    ->label(__('filament.resources.collection.table.deleted_at'))
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
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
            'index' => Pages\ListCollections::route('/'),
            'create' => Pages\CreateCollection::route('/create'),
            'view' => Pages\ViewCollection::route('/{record}'),
            'edit' => Pages\EditCollection::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
