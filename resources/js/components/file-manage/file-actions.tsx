import { FileDeleteDialog } from '@/components/file-manage/file-delete-dialog';
import { Button } from '@/components/ui/button';
import { OnAction } from '@/types';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { RotateCw, Share, Trash } from 'lucide-react';

interface FilesActionsProps {
    variant: 'default' | 'trash';
    disableActions?: boolean;
    disableMultipleAction?: boolean;
    isAlreadyShared?: boolean;
    onAction: OnAction;
    onOpenFileDialog?: () => void;
}

export function FileActions({
    variant,
    disableActions = false,
    disableMultipleAction = false,
    isAlreadyShared = false,
    onAction,
    onOpenFileDialog,
}: FilesActionsProps) {
    const { t } = useLaravelReactI18n();

    if (variant === 'default') {
        return (
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button disabled={disableActions} onClick={() => onAction('delete')} variant="destructive" className="gap-2">
                        <Trash className="h-4 w-4" />
                        {t('file_manage.actions_button_trash')}
                    </Button>
                    <Button
                        disabled={disableActions || disableMultipleAction}
                        onClick={() => onAction(isAlreadyShared ? 'cancel-share' : 'share')}
                        variant="outline"
                        className="gap-2"
                    >
                        <Share className="h-4 w-4" />
                        {isAlreadyShared ? t('file_manage.actions_button_cancel_share') : t('file_manage.actions_button_share')}
                    </Button>
                </div>
                <Button onClick={onOpenFileDialog} variant="secondary" className="gap-2">
                    <Share className="h-4 w-4" />
                    {t('file_manage.actions_button_upload')}
                </Button>
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
