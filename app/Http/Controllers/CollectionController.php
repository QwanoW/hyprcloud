<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CollectionController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $collections = Collection::where('user_id', Auth::id())
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json(['data' => $collections]);
    }

    public function recent()
    {
        $collections = Collection::where('user_id', Auth::id())
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json(['data' => $collections]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
        ]);

        $collection = Collection::create([
            'name' => $request->name,
            'icon' => $request->icon ?? '📁',
            'user_id' => Auth::id(),
        ]);

        return response()->json($collection, 201);
    }

    public function show(Collection $collection)
    {
        $this->authorize('view', $collection);

        $collection->load(['files']);

        return response()->json($collection);
    }

    public function update(Request $request, Collection $collection)
    {
        $this->authorize('update', $collection);

        $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
        ]);

        $collection->update($request->only(['name', 'icon']));

        return response()->json($collection);
    }

    public function destroy(Collection $collection)
    {
        $this->authorize('delete', $collection);

        $collection->delete();

        return response()->json(['message' => __('file_manage.collection_deleted')]);
    }
}
