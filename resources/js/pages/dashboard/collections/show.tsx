import { Files } from '@/components/file-manage/files';
import { useAllFilesFromInfinite, useFilesSort, useInfiniteFilesQuery } from '@/hooks/file-manage/use-files-query';
import DashboardLayout from '@/layouts/dashboard/layout';
import { collectionApi } from '@/services/collectionApi';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import { useLaravelReactI18n } from 'laravel-react-i18n';

interface CollectionShowPageProps {
    collectionId: string;
}

export default function CollectionShow({ collectionId }: CollectionShowPageProps) {
    const { sortOptions, updateSort } = useFilesSort();
    const { t } = useLaravelReactI18n();

    // Fetch collection details
    const collectionQuery = useQuery({
        queryKey: ['collection', collectionId],
        queryFn: () => collectionApi.getCollection(Number(collectionId)),
    });

    // Fetch files for this collection
    const filesQuery = useInfiniteFilesQuery({
        type: 'all',
        per_page: 50,
        sort: sortOptions.sort,
        direction: sortOptions.direction,
        collection_id: Number(collectionId),
    });

    const files = useAllFilesFromInfinite(filesQuery);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.collections'),
            href: '/dashboard/collections',
        },
    ];

    if (collectionQuery.data) {
        breadcrumbs.push({
            title: collectionQuery.data.name,
            href: `/dashboard/collections/${collectionId}`,
        });
    }

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title={collectionQuery.data?.name || 'Collection'} />

            {filesQuery.isError && (
                <div className="mb-8 flex items-center justify-center py-8">
                    <span className="text-red-500">Error loading files: {filesQuery.error?.message}</span>
                </div>
            )}

            <Files
                variant="collection"
                files={files}
                withActions={true}
                infiniteQuery={filesQuery}
                sortOptions={sortOptions}
                onSortChange={updateSort}
                currentCollectionId={Number(collectionId)}
                currentFolderId={undefined}
            />
        </DashboardLayout>
    );
}
