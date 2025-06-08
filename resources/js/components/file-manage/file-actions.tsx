import { FileDeleteDialog } from '@/components/file-manage/file-delete-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { OnAction } from '@/types';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { ChevronDown, FolderPlus, Plus, RotateCw, Share, Trash } from 'lucide-react';
import { ShareDialog } from '@/components/share-dialog';
import { useState } from 'react';

interface FilesActionsProps {
    variant: 'default' | 'trash';
    disableActions?: boolean;
    disableMultipleAction?: boolean;
    selectedFileIds?: number[];
    onAction: OnAction;
    onOpenFileDialog?: () => void;
    onCreateCollection?: () => void;
    onCreateFolder?: () => void;
}

export function FileActions({
    variant,
    disableActions = false,
    disableMultipleAction = false,
    selectedFileIds = [],
    onAction,
    onOpenFileDialog,
    onCreateCollection,
    onCreateFolder,
}: FilesActionsProps) {
    const { t } = useLaravelReactI18n();
    const [shareDialogOpen, setShareDialogOpen] = useState(false);

    if (variant === 'default') {
        return (
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button disabled={disableActions} onClick={() => onAction('delete')} variant="destructive" className="gap-2">
                        <Trash className="h-4 w-4" />
                        {t('file_manage.actions_button_trash')}
                    </Button>
                    <Button
                        disabled={disableActions || disableMultipleAction || selectedFileIds.length !== 1}
                        onClick={() => setShareDialogOpen(true)}
                        variant="outline"
                        className="gap-2"
                    >
                        <Share className="h-4 w-4" />
                        {t('file_manage.actions_button_share')}
                    </Button>
                    {selectedFileIds.length === 1 && (
                        <ShareDialog
                            fileId={selectedFileIds[0]}
                            open={shareDialogOpen}
                            onOpenChange={setShareDialogOpen}
                        />
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {(onCreateCollection || onCreateFolder) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="default" size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    {t('file_manage.actions_button_create')}
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {onCreateCollection && (
                                    <DropdownMenuItem onClick={onCreateCollection} className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        {t('file_manage.actions_button_create_collection')}
                                    </DropdownMenuItem>
                                )}
                                {onCreateFolder && (
                                    <DropdownMenuItem onClick={onCreateFolder} className="gap-2">
                                        <FolderPlus className="h-4 w-4" />
                                        {t('file_manage.actions_button_create_folder')}
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    <Button onClick={onOpenFileDialog} variant="secondary" className="gap-2">
                        <Share className="h-4 w-4" />
                        {t('file_manage.actions_button_upload')}
                    </Button>
                </div>
            </div>
        );
    } else if (variant === 'trash') {
        return (
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <FileDeleteDialog onConfirm={() => onAction('delete-permanently')}>
                        <Button disabled={disableActions} variant="destructive" className="gap-2">
                            <Trash className="h-4 w-4" />
                            {t('file_manage.actions_button_delete_permanently')}
                        </Button>
                    </FileDeleteDialog>
                    <Button disabled={disableActions} onClick={() => onAction('restore')} variant="outline" className="gap-2">
                        <RotateCw className="h-4 w-4" />
                        {t('file_manage.actions_button_restore')}{' '}
                    </Button>
                </div>
            </div>
        );
    }
    return null;
}
