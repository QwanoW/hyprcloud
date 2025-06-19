import { FileDeleteDialog } from '@/components/file-manage/file-delete-dialog';
import { FileIcon as CustomFileIcon } from '@/components/file-manage/file-icon';
import { Files } from '@/components/file-manage/files';
import { RenameDialog } from '@/components/file-manage/rename-dialog';
import { ShareDialog } from '@/components/share-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFileActionMutations } from '@/hooks/file-manage/use-file-mutations';
import { useAllFilesFromInfinite, useFilesSort, useInfiniteFilesQuery } from '@/hooks/file-manage/use-files-query';
import { useFormatFileSize } from '@/hooks/file-manage/use-format-file-size';
import DashboardLayout from '@/layouts/dashboard/layout';
import { type BreadcrumbItem, FileType, TFile } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { ArrowLeft, Calendar, Clock, Download, FileText, HardDrive, Share2, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ShowFilePageProps {
    fileId: string;
    file?: TFile;
    breadcrumbPath?: { data: TFile[] } | TFile[];
}

export default function ShowFile({ fileId, file, breadcrumbPath = [] }: ShowFilePageProps) {
    const { t, currentLocale } = useLaravelReactI18n();
    const { sortOptions, updateSort } = useFilesSort();
    const { actions, loading } = useFileActionMutations();
    const [currentFile] = useState<TFile | null>(file || null);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const fileSize = useFormatFileSize(currentFile?.size || 0);
    const locale = currentLocale();

    // Query for folder contents if current file is a folder
    const filesQuery = useInfiniteFilesQuery({
        folder_id: currentFile?.type === FileType.Folder ? currentFile.id : undefined,
        type: 'all',
        per_page: 50,
        sort: sortOptions.sort,
        direction: sortOptions.direction,
        enabled: currentFile?.type === FileType.Folder,
    });

    const urlParams = new URLSearchParams(window.location.search);
    const sourcePage = urlParams.get('source');
    const pageVariant = sourcePage?.includes('/dashboard/trash')
        ? 'trash'
        : sourcePage?.includes('/dashboard/collections')
          ? 'collection'
          : 'default';

    const files = useAllFilesFromInfinite(filesQuery);

    const getFirstBreadcrumb = (): BreadcrumbItem[] => {
        if (sourcePage?.includes('/dashboard/gallery')) {
            return [
                {
                    title: t('breadcrumb.gallery'),
                    href: '/dashboard/gallery',
                },
            ];
        }

        if (sourcePage?.includes('/dashboard/trash')) {
            return [
                {
                    title: t('breadcrumb.trash'),
                    href: '/dashboard/trash',
                },
            ];
        }

        if (sourcePage?.includes('/dashboard/search')) {
            return [
                {
                    title: t('breadcrumb.search'),
                    href: '/dashboard/search',
                },
            ];
        }

        if (sourcePage?.includes('/dashboard/collections/')) {
            const collectionMatch = sourcePage.match(/\/dashboard\/collections\/(\d+)/);
            if (collectionMatch) {
                return [
                    {
                        title: t('breadcrumb.collections'),
                        href: '/dashboard/collections',
                    },
                    {
                        title: collectionMatch[1],
                        href: `/dashboard/collections/${collectionMatch[1]}`,
                    },
                ];
            }
        }

        return [
            {
                title: t('breadcrumb.all-files'),
                href: '/dashboard/files',
            },
        ];
    };

    const breadcrumbs: BreadcrumbItem[] = [
        ...getFirstBreadcrumb(),
        ...(Array.isArray(breadcrumbPath) ? breadcrumbPath : breadcrumbPath?.data || []).map((pathFile) => ({
            title: pathFile.name,
            href: `/dashboard/files/${btoa(pathFile.id.toString())}`,
        })),
    ];

    if (currentFile) {
        breadcrumbs.push({
            title: currentFile.name,
            href: `/dashboard/files/${fileId}`,
        });
    }

    const handleGoBack = () => {
        sessionStorage.setItem('lastVisitedPage', window.location.pathname);

        const pathArray = Array.isArray(breadcrumbPath) ? breadcrumbPath : breadcrumbPath?.data || [];
        if (pathArray.length > 0) {
            const parentFile = pathArray[pathArray.length - 1];
            router.visit(`/dashboard/files/${btoa(parentFile.id.toString())}`);
        } else {
            router.visit('/dashboard/files');
        }
    };

    const handleShare = () => {
        setShareDialogOpen(true);
    };

    const handleDownload = () => {
        if (currentFile) {
            window.open(currentFile.url, '_blank');
        }
    };

    const handleDelete = () => {
        if (currentFile) {
            actions.trash([currentFile.id]);
            // Navigate back after deletion
            setTimeout(() => {
                handleGoBack();
            }, 1000);
        }
    };

    if (!currentFile) {
        return (
            <DashboardLayout breadcrumbs={breadcrumbs}>
                <Head title={t('file_manage.file_not_found')} />
                <div className="space-y-6 p-4">
                    <div className="flex h-96 flex-col items-center justify-center space-y-4">
                        <div className="text-center">
                            <FileText className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                            <h1 className="text-2xl font-bold tracking-tight">{t('file_manage.file_not_found')}</h1>
                            <p className="text-muted-foreground mt-2">{t('file_manage.file_not_found_description')}</p>
                        </div>
                        <Button onClick={() => router.visit('/dashboard/files')} variant="outline" size="lg">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t('shared.back_to_files')}
                        </Button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // For individual files accessed via "Properties" button, show file details
    if (currentFile.type !== FileType.Folder) {
        return (
            <DashboardLayout breadcrumbs={breadcrumbs}>
                <Head title={currentFile.name} />
                <div className="space-y-4 p-4">
                    <Card className="border-primary/20">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-primary/10 h-20 w-20 flex-shrink-0 rounded-lg p-2">
                                        <CustomFileIcon file={currentFile} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-foreground text-2xl">{currentFile.name}</CardTitle>
                                        <CardDescription className="mt-3 flex items-center gap-2">
                                            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                                                {currentFile.type}
                                            </Badge>
                                            {currentFile.shared ? (
                                                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-600">
                                                    <Share2 className="mr-1 h-3 w-3" />
                                                    {t('file_manage.shared_publicly')}
                                                </Badge>
                                            ) : (
                                                <></>
                                            )}
                                        </CardDescription>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        {currentFile.type === FileType.Image && (
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
                                        <div className="flex items-center gap-2">
                                            <FileText className="text-primary h-5 w-5" />
                                            <h3 className="text-foreground text-lg font-semibold">{t('file_manage.preview')}</h3>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Button onClick={handleDownload} variant="default" size="lg" className="bg-primary hover:bg-primary/90">
                                                <Download className="mr-2 h-4 w-4" />
                                                {t('file_manage.download')}
                                            </Button>

                                            <Button onClick={handleShare} variant="secondary" size="lg" className="bg-accent hover:bg-accent/80">
                                                <Share2 className="mr-2 h-4 w-4" />
                                                {t('file_manage.action_menu_share')}
                                            </Button>
                                            <FileDeleteDialog onConfirm={handleDelete}>
                                                <Button
                                                    variant="destructive"
                                                    size="lg"
                                                    disabled={loading.isTrashLoading}
                                                    className="bg-destructive hover:bg-destructive/90"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    {loading.isTrashLoading ? t('file_manage.deleting') : t('file_manage.action_menu_delete')}
                                                </Button>
                                            </FileDeleteDialog>
                                        </div>
                                    </div>
                                    <div className="bg-accent/30 border-accent/20 flex justify-center rounded-lg border p-6">
                                        <img
                                            src={currentFile.url}
                                            alt={currentFile.name}
                                            className="border-border max-h-96 max-w-full rounded-lg border object-contain shadow-lg"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{t('file_manage.size')}</CardTitle>
                                <HardDrive className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{fileSize}</div>
                                <p className="text-muted-foreground text-xs">{t('file_manage.file_size')}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{t('file_manage.created')}</CardTitle>
                                <Calendar className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{new Date(currentFile.created_at).toLocaleDateString(locale)}</div>
                                <p className="text-muted-foreground text-xs">{new Date(currentFile.created_at).toLocaleTimeString(locale)}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{t('file_manage.modified')}</CardTitle>
                                <Clock className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{new Date(currentFile.updated_at).toLocaleDateString(locale)}</div>
                                <p className="text-muted-foreground text-xs">{new Date(currentFile.updated_at).toLocaleTimeString(locale)}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title={currentFile.name} />
            <div>
                {filesQuery.isError && (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <div className="h-4 w-4 rounded-full bg-red-500" />
                                <span className="font-medium text-red-700">
                                    {t('file_manage.error_loading')}: {filesQuery.error?.message}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Files
                    files={files}
                    withActions={true}
                    infiniteQuery={filesQuery}
                    sortOptions={sortOptions}
                    onSortChange={updateSort}
                    variant={pageVariant}
                    currentFolderId={currentFile?.type === FileType.Folder ? currentFile.id : undefined}
                />
            </div>
            {currentFile && <ShareDialog fileId={currentFile.id} open={shareDialogOpen} onOpenChange={setShareDialogOpen} />}
            {currentFile && (
                 <RenameDialog
                     file={currentFile}
                     open={isRenameDialogOpen}
                     onOpenChange={setIsRenameDialogOpen}
                     onRename={(newName) => {
                         // Handle rename logic here
                         console.log('Renaming file to:', newName);
                         setIsRenameDialogOpen(false);
                     }}
                 />
             )}
        </DashboardLayout>
    );
}
