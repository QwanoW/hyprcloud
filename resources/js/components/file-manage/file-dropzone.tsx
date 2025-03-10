import { cn, formatFileSize } from '@/lib/utils';
import { Upload } from 'lucide-react';
import Dropzone, { DropEvent, FileRejection } from 'react-dropzone';

interface FileDropzoneProps {
    onDrop: <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void;
    maxSize: number;
    maxFiles: number;
    className?: string;
}

export function FileDropzone({ onDrop, maxFiles, maxSize, className }: FileDropzoneProps) {
    return (
        <Dropzone onDrop={onDrop} maxSize={maxSize} maxFiles={maxFiles}>
            {({ getRootProps, getInputProps, isDragActive }) => (
                <div
                    {...getRootProps()}
                    className={cn(
                        'group border-muted-foreground/25 hover:bg-muted/25 relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition',
                        'ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                        isDragActive && 'border-muted-foreground/50',
                        className,
                    )}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                            <div className="rounded-full border border-dashed p-3">
                                <Upload className="text-muted-foreground size-7" aria-hidden="true" />
                            </div>
                            <p className="text-muted-foreground font-medium">Drop the files here</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                            <div className="rounded-full border border-dashed p-3">
                                <Upload className="text-muted-foreground size-7" aria-hidden="true" />
                            </div>
                            <div className="flex flex-col gap-px">
                                <p className="text-muted-foreground font-medium">Drag {`'n'`} drop files here, or click to select files</p>
                                <p className="text-muted-foreground/70 text-sm">
                                    {`You can upload
                                    multiple files up to ${formatFileSize(maxSize)} each`}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Dropzone>
    );
}
