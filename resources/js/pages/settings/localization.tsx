import { Head } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import TranslationsToggleTab from '@/components/translations-tabs';

export default function Localization() {
    const { t } = useLaravelReactI18n();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('settings.localization_breadcrumb_title'),
            href: '/settings/localization',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.localization_meta_title')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={t('settings.localization_heading_title')}
                        description={t('settings.localization_heading_description')}
                    />
                    <TranslationsToggleTab />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}