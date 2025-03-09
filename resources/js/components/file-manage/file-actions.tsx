import { Button } from '@/components/ui/button';
import { Share, Delete } from 'lucide-react';

interface FilesActionsProps {
    onDelete: () => void;
    onShare: () => void;
}

export function FileActions({ onDelete, onShare }: FilesActionsProps) {
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
        </div>
    )
}
