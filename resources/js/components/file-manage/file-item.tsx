import { FileIcon } from '@/components/file-manage/file-icon';
import { TFile } from '@/types';
import React from 'react';
import { cn, formatFileSize } from '@/lib/utils';

export const FileItem = React.memo(({ file, isSelected }: { file: TFile; isSelected: boolean }) => (
    <div
        className={cn(
            'p-4 border rounded flex items-center space-x-4 hover:bg-gray-100 transition-colors',
            isSelected && 'bg-blue-100',
        )}
    >
        <FileIcon file={file} />
        <div className="flex-1">
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-500">
                {formatFileSize(file.size)}
            </p>
        </div>
        {file.shared && (
            <div className="px-2 py-1 text-xs text-blue-600 border border-blue-600 rounded">
                Shared
            </div>
        )}
    </div>
));
