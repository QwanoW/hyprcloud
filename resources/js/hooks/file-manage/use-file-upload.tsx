import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { toastFileRejections } from '@/lib/file-rejections-custom-errors';
import { FileRejection } from 'react-dropzone';

type FileUploadOptions = {
    onSuccess?: () => void;
};

export function useFileUpload(options?: FileUploadOptions) {
    const upload = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
            toastFileRejections(fileRejections);
        }

        if (acceptedFiles.length > 0) {
            toast.loading('Uploading files...', { id: 'uploading' });
            router.post(
                '/files',
                {
                    files: acceptedFiles,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: [],
                    onSuccess: () => {
                        toast.success('Files uploaded successfully', { id: 'uploading' });
                        if (options?.onSuccess) {
                            options.onSuccess();
                        }
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

    return { upload };
}
