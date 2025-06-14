import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TFile, FileType } from '@/types';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useEffect, useState } from 'react';

interface RenameDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    file: TFile;
    onRename: (newName: string) => void;
}

export function RenameDialog({ open, onOpenChange, file, onRename }: RenameDialogProps) {
    const { t } = useLaravelReactI18n();
    const [newName, setNewName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            // For files, remove extension from the name
            if (file.type !== FileType.Folder) {
                const lastDotIndex = file.name.lastIndexOf('.');
                const nameWithoutExtension = lastDotIndex > 0 ? file.name.substring(0, lastDotIndex) : file.name;
                setNewName(nameWithoutExtension);
            } else {
                // For folders, use the full name
                setNewName(file.name);
            }
        }
    }, [file, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setIsLoading(true);
        try {
            let finalName = newName.trim();
            
            if (file.type !== FileType.Folder) {
                const lastDotIndex = file.name.lastIndexOf('.');
                if (lastDotIndex > 0) {
                    const originalExtension = file.name.substring(lastDotIndex);
                    
                    // Remove extension from input if user accidentally included it
                    if (finalName.toLowerCase().endsWith(originalExtension.toLowerCase())) {
                        finalName = finalName.substring(0, finalName.length - originalExtension.length);
                    }
                    
                    // Always append the original extension
                    finalName = finalName + originalExtension;
                }
            }
            
            onRename(finalName);
            onOpenChange(false);
        } catch (error) {
            console.error('Rename failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setNewName('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('file_manage.rename_dialog_title')}</DialogTitle>
                    <DialogDescription>
                        {file?.type === 'file' 
                            ? t('file_manage.rename_dialog_description_file')
                            : t('file_manage.rename_dialog_description_folder')
                        }
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                {t('file_manage.rename_dialog_name_label')}
                            </Label>
                            <Input
                                id="name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="col-span-3"
                                placeholder={file?.type !== FileType.Folder ? t('file_manage.rename_dialog_file_placeholder') : t('file_manage.rename_dialog_folder_placeholder')}
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>
                        {file?.type !== FileType.Folder && (
                            <div className="text-sm text-muted-foreground">
                                {t('file_manage.rename_dialog_extension_note')}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                            {t('file_manage.rename_dialog_cancel')}
                        </Button>
                        <Button type="submit" disabled={isLoading || !newName.trim()}>
                            {isLoading ? t('file_manage.rename_dialog_renaming') : t('file_manage.rename_dialog_rename')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}