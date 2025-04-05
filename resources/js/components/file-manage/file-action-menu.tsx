import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileIcon, Share, RotateCw, Trash2, Download } from 'lucide-react';
import { OnAction } from '@/types';
import { useLaravelReactI18n } from 'laravel-react-i18n';

interface ActionMenuProps {
    pos: { x: number; y: number };
    variant: 'default' | 'trash';
    isAlreadyShared?: boolean;
    disableMultipleAction?: boolean;
    onAction: OnAction;
    onClose: () => void;
}

export const ActionMenu = ({ pos, variant, isAlreadyShared = false, disableMultipleAction = false, onAction, onClose }: ActionMenuProps) => {
    const { t } = useLaravelReactI18n();

    const ACTION_BUTTONS = [
        { action: 'show', labelKey: 'file_manage.action_menu_open', icon: <FileIcon className="mr-2 h-4 w-4" />, variants: ['default'], acceptMultiple: false },
        { action: 'share', labelKey: 'file_manage.action_menu_share', icon: <Share className="mr-2 h-4 w-4" />, variants: ['default'], acceptMultiple: false },
        { action: 'cancel-share', labelKey: 'file_manage.action_menu_cancel_share', icon: <Share className="mr-2 h-4 w-4 text-red-500" />, variants: ['default'], acceptMultiple: false },
        { action: 'restore', labelKey: 'file_manage.action_menu_restore', icon: <RotateCw className="mr-2 h-4 w-4" />, variants: ['trash'], acceptMultiple: true },
        { action: 'delete', labelKey: 'file_manage.action_menu_delete', icon: <Trash2 className="mr-2 h-4 w-4 text-orange-500" />, variants: ['default'], acceptMultiple: true },
        { action: 'delete-permanently', labelKey: 'file_manage.action_menu_delete_permanently', icon: <Trash2 className="mr-2 h-4 w-4 text-red-600" />, variants: ['trash'], acceptMultiple: true },
        { action: 'download-zip', labelKey: 'file_manage.action_menu_download_zip', icon: <Download className="mr-2 h-4 w-4" />, variants: ['default'], acceptMultiple: true },
    ];

    const renderActionButtons = () => {
        return ACTION_BUTTONS.map((item) => {
            const shouldShow = item.variants.includes(variant)
                && (item.acceptMultiple || !disableMultipleAction)
                && (item.action !== 'share' || !isAlreadyShared)
                && (item.action !== 'cancel-share' || isAlreadyShared);

            if (shouldShow) {
                return (
                    <Button
                        key={item.action}
                        className="w-full h-10 justify-start rounded-none hover:text-blue-600 dark:hover:text-blue-400 px-3"
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
        <div
            className='w-52'
            style={{ top: pos.y, left: pos.x, position: 'fixed', zIndex: 1000 }}
            onClick={onClose}
        >
            <Card className='p-0 overflow-hidden shadow-lg border'>
                <CardContent className='flex flex-col items-start p-0'>
                    {renderActionButtons()}
                </CardContent>
            </Card>
        </div>
    );
};