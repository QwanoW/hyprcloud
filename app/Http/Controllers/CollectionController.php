<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CollectionController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $collections = Collection::where('user_id', Auth::id())
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json(['data' => $collections]);
    }

    /**
     * Get recent collections for sidebar (last 5)
     */
    public function recent()
    {
        $collections = Collection::where('user_id', Auth::id())
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json(['data' => $collections]);
    }

    /**
     * Store a newly created resource in storage.
     */
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

    /**
     * Display the specified resource.
     */
    public function show(Collection $collection)
    {
        $this->authorize('view', $collection);

        $collection->load(['files', 'folders']);

        return response()->json($collection);
    }

    /**
     * Update the specified resource in storage.
     */
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Collection $collection)
    {
        $this->authorize('delete', $collection);

        $collection->delete();

        return response()->json(['message' => 'Коллекция успешно удалена']);
    }
}
