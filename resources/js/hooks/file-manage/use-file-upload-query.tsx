import { useMutation } from '@tanstack/react-query';
import { fileApi } from '@/services/fileApi';
import { toast } from 'sonner';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useInvalidateFileQueries } from './use-file-mutations';
import { useFileRejectionToast } from './use-file-rejection-toast';

export function useFileUploadQuery() {
  const { t } = useLaravelReactI18n();
  const invalidateFileQueries = useInvalidateFileQueries();
  const toastFileRejections = useFileRejectionToast();

  const uploadMutation = useMutation({
    mutationFn: fileApi.uploadFiles,
    onMutate: () => {
      toast.loading(t('file_manage.file_upload.uploading'), { id: 'upload' });
    },
    onSuccess: () => {
      invalidateFileQueries();
      toast.success(t('file_manage.file_upload.uploaded'), { id: 'upload' });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(t('file_manage.file_upload.failed'), {
        id: 'upload',
        description: error.response?.data?.message || error.message,
      });
    },
  });

  return {
    upload: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    toastFileRejections,
  };
}