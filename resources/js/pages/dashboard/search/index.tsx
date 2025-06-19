import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Files } from '@/components/file-manage/files';
import { fileManagerApi } from '@/services/fileManagerApi';
import DashboardLayout from '@/layouts/dashboard/layout';
import { type BreadcrumbItem, TFile } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function SearchFiles() {
    const { t } = useLaravelReactI18n();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const searchFilesQuery = useQuery({
        queryKey: ['files-search', debouncedQuery],
        queryFn: () => fileManagerApi.search(debouncedQuery),
        enabled: debouncedQuery.length > 0,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const files: TFile[] = searchFilesQuery.data?.data || [];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.search'),
            href: '/dashboard/search',
        }
    ];

    const handleSearch = () => {
        setDebouncedQuery(searchQuery.trim());
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title={t('breadcrumb.search')} />
            <div className='h-full'>
                <div className='px-4 pt-4'>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                type="text"
                                placeholder={t('file_manage.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="pl-10"
                            />
                        </div>
                        <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
                            {t('breadcrumb.search')}
                        </Button>
                    </div>
                </div>

                {searchFilesQuery.isError && (
                    <div className="flex justify-center items-center py-8 mb-8">
                        <span className="text-red-500">{t('file_manage.search_error')}</span>
                    </div>
                )}

                {debouncedQuery && searchFilesQuery.isLoading && (
                    <div className="flex justify-center items-center py-8 mb-8">
                        <span className="text-muted-foreground">{t('file_manage.search_loading')}</span>
                    </div>
                )}

                {debouncedQuery && !searchFilesQuery.isLoading && files.length === 0 && (
                    <div className="flex justify-center items-center py-8 mb-8">
                        <span className="text-muted-foreground">{t('file_manage.search_no_results')}</span>
                    </div>
                )}

                {!debouncedQuery && (
                    <div className="flex justify-center items-center py-8 mb-8">
                        <span className="text-muted-foreground">{t('file_manage.search_enter_query')}</span>
                    </div>
                )}

                {files.length > 0 && (
                    <Files 
                        files={files} 
                        withActions={true} 
                        currentFolderId={undefined}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}