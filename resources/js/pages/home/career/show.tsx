import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Homelayout from '@/layouts/home/layout';
import { getLocalizedField } from '@/lib/utils';
import { Vacancy } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { ArrowLeft, Calendar, Mail, MapPin } from 'lucide-react';

interface VacancyPageProps {
    vacancy: Vacancy;
}

export default function VacancyPage({ vacancy }: VacancyPageProps) {
    const { t, currentLocale } = useLaravelReactI18n();
    const locale = currentLocale();

    const formatTextWithLineBreaks = (text: string) => {
        return text.split('\n').map((line, index) => (
            <p key={index} className="mb-3">
                {line}
            </p>
        ));
    };

    return (
        <Homelayout>
            <Head title={getLocalizedField(vacancy, 'title', locale)} />
            <div className="container mx-auto px-4 py-12 sm:px-6">
                <div className="mb-8">
                    <Link href={route('career.index')}>
                        <Button variant="outline" size="sm" className="group">
                            <ArrowLeft size={16} className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                            {t('career.back_to_all')}
                        </Button>
                    </Link>
                </div>

                <Card className="mb-8 overflow-hidden border-gray-200 shadow-md dark:border-gray-700">
                    <CardContent className="px-6 pt-8 sm:px-8">
                        <div className="mx-auto max-w-3xl">
                            <h1 className="text-primary mb-4 text-3xl font-bold sm:text-4xl">{getLocalizedField(vacancy, 'title', locale)}</h1>

                            <div className="mb-8 flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300">
                                <div className="flex items-center">
                                    <MapPin size={18} className="text-primary/70 mr-2" />
                                    <span>{getLocalizedField(vacancy, 'location', locale)}</span>
                                </div>
                                {vacancy.published_at && (
                                    <div className="flex items-center">
                                        <Calendar size={18} className="text-primary/70 mr-2" />
                                        <span>{t('career.posted')}: {new Date(vacancy.published_at).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-10">
                                <section>
                                    <h2 className="mb-4 flex items-center border-b border-gray-200 pb-2 text-2xl font-semibold dark:border-gray-700">
                                        {t('career.job_description')}
                                    </h2>
                                    <div className="leading-relaxed text-gray-700 dark:text-gray-300">
                                        {formatTextWithLineBreaks(getLocalizedField(vacancy, 'description', locale))}
                                    </div>
                                </section>

                                <section>
                                    <h2 className="mb-4 flex items-center border-b border-gray-200 pb-2 text-2xl font-semibold dark:border-gray-700">
                                        {t('career.requirements')}
                                    </h2>
                                    <div className="leading-relaxed text-gray-700 dark:text-gray-300">
                                        {formatTextWithLineBreaks(getLocalizedField(vacancy, 'requirements', locale))}
                                    </div>
                                </section>

                                <section className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/30">
                                    <h2 className="mb-4 flex items-center text-2xl font-semibold">
                                        <Mail size={20} className="text-primary mr-2" />
                                        {t('career.how_to_apply')}
                                    </h2>
                                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                                        {t('career.apply_text')}{' '}
                                        <a href="mailto:careers@hyprcloud.com" className="text-primary font-medium hover:underline">
                                            careers@hyprcloud.com
                                        </a>
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">{t('career.apply_subject')}</p>
                                </section>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Homelayout>
    );
}
