import { Files } from '@/components/file-manage/files';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, TFile, Pagination } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gallery',
        href: '/gallery',
    },
];

export default function Gallery({ files, pagination }: { files: TFile[], pagination: Pagination }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gallery" />
            <Files withActions files={files} pagination={pagination} />
        </AppLayout>
    );
}
