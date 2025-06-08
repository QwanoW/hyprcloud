<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SharedLinkResource\Pages;
use App\Filament\Resources\SharedLinkResource\RelationManagers;
use App\Models\SharedLink;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class SharedLinkResource extends Resource
{
    protected static ?string $model = SharedLink::class;

    protected static ?string $navigationIcon = 'heroicon-o-share';

    public static function getModelLabel(): string
    {
        return __('filament.resources.shared_link.label');
    }

    public static function getPluralModelLabel(): string
    {
        return __('filament.resources.shared_link.plural_label');
    }

    public static function getNavigationLabel(): string
    {
        return __('filament.resources.shared_link.navigation_label');
    }

    public static function getNavigationGroup(): ?string
    {
        return __('filament.navigation_groups.file_management');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('file_id')
                    ->label(__('filament.resources.shared_link.form.file'))
                    ->relationship('file', 'name')
                    ->required()
                    ->searchable(),
                Forms\Components\Select::make('user_id')
                    ->label(__('filament.resources.shared_link.form.user'))
                    ->relationship('user', 'name')
                    ->required()
                    ->searchable(),
                Forms\Components\TextInput::make('token')
                    ->label(__('filament.resources.shared_link.form.token'))
                    ->required()
                    ->maxLength(255)
                    ->default(fn () => \Str::random(32)),
                Forms\Components\TextInput::make('password')
                    ->label(__('filament.resources.shared_link.form.password'))
                    ->password()
                    ->maxLength(255),
                Forms\Components\DateTimePicker::make('expires_at')
                    ->label(__('filament.resources.shared_link.form.expires_at')),
                Forms\Components\Toggle::make('allow_download')
                    ->label(__('filament.resources.shared_link.form.allow_download'))
                    ->default(true),
                Forms\Components\Toggle::make('is_active')
                    ->label(__('filament.resources.shared_link.form.is_active'))
                    ->default(true),
                Forms\Components\TextInput::make('access_count')
                    ->label(__('filament.resources.shared_link.form.access_count'))
                    ->numeric()
                    ->default(0)
                    ->disabled(),
                Forms\Components\DateTimePicker::make('last_accessed_at')
                    ->label(__('filament.resources.shared_link.form.last_accessed_at'))
                    ->disabled(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('file.name')
                    ->label(__('filament.resources.shared_link.table.file'))
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label(__('filament.resources.shared_link.table.user'))
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('token')
                    ->label(__('filament.resources.shared_link.table.token'))
                    ->searchable()
                    ->limit(20),
                Tables\Columns\TextColumn::make('expires_at')
                    ->label(__('filament.resources.shared_link.table.expires_at'))
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\IconColumn::make('allow_download')
                    ->label(__('filament.resources.shared_link.table.allow_download'))
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label(__('filament.resources.shared_link.table.is_active'))
                    ->boolean(),
                Tables\Columns\TextColumn::make('access_count')
                    ->label(__('filament.resources.shared_link.table.access_count'))
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('last_accessed_at')
                    ->label(__('filament.resources.shared_link.table.last_accessed_at'))
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('filament.resources.shared_link.table.created_at'))
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label(__('filament.resources.shared_link.table.updated_at'))
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label(__('filament.resources.shared_link.table.is_active')),
                Tables\Filters\TernaryFilter::make('allow_download')
                    ->label(__('filament.resources.shared_link.table.allow_download')),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
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
            'index' => Pages\ListSharedLinks::route('/'),
            'create' => Pages\CreateSharedLink::route('/create'),
            'view' => Pages\ViewSharedLink::route('/{record}'),
            'edit' => Pages\EditSharedLink::route('/{record}/edit'),
        ];
    }
}
