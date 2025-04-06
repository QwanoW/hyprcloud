<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TestimonialResource\Pages;
use App\Models\Testimonial;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class TestimonialResource extends Resource
{
    protected static ?string $model = Testimonial::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';
    
    protected static ?string $navigationLabel = 'Отзывы';
    
    protected static ?string $navigationGroup = 'Контент';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Фотография')
                    ->schema([
                        Forms\Components\FileUpload::make('photo')
                            ->label('Фотография')
                            ->image()
                            ->directory('testimonials')
                            ->visibility('public')
                            ->imagePreviewHeight('100')
                            ->maxSize(1024)
                    ])->columnSpanFull(),
                Forms\Components\Section::make('Настройки')
                    ->schema([
                        Forms\Components\Toggle::make('show_on_homepage')
                            ->label('Показывать на главной странице')
                            ->default(false)
                    ])->columnSpanFull(),
                Forms\Components\Tabs::make('Локализация')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('Русский')
                            ->schema([
                                Forms\Components\TextInput::make('name_ru')
                                    ->label('Имя (RU)')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('position_ru')
                                    ->label('Должность (RU)')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\Textarea::make('testimonial_ru')
                                    ->label('Отзыв (RU)')
                                    ->required()
                                    ->rows(5)
                                    ->columnSpanFull(),
                            ]),
                        Forms\Components\Tabs\Tab::make('English')
                            ->schema([
                                Forms\Components\TextInput::make('name_en')
                                    ->label('Имя (EN)')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('position_en')
                                    ->label('Должность (EN)')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\Textarea::make('testimonial_en')
                                    ->label('Отзыв (EN)')
                                    ->required()
                                    ->rows(5)
                                    ->columnSpanFull(),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('photo')
                    ->label('Фото')
                    ->circular(),
                Tables\Columns\TextColumn::make('name_ru')
                    ->label('Имя (RU)')
                    ->searchable(),
                Tables\Columns\TextColumn::make('position_ru')
                    ->label('Должность (RU)')
                    ->searchable(),
                Tables\Columns\IconColumn::make('show_on_homepage')
                    ->label('На главной')
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
            'index' => Pages\ListTestimonials::route('/'),
            'create' => Pages\CreateTestimonial::route('/create'),
            'edit' => Pages\EditTestimonial::route('/{record}/edit'),
        ];
    }
}