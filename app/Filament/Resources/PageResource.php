<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PageResource\Pages;
use App\Filament\Resources\PageResource\RelationManagers;
use App\Models\Page;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PageResource extends Resource
{
    protected static ?string $model = Page::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    
    protected static ?string $navigationLabel = 'Статические страницы';
    
    protected static ?string $navigationGroup = 'Контент';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Информация о странице')
                    ->schema([
                        Forms\Components\TextInput::make('slug')
                            ->label('URL-идентификатор')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Forms\Components\DateTimePicker::make('last_updated')
                            ->label('Последнее обновление')
                            ->default(now()),
                    ])->columns(2),
                Forms\Components\Tabs::make('Локализация')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('Русский')
                            ->schema([
                                Forms\Components\TextInput::make('title_ru')
                                    ->label('Заголовок (RU)')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\MarkdownEditor::make('content_ru')
                                    ->label('Содержание (RU)')
                                    ->required()
                                    ->columnSpanFull(),
                            ]),
                        Forms\Components\Tabs\Tab::make('English')
                            ->schema([
                                Forms\Components\TextInput::make('title_en')
                                    ->label('Заголовок (EN)')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\MarkdownEditor::make('content_en')
                                    ->label('Содержание (EN)')
                                    ->required()
                                    ->columnSpanFull(),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('slug')
                    ->label('URL-идентификатор')
                    ->searchable(),
                Tables\Columns\TextColumn::make('title_ru')
                    ->label('Заголовок (RU)')
                    ->searchable(),
                Tables\Columns\TextColumn::make('title_en')
                    ->label('Заголовок (EN)')
                    ->searchable(),
                Tables\Columns\TextColumn::make('last_updated')
                    ->label('Последнее обновление')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Создан')
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
            'index' => Pages\ListPages::route('/'),
            'create' => Pages\CreatePage::route('/create'),
            'edit' => Pages\EditPage::route('/{record}/edit'),
        ];
    }
}
