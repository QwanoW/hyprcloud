import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ActionMenuProps {
    pos: { x: number; y: number };
    variant: 'default' | 'trash';
    isAlreadyShared?: boolean;
    disableMultipleAction?: boolean;
    onAction: (action: 'show' | 'share' | 'cancel-share' | 'restore' | 'delete' | 'delete-permanently' | 'download-zip') => void;
    onClose: () => void;
}

export const ActionMenu = ({ pos, variant, isAlreadyShared = false, disableMultipleAction = false, onAction, onClose }: ActionMenuProps) => {
    if (variant === 'default') {
        return (
            <div
                style={{ top: pos.y, left: pos.x, position: 'fixed', zIndex: 1000 }}
                onClick={onClose}
            >
                <Card>
                    <CardContent>
                        {!disableMultipleAction && (
                            <>
                                <Button variant="ghost" onClick={() => onAction('show')}>
                                    Open
                                </Button>
                                <Button variant="ghost" onClick={() => onAction(isAlreadyShared ? 'cancel-share' : 'share')}>
                                    {isAlreadyShared ? 'Cancel share' : 'Share'}
                                </Button></>
                        )}
                        <Button variant="ghost" onClick={() => onAction('delete')}>
                            Delete
                        </Button>
                        <Button variant="ghost" onClick={() => onAction('download-zip')}>
                            Download zip
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    } else if (variant === 'trash') {
        return (
            <div
                style={{ top: pos.y, left: pos.x, position: 'fixed', zIndex: 1000 }}
                onClick={onClose}
            >
                <Card>
                    <CardContent>
                        <Button variant="ghost" onClick={() => onAction('delete-permanently')}>
                            Delete permanently
                        </Button>
                        <Button variant="ghost" onClick={() => onAction('restore')}>
                            Restore
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    return null;
};
