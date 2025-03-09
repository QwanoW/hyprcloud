<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FileController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'files'    => 'required|array',
            'files.*'  => 'file|max:10240',
        ]);

        $user = Auth::user();


        foreach ($request->file('files') as $uploadedFile) {
            $mimeType = $uploadedFile->getMimeType();

            $fileType = \App\Enum\FileTypeEnum::OTHER;

            if (str_starts_with($mimeType, 'image/')) {
                $fileType = \App\Enum\FileTypeEnum::IMAGE;
            } elseif (str_starts_with($mimeType, 'video/')) {
                $fileType = \App\Enum\FileTypeEnum::VIDEO;
            } elseif (str_starts_with($mimeType, 'audio/')) {
                $fileType = \App\Enum\FileTypeEnum::AUDIO;
            } else {
                $extension = strtolower($uploadedFile->getClientOriginalExtension());
                if (in_array($extension, ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'])) {
                    $fileType = \App\Enum\FileTypeEnum::FILE;
                }
            }

            $path = $uploadedFile->store('uploads', 'public');

            \App\Models\File::create([
                'user_id' => $user->id,
                'name'    => $uploadedFile->getClientOriginalName(),
                'type'    => $fileType->value, // Значение enum, например 'image'
                'size'    => $uploadedFile->getSize(),
                'path'    => $path,
                'trash'   => false,
                'shared'  => false,
            ]);
        }

        return back();
    }

//    public function show($id)
//    {
//        $file = File::findOrFail($id);
//
//        if ($file->user_id !== Auth::id()) {
//            abort(403);
//        }
//
//        return view('files.show', compact('file'));
//    }

    public function update(Request $request, $id)
    {
        $file = File::findOrFail($id);

        if ($file->user_id !== Auth::id()) {
            abort(403, 'Доступ запрещен');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'path' => 'required|string',
        ]);

        $file->update($request->only('name', 'path'));

        return redirect()->route('files.index')
            ->with('success', 'Файл успешно обновлен!');
    }

    public function destroy($id): RedirectResponse
    {
        $file = File::findOrFail($id);

        if ($file->user_id !== Auth::id()) {
            abort(403);
        }

        $file->delete();

        return back();
    }
}
