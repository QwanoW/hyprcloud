import { FileIcon } from '@/components/file-manage/file-icon';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { formatFileSize } from '@/lib/utils';
import { TFile } from '@/types';
import { Link } from 'lucide-react';
import React from 'react';

interface FileItemProps {
    variant: 'row' | 'card';
    className?: string;
    file: TFile;
}

export const FileItem = React.memo(({ file, className, variant }: FileItemProps) => {
    const updatedAt = new Date(file.updated_at);

    // cant see file if file is in trash
    const moveIntoFile =
        file.trash
        ? undefined
        : () => open(file.url);

    if (variant === 'card')
        return (
            <Card
                onDoubleClick={moveIntoFile}
                data-id={file.id}
                className={'hover:bg-muted flex items-center gap-1.5 border-none p-2 shadow-none transition-colors ' + className}
            >
                <FileIcon file={file} />
                <CardContent className="flex-1 p-0">
                    <CardTitle title={file.name} className="line-clamp-2 w-20 text-center font-mono text-sm break-words">
                        {file.name}
                    </CardTitle>
                    <p className="text-muted-foreground text-center text-xs">{formatFileSize(file.size)}</p>
                </CardContent>
            </Card>
        );

    return (
        <Card
            onDoubleClick={moveIntoFile}
            data-id={file.id}
            className={'hover:bg-muted border-none px-2 py-1 shadow-none transition-colors ' + className}
        >
            <CardContent className="flex w-full p-0">
                <div className="flex w-1/2 items-center gap-4 pr-6 lg:w-2/3">
                    <div className="aspect-square h-12 w-12">
                        <FileIcon file={file} />
                    </div>
                    <CardTitle title={file.name} className="line-clamp-1 w-fit font-mono text-sm">
                        {file.name}
                    </CardTitle>
                </div>
                <div className="flex w-1/2 items-center justify-between lg:w-1/3">
                    <p className="text-muted-foreground text-center text-sm">{updatedAt.toDateString()}</p>
                    <p className="text-muted-foreground text-center text-sm">{updatedAt.toLocaleTimeString()}</p>
                    <p className="text-muted-foreground text-center text-sm">{formatFileSize(file.size)}</p>
                    {file.shared ? <Link /> : <div></div>}
                </div>
            </CardContent>
        </Card>
    );
});
