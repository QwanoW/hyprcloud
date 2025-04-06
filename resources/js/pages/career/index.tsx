import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Vacancy } from '@/types';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import Homelayout from '@/layouts/home/layout';
import { getLocalizedField } from '@/lib/utils';
import { MapPin, ArrowRight } from 'lucide-react';

interface CareerPageProps {
  vacancies: Vacancy[];
}

export default function CareerPage({ vacancies }: CareerPageProps) {
  const { t, currentLocale } = useLaravelReactI18n();
  const locale = currentLocale();

  return (
    <Homelayout>
      <Head title={t('career.meta_title')} />
      <div className="container mx-auto py-12 px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t('career.career_opportunities')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t('career.join_team')}
          </p>
        </div>
        
        {vacancies.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
            <p className="text-xl text-gray-500 dark:text-gray-400">{t('career.no_positions')}</p>
          </div>
        ) : (
          <div 
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {vacancies.map((vacancy) => (
                <Card className="h-full flex flex-col overflow-hidden border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold">
                      {getLocalizedField(vacancy, 'title', locale)}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <MapPin size={16} className="mr-1 text-primary/70" />
                      <span>{getLocalizedField(vacancy, 'location', locale)}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="line-clamp-3 text-gray-600 dark:text-gray-300">
                      {getLocalizedField(vacancy, 'description', locale)}
                    </p>
                  </CardContent>
                  <div className="p-4 pt-0 mt-auto">
                    <Link href={route('career.show', vacancy.id)}>
                      <Button 
                        variant="outline" 
                        className="w-full group"
                      >
                        <span>{t('career.view_details')}</span>
                        <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
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