import DashboardLayout from '@/layouts/dashboard/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import { collectionApi } from '@/services/collectionApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Folder } from 'lucide-react';
import { Collection } from '@/services/collectionApi';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function Collections() {
    const { t } = useLaravelReactI18n();

    // Fetch all collections
    const collectionsQuery = useQuery({
        queryKey: ['collections'],
        queryFn: () => collectionApi.getCollections(),
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.collections'),
            href: '/dashboard/collections',
        },
    ];

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title="Collections" />
            <div className='h-full'>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Collections</h1>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Collection
                    </Button>
                </div>
                
                {collectionsQuery.isLoading && (
                    <div className="flex justify-center items-center py-8">
                        <span>Loading collections...</span>
                    </div>
                )}
                
                {collectionsQuery.isError && (
                    <div className="flex justify-center items-center py-8">
                        <span className="text-red-500">Error loading collections: {collectionsQuery.error?.message}</span>
                    </div>
                )}
                
                {collectionsQuery.data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {collectionsQuery.data.data.map((collection: Collection) => (
                            <Link
                                key={collection.id}
                                href={`/dashboard/collections/${collection.id}`}
                                className="block"
                            >
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{collection.icon}</span>
                                            <CardTitle className="text-lg">{collection.name}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <FileText className="w-4 h-4" />
                                                <span>{collection.files_count || 0} files</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Folder className="w-4 h-4" />
                                                <span>{collection.folders_count || 0} folders</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
                
                {collectionsQuery.data?.data.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-6xl mb-4">📁</div>
                        <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
                        <p className="text-muted-foreground mb-4">Create your first collection to organize your files</p>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Collection
                        </Button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}