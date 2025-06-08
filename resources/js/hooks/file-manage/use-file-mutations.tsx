import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fileApi } from '@/services/fileApi';
import { fileManagerApi } from '@/services/fileManagerApi';
import { toast } from 'sonner';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { downloadFile } from '@/lib/utils';

type MutationConfig = {
  loadingMessage: string;
  successMessage: string;
  errorMessage?: string;
  toastId: string;
};

export function useInvalidateFileQueries() {
  const queryClient = useQueryClient();
  
  return () => {
    const queryKeys = ['files', 'gallery', 'trash'];
    queryKeys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  };
}

function useFileMutation<TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  config: MutationConfig,
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error) => void;
  }
) {
  const { t } = useLaravelReactI18n();
  const invalidateFileQueries = useInvalidateFileQueries();
  
  return useMutation({
    mutationFn,
    onMutate: () => {
      toast.loading(config.loadingMessage, { id: config.toastId });
    },
    onSuccess: (data, variables) => {
      if (config.successMessage) {
        toast.success(config.successMessage, { id: config.toastId });
      }
      invalidateFileQueries();
      options?.onSuccess?.(data, variables);
    },
    onError: (error: Error) => {
      const errorMessage = config.errorMessage || t('file_manage.file_actions.action_failed');
      toast.error(errorMessage, {
        id: config.toastId,
        description: (error as { response?: { data?: { message?: string } }; message: string }).response?.data?.message || error.message,
      });
      options?.onError?.(error);
    },
  });
}

export function useFileActionMutations() {
  const { t } = useLaravelReactI18n();
  
  const trashMutation = useFileMutation(
    fileApi.bulkDelete,
    {
      loadingMessage: t('file_manage.file_actions.moving_to_trash'),
      successMessage: t('file_manage.file_actions.moved_to_trash'),
      toastId: 'trash',
    }
  );
  
  const destroyMutation = useFileMutation(
    fileApi.bulkDeletePermanently,
    {
      loadingMessage: t('file_manage.file_actions.deleting'),
      successMessage: t('file_manage.file_actions.deleted'),
      toastId: 'destroy',
    }
  );
  
  const restoreMutation = useFileMutation(
    fileApi.bulkRestore,
    {
      loadingMessage: t('file_manage.file_actions.restoring'),
      successMessage: t('file_manage.file_actions.restored'),
      toastId: 'restore',
    }
  );
  

  
  const downloadZipMutation = useMutation({
    mutationFn: fileApi.downloadZip,
    onSuccess: (data) => {
      downloadFile((data as { download_url: string }).download_url, 'files.zip');
      toast.success(t('file_manage.file_actions.download_started'));
    },
    onError: (error: Error) => {
      toast.error(t('file_manage.file_actions.download_failed'), {
        description: (error as { response?: { data?: { message?: string } }; message: string }).response?.data?.message || error.message,
      });
    },
  });
  
  const moveMutation = useFileMutation(
    ({ id, targetCollectionId, targetFolderId }: { id: number; targetCollectionId?: number; targetFolderId?: number }) => 
      fileManagerApi.move(id, { collection_id: targetCollectionId, parent_folder_id: targetFolderId }),
    {
      loadingMessage: t('file_manage.file_actions.moving'),
      successMessage: t('file_manage.file_actions.moved'),
      toastId: 'move',
    }
  );
  
  return {
    mutations: {
      trash: trashMutation,
      destroy: destroyMutation,
      restore: restoreMutation,
      downloadZip: downloadZipMutation,
      move: moveMutation,
    },
    actions: {
      trash: (ids: number[]) => trashMutation.mutate(ids),
      destroy: (ids: number[]) => destroyMutation.mutate(ids),
      restore: (ids: number[]) => restoreMutation.mutate(ids),
      downloadZip: (ids: number[]) => downloadZipMutation.mutate(ids),
      move: (id: number, targetCollectionId?: number, targetFolderId?: number) => 
        moveMutation.mutate({ id, targetCollectionId, targetFolderId }),
    },
    loading: {
      isTrashLoading: trashMutation.isPending,
      isDestroyLoading: destroyMutation.isPending,
      isRestoreLoading: restoreMutation.isPending,
      isDownloadLoading: downloadZipMutation.isPending,
      isMoveLoading: moveMutation.isPending,
    },
  };
}