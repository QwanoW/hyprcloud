import { Button } from '@/components/ui/button';
import { Share, Trash } from 'lucide-react';
import { FileDeleteDialog } from '@/components/file-manage/file-delete-dialog';

interface FilesActionsProps {
    variant: 'default' | 'trash'
    disableActions?: boolean;
    disableMultipleAction?: boolean;

    isAlreadyShared?: boolean;

    onAction: (action: 'show' | 'share' | 'cancel-share' | 'restore' | 'delete' | 'delete-permanently') => void;
    onOpenFileDialog?: () => void;
}

// function areEqual(prevProps: FilesActionsProps, nextProps: FilesActionsProps) {
//     return prevProps.disableActions === nextProps.disableActions;
// }

export function FileActions({ variant, disableActions = false, disableMultipleAction = false, isAlreadyShared = false, onAction, onOpenFileDialog }: FilesActionsProps) {
    if (variant === 'default') {
        return (
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button disabled={disableActions} onClick={() => onAction('delete')} variant="destructive" className="gap-2">
                        <Trash className="h-4 w-4" />
                        Trash
                    </Button>
                    <Button disabled={disableActions || disableMultipleAction} onClick={() => onAction(isAlreadyShared ? 'cancel-share' : 'share')} variant="outline" className="gap-2">
                        <Share className="h-4 w-4" />
                        {isAlreadyShared ? 'Cancel share' : 'Share'}
                    </Button>
                </div>
                <Button onClick={onOpenFileDialog} variant="secondary" className="gap-2">
                    <Share className="h-4 w-4" />
                    Upload
                </Button>
            </div>
        );
    } else if (variant === 'trash') {
        return (
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <FileDeleteDialog onConfirm={() => onAction('delete-permanently')} >
                        <Button disabled={disableActions} variant="destructive" className="gap-2">
                            <Trash className="h-4 w-4" />
                            Delete permanently
                        </Button>
                    </FileDeleteDialog>
                    <Button disabled={disableActions} onClick={() => onAction('restore')} variant="outline" className="gap-2">
                        <Share className="h-4 w-4" />
                        Restore
                    </Button>
                </div>
            </div>
        );
    }
}
