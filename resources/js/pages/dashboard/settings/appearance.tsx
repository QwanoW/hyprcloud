import { Head } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import DashboardLayout from '@/layouts/dashboard/layout';
import SettingsLayout from '@/layouts/settings/layout';

export default function Appearance() {
    const { t } = useLaravelReactI18n();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('settings.appearance_breadcrumb_title'),
            href: '/settings/appearance',
        },
    ];

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.appearance_meta_title')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={t('settings.appearance_heading_title')}
                        description={t('settings.appearance_heading_description')}
                    />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </DashboardLayout>
    );
}