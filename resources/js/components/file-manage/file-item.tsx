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
    const updatedAt = new Date(file.updated_at)

    if (variant === 'card')
        return (
            <Card data-id={file.id} className={'hover:bg-muted flex items-center border-none p-4 shadow-none transition-colors ' + className}>
                <FileIcon file={file} />
                <CardContent className="flex-1 p-0">
                    <CardTitle className="w-20 truncate text-center font-mono text-sm">{file.name}</CardTitle>
                    <p className="text-muted-foreground text-center text-sm">{formatFileSize(file.size)}</p>
                </CardContent>
            </Card>
        );

    return (
        <Card data-id={file.id} className={'hover:bg-muted border-none px-2 py-1 shadow-none transition-colors ' + className}>
            <CardContent className="flex w-full p-0">
                <div className="flex w-2/3 items-center gap-4 pr-6">
                    <div className="w-12 h-12">
                        <FileIcon file={file} />
                    </div>
                    <CardTitle className="truncate text-center font-mono text-sm">{file.name}</CardTitle>
                </div>
                <div className="flex w-1/3 items-center justify-between">
                    <p className="text-muted-foreground text-center text-sm">{updatedAt.toDateString()}</p>
                    <p className="text-muted-foreground text-center text-sm">{updatedAt.toLocaleTimeString()}</p>
                    <p className="text-muted-foreground text-center text-sm">{formatFileSize(file.size)}</p>
                    {file.shared ? <Link /> : <div></div>}
                </div>
            </CardContent>
        </Card>
    );
});
