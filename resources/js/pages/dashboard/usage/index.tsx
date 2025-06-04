import DashboardLayout from '@/layouts/dashboard/layout';
import { Payment, SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { formatFileSizeParts, getFormattedPrice, getLocalizedField } from '@/lib/utils';
import { BarChart3, HardDrive, Upload, Zap } from 'lucide-react';

export default function UsagePage({ payment }: {payment: Payment | null}) {
    const { t, currentLocale } = useLaravelReactI18n();
    const { auth: {user} } = usePage<SharedData>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.dashboard'),
            href: '/dashboard',
        },
        {
            title: t('components.user_menu_usage'),
            href: '/dashboard/usage',
        },
    ];

    const locale = currentLocale();

    const storageUsed = user.storage_used_bytes;
    const storageLimit = user.plan.storage_limit_bytes;
    const storageUsedPercentage = user.storage_usage_percentage ?? 
        (storageLimit > 0 ? Math.min(100, (storageUsed / storageLimit) * 100) : 0);
    const maxFileSize = user.plan.max_file_size_bytes;

    const isStorageFull = storageUsedPercentage >= 100;
    const isStorageWarning = storageUsedPercentage >= 80;

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title={t('components.user_menu_usage')} />
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{t('components.storage_usage_title')}</h1>
                        <p className="text-muted-foreground">
                            {t('usage.description')}
                        </p>
                    </div>
                    <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Link href={route('manage-plan.index')}>
                            <Zap className="mr-2 h-4 w-4" />
                            {t('components.storage_usage_upgrade_plan')}
                        </Link>
                    </Button>
                </div>

                {/* Storage Overview */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('usage.storage_used')}
                            </CardTitle>
                            <HardDrive className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatFileSizeParts(storageUsed, locale).value} {t(formatFileSizeParts(storageUsed, locale).unitKey)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('components.storage_usage_used_of')} {formatFileSizeParts(storageLimit, locale).value} {t(formatFileSizeParts(storageLimit, locale).unitKey)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('components.storage_usage_max_file_size')}
                            </CardTitle>
                            <Upload className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatFileSizeParts(maxFileSize, locale).value} {t(formatFileSizeParts(maxFileSize, locale).unitKey)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('usage.per_file_limit')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('usage.current_plan')}
                            </CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{getLocalizedField(user.plan, "name", locale)}</div>
                            <p className="text-xs text-muted-foreground">
                                {payment ? getFormattedPrice(user.plan, payment.billing_cycle, locale) : getFormattedPrice(user.plan, 'monthly', locale)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Storage Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HardDrive className="h-5 w-5" />
                            {t('components.storage_usage_title')}
                        </CardTitle>
                        <CardDescription>
                            {isStorageFull 
                                ? t('components.storage_usage_storage_full')
                                : isStorageWarning 
                                ? t('components.storage_usage_storage_warning')
                                : t('usage.storage_healthy')
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>
                                    {formatFileSizeParts(storageUsed, locale).value} {t(formatFileSizeParts(storageUsed, locale).unitKey)} {t('components.storage_usage_used_of')} {formatFileSizeParts(storageLimit, locale).value} {t(formatFileSizeParts(storageLimit, locale).unitKey)}
                                </span>
                                <span>{storageUsedPercentage.toFixed(1)}%</span>
                            </div>
                            <Progress 
                                value={storageUsedPercentage} 
                                indicatorClassName={`${isStorageFull ? 'bg-red-400' : isStorageWarning ? 'bg-yellow-400' : 'bg-green-400'}`}
                                className='h-3'
                            />
                        </div>
                        
                        {(isStorageFull || isStorageWarning) && (
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                                <div>
                                    <p className="font-medium text-orange-900">
                                        {isStorageFull ? t('components.storage_usage_storage_full') : t('components.storage_usage_storage_warning')}
                                    </p>
                                    <p className="text-sm text-orange-700">
                                        {t('usage.upgrade_suggestion')}
                                    </p>
                                </div>
                                <Button asChild variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-600 dark:text-orange-300 dark:hover:bg-orange-900/20">
                                    <Link href={route('manage-plan.index')}>
                                        {t('components.storage_usage_upgrade_plan')}
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>


            </div>
        </DashboardLayout>
    );
}