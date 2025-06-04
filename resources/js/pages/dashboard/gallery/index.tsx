import { Files } from '@/components/file-manage/files';
import DashboardLayout from '@/layouts/dashboard/layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useInfiniteFilesQuery, useAllFilesFromInfinite, useFilesSort } from '@/hooks/file-manage/use-files-query';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function Gallery() {
    const { t } = useLaravelReactI18n();
    
    const { sortOptions, updateSort } = useFilesSort();
    
    const galleryQuery = useInfiniteFilesQuery({
        type: 'gallery',
        per_page: 20,
        sort: sortOptions.sort,
        direction: sortOptions.direction
    });
    
    const files = useAllFilesFromInfinite(galleryQuery);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.gallery'),
            href: '/dashboard/gallery',
        },
    ];

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title={t('breadcrumb.gallery')} />
            {galleryQuery.isError && (
                <div className="flex justify-center items-center py-8">
                    <span className="text-red-500">Error loading gallery: {galleryQuery.error?.message}</span>
                </div>
            )}
            <Files 
                withActions 
                files={files} 
                infiniteQuery={galleryQuery}
                sortOptions={sortOptions}
                onSortChange={updateSort}
            />
        </DashboardLayout>
    );
}