import { File } from '@/types';

export function FilesList({ files }: { files: File[] }) {
    return (
        <div className="grid grid-cols-3 gap-4">
            {files.length === 0 && <div className="col-span-3 text-center">No files found</div>}
            {files.map((file) => (
                <div className="bg-muted p-2" key={file.name}>
                    {file.name}
                </div>
            ))}
        </div>
    );
}
