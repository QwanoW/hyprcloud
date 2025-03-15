import { FileActions } from '@/components/file-manage/file-actions';
import { FileDropzone } from '@/components/file-manage/file-dropzone';
import { FilesList } from '@/components/file-manage/file-list';
import { useFileActions } from '@/hooks/file-manage/use-file-actions';
import { useFileSelection } from '@/hooks/file-manage/use-file-selection';
import { useFileUpload } from '@/hooks/file-manage/use-file-upload';
import { Pagination, TFile } from '@/types';
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface FilesProps {
    variant?: 'default' | 'trash';
    withActions?: boolean;
    files: TFile[];
    pagination: Pagination;
}

export function Files({ variant = 'default', withActions = false, files, pagination }: FilesProps) {
    const { upload } = useFileUpload();
    const { trash, destroy, restore, update } = useFileActions();
    const { selectedIds, handleSelect } = useFileSelection();

    const openFileDialogRef = useRef<() => void>(null);
    const onOpenFileDialog = () => {
        if (openFileDialogRef.current) {
            openFileDialogRef.current();
        }
    };

    const handleShare = useCallback(() => {
        if (selectedIds.length !== 1) {
            toast.error('You can only choose 1 file to share');
            return;
        }

        const isAlreadyShared = files.find((f) => f.id === selectedIds[0])!.shared;
        if (isAlreadyShared) {
            toast.error('File is already shared', {
                duration: 5000,
                action: {
                    label: 'Undo share',
                    onClick: () => {
                        update(selectedIds[0], { shared: false });
                    },
                },
            });
            return;
        }
        update(selectedIds[0], { shared: true });
    }, [files, selectedIds, update]);

    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            {withActions && (
                <FileActions
                    variant={variant}
                    disableActions={selectedIds.length === 0}
                    onRestore={() => {
                        restore(selectedIds);
                    }}
                    onDeletePermanently={() => {
                        destroy(selectedIds);
                    }}
                    onDelete={() => {
                        trash(selectedIds);
                    }}
                    onShare={handleShare}
                    onOpenFileDialog={onOpenFileDialog}
                />
            )}
            <FileDropzone openFileDialogRef={openFileDialogRef} onDrop={upload} maxFiles={10} maxSize={100 * 1024 * 1024}>
                <FilesList handleSelect={handleSelect} pagination={pagination} files={files} />
            </FileDropzone>
        </div>
    );
}
