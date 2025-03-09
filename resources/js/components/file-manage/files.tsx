import { FileActions } from '@/components/file-manage/file-actions';
import { FileDropzone } from '@/components/file-manage/file-dropzone';
import { FilesList } from '@/components/file-manage/files-list';
import { toastFileRejections } from '@/lib/file-rejections-custom-errors';
import { File as FileType } from '@/types';
import { useForm } from '@inertiajs/react';
import { FileRejection } from 'react-dropzone';
import { toast } from 'sonner';

interface FilesProps {
    withActions: boolean;
    files: FileType[];
}

export function Files({ withActions, files }: FilesProps) {
    const { setData, post } = useForm<{files: File[]}>({
        'files': [],
    });

    // const fakeUploadFile = (_: File): Promise<string> => {
    //     return new Promise((resolve) => {
    //         setTimeout(() => {
    //             resolve(
    //                 'https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    //             );
    //         }, 1000);
    //     });
    // };

    const handleDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
            toastFileRejections(fileRejections);
        }

        if (acceptedFiles.length > 0) {
            toast.loading('Uploading files...', {
                id: 'uploading',
            });
            setData('files', acceptedFiles);
            post(route('files.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Files uploaded successfully', {
                        id: 'uploading',
                    });
                },
                onError: (errors) => {
                    toast.error('Failed to upload files', {
                        id: 'uploading',
                        description: Object.entries(errors)[0][1],
                    });
                },

                // showProgress: true,
                // onProgress: (params) => {
                //     console.log(params);
                // }
            });
        }
    };

    return (
        <FileDropzone onDrop={handleDrop}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {withActions && <FileActions onDelete={() => {}} onShare={() => {}} />}

                <FilesList files={files} />
            </div>
        </FileDropzone>
    );
}
