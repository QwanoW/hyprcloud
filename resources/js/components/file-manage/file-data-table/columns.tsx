import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TFile, FileType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import {
    File as FileIcon,
    FileText as FileTextIcon,
    Image as ImageIcon, MoreHorizontal,
    Music as MusicIcon,
    Video as VideoIcon
} from 'lucide-react';
import { formatDate, formatFileSize } from '@/lib/utils';

export function getFileIcon(fileType: FileType) {
    switch (fileType) {
        case FileType.Image:
            return <ImageIcon />;
        case FileType.Video:
            return <VideoIcon />;
        case FileType.Audio:
            return <MusicIcon />;
        case FileType.File:
            return <FileIcon />;
        case FileType.Other:
        default:
            return <FileTextIcon />;
    }
}

// TODO: add languages
export const columns: ColumnDef<TFile>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
            const fileName = row.getValue<string>('name');
            const fileType = row.original.type;
            return (
                <div className="flex items-center space-x-4">
                    {getFileIcon(fileType)}
                    <span>{fileName}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'updated_at',
        size: 40,
        header: () => <div className="text-right">Updated at</div>,
        cell: ({ row }) => {
            const date = row.getValue<string>('updated_at');
            return <div className="text-right">{formatDate(date)}</div>;
        },
    },
    {
        accessorKey: 'size',
        size: 40,
        header: () => <div className="text-center">File size</div>,

        cell: ({ row }) => {
            const size = row.getValue<number>('size');
            return <div className="text-center">{formatFileSize(size)}</div>;
        },
    },
    {
        id: 'actions',
        size: 15,
        cell: ({ row }) => {
            const file = row.original;

            return (
                <div className="text-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(file.id))}>Copy payment ID</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View customer</DropdownMenuItem>
                            <DropdownMenuItem>View payment details</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
