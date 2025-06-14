import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { collectionApi, type Collection } from '@/services/collectionApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLaravelReactI18n } from 'laravel-react-i18n';

interface DeleteCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection: Collection | null;
}

export function DeleteCollectionDialog({ open, onOpenChange, collection }: DeleteCollectionDialogProps) {
  const queryClient = useQueryClient();
  const { t } = useLaravelReactI18n();

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!collection) throw new Error('No collection selected');
      return collectionApi.deleteCollection(collection.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collections-recent'] });
      toast.success(t('file_manage.delete_collection_success'));
      onOpenChange(false);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || t('file_manage.delete_collection_failed'));
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('file_manage.delete_collection_confirm_title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('file_manage.delete_collection_confirm_description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            {t('file_manage.delete_collection_confirm_cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? '...' : t('file_manage.delete_collection_confirm_submit')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}