import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, Trash2Icon, RotateCw, FileIcon, ImageIcon, Film, AudioLines, MoreHorizontal } from 'lucide-react';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { formatFileSize, formatTimeAgo } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Analytics',
        href: '/dashboard/analytics',
    },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// TODO: add types
const Analytics = ({fileStats, activityByDay, activitySummary, recentActivity}: {fileStats: any, activityByDay: any, activitySummary: any, recentActivity: any}) => {
    console.log(fileStats, activityByDay, activitySummary, recentActivity)

  const getActivityIcon = (actionType: string) => {
    switch(actionType) {
      case 'upload': return <ArrowUpCircle className="text-green-500" />;
      case 'download': return <ArrowDownCircle className="text-blue-500" />;
      case 'zip_download': return <ArrowDownCircle className="text-blue-500" />;
      case 'delete': return <Trash2Icon className="text-red-400" />;
      case 'permanent_delete': return <Trash2Icon className="text-red-600" />;
      case 'restore': return <RotateCw className="text-amber-500" />;
      default: return <MoreHorizontal />;
    }
  };

  const getActionTypeLabel = (actionType: string) => {
    switch(actionType) {
      case 'upload': return 'Загрузка файла';
      case 'download': return 'Скачивание файла';
      case 'zip_download': return 'Скачивание архива';
      case 'delete': return 'Перемещение в корзину';
      case 'permanent_delete': return 'Удаление навсегда';
      case 'restore': return 'Восстановление файла';
      default: return actionType;
    }
  };

  const fileTypeData = [
    { name: 'Изображения', value: fileStats.by_type.images, icon: <ImageIcon /> },
    { name: 'Видео', value: fileStats.by_type.videos, icon: <Film /> },
    { name: 'Аудио', value: fileStats.by_type.audio, icon: <AudioLines /> },
    { name: 'Документы', value: fileStats.by_type.documents, icon: <FileIcon /> },
    { name: 'Другое', value: fileStats.by_type.other, icon: <MoreHorizontal /> },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
      <h1 className="text-3xl font-bold">Аналитика пользователя</h1>
      
      {/* Карточки с общей статистикой */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Общее количество файлов</CardTitle>
            <FileIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fileStats.total_count}</div>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(fileStats.total_size)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Загружено всего</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activitySummary.total_uploads}</div>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(activitySummary.upload_size)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Скачано всего</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activitySummary.total_downloads}</div>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(activitySummary.download_size)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">В корзине</CardTitle>
            <Trash2Icon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fileStats.trashed_count}</div>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(fileStats.trashed_size)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Графики активности */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Активность за последние 30 дней</CardTitle>
            <CardDescription>Количество операций по дням</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activityByDay}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'Количество']} />
                <Line type="monotone" dataKey="uploads" name="Загрузки" stroke="#82ca9d" />
                <Line type="monotone" dataKey="downloads" name="Скачивания" stroke="#8884d8" />
                <Line type="monotone" dataKey="deletes" name="Удаления" stroke="#ff7300" />
                <Line type="monotone" dataKey="restores" name="Восстановления" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Объем данных (МБ)</CardTitle>
            <CardDescription>Загрузки и скачивания по дням</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activityByDay.map(day => ({
                  ...day,
                  upload_size_mb: Math.round(day.upload_size / (1024 * 1024) * 100) / 100,
                  download_size_mb: Math.round(day.download_size / (1024 * 1024) * 100) / 100,
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'МБ']} />
                <Bar dataKey="upload_size_mb" name="Загружено" fill="#82ca9d" />
                <Bar dataKey="download_size_mb" name="Скачано" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Распределение по типам файлов и последние действия */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Распределение по типам файлов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fileTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {fileTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Файлов']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {fileTypeData.map((type, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-3 w-3" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm">{type.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Последние действия</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    {getActivityIcon(activity.action_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{getActionTypeLabel(activity.action_type)}</p>
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.created_at)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.entity_name} ({formatFileSize(activity.size)})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
        </AppLayout>
  );
};

export default Analytics;