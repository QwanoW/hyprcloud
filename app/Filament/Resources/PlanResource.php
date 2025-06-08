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
    
    protected static ?string $navigationLabel = null;
    
    protected static ?string $navigationGroup = null;
    
    public static function getNavigationLabel(): string
    {
        return __('filament.resources.plan.navigation_label');
    }
    
    public static function getNavigationGroup(): ?string
    {
        return __('filament.navigation_groups.plan_management');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('filament.resources.plan.form.basic_info'))
                    ->schema([
                        Forms\Components\TextInput::make('name_en')
                            ->label(__('filament.resources.plan.form.name_en'))
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('name_ru')
                            ->label(__('filament.resources.plan.form.name_ru'))
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('description_en')
                            ->label(__('filament.resources.plan.form.description_en'))
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('description_ru')
                            ->label(__('filament.resources.plan.form.description_ru'))
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('icon')
                            ->label(__('filament.resources.plan.form.icon'))
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Toggle::make('popular')
                            ->label(__('filament.resources.plan.form.popular'))
                            ->default(false),
                    ])->columns(2),
                Forms\Components\Section::make(__('filament.resources.plan.form.pricing'))
                    ->schema([
                        Forms\Components\TextInput::make('monthly_usd_price')
                            ->label(__('filament.resources.plan.form.monthly_usd_price'))
                            ->required()
                            ->numeric()
                            ->minValue(0),
                        Forms\Components\TextInput::make('monthly_rub_price')
                            ->label(__('filament.resources.plan.form.monthly_rub_price'))
                            ->required()
                            ->numeric()
                            ->minValue(0),
                        Forms\Components\TextInput::make('yearly_usd_price')
                            ->label(__('filament.resources.plan.form.yearly_usd_price'))
                            ->required()
                            ->numeric()
                            ->minValue(0),
                        Forms\Components\TextInput::make('yearly_rub_price')
                            ->label(__('filament.resources.plan.form.yearly_rub_price'))
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
                    ->label(__('filament.resources.plan.table.name_en'))
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('name_ru')
                    ->label(__('filament.resources.plan.table.name_ru'))
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('monthly_usd_price')
                    ->label(__('filament.resources.plan.table.monthly_usd_price'))
                    ->money('USD')
                    ->sortable(),
                Tables\Columns\TextColumn::make('monthly_rub_price')
                    ->label(__('filament.resources.plan.table.monthly_rub_price'))
                    ->money('RUB')
                    ->sortable(),
                Tables\Columns\IconColumn::make('popular')
                    ->label(__('filament.resources.plan.table.popular'))
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('filament.resources.plan.table.created_at'))
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label(__('filament.resources.plan.table.updated_at'))
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('popular')
                    ->label(__('filament.resources.plan.table.popular')),
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
            'index' => Pages\ListPlans::route('/'),
            'create' => Pages\CreatePlan::route('/create'),
            'edit' => Pages\EditPlan::route('/{record}/edit'),
        ];
    }
}
