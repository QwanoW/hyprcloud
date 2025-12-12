<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\SharedLink;
use App\Http\Resources\FileResource;
use App\Services\ZipService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Carbon\Carbon;

class SharedLinkController extends Controller
{
    public function create(Request $request): JsonResponse
    {
        $request->validate([
            'file_id' => 'required|exists:files,id',
            'password' => 'nullable|string|min:4|max:50',
            'expires_at' => 'nullable|date|after:now',
            'allow_download' => 'boolean',
        ]);

        $file = File::findOrFail($request->file_id);
        
        if ($file->user_id !== Auth::id()) {
            return response()->json(['error' => __('file_manage.access_denied')], 403);
        }

        $user = Auth::user();
        $plan = $user->plan;

        // Check if user can share files
        if (!$plan || !$plan->can_share_files) {
            return response()->json(['error' => __('file_manage.sharing_not_available')], 403);
        }

        // Check shared links limit
        if ($plan->max_shared_links !== null) {
            $currentLinksCount = $user->sharedLinks()->where('is_active', true)->count();
            if ($currentLinksCount >= $plan->max_shared_links) {
                return response()->json(['error' => __('file_manage.shared_links_limit_exceeded')], 403);
            }
        }

        // Validate expiry date against plan limits
        if ($request->expires_at && $plan->shared_link_expiry_days) {
            $maxExpiryDate = now()->addDays($plan->shared_link_expiry_days);
            $requestedExpiryDate = Carbon::parse($request->expires_at);
            
            if ($requestedExpiryDate->gt($maxExpiryDate)) {
                return response()->json([
                    'error' => __('file_manage.expiry_date_exceeds_limit'),
                    'max_expiry_date' => $maxExpiryDate->toISOString()
                ], 422);
            }
        }

        // Deactivate existing shared links for this file
        $file->sharedLinks()->update(['is_active' => false]);

        $sharedLink = SharedLink::create([
            'file_id' => $file->id,
            'user_id' => $user->id,
            'password' => $request->password,
            'expires_at' => $request->expires_at,
            'allow_download' => $request->allow_download ?? true,
        ]);

        return response()->json([
            'shared_link' => [
                'id' => $sharedLink->id,
                'token' => $sharedLink->token,
                'url' => $sharedLink->getShareUrl(),
                'expires_at' => $sharedLink->expires_at,
                'allow_download' => $sharedLink->allow_download,
                'password_protected' => !is_null($sharedLink->password),
            ]
        ]);
    }

