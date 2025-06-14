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
import { collectionApi, type CollectionUpdateRequest, type Collection } from '@/services/collectionApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useAppearance } from '@/hooks/use-appearance';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import i18nRu from '@emoji-mart/data/i18n/ru.json'
import i18nEn from '@emoji-mart/data/i18n/en.json'

interface EditCollectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection: Collection | null;
}

export function EditCollectionModal({ open, onOpenChange, collection }: EditCollectionModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📁');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { appearance } = useAppearance();
  const { t, currentLocale } = useLaravelReactI18n();
  const locale = currentLocale();

  // Update form when collection changes
  useEffect(() => {
    if (collection) {
      setName(collection.name);
      setIcon(collection.icon);
    }
  }, [collection]);

  const updateMutation = useMutation({
    mutationFn: (data: CollectionUpdateRequest) => {
      if (!collection) throw new Error('No collection selected');
      return collectionApi.updateCollection(collection.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collections-recent'] });
      toast.success(t('file_manage.edit_collection_success'));
      onOpenChange(false);
      setShowEmojiPicker(false);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || t('file_manage.edit_collection_failed'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(t('file_manage.create_collection_name_required'));
      return;
    }
    updateMutation.mutate({ name: name.trim(), icon });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEmojiClick = (emoji: any) => {
    setIcon(emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('file_manage.edit_collection_title')}</DialogTitle>
          <DialogDescription>
            {t('file_manage.edit_collection_description')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t('file_manage.create_collection_name_label')}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder={t('file_manage.create_collection_name_placeholder')}
                disabled={updateMutation.isPending}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                {t('file_manage.create_collection_icon_label')}
              </Label>
              <div className="col-span-3 relative">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  disabled={updateMutation.isPending}
                >
                  <span className="text-lg mr-2">{icon}</span>
                  {t('file_manage.create_collection_choose_emoji')}
                </Button>
                {showEmojiPicker && (
                  <div className="absolute top-full left-0 z-50 mt-1">
                    <Picker
                      i18n={locale === 'ru' ? i18nRu : i18nEn}
                      data={data}
                      onEmojiSelect={handleEmojiClick}
                      theme={appearance}
                      previewPosition="none"
                      skinTonePosition="none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              {t('file_manage.create_collection_cancel')}
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? t('file_manage.edit_collection_updating') : t('file_manage.edit_collection_submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}