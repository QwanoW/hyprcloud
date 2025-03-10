import { FileActions } from '@/components/file-manage/file-actions';
import { PaginatedFilesTable } from '@/components/file-manage/file-data-table';
import { columns } from '@/components/file-manage/file-data-table/columns';
import { FileDropzone } from '@/components/file-manage/file-dropzone';
import { Button } from '@/components/ui/button';
import { toastFileRejections } from '@/lib/file-rejections-custom-errors';
import { File, Pagination } from '@/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { FileRejection } from 'react-dropzone';
import { toast } from 'sonner';

interface FilesProps {
    withActions: boolean;
    files: File[];
    filesPagination: Pagination<File[]>;
}

export function Files({ withActions, files, filesPagination }: FilesProps) {
    const [showDropzone, setShowDropzone] = useState(Boolean(localStorage.getItem('showDropzone') ?? false));

    const handleShowDropzone = () => {
        setShowDropzone(!showDropzone);
        localStorage.setItem('showDropzone', JSON.stringify(showDropzone));
    };

    const handleDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
            toastFileRejections(fileRejections);
        }

        if (acceptedFiles.length > 0) {
            toast.loading('Uploading files...', {
                id: 'uploading',
            });
            router.post(
                `/files`,
                {
                    files: acceptedFiles,
                },
                {
                    preserveState: true,
                    only: [],
                    onSuccess: () => {
                        toast.success('Files uploaded successfully', {
                            id: 'uploading',
                        });
                        router.reload({
                            only: ['files', 'filesPagination'],
                            onBefore: (visit) => {
                                visit.url.searchParams.append('fullLoad', 'true');
                            },
                        });
                    },
                    onError: (errors) => {
                        toast.error('Failed to upload files', {
                            id: 'uploading',
                            description: Object.entries(errors)[0][1],
                        });
                    },
                },
            );
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            {withActions && <FileActions onDelete={() => {}} onShare={() => {}} />}
            <div>
                <Button onClick={handleShowDropzone} variant="link">
                    Show dropzone
                </Button>
                {showDropzone && <FileDropzone maxFiles={10} maxSize={100 * 1024 * 1024} onDrop={handleDrop} />}
            </div>
            <PaginatedFilesTable columns={columns} files={files} filesPagination={filesPagination} />
        </div>
    );
}
