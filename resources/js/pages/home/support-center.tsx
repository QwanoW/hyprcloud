import { Head } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import Homelayout from '@/layouts/home/layout';
import { Construction } from 'lucide-react';

export default function SupportCenterPage() {
  const { t } = useLaravelReactI18n();

  return (
    <Homelayout>
      <Head title={t('common.support')} />
      <div className="container mx-auto py-12 px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <Construction size={64} className="text-primary/70" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t('common.support')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t('common.under_development')}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-4">
            {t('common.under_development_description')}
          </p>
        </div>
      </div>
    </Homelayout>
  );
}