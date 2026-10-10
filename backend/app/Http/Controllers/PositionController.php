<?php

namespace App\Http\Controllers;

use App\Models\Position;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PositionController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'positions' => Position::query()->orderBy('sort_order')->orderBy('id')->get()->map->toFrontend()->values(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ], [
            'title.required' => 'أدخل اسم الوظيفة',
        ]);

        $position = Position::query()->create([
            'title' => trim($data['title']),
            'sort_order' => (int) Position::query()->max('sort_order') + 1,
        ]);

        return response()->json(['position' => $position->toFrontend()], 201);
    }

    public function update(Request $request, Position $position): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ], [
            'title.required' => 'أدخل اسم الوظيفة',
        ]);

        $position->title = trim($data['title']);
        $position->save();

        return response()->json(['position' => $position->fresh()->toFrontend()]);
    }

    public function destroy(Position $position): JsonResponse
    {
        $position->delete();

        return response()->json(['ok' => true]);
    }
}
