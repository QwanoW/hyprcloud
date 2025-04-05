import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Vacancy } from '@/types';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import Homelayout from '@/layouts/home/layout';
import { getLocalizedField } from '@/lib/utils';



interface CareerPageProps {
  vacancies: Vacancy[];
}

export default function CareerPage({ vacancies }: CareerPageProps) {
  const { t, currentLocale } = useLaravelReactI18n();
  const locale = currentLocale();

  return (
    <Homelayout>
      <Head title={t('Career Opportunities')} />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">{t('Career Opportunities')}</h1>
        <p className="text-lg mb-8">{t('Join our team and help us build the future of cloud computing')}</p>
        
        {vacancies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">{t('No open positions at the moment')}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vacancies.map((vacancy) => (
              <Card key={vacancy.id} className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>{getLocalizedField(vacancy, 'title', locale)}</CardTitle>
                  <p className="text-sm text-gray-500">{getLocalizedField(vacancy, 'location', locale)}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="line-clamp-3 mb-4">
                    {getLocalizedField(vacancy, 'description', locale)}
                  </p>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                  <Link href={route('career.show', vacancy.id)}>
                    <Button variant="outline" className="w-full">
                      {t('View Details')}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Homelayout>
  );
}