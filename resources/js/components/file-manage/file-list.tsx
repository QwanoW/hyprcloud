import { FileItem } from '@/components/file-manage/file-item';
import { FileSort } from '@/components/file-manage/file-sort';
import { ViewModeSwitcher } from '@/components/file-manage/view-mode-switcher';
import { cn } from '@/lib/utils';
import { FileManagerIndexResponse } from '@/services/fileManagerApi';
import { TFile } from '@/types';
import autoAnimate from '@formkit/auto-animate';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Selecto from 'react-selecto';

interface FileListProps {
    files: TFile[];
    handleSelect: (id: number, type: 'select' | 'unselect') => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
    infiniteQuery?: UseInfiniteQueryResult<InfiniteData<FileManagerIndexResponse, unknown>, Error>;
    sortOptions?: {
        sort: string;
        direction: 'asc' | 'desc';
    };
    onSortChange?: (sort: string) => void;
    onFileDoubleClick?: (file: TFile) => void;
}

export const FilesList = ({ files, handleSelect, containerRef, infiniteQuery, sortOptions, onSortChange, onFileDoubleClick }: FileListProps) => {
    const { t } = useLaravelReactI18n();
    const [viewMode, setViewMode] = useState<'list' | 'cards'>(() => (localStorage.getItem('viewMode') as 'list' | 'cards') || 'list');
    const [previousFiles, setPreviousFiles] = useState<TFile[]>([]);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Save previous files when new files are loaded
    useEffect(() => {
        if (files.length > 0 && !infiniteQuery?.isFetchingNextPage) {
            setPreviousFiles(files);
        }
    }, [files, infiniteQuery?.isFetchingNextPage]);

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

    // Check if we're fetching due to sorting (not infinite scroll)
    // Use isPending to catch initial loads after sort changes
    const isRefetching = (infiniteQuery?.isFetching || infiniteQuery?.isPending) && !infiniteQuery?.isFetchingNextPage;

    const renderFiles = useCallback(() => {
        // Show previous files during sorting if current files are empty
        const filesToRender = files.length === 0 && isRefetching && previousFiles.length > 0 ? previousFiles : files;
        
        return filesToRender.map((file) => (
            <FileItem 
                variant={viewMode === 'list' ? 'row' : 'card'} 
                key={file.id} 
                className="selecto-item" 
                file={file} 
                data-id={file.id}
                onFileDoubleClick={onFileDoubleClick}
            />
        ));
    }, [files, viewMode, isRefetching, previousFiles, onFileDoubleClick]);

    const containerClass = viewMode === 'list' ? 'flex flex-col space-y-1' : 'grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4';
    
    return (
        <div className="h-full space-y-6 flex flex-col">
            <div className="flex justify-between flex-wrap">
                <ViewModeSwitcher viewMode={viewMode} onViewModeChange={onViewModeChange} />
                {sortOptions && onSortChange && <FileSort sortOptions={sortOptions} onSortChange={onSortChange} />}
            </div>
            <div className="relative">
                <div ref={containerRef} className={cn(containerClass, isRefetching && "opacity-50 pointer-events-none", "px-2")}>
                    {renderFiles()}
                </div>
                {/* Loading overlay during sorting/refetching */}
                {isRefetching && (
                    <div className="absolute inset-0">
                        <div className='flex justify-center mt-24'>
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        </div>
                    </div>
                )}
            </div>
            {files.length === 0 && !infiniteQuery?.isPending && !isRefetching && (
                <div className="mt-40 text-center">
                    <span className="text-accent-foreground">{t('file_manage.list_empty')}</span>
                </div>
            )}

            {/* Load more trigger and loading indicator */}
            {infiniteQuery && files.length > 0 && (
                <div ref={loadMoreRef} className="flex justify-center">
                    {infiniteQuery.isFetchingNextPage && (
                        <div className="mt-40 flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2 text-sm">{t('shared.loading_more')}</span>
                        </div>
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
