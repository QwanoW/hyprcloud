import { FileActions } from '@/components/file-manage/file-actions';
import { PaginatedFilesTable } from '@/components/file-manage/file-data-table';
import { columns } from '@/components/file-manage/file-data-table/columns';
import { FileDropzone } from '@/components/file-manage/file-dropzone';
import { useFileUpload } from '@/hooks/file-manage/use-file-upload';
import { Pagination, TFile } from '@/types';
import { useRef } from 'react';
import { FilesList } from '@/components/file-manage/file-list';

interface FilesProps {
    withActions: boolean;
    files: TFile[];
    pagination: Pagination;
}

export function Files({ withActions, files, pagination }: FilesProps) {
    const { upload } = useFileUpload();

    const openFileDialogRef = useRef<() => void>(null);
    const onOpenFileDialog = () => {
        if (openFileDialogRef.current) {
            openFileDialogRef.current();
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            {withActions && <FileActions onDelete={() => {}} onShare={() => {}} onOpenFileDialog={onOpenFileDialog} />}
            <FileDropzone openFileDialogRef={openFileDialogRef} onDrop={upload} maxFiles={10} maxSize={100 * 1024 * 1024}>
                {/*<PaginatedFilesTable columns={columns} files={files} pagination={pagination} />*/}
                <FilesList pagination={pagination} files={files} />
            </FileDropzone>
        </div>
    );
}
