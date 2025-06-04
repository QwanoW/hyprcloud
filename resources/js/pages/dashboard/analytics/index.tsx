import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, Trash2Icon, RotateCw, FileIcon as FileIconLucide, ImageIcon, Film, AudioLines, MoreHorizontal } from 'lucide-react';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import DashboardLayout from '@/layouts/dashboard/layout';
import { formatFileSizeParts, formatTimeAgo } from '@/lib/utils';
import React from 'react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useFormatFileSize } from '@/hooks/file-manage/use-format-file-size';

interface FileStats {
    total_count: number;
    total_size: number;
    trashed_count: number;
    trashed_size: number;
    by_type: {
        images: number;
        videos: number;
        audio: number;
        documents: number;
        other: number;
    };
}

interface ActivityDay {
    date: string;
    uploads: number;
    downloads: number;
    deletes: number;
    restores: number;
    upload_size: number;
    download_size: number;
}

interface ActivitySummary {
    total_uploads: number;
    upload_size: number;
    total_downloads: number;
    download_size: number;
}

interface RecentActivityItem {
    id: number | string;
    action_type: string;
    created_at: string;
    entity_name: string;
    size: number;
}

interface AnalyticsProps {
    fileStats: FileStats;
    activityByDay: ActivityDay[];
    activitySummary: ActivitySummary;
    recentActivity: RecentActivityItem[];
}

const CHART_COLORS = {
    uploads: "#4ade80",
    downloads: "#60a5fa",
    deletes: "#fb923c",
    restores: "#fbbf24",
    other: "#94a3b8",
    images: "#22c55e",
    videos: "#3b82f6",
    audio: "#8b5cf6",
    documents: "#f59e0b",
};

const getActivityIcon = (actionType: string): React.ReactNode => {
    switch (actionType) {
        case 'upload': return <ArrowUpCircle className="h-5 w-5 text-green-500" />;
        case 'download': return <ArrowDownCircle className="h-5 w-5 text-blue-500" />;
        case 'zip_download': return <ArrowDownCircle className="h-5 w-5 text-blue-500" />;
        case 'delete': return <Trash2Icon className="h-5 w-5 text-orange-500" />;
        case 'permanent_delete': return <Trash2Icon className="h-5 w-5 text-red-600" />;
        case 'restore': return <RotateCw className="h-5 w-5 text-amber-500" />;
        default: return <MoreHorizontal className="h-5 w-5 text-muted-foreground" />;
    }
};

