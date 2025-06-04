import { useLaravelReactI18n } from 'laravel-react-i18n';
import { toast } from 'sonner';
import { FileRejection } from 'react-dropzone';

// File rejection toast utility
export function useFileRejectionToast() {
  const { t } = useLaravelReactI18n();
  
  return (rejections: FileRejection[]) => {
    rejections.forEach((rejection) => {
      const { file, errors } = rejection;
      errors.forEach((error) => {
        let message = '';
        switch (error.code) {
          case 'file-too-large':
            message = t('file_manage.file_upload.file_too_large', { name: file.name });
            break;
          case 'file-invalid-type':
            message = t('file_manage.file_upload.file_invalid_type', { name: file.name });
            break;
          case 'too-many-files':
            message = t('file_manage.file_upload.too_many_files');
            break;
          default:
            message = t('file_manage.file_upload.file_rejected', { name: file.name, reason: error.message });
        }
        toast.error(message);
      });
    });
  };
}