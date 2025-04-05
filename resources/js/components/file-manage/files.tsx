import { FileActions } from '@/components/file-manage/file-actions';
import { FileDropzone } from '@/components/file-manage/file-dropzone';
import { FilesList } from '@/components/file-manage/file-list';
import { useFileActionMenu } from '@/hooks/file-manage/use-file-action-menu';
import { useFileActions } from '@/hooks/file-manage/use-file-actions';
import { useFileSelection } from '@/hooks/file-manage/use-file-selection';
import { useFileUpload } from '@/hooks/file-manage/use-file-upload';
import { Pagination, SharedData, TFile } from '@/types';
import { useCallback, useRef } from 'react';
import { ActionMenu } from '@/components/file-manage/file-action-menu';
import { useOutsideClick } from '@/hooks/use-outside-click';
import axios from 'axios';
import { toast } from 'sonner';
import { usePage } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

interface FilesProps {
    variant?: 'default' | 'trash';
    withActions?: boolean;
    files: TFile[];
    pagination: Pagination;
}

export function Files({ variant = 'default', withActions = false, files, pagination }: FilesProps) {
    const { t } = useLaravelReactI18n();
    const {auth: {user}} = usePage<SharedData>().props;
    const { upload } = useFileUpload();
    const {share, cancelShare, restore, destroy, trash} = useFileActions();
    const { selectedIds, handleSelect } = useFileSelection();

    const disableActions = selectedIds.length === 0;
    const disableMultipleAction = selectedIds.length !== 1;
    const isAlreadyShared = Boolean(files.find((f) => f.id === selectedIds[0])?.shared);

    const containerRef = useRef<HTMLDivElement>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);
    const { actionMenuOpen, setActionMenuOpen, actionMenuPos } = useFileActionMenu(containerRef);
    useOutsideClick(actionMenuRef, () => setActionMenuOpen(false));

    const openFileDialogRef = useRef<() => void>(null);
    const onOpenFileDialog = () => {
        if (openFileDialogRef.current) {
            openFileDialogRef.current();
        }
    };

    const onAction = useCallback(async (action: 'show' | 'share' | 'cancel-share' | 'restore' | 'delete' | 'delete-permanently' | 'download-zip') => {
        setActionMenuOpen(false); // Close menu on action
        if (action === 'show') {
            if (!disableMultipleAction) {
                const file = files.find((f) => f.id === selectedIds[0]);
                if (file) {
                    window.open(file.url, '_blank');
                }
            }
        } else if (action === 'share') {
            share(selectedIds[0], user.id);
        }
         else if (action === 'cancel-share') {
            cancelShare(selectedIds[0]);
        } else if (action === 'restore') {
            restore(selectedIds);
        } else if (action === 'delete') {
            trash(selectedIds);
        } else if (action === 'delete-permanently') {
            destroy(selectedIds);
        } else if (action === 'download-zip') {
            const toastId = 'download-zip';
            try {
                toast.loading(t('file_manage.toast_zip_creating'), { id: toastId });
                const response = await axios.post<{ download_url: string }>(route('files.downloadZip', { ids: selectedIds }));
                window.open(response.data.download_url, '_blank');
                toast.success(t('file_manage.toast_zip_success'), { id: toastId });
            } catch (error) {
                toast.error(t('file_manage.toast_zip_error'), { id: toastId });
            }
        }
    }, [share, cancelShare, restore, destroy, trash, selectedIds, user.id, files, disableMultipleAction, t, setActionMenuOpen]);

    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            {withActions && (
                <FileActions
                    variant={variant}
                    disableActions={disableActions}
                    disableMultipleAction={disableMultipleAction}
                    isAlreadyShared={isAlreadyShared}
                    onAction={onAction}
                    onOpenFileDialog={onOpenFileDialog}
                />
            )}
            <FileDropzone openFileDialogRef={openFileDialogRef} onDrop={(acceptedFiles, fileRejections) => upload(acceptedFiles, fileRejections, files)} maxFiles={10} maxSize={100 * 1024 * 1024}>
                <FilesList
                    handleSelect={handleSelect}
                    pagination={pagination}
                    files={files}
                    containerRef={containerRef}
                />
            </FileDropzone>
            {actionMenuOpen && (
                <div ref={actionMenuRef}>
                    <ActionMenu pos={actionMenuPos} variant={variant} disableMultipleAction={disableMultipleAction} isAlreadyShared={isAlreadyShared} onAction={onAction} onClose={() => setActionMenuOpen(false)} />
                </div>
            )}
        </div>
    );
}