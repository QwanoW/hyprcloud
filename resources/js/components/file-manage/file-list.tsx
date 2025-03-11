import { FileItem } from '@/components/file-manage/file-item';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Pagination, TFile } from '@/types';
import { useRef, useState, useCallback } from 'react';
import Selecto from 'react-selecto';
import { InfiniteScroll } from '@/components/infinite-scroll';

// Улучшенный компонент переключения режима отображения
const ViewModeSwitcher = ({
                              viewMode,
                              onViewModeChange,
                          }: {
    viewMode: 'list' | 'cards';
    onViewModeChange: (mode: 'list' | 'cards') => void;
}) => (
    <div className="flex space-x-2">
        <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => onViewModeChange('list')}
        >
            Список
        </Button>
        <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            onClick={() => onViewModeChange('cards')}
        >
            Карточки
        </Button>
    </div>
);

interface FileListProps {
    files: TFile[];
    pagination: Pagination;
}

// Основной компонент списка файлов с улучшенной структурой
export function FilesList({ files, pagination }: FileListProps) {
    const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
    const containerRef = useRef<HTMLDivElement>(null);

    // Кастомный хук для логики выделения файлов
    const useFileSelection = () => {
        const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

        const handleSelectEnd = useCallback((selectedElements: HTMLElement[]) => {
            const newSelectedIds = new Set(
                selectedElements.map((el) => el.getAttribute('data-id') || '')
            );
            setSelectedIds(newSelectedIds);
        }, []);

        return { selectedIds, handleSelectEnd };
    };

    const { selectedIds, handleSelectEnd: handleFileSelectEnd } = useFileSelection(files);

    const renderFiles = useCallback(() => {
        return files.map((file) => (
            <div
                key={file.id}
                className={cn(
                    'selecto-item',
                    selectedIds.has(String(file.id)) && 'bg-blue-100',
                )}
                data-id={file.id}
            >
                <FileItem file={file} isSelected={selectedIds.has(String(file.id))} />
            </div>
        ));
    }, [files, selectedIds]);

    const handleSelectEnd = useCallback((e: any) => {
        handleFileSelectEnd(e.selected);
    }, [handleFileSelectEnd]);

    return (
        <div className="space-y-6">
            <ViewModeSwitcher viewMode={viewMode} onViewModeChange={setViewMode} />

            <div
                ref={containerRef}
                className={cn(
                    'flex',
                    viewMode === 'list' ? 'flex-col space-y-2' : 'grid gap-4',
                    viewMode === 'cards' && 'grid-cols-[repeat(auto-fill,minmax(200px,1fr))]',
                )}
            >
                {renderFiles()}
            </div>

            <InfiniteScroll pagination={pagination} only={['files', 'pagination']} />

            {containerRef.current && (
                <Selecto
                    container={containerRef.current}
                    selectableTargets={['.selecto-item']}
                    toggleContinueSelect="ctrl"
                    hitRate={0}
                    onSelectEnd={handleSelectEnd}
                />
            )}
        </div>
    );
}
