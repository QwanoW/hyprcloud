import { Files } from '@/components/file-manage/files';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, TFile, Pagination } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'All content',
        href: '/dashboard',
    },
];

export default function Dashboard({ files, pagination }: { files: TFile[], pagination: Pagination }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <Files withActions files={files} pagination={pagination} />
        </AppLayout>
    );
}