    public function update(Request $request, SharedLink $sharedLink): JsonResponse
    {
        if ($sharedLink->user_id !== Auth::id()) {
            return response()->json(['error' => __('file_manage.access_denied')], 403);
        }

        $request->validate([
            'password' => 'nullable|string|min:4|max:50',
            'expires_at' => 'nullable|date|after:now',
            'allow_download' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $user = Auth::user();
        $plan = $user->plan;

        // Validate expiry date against plan limits
        if ($request->expires_at && $plan->shared_link_expiry_days) {
            $maxExpiryDate = now()->addDays($plan->shared_link_expiry_days);
            $requestedExpiryDate = Carbon::parse($request->expires_at);
            
            if ($requestedExpiryDate->gt($maxExpiryDate)) {
                return response()->json([
                    'error' => __('file_manage.expiry_date_exceeds_limit'),
                    'max_expiry_date' => $maxExpiryDate->toISOString()
                ], 422);
            }
        }

        $updateData = [];
        
        if ($request->has('password')) {
            $updateData['password'] = $request->password;
        }
        
        if ($request->has('expires_at')) {
            $updateData['expires_at'] = $request->expires_at;
        }
        
        if ($request->has('allow_download')) {
            $updateData['allow_download'] = $request->allow_download;
        }
        
        if ($request->has('is_active')) {
            $updateData['is_active'] = $request->is_active;
        }

        $sharedLink->update($updateData);

        return response()->json([
            'shared_link' => [
                'id' => $sharedLink->id,
                'token' => $sharedLink->token,
                'url' => $sharedLink->getShareUrl(),
                'expires_at' => $sharedLink->expires_at,
                'allow_download' => $sharedLink->allow_download,
                'password_protected' => !is_null($sharedLink->password),
                'is_active' => $sharedLink->is_active,
            ]
        ]);
    }

    public function destroy(SharedLink $sharedLink): JsonResponse
    {
        if ($sharedLink->user_id !== Auth::id()) {
            return response()->json(['error' => __('file_manage.access_denied')], 403);
        }

        $sharedLink->delete();

        return response()->json(['message' => __('file_manage.shared_link_deleted')]);
    }

    public function getFileSharedLinks(File $file): JsonResponse
    {
        if ($file->user_id !== Auth::id()) {
            return response()->json(['error' => __('file_manage.access_denied')], 403);
        }

        $sharedLinks = $file->sharedLinks()->get()->map(function ($link) {
            return [
                'id' => $link->id,
                'token' => $link->token,
                'url' => $link->getShareUrl(),
                'expires_at' => $link->expires_at,
                'allow_download' => $link->allow_download,
                'password_protected' => !is_null($link->password),
                'access_count' => $link->access_count,
                'last_accessed_at' => $link->last_accessed_at,
                'created_at' => $link->created_at,
                'is_active' => $link->is_active,
            ];
        });

        return response()->json(['shared_links' => $sharedLinks]);
    }

    public function access(Request $request, string $token): JsonResponse
    {
        $sharedLink = SharedLink::where('token', $token)
            ->where('is_active', true)
            ->with('file', 'user')
            ->first();

        if (!$sharedLink || !$sharedLink->isAccessible()) {
            return response()->json(['error' => 'Shared link not found or expired'], 404);
        }

        // Check password if required
        if ($sharedLink->password) {
            $request->validate(['password' => 'required|string']);
            
            if (!$sharedLink->checkPassword($request->password)) {
                return response()->json(['error' => 'Invalid password'], 401);
            }
        }

        $sharedLink->incrementAccessCount();

        return response()->json([
            'file' => [
                'id' => $sharedLink->file->id,
                'name' => $sharedLink->file->name,
                'type' => $sharedLink->file->type,
                'size' => $sharedLink->file->size,
                'allow_download' => $sharedLink->allow_download,
                'owner' => [
                    'id' => $sharedLink->user->id,
                    'name' => $sharedLink->user->name,
                ]
            ]
        ]);
    }

    public function download(string $token, ZipService $zipService): \Symfony\Component\HttpFoundation\BinaryFileResponse|JsonResponse
    {
        $sharedLink = SharedLink::where('token', $token)
            ->where('is_active', true)
            ->with('file')
            ->first();

        if (!$sharedLink || !$sharedLink->isAccessible()) {
            return response()->json(['error' => 'Shared link not found or expired'], 404);
        }

        if (!$sharedLink->allow_download) {
            return response()->json(['error' => 'Download not allowed'], 403);
        }

        $file = $sharedLink->file;
        
        $sharedLink->incrementAccessCount();
        
        // If it's a folder, create zip archive
        if ($file->isFolder()) {
            $zipFileName = $zipService->generateZipFileName($file->name);
            $zipPath = $zipService->getZipPath($zipFileName);
            
            $files = collect([$file]);
            if (!$zipService->createZipFromFiles($files, $zipPath)) {
                return response()->json(['error' => 'Archive creation failed'], 500);
            }
            
            return response()->download($zipPath, $zipFileName)->deleteFileAfterSend(true);
        }
        
        if (!Storage::disk('local')->exists($file->path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $filePath = Storage::disk('local')->path($file->path);
        return response()->download($filePath, $file->name);
    }

    public function getUserSharedLinks(): JsonResponse
    {
        $user = Auth::user();
        $sharedLinks = $user->sharedLinks()->with('file')->get();

        return response()->json([
            'shared_links' => $sharedLinks->map(function ($link) {
                return [
                    'id' => $link->id,
                    'token' => $link->token,
                    'url' => $link->getShareUrl(),
                    'expires_at' => $link->expires_at,
                    'allow_download' => $link->allow_download,
                    'password_protected' => !is_null($link->password),
                    'is_active' => $link->is_active,
                    'access_count' => $link->access_count,
                    'created_at' => $link->created_at,
                    'file' => [
                        'id' => $link->file->id,
                        'name' => $link->file->name,
                    ],
                ];
            })
        ]);
    }

    public function accessPage(Request $request, string $token)
    {
        $sharedLink = SharedLink::where('token', $token)
            ->where('is_active', true)
            ->with('file', 'user')
            ->first();

        if (!$sharedLink || !$sharedLink->isAccessible()) {
            return Inertia::render('home/shared/forbidden');
        }

        // Check password if required
        if ($sharedLink->password) {
            if ($request->isMethod('post')) {
                $request->validate(['password' => 'required|string']);
                if (!$sharedLink->checkPassword($request->password)) {
                    throw ValidationException::withMessages([
                        'password' => [__('shared.invalid_password')]
                    ]);
                }
            } else {
                return Inertia::render('home/shared/password', [
                    'token' => $token
                ]);
            }
        }

        // Increment access count
        $sharedLink->incrementAccessCount();

        return Inertia::render('home/shared/index', [
            'file' => FileResource::make($sharedLink->file),
            'sharedLink' => [
                'allow_download' => $sharedLink->allow_download,
                'token' => $token
            ]
        ]);
    }

    public function preview(string $token)
    {
        $sharedLink = SharedLink::where('token', $token)
            ->where('is_active', true)
            ->with('file')
            ->first();

        if (!$sharedLink || !$sharedLink->isAccessible()) {
            abort(404);
        }

        $file = $sharedLink->file;
        $path = Storage::disk("local")->path($file->path);
        
        if (!file_exists($path)) {
            abort(404);
        }

        return response()->file($path);
    }
}
