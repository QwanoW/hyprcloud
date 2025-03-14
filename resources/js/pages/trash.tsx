import { Files } from '@/components/file-manage/files';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, TFile, Pagination } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Trash',
        href: '/trash',
    },
];

export default function Trash({ files, pagination }: { files: TFile[], pagination: Pagination }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trash" />
            <Files withActions variant="trash" files={files} pagination={pagination} />
        </AppLayout>
    );
}
