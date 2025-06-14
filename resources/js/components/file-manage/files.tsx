import { CreateCollectionModal } from '@/components/file-manage/create-collection-modal';
import { CreateFolderModal } from '@/components/file-manage/create-folder-modal';
import { ActionMenu } from '@/components/file-manage/file-action-menu';
import { FileActions } from '@/components/file-manage/file-actions';
import { FileDropzone } from '@/components/file-manage/file-dropzone';
import { FilesList } from '@/components/file-manage/file-list';
import { FileViewerModal } from '@/components/file-manage/file-viewer-modal';
import { MoveDialog } from '@/components/file-manage/move-dialog';
import { RenameDialog } from '@/components/file-manage/rename-dialog';
import { ShareDialog } from '@/components/share-dialog';
import { useFileActionMutations } from '@/hooks/file-manage';
import { useFileActionMenu } from '@/hooks/file-manage/use-file-action-menu';
import { useFileSelection } from '@/hooks/file-manage/use-file-selection';
import { useFileUploadQuery } from '@/hooks/file-manage/use-file-upload-query';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { FileManagerIndexResponse } from '@/services/fileManagerApi';
import { SharedData, TFile } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';

interface FilesProps {
    variant?: 'default' | 'trash' | 'collection';
    withActions?: boolean;
    files: TFile[];
    infiniteQuery?: UseInfiniteQueryResult<InfiniteData<FileManagerIndexResponse, unknown>, Error>;
    sortOptions?: {
        sort: string;
        direction: 'asc' | 'desc';
    };
    onSortChange?: (sort: string) => void;
    currentCollectionId?: number;
    currentFolderId?: number;
}

export function Files({
    variant = 'default',
    withActions = false,
    files,
    infiniteQuery,
    sortOptions,
    onSortChange,
    currentCollectionId,
    currentFolderId,
}: FilesProps) {
    const {auth: {user: { plan}}} = usePage<SharedData>().props;
    const { upload, toastFileRejections } = useFileUploadQuery(currentCollectionId, currentFolderId);
    const { actions } = useFileActionMutations();
    const { selectedIds, handleSelect } = useFileSelection();
    const [showCreateCollection, setShowCreateCollection] = useState(false);
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [showMoveDialog, setShowMoveDialog] = useState(false);
    const [showRenameDialog, setShowRenameDialog] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [shareFileId, setShareFileId] = useState<number | null>(null);
    const [fileViewerModal, setFileViewerModal] = useState<{ isOpen: boolean; files: TFile[]; initialFileId: number }>({ 
        isOpen: false, 
        files: [], 
        initialFileId: 0 
    });

    const disableActions = selectedIds.length === 0;
    const disableMultipleAction = selectedIds.length !== 1;
    const isFolder = selectedIds.length === 1 && files.find((f) => f.id === selectedIds[0])?.type === 'folder';

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
        async (action: 'show' | 'restore' | 'delete' | 'delete-permanently' | 'download-zip' | 'move' | 'navigate' | 'properties' | 'share' | 'remove-from-collection' | 'rename') => {
            setActionMenuOpen(false); // Close menu on action
            if (action === 'navigate') {
                const hashedId = btoa(selectedIds[0].toString());
                router.visit(`/dashboard/files/${hashedId}?source=${window.location.pathname}`);
            } else if (action === 'properties') {
                const hashedId = btoa(selectedIds[0].toString());
                router.visit(`/dashboard/files/${hashedId}?source=${window.location.pathname}`);
            } else if (action === 'move') {
                setShowMoveDialog(true);
            } else if (action === 'share') {
                setShareFileId(selectedIds[0]);
                setShowShareDialog(true);
            } else if (action === 'restore') {
                actions.restore(selectedIds);
            } else if (action === 'delete') {
                actions.trash(selectedIds);
            } else if (action === 'delete-permanently') {
                actions.destroy(selectedIds);
            } else if (action === 'download-zip') {
                actions.downloadZip(selectedIds);
            } else if (action === 'remove-from-collection') {
                actions.removeFromCollection(selectedIds);
            } else if (action === 'rename') {
                setShowRenameDialog(true);
            }
        },
        [actions, selectedIds, setActionMenuOpen],
    );

    const handleFileDoubleClick = useCallback((file: TFile) => {
        setFileViewerModal({
            isOpen: true,
            files: files,
            initialFileId: file.id
        });
    }, [files]);

    return (
        <div className="flex h-full flex-col gap-4 rounded-xl p-4">
            {withActions && (
                <FileActions
                    variant={variant}
                    disableActions={disableActions}
                    disableMultipleAction={disableMultipleAction}
                    selectedFileIds={selectedIds}
                    onAction={onAction}
                    onOpenFileDialog={onOpenFileDialog}
                    onCreateCollection={() => setShowCreateCollection(true)}
                    onCreateFolder={() => setShowCreateFolder(true)}
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
                maxSize={plan.max_file_size_bytes}
            >
                <FilesList
                    handleSelect={handleSelect}
                    files={files}
                    containerRef={containerRef}
                    infiniteQuery={infiniteQuery}
                    sortOptions={sortOptions}
                    onSortChange={onSortChange}
                    onFileDoubleClick={handleFileDoubleClick}
                />
            </FileDropzone>
            {actionMenuOpen && (
                <div ref={actionMenuRef}>
                    <ActionMenu
                        pos={actionMenuPos}
                        variant={variant}
                        isFolder={isFolder}
                        disableMultipleAction={disableMultipleAction}
                        onAction={onAction}
                        onClose={() => setActionMenuOpen(false)}
                    />
                </div>
            )}

            <CreateCollectionModal open={showCreateCollection} onOpenChange={setShowCreateCollection} />

            <CreateFolderModal
                open={showCreateFolder}
                onOpenChange={setShowCreateFolder}
                defaultCollectionId={currentCollectionId?.toString()}
                defaultParentFolderId={currentFolderId?.toString()}
            />

            <MoveDialog
                open={showMoveDialog}
                onClose={() => setShowMoveDialog(false)}
                selectedItems={files.filter((f) => selectedIds.includes(f.id))}
                onMove={async (targetCollectionId, targetFolderId) => {
                    const selectedFiles = files.filter((f) => selectedIds.includes(f.id));

                    // Move each selected file/folder
                    for (const file of selectedFiles) {
                        actions.move(file.id, targetCollectionId, targetFolderId);
                    }

                    setShowMoveDialog(false);
                }}
                currentCollectionId={currentCollectionId}
                currentFolderId={currentFolderId}
            />

            <FileViewerModal
                isOpen={fileViewerModal.isOpen}
                files={fileViewerModal.files}
                initialFileId={fileViewerModal.initialFileId}
                onClose={() => setFileViewerModal({ isOpen: false, files: [], initialFileId: 0 })}
            />

            {shareFileId && (
                <ShareDialog
                    fileId={shareFileId}
                    open={showShareDialog}
                    onOpenChange={(open) => {
                        setShowShareDialog(open);
                        if (!open) {
                            setShareFileId(null);
                        }
                    }}
                />
            )}

            {selectedIds.length === 1 && (
                <RenameDialog
                    file={files.find(f => f.id === selectedIds[0])!}
                    open={showRenameDialog}
                    onOpenChange={setShowRenameDialog}
                    onRename={(newName) => {
                        actions.rename(selectedIds[0], newName);
                        setShowRenameDialog(false);
                    }}
                />
            )}
        </div>
    );
}