export default function Analytics({ fileStats, activityByDay, activitySummary, recentActivity }: AnalyticsProps) {
    const { t, currentLocale } = useLaravelReactI18n();
    const locale = currentLocale();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.dashboard'),
            href: '/dashboard',
        },
        {
            title: t('breadcrumb.analytics'),
            href: '/dashboard/analytics',
        },
    ];

    const activityChartConfig = {
        uploads: { label: t('analytics.chart_activity_label_uploads'), color: CHART_COLORS.uploads },
        downloads: { label: t('analytics.chart_activity_label_downloads'), color: CHART_COLORS.downloads },
        deletes: { label: t('analytics.chart_activity_label_deletes'), color: CHART_COLORS.deletes },
        restores: { label: t('analytics.chart_activity_label_restores'), color: CHART_COLORS.restores },
    } satisfies ChartConfig;

    const volumeChartConfig = {
        upload_size_mb: { label: t('analytics.chart_volume_label_uploaded'), color: CHART_COLORS.uploads },
        download_size_mb: { label: t('analytics.chart_volume_label_downloaded'), color: CHART_COLORS.downloads },
    } satisfies ChartConfig;

    const fileTypeChartConfig = {
        value: {
            label: t('analytics.chart_file_type_label_files'),
        },
        images: { label: t('analytics.chart_file_type_label_images'), color: CHART_COLORS.images, icon: ImageIcon },
        videos: { label: t('analytics.chart_file_type_label_videos'), color: CHART_COLORS.videos, icon: Film },
        audio: { label: t('analytics.chart_file_type_label_audio'), color: CHART_COLORS.audio, icon: AudioLines },
        documents: { label: t('analytics.chart_file_type_label_documents'), color: CHART_COLORS.documents, icon: FileIconLucide },
        other: { label: t('analytics.chart_file_type_label_other'), color: CHART_COLORS.other, icon: MoreHorizontal },
    } satisfies ChartConfig;

    const getActionTypeLabel = (actionType: string): string => {
        const key = `analytics.action_type_${actionType}`;
        const translated = t(key);
        if (translated === key) {
            return t('analytics.action_type_unknown', {actionType: actionType});
        }
        return translated;
    };

    const activityByDayFormatted = activityByDay.map(day => ({
        ...day,
        upload_size_mb: parseFloat((day.upload_size / (1024 * 1024)).toFixed(2)),
        download_size_mb: parseFloat((day.download_size / (1024 * 1024)).toFixed(2)),
        formattedDate: day.date.slice(-5)
    }));

    const fileTypeData = [
        { name: t('analytics.chart_file_type_label_images'), value: fileStats.by_type.images, fill: CHART_COLORS.images, icon: fileTypeChartConfig.images.icon },
        { name: t('analytics.chart_file_type_label_videos'), value: fileStats.by_type.videos, fill: CHART_COLORS.videos, icon: fileTypeChartConfig.videos.icon },
        { name: t('analytics.chart_file_type_label_audio'), value: fileStats.by_type.audio, fill: CHART_COLORS.audio, icon: fileTypeChartConfig.audio.icon },
        { name: t('analytics.chart_file_type_label_documents'), value: fileStats.by_type.documents, fill: CHART_COLORS.documents, icon: fileTypeChartConfig.documents.icon },
        { name: t('analytics.chart_file_type_label_other'), value: fileStats.by_type.other, fill: CHART_COLORS.other, icon: fileTypeChartConfig.other.icon },
    ].filter(item => item.value > 0);

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title={t('analytics.meta_title')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{t('analytics.heading_title')}</h1>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('analytics.stat_card_total_files_title')}</CardTitle>
                            <FileIconLucide className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{fileStats.total_count}</div>
                            <p className="text-xs text-muted-foreground">
                                {t('analytics.stat_card_total_files_desc', { size: useFormatFileSize(fileStats.total_size) })}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('analytics.stat_card_total_uploads_title')}</CardTitle>
                            <ArrowUpCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activitySummary.total_uploads}</div>
                            <p className="text-xs text-muted-foreground">
                                {t('analytics.stat_card_total_uploads_desc', { size: useFormatFileSize(activitySummary.upload_size) })}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('analytics.stat_card_total_downloads_title')}</CardTitle>
                            <ArrowDownCircle className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activitySummary.total_downloads}</div>
                            <p className="text-xs text-muted-foreground">
                                {t('analytics.stat_card_total_downloads_desc', { size: useFormatFileSize(activitySummary.download_size) })}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('analytics.stat_card_in_trash_title')}</CardTitle>
                            <Trash2Icon className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{fileStats.trashed_count}</div>
                            <p className="text-xs text-muted-foreground">
                                {t('analytics.stat_card_in_trash_desc', { size: useFormatFileSize(fileStats.trashed_size) })}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('analytics.chart_activity_title')}</CardTitle>
                            <CardDescription>{t('analytics.chart_activity_description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80 w-full">
                                <ChartContainer config={activityChartConfig} className="h-full w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={activityByDayFormatted}
                                            margin={{ top: 5, right: 10, left: 10, bottom: 25 }}
                                        >
                                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="date"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={12}
                                                angle={-45}
                                                height={60}
                                                tickFormatter={(value) => value.slice(-5)}
                                            />
                                            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                            <ChartTooltip
                                                content={<ChartTooltipContent />}
                                            />
                                            <Line
                                                dataKey="uploads"
                                                type="monotone"
                                                stroke={activityChartConfig.uploads.color}
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                                activeDot={{ r: 5 }}
                                                name={activityChartConfig.uploads.label}
                                            />
                                            <Line
                                                dataKey="downloads"
                                                type="monotone"
                                                stroke={activityChartConfig.downloads.color}
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                                activeDot={{ r: 5 }}
                                                name={activityChartConfig.downloads.label}
                                            />
                                            <Line
                                                dataKey="deletes"
                                                type="monotone"
                                                stroke={activityChartConfig.deletes.color}
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                                activeDot={{ r: 5 }}
                                                name={activityChartConfig.deletes.label}
                                            />
                                            <Line
                                                dataKey="restores"
                                                type="monotone"
                                                stroke={activityChartConfig.restores.color}
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                                activeDot={{ r: 5 }}
                                                name={activityChartConfig.restores.label}
                                            />
                                            <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" height={36} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('analytics.chart_volume_title')}</CardTitle>
                            <CardDescription>{t('analytics.chart_volume_description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80 w-full">
                                <ChartContainer config={volumeChartConfig} className="h-full w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={activityByDayFormatted}
                                            margin={{ top: 5, right: 10, left: 10, bottom: 25 }}
                                        >
                                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="date"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={12}
                                                angle={-45}
                                                height={60}
                                                tickFormatter={(value) => value.slice(-5)}
                                            />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                unit={` ${t('analytics.chart_volume_unit_short')}`}
                                            />
                                            <ChartTooltip
                                                content={<ChartTooltipContent />}
                                                formatter={(value) => [`${value} ${t('analytics.chart_volume_unit_short')}`, undefined]}
                                            />
                                            <Bar
                                                dataKey="upload_size_mb"
                                                fill={volumeChartConfig.upload_size_mb.color}
                                                radius={[4, 4, 0, 0]}
                                                maxBarSize={50}
                                                name={volumeChartConfig.upload_size_mb.label}
                                            />
                                            <Bar
                                                dataKey="download_size_mb"
                                                fill={volumeChartConfig.download_size_mb.color}
                                                radius={[4, 4, 0, 0]}
                                                maxBarSize={50}
                                                name={volumeChartConfig.download_size_mb.label}
                                            />
                                            <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" height={36} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('analytics.chart_file_type_title')}</CardTitle>
                            <CardDescription>{t('analytics.chart_file_type_description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <div className="h-64 w-full">
                                <ChartContainer
                                    config={fileTypeChartConfig}
                                    className="mx-auto h-full"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <ChartTooltip
                                                content={(props) => {
                                                    if (!props.active || !props.payload || props.payload.length === 0) {
                                                        return null;
                                                    }
                                                    const data = props.payload[0].payload;
                                                    return (
                                                        <div className="rounded-lg bg-white p-2 shadow-md dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                                                            <p className="font-medium">{data.name}</p>
                                                            <p className="text-muted-foreground">{data.value} {t('analytics.chart_file_type_tooltip_suffix')}</p>
                                                        </div>
                                                    );
                                                }}
                                            />
                                            <Pie
                                                data={fileTypeData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={2}
                                                strokeWidth={2}
                                                stroke="#fff"
                                            >
                                                {fileTypeData.map((entry) => (
                                                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <ChartLegend
                                                layout="horizontal"
                                                verticalAlign="bottom"
                                                align="center"
                                                content={(props) => {
                                                    const { payload } = props;
                                                    if (!payload) return null;

                                                    return (
                                                        <ul className="flex flex-wrap justify-center gap-4 pt-4">
                                                            {payload.map((entry, index) => (
                                                                <li key={`item-${index}`} className="flex items-center gap-2">
                                                                    <div
                                                                        className="h-3 w-3 rounded-full"
                                                                        style={{ backgroundColor: entry.color }}
                                                                    />
                                                                    <span className="text-sm">{entry.value}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    );
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('analytics.recent_activity_title')}</CardTitle>
                            <CardDescription>{t('analytics.recent_activity_description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                                {getActivityIcon(activity.action_type)}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium">{getActionTypeLabel(activity.action_type)}</p>
                                                    <span className="ml-auto flex-shrink-0 text-xs text-muted-foreground">
                                                        {formatTimeAgo(activity.created_at)}
                                                    </span>
                                                </div>
                                                <p className="truncate text-sm text-muted-foreground" title={activity.entity_name}>
                                                    {activity.entity_name} ({formatFileSizeParts(activity.size, locale).value} {formatFileSizeParts(activity.size, locale).unitKey})
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">{t('analytics.recent_activity_empty')}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};