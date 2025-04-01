import { toastFileRejections } from '@/lib/file-rejections-custom-errors';
import { TFile } from '@/types';
import { router } from '@inertiajs/react';
import { FileRejection } from 'react-dropzone';
import { toast } from 'sonner';

type FileUploadOptions = {
    onSuccess?: () => void;
};

export function useFileUpload(options?: FileUploadOptions) {
    const upload = (acceptedFiles: File[], fileRejections: FileRejection[], prevFiles: TFile[]) => {
        const uniqueAcceptedFiles = acceptedFiles.filter((acceptedFile) => {
            const nameIsTaken = prevFiles.some((prevFile) => prevFile.name === acceptedFile.name);
            if (nameIsTaken) {
                toast.error(`File with name ${acceptedFile.name} is already exists`);
                return false;
            }

            return true
        });

        if (fileRejections.length > 0) {
            toastFileRejections(fileRejections);
        }

        if (uniqueAcceptedFiles.length > 0) {
            toast.loading('Uploading files...', { id: 'uploading' });
            router.post(
                '/files',
                {
                    files: uniqueAcceptedFiles,
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
