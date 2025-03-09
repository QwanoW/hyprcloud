import { ErrorCode, FileRejection } from 'react-dropzone';
import { toast } from 'sonner';

// TODO: add language variations
const customErrors: Record<string, string> = {
    [ErrorCode.FileTooLarge]: 'is too large, maximum file size is 1GB',
    [ErrorCode.TooManyFiles]: 'Too many files, you can only upload 5 files at once',
    [ErrorCode.FileTooSmall]: 'is too small',
    [ErrorCode.FileInvalidType]: 'is invalid file type',
};

export function toastFileRejections(fileRejections: FileRejection[]) {
    const hasTooManyFiles = fileRejections.some((fileRejection) => fileRejection.errors.some((error) => error.code === ErrorCode.TooManyFiles));
    if (hasTooManyFiles) {
        toast.error(customErrors[ErrorCode.TooManyFiles]);
        return;
    }

    fileRejections.forEach((fileRejection) => {
        fileRejection.errors.forEach((error) => {
            if (error.code in customErrors && error.code !== ErrorCode.TooManyFiles) {
                toast.error(`File ${fileRejection.file.name} ${customErrors[error.code]}`);
            }
        });
    });
}
