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

    public static function getModelLabel(): string
    {
        return __('filament.resources.file.label');
    }

    public static function getPluralModelLabel(): string
    {
        return __('filament.resources.file.plural_label');
    }

    public static function getNavigationLabel(): string
    {
        return __('filament.resources.file.navigation_label');
    }

    public static function getNavigationGroup(): ?string
    {
        return __('filament.navigation_groups.file_management');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('filament.resources.file.form.file_info'))
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label(__('filament.resources.file.form.name'))
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Select::make('type')
                            ->label(__('filament.resources.file.form.type'))
                            ->options(\App\Enum\FileTypeEnum::class)
                            ->required(),
                        Forms\Components\TextInput::make('size')
                            ->label(__('filament.resources.file.form.size'))
                            ->numeric()
                            ->required(),
                        Forms\Components\TextInput::make('path')
                            ->label(__('filament.resources.file.form.path'))
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Select::make('user_id')
                            ->label(__('filament.resources.file.form.user'))
                            ->relationship('user', 'name')
                            ->required(),
                        Forms\Components\Select::make('collection_id')
                            ->label(__('filament.resources.file.form.collection'))
                            ->relationship('collection', 'name')
                            ->searchable(),
                        Forms\Components\Select::make('parent_folder_id')
                            ->label(__('filament.resources.file.form.parent_folder'))
                            ->relationship('parentFolder', 'name')
                            ->searchable(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label(__('filament.resources.file.table.name'))
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('type')
                    ->label(__('filament.resources.file.table.type'))
                    ->badge()
                    ->sortable(),
                Tables\Columns\TextColumn::make('size')
                    ->label(__('filament.resources.file.table.size'))
                    ->formatStateUsing(fn (int $state): string => number_format($state / 1024, 2) . ' KB')
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label(__('filament.resources.file.table.user'))
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('collection.name')
                    ->label(__('filament.resources.file.table.collection'))
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('parentFolder.name')
                    ->label(__('filament.resources.file.table.parent_folder'))
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('filament.resources.file.table.created_at'))
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label(__('filament.resources.file.table.updated_at'))
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('deleted_at')
                    ->label(__('filament.resources.file.table.deleted_at'))
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
            'index' => Pages\ListFiles::route('/'),
            'create' => Pages\CreateFile::route('/create'),
            'view' => Pages\ViewFile::route('/{record}'),
            'edit' => Pages\EditFile::route('/{record}/edit'),
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
