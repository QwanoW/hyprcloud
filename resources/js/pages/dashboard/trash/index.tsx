import { Files } from '@/components/file-manage/files';
import DashboardLayout from '@/layouts/dashboard/layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useInfiniteFilesQuery, useAllFilesFromInfinite, useFilesSort } from '@/hooks/file-manage/use-files-query';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function Trash() {
    const { t } = useLaravelReactI18n();
    
    const { sortOptions, updateSort } = useFilesSort();
    
    const trashQuery = useInfiniteFilesQuery({
        type: 'trash',
        per_page: 20,
        sort: sortOptions.sort,
        direction: sortOptions.direction
    });
    
    const files = useAllFilesFromInfinite(trashQuery);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.trash'),
            href: '/dashboard/trash',
        },
    ];
    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title={t('breadcrumb.trash')} />
            {trashQuery.isError && (
                <div className="flex justify-center items-center py-8">
                    <span className="text-red-500">Error loading trash: {trashQuery.error?.message}</span>
                </div>
            )}
            <Files 
                withActions 
                variant="trash" 
                files={files} 
                infiniteQuery={trashQuery}
                sortOptions={sortOptions}
                onSortChange={updateSort}
            />
        </DashboardLayout>
    );
}
