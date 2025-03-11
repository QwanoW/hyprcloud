import { FileType, TFile } from '@/types';

export const FileIcon = ({ file }: { file: TFile }) => {
    if (file.type === FileType.Image) {
        return (
            <img
                src={file.path}
                alt={file.name}
                className="w-12 h-12 object-cover rounded"
            />
        );
    }
    switch (file.type) {
        case FileType.Video:
            return (
                <svg
                    className="w-12 h-12 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M10 16.5l6-4.5-6-4.5v9z" />
                    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM0 16H3V5h18v14z" />
                </svg>
            );
        case FileType.Audio:
            return (
                <svg
                    className="w-12 h-12 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
                </svg>
            );
        default:
            return (
                <svg
                    className="w-12 h-12 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM13 9V3.5L18.5 9H13z" />
                </svg>
            );
    }
};
