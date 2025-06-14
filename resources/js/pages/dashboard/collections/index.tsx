import DashboardLayout from '@/layouts/dashboard/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import { collectionApi } from '@/services/collectionApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, FileText, Folder, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Collection } from '@/services/collectionApi';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { CreateCollectionModal } from '@/components/file-manage/create-collection-modal';
import { EditCollectionModal } from '@/components/file-manage/edit-collection-modal';
import { DeleteCollectionDialog } from '@/components/file-manage/delete-collection-dialog';
import { useState } from 'react';

export default function Collections() {
    const { t } = useLaravelReactI18n();
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

    // Fetch all collections
    const collectionsQuery = useQuery({
        queryKey: ['collections'],
        queryFn: () => collectionApi.getCollections(),
    });

    const handleEdit = (collection: Collection, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedCollection(collection);
        setEditModalOpen(true);
    };

    const handleDelete = (collection: Collection, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedCollection(collection);
        setDeleteDialogOpen(true);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.collections'),
            href: '/dashboard/collections',
        },
    ];

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title="Collections" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('breadcrumb.collections')}</h1>
                    <Button onClick={() => setCreateModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        {t('file_manage.actions_button_create_collection')}
                    </Button>
                </div>
                
                {collectionsQuery.isLoading && (
                    <div className="flex justify-center items-center py-8">
                        <span>{t('file_manage.loading_collections')}</span>
                    </div>
                )}
                
                {collectionsQuery.isError && (
                    <div className="flex justify-center items-center py-8">
                        <span className="text-red-500">{t('file_manage.error_loading_collections')}: {collectionsQuery.error?.message}</span>
                    </div>
                )}
                
                {collectionsQuery.data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {collectionsQuery.data.data.map((collection: Collection) => (
                            <div key={collection.id} className="relative">
                                <Link
                                    href={`/dashboard/collections/${collection.id}`}
                                    className="block"
                                >
                                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{collection.icon}</span>
                                                    <CardTitle className="text-lg">{collection.name}</CardTitle>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                            }}
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={(e) => handleEdit(collection, e)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            {t('file_manage.edit_collection_title')}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={(e) => handleDelete(collection, e)}
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            {t('file_manage.delete_collection_confirm_title')}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <FileText className="w-4 h-4" />
                                                    <span>{collection.files_count || 0} {t('file_manage.files')}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Folder className="w-4 h-4" />
                                                    <span>{collection.folders_count || 0} {t('file_manage.folders')}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
                
                {collectionsQuery.data?.data.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-6xl mb-4">📁</div>
                        <h3 className="text-lg font-semibold mb-2">{t('file_manage.no_collections_title')}</h3>
                        <p className="text-muted-foreground mb-4">{t('file_manage.no_collections_description')}</p>
                        <Button onClick={() => setCreateModalOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            {t('file_manage.actions_button_create_collection')}
                        </Button>
                    </div>
                )}

                {/* Modals */}
                <CreateCollectionModal
                    open={createModalOpen}
                    onOpenChange={setCreateModalOpen}
                />
                <EditCollectionModal
                    open={editModalOpen}
                    onOpenChange={setEditModalOpen}
                    collection={selectedCollection}
                />
                <DeleteCollectionDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    collection={selectedCollection}
                />
            </div>
        </DashboardLayout>
    );
}