<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FileResource\Pages;
use App\Models\File;
use App\Enum\FileTypeEnum;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\HtmlString;

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
                
                Forms\Components\Section::make(__('filament.resources.file.form.preview'))
                    ->schema([
                        Forms\Components\Placeholder::make('file_preview')
                            ->label(__('filament.resources.file.form.file_preview'))
                            ->content(function (File $record = null) {
                                if (!$record || !$record->url) {
                                    return new HtmlString('<p>' . __('filament.resources.file.form.no_preview') . '</p>');
                                }
                                
                                return match ($record->type) {
                                    FileTypeEnum::IMAGE => new HtmlString(
                                        '<img src="' . $record->url . '" alt="' . $record->name . '" style="max-width: 300px; max-height: 300px; border-radius: 8px;">'
                                    ),
                                    FileTypeEnum::VIDEO => new HtmlString(
                                        '<video controls style="max-width: 400px; max-height: 300px; border-radius: 8px;">'
                                        . '<source src="' . $record->url . '" type="video/mp4">'
                                        . __('filament.resources.file.form.video_not_supported')
                                        . '</video>'
                                    ),
                                    FileTypeEnum::AUDIO => new HtmlString(
                                        '<audio controls style="width: 100%; max-width: 400px;">'
                                        . '<source src="' . $record->url . '" type="audio/mpeg">'
                                        . __('filament.resources.file.form.audio_not_supported')
                                        . '</audio>'
                                    ),
                                    default => new HtmlString('<p>' . __('filament.resources.file.form.no_preview_available') . '</p>')
                                };
                            })
                            ->visible(fn (File $record = null) => $record && $record->url && in_array($record->type, [FileTypeEnum::IMAGE, FileTypeEnum::VIDEO, FileTypeEnum::AUDIO])),
                        
                        Forms\Components\Actions::make([
                            Forms\Components\Actions\Action::make('download')
                                ->label(__('filament.resources.file.form.download'))
                                ->icon('heroicon-o-arrow-down-tray')
                                ->url(fn (File $record = null) => $record?->url)
                                ->openUrlInNewTab()
                                ->visible(fn (File $record = null) => $record && $record->url),
                        ]),
                    ])
                    ->visible(fn (string $operation) => $operation === 'view' || $operation === 'edit'),
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
                Tables\Actions\Action::make('preview')
                    ->label(__('filament.resources.file.table.preview'))
                    ->icon('heroicon-o-eye')
                    ->modalContent(function (File $record) {
                        if (!$record->url) {
                            return new HtmlString('<p>' . __('filament.resources.file.table.no_preview') . '</p>');
                        }
                        
                        return new HtmlString(
                            match ($record->type) {
                                FileTypeEnum::IMAGE => 
                                    '<div style="text-align: center;">'
                                    . '<img src="' . $record->url . '" alt="' . $record->name . '" style="max-width: 100%; max-height: 70vh; border-radius: 8px;">'
                                    . '</div>',
                                FileTypeEnum::VIDEO => 
                                    '<div style="text-align: center;">'
                                    . '<video controls style="max-width: 100%; max-height: 70vh; border-radius: 8px;">'
                                    . '<source src="' . $record->url . '" type="video/mp4">'
                                    . __('filament.resources.file.table.video_not_supported')
                                    . '</video>'
                                    . '</div>',
                                FileTypeEnum::AUDIO => 
                                    '<div style="text-align: center; padding: 2rem;">'
                                    . '<div style="margin-bottom: 1rem; font-size: 1.2rem; font-weight: bold;">' . $record->name . '</div>'
                                    . '<audio controls style="width: 100%; max-width: 400px;">'
                                    . '<source src="' . $record->url . '" type="audio/mpeg">'
                                    . __('filament.resources.file.table.audio_not_supported')
                                    . '</audio>'
                                    . '</div>',
                                default => '<p>' . __('filament.resources.file.table.no_preview_available') . '</p>'
                            }
                        );
                    })
                    ->modalHeading(fn (File $record) => __('filament.resources.file.table.preview_title', ['name' => $record->name]))
                    ->modalWidth('4xl')
                    ->visible(fn (File $record) => $record->url && in_array($record->type, [FileTypeEnum::IMAGE, FileTypeEnum::VIDEO, FileTypeEnum::AUDIO])),
                Tables\Actions\Action::make('download')
                    ->label(__('filament.resources.file.table.download'))
                    ->icon('heroicon-o-arrow-down-tray')
                    ->url(fn (File $record) => $record->url)
                    ->openUrlInNewTab()
                    ->visible(fn (File $record) => $record->url && $record->type !== FileTypeEnum::FOLDER),
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
