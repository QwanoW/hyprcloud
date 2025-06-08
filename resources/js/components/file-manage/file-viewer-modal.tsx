import { FileDeleteDialog } from '@/components/file-manage/file-delete-dialog';
import { FileIcon } from '@/components/file-manage/file-icon';
import { ShareDialog } from '@/components/share-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useFileActionMutations } from '@/hooks/file-manage/use-file-mutations';
import { FileType, TFile } from '@/types';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { ChevronLeft, ChevronRight, Download, Share2, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useState, useMemo } from 'react';


interface FileViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    files: TFile[];
    initialFileId: number;
    onFileDeleted?: (fileId: number) => void;
}

export const FileViewerModal = ({ 
    isOpen, 
    onClose, 
    files, 
    initialFileId, 
    onFileDeleted 
}: FileViewerModalProps) => {
    const { t } = useLaravelReactI18n();
    const { actions, loading } = useFileActionMutations();
    
    // Мемоизируем список просматриваемых файлов
    const viewableFiles = useMemo(() => 
        files.filter((file) => file.type !== FileType.Folder), 
        [files]
    );

    // Инициализируем индекс на основе initialFileId
    const [currentIndex, setCurrentIndex] = useState(0);

    // Обновляем индекс при изменении initialFileId или списка файлов
    useEffect(() => {
        if (viewableFiles.length === 0) return;
        
        const index = viewableFiles.findIndex((file) => file.id === initialFileId);
        const validIndex = index !== -1 ? index : 0;
        setCurrentIndex(validIndex);
    }, [initialFileId, viewableFiles]);

    // Проверяем валидность текущего индекса
    useEffect(() => {
        if (viewableFiles.length === 0) return;
        
        if (currentIndex >= viewableFiles.length) {
            setCurrentIndex(Math.max(0, viewableFiles.length - 1));
        } else if (currentIndex < 0) {
            setCurrentIndex(0);
        }
    }, [viewableFiles.length, currentIndex]);

    const currentFile = viewableFiles[currentIndex];

    const handlePrevious = useCallback(() => {
        if (viewableFiles.length <= 1) return;
        
        setCurrentIndex((prev) => {
            return prev > 0 ? prev - 1 : viewableFiles.length - 1;
        });
    }, [viewableFiles.length]);

    const handleNext = useCallback(() => {
        if (viewableFiles.length <= 1) return;
        
        setCurrentIndex((prev) => {
            return prev < viewableFiles.length - 1 ? prev + 1 : 0;
        });
    }, [viewableFiles.length]);

    // Обработка клавиатурных событий
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen || viewableFiles.length === 0) return;
            
            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    handlePrevious();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    handleNext();
                    break;
                case 'Escape':
                    event.preventDefault();
                    onClose();
                    break;
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handlePrevious, handleNext, onClose, viewableFiles.length]);

    const handleDownload = useCallback(() => {
        if (!currentFile) return;
        window.open(currentFile.url, '_blank');
    }, [currentFile]);

    const [shareDialogOpen, setShareDialogOpen] = useState(false);

    const handleShare = useCallback(() => {
        setShareDialogOpen(true);
    }, []);

    const handleDelete = useCallback(() => {
        if (!currentFile) return;
        
        actions.trash([currentFile.id]);
        onFileDeleted?.(currentFile.id);

        // Если это последний файл, закрываем модальное окно
        if (viewableFiles.length === 1) {
            onClose();
        }
    }, [currentFile, actions, onFileDeleted, viewableFiles.length, onClose]);



    const renderFilePreview = (file: TFile) => {
        switch (file.type) {
            case FileType.Image:
                return (
                    <div className="flex h-full items-center justify-center p-4">
                        <img 
                            src={file.url} 
                            alt={file.name} 
                            className="max-h-full max-w-full rounded-lg object-contain shadow-lg" 
                        />
                    </div>
                );
            
            case FileType.Video:
                return (
                    <div className="flex h-full items-center justify-center p-4">
                        <video 
                            src={file.url} 
                            controls 
                            className="max-h-full max-w-full rounded-lg shadow-lg"
                        >
                            {t('file_manage.video_not_supported')}
                        </video>
                    </div>
                );
            
            case FileType.Audio:
                return (
                    <div className="flex h-full flex-col items-center justify-center space-y-6 p-8">
                        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 shadow-md">
                            <FileIcon file={file} />
                        </div>
                        <div className="w-full max-w-md">
                            <h3 className="mb-4 text-center text-lg font-medium text-foreground">
                                {file.name}
                            </h3>
                            <audio 
                                src={file.url} 
                                controls 
                                className="w-full"
                            >
                                {t('file_manage.audio_not_supported')}
                            </audio>
                        </div>
                    </div>
                );
            
            default:
                return (
                    <div className="flex h-full flex-col items-center justify-center space-y-6 p-8">
                        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 shadow-md">
                            <FileIcon file={file} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-foreground">
                                {file.name}
                            </h3>
                            <p className="mt-2 text-muted-foreground">
                                {t('file_manage.preview_not_available')}
                            </p>
                        </div>
                    </div>
                );
        }
    };

    // Если нет файлов для просмотра, не рендерим компонент
    if (viewableFiles.length === 0 || !currentFile) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="[&>button]:hidden !max-w-7xl h-[90vh] flex flex-col p-0">
                <DialogTitle className="sr-only">
                    {currentFile.name || 'File Viewer'}
                </DialogTitle>

                {/* Header */}
                <div className="flex flex-col space-y-6 sm:space-y-0 sm:flex-row items-start justify-between sm:items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4">
                    <div className="flex items-center space-x-3 min-w-0">
                        <div className="h-8 w-8 flex-shrink-0">
                            <FileIcon file={currentFile} />
                        </div>
                        <div className="min-w-0">
                            <h2 className="max-w-[calc(100vw-5rem)] sm:max-w-[30rem] truncate text-lg font-semibold text-foreground">
                                {currentFile.name}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                    {currentFile.type}
                                </Badge>
                                {currentFile.shared ? (
                                    <Badge 
                                        variant="outline" 
                                        className="border-green-200 bg-green-50 text-green-700 text-xs"
                                    >
                                        <Share2 className="mr-1 h-3 w-3" />
                                        {t('file_manage.shared_publicly')}
                                    </Badge>
                                ) : <></>}
                                <span className="text-muted-foreground text-sm">
                                    {currentIndex + 1} / {viewableFiles.length}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="w-full sm:w-fit flex items-center gap-2">
                        <Button 
                            onClick={handleDownload} 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-primary/10"
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                            onClick={handleShare} 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-primary/10"
                        >
                            <Share2 className="h-4 w-4" />
                        </Button>
                        
                        <FileDeleteDialog onConfirm={handleDelete}>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={loading.isTrashLoading}
                                className="hover:bg-destructive/10"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </FileDeleteDialog>

                        <Button
                            onClick={onClose}
                            variant="ghost"
                            size="sm"
                            className="ml-auto sm:ml-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Content area */}
                <div className="relative flex-1 overflow-hidden bg-muted/30">
                    <div className="h-full">
                        {renderFilePreview(currentFile)}
                    </div>
                    
                    {/* Navigation buttons */}
                    {viewableFiles.length > 1 && (
                        <>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg border-border/50"
                                onClick={handlePrevious}
                                disabled={viewableFiles.length <= 1}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg border-border/50"
                                onClick={handleNext}
                                disabled={viewableFiles.length <= 1}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
            {currentFile && (
                <ShareDialog
                    fileId={currentFile.id}
                    open={shareDialogOpen}
                    onOpenChange={setShareDialogOpen}
                />
            )}
        </Dialog>
    );
};