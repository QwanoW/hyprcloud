import { ActionMenu } from '@/components/file-manage/file-action-menu';
import { FileActions } from '@/components/file-manage/file-actions';
import { FileDropzone } from '@/components/file-manage/file-dropzone';
import { FilesList } from '@/components/file-manage/file-list';
import { useFileActionMutations } from '@/hooks/file-manage';
import { useFileActionMenu } from '@/hooks/file-manage/use-file-action-menu';
import { useFileSelection } from '@/hooks/file-manage/use-file-selection';
import { useFileUploadQuery } from '@/hooks/file-manage/use-file-upload-query';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { TFile } from '@/types';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

interface FilesProps {
    variant?: 'default' | 'trash';
    withActions?: boolean;
    files: TFile[];
    infiniteQuery?: UseInfiniteQueryResult<{ data: TFile[] }, Error>;
    sortOptions?: {
        sort: string;
        direction: 'asc' | 'desc';
    };
    onSortChange?: (sort: string) => void;
}

export function Files({ variant = 'default', withActions = false, files, infiniteQuery, sortOptions, onSortChange }: FilesProps) {
    const { upload, toastFileRejections } = useFileUploadQuery();
    const { actions } = useFileActionMutations();
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

    const onAction = useCallback(
        async (action: 'show' | 'share' | 'cancel-share' | 'restore' | 'delete' | 'delete-permanently' | 'download-zip') => {
            setActionMenuOpen(false); // Close menu on action
            if (action === 'show') {
                if (!disableMultipleAction) {
                    const file = files.find((f) => f.id === selectedIds[0]);
                    if (file) {
                        window.open(file.url, '_blank');
                    }
                }
            } else if (action === 'share') {
                actions.share(selectedIds[0]);
            } else if (action === 'cancel-share') {
                actions.cancelShare(selectedIds[0]);
            } else if (action === 'restore') {
                actions.restore(selectedIds);
            } else if (action === 'delete') {
                actions.trash(selectedIds);
            } else if (action === 'delete-permanently') {
                actions.destroy(selectedIds);
            } else if (action === 'download-zip') {
                actions.downloadZip(selectedIds);
            }
        },
        [actions, selectedIds, files, disableMultipleAction, setActionMenuOpen],
    );

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
            <FileDropzone
                openFileDialogRef={openFileDialogRef}
                onDrop={(acceptedFiles, fileRejections) => {
                    if (fileRejections.length > 0) {
                        toastFileRejections(fileRejections);
                    }
                    if (acceptedFiles.length > 0) {
                        upload(acceptedFiles);
                    }
                }}
                maxFiles={10}
                maxSize={100 * 1024 * 1024}
            >
                <FilesList
                    handleSelect={handleSelect}
                    files={files}
                    containerRef={containerRef}
                    infiniteQuery={infiniteQuery}
                    sortOptions={sortOptions}
                    onSortChange={onSortChange}
                />
            </FileDropzone>
            {actionMenuOpen && (
                <div ref={actionMenuRef}>
                    <ActionMenu
                        pos={actionMenuPos}
                        variant={variant}
                        disableMultipleAction={disableMultipleAction}
                        isAlreadyShared={isAlreadyShared}
                        onAction={onAction}
                        onClose={() => setActionMenuOpen(false)}
                    />
                </div>
            )}
        </div>
    );
}
