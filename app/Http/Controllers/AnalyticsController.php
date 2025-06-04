<?php

namespace App\Http\Controllers;

use App\Enum\FileTypeEnum;
use App\Models\File;
use App\Models\UserActivity;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        
        // Статистика по файлам
        $fileStats = [
            'total_count' => File::where('user_id', $userId)->count(),
            'total_size' => File::where('user_id', $userId)->sum('size'),
            'by_type' => [
                'images' => File::where('user_id', $userId)->where('type', FileTypeEnum::IMAGE)->count(),
                'videos' => File::where('user_id', $userId)->where('type', FileTypeEnum::VIDEO)->count(),
                'audio' => File::where('user_id', $userId)->where('type', FileTypeEnum::AUDIO)->count(),
                'documents' => File::where('user_id', $userId)->where('type', FileTypeEnum::FILE)->count(),
                'other' => File::where('user_id', $userId)->where('type', FileTypeEnum::OTHER)->count(),
            ],
            'trashed_count' => File::where('user_id', $userId)->onlyTrashed()->count(),
            'trashed_size' => File::where('user_id', $userId)->onlyTrashed()->sum('size'),
        ];
        
        // Активность пользователя за последние 30 дней
        $thirtyDaysAgo = Carbon::today()->subDays(29);

        $activityByDay = UserActivity::where('user_id', $userId)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('action_type'),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(IFNULL(size, 0)) as total_size')
            )
            ->groupBy('date', 'action_type')
            ->orderBy('date')
            ->get()
            ->groupBy('date');
            
        // Преобразуем данные для фронтенда
        $lastThirtyDays = collect(range(0, 29))->map(function ($day) use ($thirtyDaysAgo, $activityByDay) {
            $date = $thirtyDaysAgo->copy()->addDays($day)->format('Y-m-d');
            $activity = $activityByDay[$date] ?? collect();
            
            return [
                'date' => $date,
                'uploads' => $activity->where('action_type', 'upload')->first()['count'] ?? 0,
                'downloads' => ($activity->where('action_type', 'download')->first()['count'] ?? 0) + 
                               ($activity->where('action_type', 'zip_download')->first()['count'] ?? 0),
                'deletes' => ($activity->where('action_type', 'delete')->first()['count'] ?? 0) + 
                             ($activity->where('action_type', 'permanent_delete')->first()['count'] ?? 0),
                'restores' => $activity->where('action_type', 'restore')->first()['count'] ?? 0,
                'upload_size' => $activity->where('action_type', 'upload')->first()['total_size'] ?? 0,
                'download_size' => ($activity->where('action_type', 'download')->first()['total_size'] ?? 0) + 
                                  ($activity->where('action_type', 'zip_download')->first()['total_size'] ?? 0),
            ];
        });
        
        // Суммарная активность по типам
        $activitySummary = [
            'total_uploads' => UserActivity::where('user_id', $userId)->where('action_type', 'upload')->count(),
            'total_downloads' => UserActivity::where('user_id', $userId)
                ->whereIn('action_type', ['download', 'zip_download'])->count(),
            'total_deletes' => UserActivity::where('user_id', $userId)
                ->whereIn('action_type', ['delete', 'permanent_delete'])->count(),
            'total_restores' => UserActivity::where('user_id', $userId)->where('action_type', 'restore')->count(),
            'upload_size' => UserActivity::where('user_id', $userId)->where('action_type', 'upload')->sum('size'),
            'download_size' => UserActivity::where('user_id', $userId)
                ->whereIn('action_type', ['download', 'zip_download'])->sum('size'),
        ];
        
        // Последние действия
        $recentActivity = UserActivity::where('user_id', $userId)
            ->with(['user'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        return Inertia::render('dashboard/analytics/index', [
            'fileStats' => $fileStats,
            'activityByDay' => $lastThirtyDays,
            'activitySummary' => $activitySummary,
            'recentActivity' => $recentActivity,
        ]);
    }
}