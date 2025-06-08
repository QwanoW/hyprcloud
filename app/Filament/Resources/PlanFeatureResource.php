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
    
    protected static ?string $navigationLabel = null;
    
    protected static ?string $navigationGroup = null;
    
    public static function getNavigationLabel(): string
    {
        return __('filament.resources.plan_feature.navigation_label');
    }
    
    public static function getNavigationGroup(): ?string
    {
        return __('filament.navigation_groups.plan_management');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('plan_id')
                    ->relationship('plan', 'name_en')
                    ->label(__('filament.resources.plan_feature.form.plan'))
                    ->searchable()
                    ->required(),
                Forms\Components\TextInput::make('name_en')
                    ->label(__('filament.resources.plan_feature.form.name_en'))
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('name_ru')
                    ->label(__('filament.resources.plan_feature.form.name_ru'))
                    ->required()
                    ->maxLength(255),
                Forms\Components\Toggle::make('included')
                    ->label(__('filament.resources.plan_feature.form.included'))
                    ->default(true),
                Forms\Components\Toggle::make('popular')
                    ->label(__('filament.resources.plan_feature.form.popular'))
                    ->default(false),
                Forms\Components\TextInput::make('group')
                    ->label(__('filament.resources.plan_feature.form.group'))
                    ->maxLength(255),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('plan.name_en')
                    ->label(__('filament.resources.plan_feature.table.plan'))
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('name_en')
                    ->label(__('filament.resources.plan_feature.table.name_en'))
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('name_ru')
                    ->label(__('filament.resources.plan_feature.table.name_ru'))
                    ->searchable()
                    ->sortable(),
                Tables\Columns\IconColumn::make('included')
                    ->label(__('filament.resources.plan_feature.table.included'))
                    ->boolean(),
                Tables\Columns\IconColumn::make('popular')
                    ->label(__('filament.resources.plan_feature.table.popular'))
                    ->boolean(),
                Tables\Columns\TextColumn::make('group')
                    ->label(__('filament.resources.plan_feature.table.group'))
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('filament.resources.plan_feature.table.created_at'))
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label(__('filament.resources.plan_feature.table.updated_at'))
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('plan')
                    ->relationship('plan', 'name_en'),
                Tables\Filters\TernaryFilter::make('included')
                    ->label(__('filament.resources.plan_feature.table.included')),
                Tables\Filters\TernaryFilter::make('popular')
                    ->label(__('filament.resources.plan_feature.table.popular')),
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
            'index' => Pages\ListPlanFeatures::route('/'),
            'create' => Pages\CreatePlanFeature::route('/create'),
            'edit' => Pages\EditPlanFeature::route('/{record}/edit'),
        ];
    }
}
