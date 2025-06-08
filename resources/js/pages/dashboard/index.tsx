import DashboardLayout from '@/layouts/dashboard/layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';


export default function Dashboard() {

    const { t } = useLaravelReactI18n();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.dashboard'),
            href: '/dashboard',
        },
    ];

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title={t('breadcrumb.dashboard')} />
            <div>
                aaa
            </div>
        </DashboardLayout>
    );
}
