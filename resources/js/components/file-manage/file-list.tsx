import { FileItem } from '@/components/file-manage/file-item';
import { ViewModeSwitcher } from '@/components/file-manage/view-mode-switcher';
import { InfiniteScroll } from '@/components/infinite-scroll';
import { cn } from '@/lib/utils';
import { Pagination, TFile } from '@/types';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import Selecto from 'react-selecto';
import autoAnimate from '@formkit/auto-animate';

interface FileListProps {
    files: TFile[];
    pagination: Pagination;
    handleSelect: (id: number, type: 'select' | 'unselect') => void;
}

const FilesList = memo(({ files, pagination, handleSelect }: FileListProps) => {
    const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) autoAnimate(containerRef.current)
    }, [containerRef])

    const renderFiles = useCallback(() => {
        return files.map((file) => <FileItem variant={viewMode === 'list' ? 'row' : 'card'} key={file.id} className="selecto-item" file={file} />);
    }, [files, viewMode]);

    return (
        <div className="h-full space-y-6">
            <ViewModeSwitcher viewMode={viewMode} onViewModeChange={setViewMode} />

            <div
                ref={containerRef}
                className={cn(viewMode === 'list' ? 'flex flex-col space-y-1' : 'grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4')}
            >
                {renderFiles()}
            </div>

            {files.length === 0 && (
                <div className="mt-40 text-center">
                    <span className="text-accent-foreground">No files found</span>
                </div>
            )}

            <InfiniteScroll pagination={pagination} only={['files', 'pagination']} />

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
});

export { FilesList };
