import { Files } from '@/components/file-manage/files';
import DashboardLayout from '@/layouts/dashboard/layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useInfiniteFilesQuery, useAllFilesFromInfinite, useFilesSort } from '@/hooks/file-manage/use-files-query';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function SharedFiles() {
    const { t } = useLaravelReactI18n();
    
    const { sortOptions, updateSort } = useFilesSort();
    
    const sharedQuery = useInfiniteFilesQuery({
        type: 'shared',
        per_page: 50,
        sort: sortOptions.sort,
        direction: sortOptions.direction
    });
    
    const files = useAllFilesFromInfinite(sharedQuery);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.shared'),
            href: '/dashboard/shared',
        },
    ];
    
    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title={t('breadcrumb.shared')} />
            <div className='h-full'>
                {sharedQuery.isError && (
                    <div className="flex justify-center items-center py-8 mb-8">
                        <span className="text-red-500">Error loading shared files: {sharedQuery.error?.message}</span>
                    </div>
                )}
                <Files 
                    files={files} 
                    withActions={true} 
                    infiniteQuery={sharedQuery}
                    sortOptions={sortOptions}
                    onSortChange={updateSort}
                    currentFolderId={undefined}
                />
            </div>
        </DashboardLayout>
    );
}