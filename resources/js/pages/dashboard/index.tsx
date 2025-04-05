import { Files } from '@/components/file-manage/files';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, TFile, Pagination } from '@/types';
import { Head } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function Dashboard({ files, pagination }: { files: TFile[], pagination: Pagination }) {
    const { t } = useLaravelReactI18n();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.dashboard'),
            href: '/dashboard',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('breadcrumb.dashboard')} />
            <Files withActions files={files} pagination={pagination} />
        </AppLayout>
    );
}
