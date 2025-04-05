import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import React from 'react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

interface FileDeleteDialogProps {
    children: React.ReactNode;
    onConfirm?: () => void;
}

export function FileDeleteDialog({ children, onConfirm }: FileDeleteDialogProps) {
    const { t } = useLaravelReactI18n();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('file_manage.delete_dialog_title')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('file_manage.delete_dialog_description')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('file_manage.delete_dialog_cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>{t('file_manage.delete_dialog_confirm')}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}