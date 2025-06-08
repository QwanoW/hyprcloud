import { Files } from '@/components/file-manage/files';
import DashboardLayout from '@/layouts/dashboard/layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useInfiniteFilesQuery, useAllFilesFromInfinite, useFilesSort } from '@/hooks/file-manage/use-files-query';
import { useLaravelReactI18n } from 'laravel-react-i18n';


export default function AllFiles() {
    const { sortOptions, updateSort } = useFilesSort();
    
    const filesQuery = useInfiniteFilesQuery({
        type: 'all',
        per_page: 50,
        sort: sortOptions.sort,
        direction: sortOptions.direction,
    });
    
    const files = useAllFilesFromInfinite(filesQuery);
    
    const { t } = useLaravelReactI18n();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.all-files'),
            href: '/dashboard/files',
        }
    ];

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title={t('breadcrumb.dashboard')} />
            <div className='h-full'>
                {filesQuery.isError && (
                    <div className="flex justify-center items-center py-8 mb-8">
                        <span className="text-red-500">Error loading files: {filesQuery.error?.message}</span>
                    </div>
                )}
                <Files 
                    files={files} 
                    withActions={true} 
                    infiniteQuery={filesQuery}
                    sortOptions={sortOptions}
                    onSortChange={updateSort}
                    currentFolderId={undefined}
                />
            </div>
        </DashboardLayout>
    );
}
