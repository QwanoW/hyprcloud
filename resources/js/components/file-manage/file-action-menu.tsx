import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OnAction } from '@/types';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Download, Info, Move, Navigation, RotateCw, Share2, Trash2 } from 'lucide-react';

interface ActionMenuProps {
    pos: { x: number; y: number };
    variant: 'default' | 'trash';
    isFolder?: boolean;
    disableMultipleAction?: boolean;
    onAction: OnAction;
    onClose: () => void;
}

export const ActionMenu = ({ pos, variant, isFolder = false, disableMultipleAction = false, onAction, onClose }: ActionMenuProps) => {
    const { t } = useLaravelReactI18n();

    const ACTION_BUTTONS = [
        {
            action: 'navigate',
            labelKey: 'file_manage.action_menu_navigate',
            icon: <Navigation className="mr-2 h-4 w-4" />,
            variants: ['default', 'trash'],
            acceptMultiple: false,
            folderOnly: true,
        },
        {
            action: 'properties',
            labelKey: 'file_manage.action_menu_properties',
            icon: <Info className="mr-2 h-4 w-4" />,
            variants: ['default', 'trash'],
            acceptMultiple: false,
            folderOnly: false,
            fileOnly: true,
        },
        {
            action: 'share',
            labelKey: 'file_manage.action_menu_share',
            icon: <Share2 className="mr-2 h-4 w-4" />,
            variants: ['default'],
            acceptMultiple: false,
            folderOnly: false,
        },
        {
            action: 'move',
            labelKey: 'file_manage.action_menu_move',
            icon: <Move className="mr-2 h-4 w-4" />,
            variants: ['default'],
            acceptMultiple: true,
        },
        {
            action: 'restore',
            labelKey: 'file_manage.action_menu_restore',
            icon: <RotateCw className="mr-2 h-4 w-4" />,
            variants: ['trash'],
            acceptMultiple: true,
        },
        {
            action: 'delete',
            labelKey: 'file_manage.action_menu_delete',
            icon: <Trash2 className="mr-2 h-4 w-4 text-orange-500" />,
            variants: ['default'],
            acceptMultiple: true,
        },
        {
            action: 'delete-permanently',
            labelKey: 'file_manage.action_menu_delete_permanently',
            icon: <Trash2 className="mr-2 h-4 w-4 text-red-600" />,
            variants: ['trash'],
            acceptMultiple: true,
        },
        {
            action: 'download-zip',
            labelKey: 'file_manage.action_menu_download_zip',
            icon: <Download className="mr-2 h-4 w-4" />,
            variants: ['default'],
            acceptMultiple: true,
        },
    ];

    const renderActionButtons = () => {
        return ACTION_BUTTONS.map((item) => {
            const shouldShow =
                item.variants.includes(variant) &&
                (item.acceptMultiple || !disableMultipleAction) &&
                ((!item.folderOnly && !item.fileOnly) || (item.folderOnly && isFolder) || (item.fileOnly && !isFolder));

            if (shouldShow) {
                return (
                    <Button
                        key={item.action}
                        className="h-10 w-full justify-start rounded-none px-3 hover:text-blue-600 dark:hover:text-blue-400"
                        variant="ghost"
                        onClick={() => onAction(item.action as Parameters<OnAction>[0])}
                    >
                        {item.icon}
                        {t(item.labelKey)}
                    </Button>
                );
            }
            return null;
        });
    };

    return (
        <div className="w-52" style={{ top: pos.y, left: pos.x, position: 'fixed', zIndex: 1000 }} onClick={onClose}>
            <Card className="overflow-hidden border p-0 shadow-lg">
                <CardContent className="flex flex-col items-start p-0">{renderActionButtons()}</CardContent>
            </Card>
        </div>
    );
};
