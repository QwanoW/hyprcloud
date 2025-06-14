import { FileIcon } from '@/components/file-manage/file-icon';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useFormatFileSize } from '@/hooks/file-manage/use-format-file-size';
import { TFile, FileType } from '@/types';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Check, Link } from 'lucide-react';
import React, { useState } from 'react';
import { router } from '@inertiajs/react'

interface FileItemProps {
    variant: 'row' | 'card' | 'search';
    className?: string;
    file: TFile;
    onFileDoubleClick?: (file: TFile) => void;
}

export const FileItem = React.memo(({ file, className, variant, onFileDoubleClick }: FileItemProps) => {
    const { currentLocale } = useLaravelReactI18n();
    const locale = currentLocale();
    let fileSize = useFormatFileSize(file.size);
    fileSize = file.type === FileType.Folder ? '—' : fileSize;
    const [isCopied, setIsCopied] = useState(false);
    const updatedAt = new Date(file.updated_at);
    
    // Navigate to file/folder using hashed ID or open file modal
    const moveIntoFile = () => {
        if (file.type === FileType.Folder) {
            const hashedId = btoa(file.id.toString());
            router.visit(`/dashboard/files/${hashedId}?source=${window.location.pathname}`);
        } else {
            // For files, call the modal handler if provided
            onFileDoubleClick?.(file);
        }
    };
    

    const handleCopyLink = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!file.shared_url) return;

        navigator.clipboard.writeText(file.shared_url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const renderLinkIcon = () => {
        if (!file.shared) return <div></div>;

        return (
            <button
                onClick={handleCopyLink}
                className="cursor-pointer relative p-1 rounded-md hover:bg-accent transition-colors"
                aria-label="Copy shared link"
            >
                <Link className={`h-4 w-4 text-primary ${isCopied ? 'opacity-0' : 'opacity-100'} transition-opacity`} />
                <Check
                    className={`h-4 w-4 absolute top-1 left-1 text-green-600 ${
                        isCopied ? 'opacity-100' : 'opacity-0'
                    } transition-opacity`}
                />
            </button>
        );
    };
        

    if (variant === 'search') {
        return (
            <Card
                onDoubleClick={moveIntoFile}
                data-id={file.id}
                className={'hover:bg-muted border-none px-2 py-1.5 shadow-none transition-colors cursor-pointer ' + className}
            >
                <CardContent className="flex w-full items-center gap-2 p-0">
                    <div className="h-8 w-8 flex-shrink-0">
                        <FileIcon file={file} />
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden pr-2">
                        <CardTitle title={file.name} className="truncate font-mono text-sm">
                            {file.name}
                        </CardTitle>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{fileSize}</span>
                            <span>·</span>
                            <span>{updatedAt.toLocaleDateString(locale)}</span>
                        </div>
                    </div>
                    {file.shared ? <Link className="h-4 w-4 flex-shrink-0 text-primary" /> : <div></div>}
                </CardContent>
            </Card>
        );
    }

    if (variant === 'card')
        return (
            <Card
                onDoubleClick={moveIntoFile}
                data-id={file.id}
                className={'hover:bg-muted rounded-sm bg-transparent flex flex-col items-center gap-1.5 border-none p-2 shadow-none transition-colors ' + className}
            >
                <FileIcon file={file} />
                <CardContent className="flex-1 p-0 w-full">
                    <CardTitle title={file.name} className="line-clamp-2 text-center font-mono text-sm break-words mb-1">
                        {file.name}
                    </CardTitle>
                    <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            {file.shared && <Link className="h-3 w-3 text-primary" />}
                            {file.type !== FileType.Folder && <span>{fileSize}</span>}
                        </div>
                        <span>{updatedAt.toLocaleDateString(locale)}</span>
                    </div>
                </CardContent>
            </Card>
        );

    return (
        <Card
            onDoubleClick={moveIntoFile}
            data-id={file.id}
            className={'hover:bg-muted dark:hover:bg-accent border-none px-2 py-1 shadow-none transition-colors ' + className}
        >
            <CardContent className="flex w-full p-0">
                <div className="flex w-full items-center gap-2 sm:gap-4 sm:w-1/2 lg:w-2/3 pr-2 sm:pr-6">
                    <div className="aspect-square h-8 w-8 sm:h-12 sm:w-12 flex-shrink-0">
                        <FileIcon file={file} />
                    </div>
                    <CardTitle title={file.name} className="line-clamp-1 flex-1 font-mono text-xs sm:text-sm min-w-0">
                        {file.name}
                    </CardTitle>
                </div>
                <div className="hidden sm:flex w-1/2 items-center justify-between lg:w-1/3">
                    <p className="text-muted-foreground text-center text-sm">{updatedAt.toLocaleDateString(locale)}</p>
                    <p className="text-muted-foreground text-center text-sm">{updatedAt.toLocaleTimeString(locale)}</p>
                    <p className="text-muted-foreground text-center text-sm">{fileSize}</p>
                    {file.shared ? renderLinkIcon() : <div></div>}
                </div>
                <div className="flex sm:hidden items-center gap-1 flex-shrink-0">
                    <p className="text-muted-foreground text-xs">{fileSize}</p>
                    {file.shared ? <Link className="h-3 w-3 text-primary" /> : null}
                </div>
            </CardContent>
        </Card>
    );
});