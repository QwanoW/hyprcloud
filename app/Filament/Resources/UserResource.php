<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\RelationManagers;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';
    
    public static function getModelLabel(): string
    {
        return __('filament.resources.user.label');
    }

    public static function getPluralModelLabel(): string
    {
        return __('filament.resources.user.plural_label');
    }

    public static function getNavigationLabel(): string
    {
        return __('filament.resources.user.navigation_label');
    }

    public static function getNavigationGroup(): ?string
    {
        return __('filament.navigation_groups.user_management');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('filament.resources.user.form.basic_info'))
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label(__('filament.resources.user.form.name'))
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('email')
                            ->label(__('filament.resources.user.form.email'))
                            ->email()
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
                        Forms\Components\DateTimePicker::make('email_verified_at')
                            ->label(__('filament.resources.user.form.email_verified_at')),
                        Forms\Components\TextInput::make('password')
                            ->label(__('filament.resources.user.form.password'))
                            ->password()
                            ->dehydrateStateUsing(fn ($state) => filled($state) ? bcrypt($state) : null)
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->dehydrated(fn ($state) => filled($state))
                            ->maxLength(255),
                    ])->columns(2),
                Forms\Components\Section::make(__('filament.resources.user.form.plan_info'))
                    ->schema([
                        Forms\Components\Select::make('plan_id')
                            ->label(__('filament.resources.user.form.plan'))
                            ->relationship('plan', 'name_en')
                            ->searchable(),
                    ])->columns(2),
                Forms\Components\Section::make(__('filament.resources.user.form.storage_info'))
                    ->schema([
                        Forms\Components\TextInput::make('storage_used_bytes')
                            ->label(__('filament.resources.user.form.storage_used_bytes'))
                            ->numeric()
                            ->default(0)
                            ->disabled(),
                        Forms\Components\TextInput::make('files_count')
                            ->label(__('filament.resources.user.form.files_count'))
                            ->numeric()
                            ->default(0)
                            ->disabled(),
                        Forms\Components\DateTimePicker::make('storage_stats_updated_at')
                            ->label(__('filament.resources.user.form.storage_stats_updated_at'))
                            ->disabled(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label(__('filament.resources.user.table.name'))
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->label(__('filament.resources.user.table.email'))
                    ->searchable()
                    ->sortable(),
                Tables\Columns\IconColumn::make('email_verified_at')
                    ->label(__('filament.resources.user.table.email_verified_at'))
                    ->boolean()
                    ->trueIcon('heroicon-o-check-badge')
                    ->falseIcon('heroicon-o-x-mark'),
                Tables\Columns\TextColumn::make('plan.name_en')
                    ->label(__('filament.resources.user.table.plan'))
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('storage_used_bytes')
                    ->label(__('filament.resources.user.table.storage_used_bytes'))
                    ->formatStateUsing(fn (?int $state): string => $state ? number_format($state / 1024 / 1024, 2) . ' MB' : '0 MB')
                    ->sortable(),
                Tables\Columns\TextColumn::make('files_count')
                    ->label(__('filament.resources.user.table.files_count'))
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('filament.resources.user.table.created_at'))
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label(__('filament.resources.user.table.updated_at'))
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('plan')
                    ->relationship('plan', 'name_en'),
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
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
