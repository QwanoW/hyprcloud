import { Button } from '@/components/ui/button';
import { Delete, Share } from 'lucide-react';

interface FilesActionsProps {
    onDelete: () => void;
    onShare: () => void;
    onOpenFileDialog: () => void;
}

export function FileActions({ onDelete, onShare, onOpenFileDialog }: FilesActionsProps) {
    return (
        <div className="flex items-center gap-4">
            <Button variant="destructive" className="gap-2">
                <Delete className="h-4 w-4" onClick={onDelete} />
                Delete
            </Button>
            <Button onClick={onShare} variant="outline" className="gap-2">
                <Share className="h-4 w-4" />
                Share
            </Button>
            <Button onClick={onOpenFileDialog} variant="secondary" className="gap-2">
                <Share className="h-4 w-4" />
                Upload
            </Button>
        </div>
    );
}
