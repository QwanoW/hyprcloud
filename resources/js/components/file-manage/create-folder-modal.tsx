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
import { Button } from '@/components/ui/button';
import { fileManagerApi } from '@/services/fileManagerApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLaravelReactI18n } from 'laravel-react-i18n';

interface CreateFolderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCollectionId?: string;
  defaultParentFolderId?: string;
}

export function CreateFolderModal({
  open,
  onOpenChange,
  defaultCollectionId,
  defaultParentFolderId,
}: CreateFolderModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const { t } = useLaravelReactI18n();

  const createMutation = useMutation({
    mutationFn: (data: { name: string; collection_id?: string; parent_folder_id?: string }) => fileManagerApi.createFolder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success(t('file_manage.create_folder_success'));
      onOpenChange(false);
      setName('');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || t('file_manage.create_folder_failed'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(t('file_manage.create_folder_name_required'));
      return;
    }

    const createData = {
      name,
      collection_id: defaultCollectionId ? defaultCollectionId.toString() : undefined,
      parent_folder_id: defaultParentFolderId ? defaultParentFolderId.toString() : undefined,
    };

    createMutation.mutate(createData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('file_manage.create_folder_title')}</DialogTitle>
          <DialogDescription>
            {t('file_manage.create_folder_description')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t('file_manage.create_folder_name_label')}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder={t('file_manage.create_folder_name_placeholder')}
                disabled={createMutation.isPending}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
{t('file_manage.create_folder_cancel')}
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
{createMutation.isPending ? t('file_manage.create_folder_creating') : t('file_manage.create_folder_submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}