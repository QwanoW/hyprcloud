import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Vacancy } from '@/types';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import Homelayout from '@/layouts/home/layout';
import { getLocalizedField } from '@/lib/utils';


interface VacancyPageProps {
  vacancy: Vacancy;
}

export default function VacancyPage({ vacancy }: VacancyPageProps) {
  const { t, currentLocale } = useLaravelReactI18n();
  const locale = currentLocale();

  const formatTextWithLineBreaks = (text: string) => {
    return text.split('\n').map((line, index) => (
      <p key={index} className="mb-2">{line}</p>
    ));
  };

  return (
    <Homelayout>
      <Head title={getLocalizedField(vacancy, 'title', locale)} />
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link href={route('career.index')}>
            <Button variant="outline" size="sm">
              ← {t('Back to all vacancies')}
            </Button>
          </Link>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h1 className="text-3xl font-bold mb-2">{getLocalizedField(vacancy, 'title', locale)}</h1>
            <p className="text-gray-500 mb-6">{getLocalizedField(vacancy, 'location', locale)}</p>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{t('Job Description')}</h2>
              <div className="text-gray-700">
                {formatTextWithLineBreaks(getLocalizedField(vacancy, 'description', locale))}
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{t('Requirements')}</h2>
              <div className="text-gray-700">
                {formatTextWithLineBreaks(getLocalizedField(vacancy, 'requirements', locale))}
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">{t('How to Apply')}</h2>
              <p className="mb-4">{t('If you are interested in this position, please send your resume and cover letter to')} <a href="mailto:careers@hyprcloud.com" className="text-primary hover:underline">careers@hyprcloud.com</a></p>
              <p>{t('Please include the position title in the subject line of your email.')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Homelayout>
  );
}