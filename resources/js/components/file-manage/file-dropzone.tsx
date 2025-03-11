import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';
import React, { useEffect } from 'react';

interface FileDropzoneProps {
    children: React.ReactNode;
    onDrop: <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void;
    maxSize: number;
    maxFiles: number;
    openFileDialogRef: React.RefObject<(() => void) | null>;
}

export function FileDropzone({ onDrop, maxFiles, maxSize, children, openFileDialogRef }: FileDropzoneProps) {
    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        maxFiles,
        maxSize,
        noClick: true,
        onDrop,
    });

    useEffect(() => {
        if (openFileDialogRef) {
            openFileDialogRef.current = open;
        }
    }, [open, openFileDialogRef]);

    return (
        <div {...getRootProps()} className="h-full overflow-hidden rounded-lg">
            <input {...getInputProps()} />
            {children}
            <div
                data-is-drag-active={isDragActive}
                className="pointer-events-none fixed inset-2 z-40 rounded-lg border-2 border-dashed border-blue-500 opacity-0 transition-opacity duration-300 ease-in-out data-[is-drag-active=true]:opacity-100"
            />
            <div
                data-is-drag-active={isDragActive}
                className="pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-center text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 ease-in-out data-[is-drag-active=true]:opacity-90"
            >
                <svg className="mb-4 h-12 w-12 animate-bounce text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <p className="text-lg font-semibold">Drag and drop your files here</p>
            </div>
        </div>
    );
}
