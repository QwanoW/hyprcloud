import { FileItem } from '@/components/file-manage/file-item';
import { FileSort } from '@/components/file-manage/file-sort';
import { ViewModeSwitcher } from '@/components/file-manage/view-mode-switcher';
import { cn } from '@/lib/utils';
import { TFile } from '@/types';
import autoAnimate from '@formkit/auto-animate';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Selecto from 'react-selecto';

interface FileListProps {
    files: TFile[];
    handleSelect: (id: number, type: 'select' | 'unselect') => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
    infiniteQuery?: UseInfiniteQueryResult<{ data: TFile[] }, Error>;
    sortOptions?: {
        sort: string;
        direction: 'asc' | 'desc';
    };
    onSortChange?: (sort: string) => void;
}

export const FilesList = ({ files, handleSelect, containerRef, infiniteQuery, sortOptions, onSortChange }: FileListProps) => {
    const { t } = useLaravelReactI18n();
    const [viewMode, setViewMode] = useState<'list' | 'cards'>(() => (localStorage.getItem('viewMode') as 'list' | 'cards') || 'list');
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            autoAnimate(containerRef.current);
        }
    }, [containerRef]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (!infiniteQuery || !loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
                    infiniteQuery.fetchNextPage();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px',
            },
        );

        observer.observe(loadMoreRef.current);

        return () => {
            observer.disconnect();
        };
    }, [infiniteQuery]);

    const onViewModeChange = useCallback((val: 'list' | 'cards') => {
        setViewMode(val);
        localStorage.setItem('viewMode', val);
    }, []);

    const renderFiles = useCallback(() => {
        return files.map((file) => (
            <FileItem variant={viewMode === 'list' ? 'row' : 'card'} key={file.id} className="selecto-item" file={file} data-id={file.id} />
        ));
    }, [files, viewMode]);

    const containerClass = viewMode === 'list' ? 'flex flex-col space-y-1' : 'grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4';

    return (
        <div className="h-full space-y-6">
            <div className="flex justify-between">
                <ViewModeSwitcher viewMode={viewMode} onViewModeChange={onViewModeChange} />
                {sortOptions && onSortChange && <FileSort sortOptions={sortOptions} onSortChange={onSortChange} />}
            </div>
            <div ref={containerRef} className={cn(containerClass)}>
                {renderFiles()}
            </div>
            {files.length === 0 && !infiniteQuery?.isLoading && (
                <div className="mt-40 text-center">
                    <span className="text-accent-foreground">{t('file_manage.list_empty')}</span>
                </div>
            )}

            {/* Loading indicator for initial load */}
            {infiniteQuery?.isLoading && files.length === 0 && (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">{t('shared.loading')}</span>
                </div>
            )}

            {/* Load more trigger and loading indicator */}
            {infiniteQuery && files.length > 0 && (
                <div ref={loadMoreRef} className="flex justify-center py-4">
                    {infiniteQuery.isFetchingNextPage && (
                        <div className="flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2 text-sm">{t('shared.loading_more')}</span>
                        </div>
                    )}
                    {!infiniteQuery.hasNextPage && files.length > 0 && (
                        <span className="text-muted-foreground text-sm">{t('shared.no_more_items')}</span>
                    )}
                </div>
            )}
            <Selecto
                container={containerRef.current}
                selectableTargets={['.selecto-item']}
                toggleContinueSelect="ctrl"
                hitRate={0}
                onSelect={(e) => {
                    e.added.forEach((el) => {
                        el.classList.add('active');
                        handleSelect(Number(el.dataset['id']), 'select');
                    });
                    e.removed.forEach((el) => {
                        el.classList.remove('active');
                        handleSelect(Number(el.dataset['id']), 'unselect');
                    });
                }}
            />
        </div>
    );
};
