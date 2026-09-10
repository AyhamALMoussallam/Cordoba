<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'faqs' => Faq::query()->orderBy('sort_order')->orderBy('id')->get()->map->toFrontend()->values(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
        ]);

        $faq = Faq::query()->create([
            'question' => trim($data['question']),
            'answer' => trim($data['answer']),
            'sort_order' => (int) Faq::query()->max('sort_order') + 1,
        ]);

        return response()->json(['faq' => $faq->toFrontend()], 201);
    }

    public function update(Request $request, Faq $faq): JsonResponse
    {
        $data = $request->validate([
            'question' => ['sometimes', 'string', 'max:255'],
            'answer' => ['sometimes', 'string'],
        ]);

        if (array_key_exists('question', $data)) {
            $faq->question = trim($data['question']);
        }
        if (array_key_exists('answer', $data)) {
            $faq->answer = trim($data['answer']);
        }
        $faq->save();

        return response()->json(['faq' => $faq->fresh()->toFrontend()]);
    }

    public function destroy(Faq $faq): JsonResponse
    {
        $faq->delete();

        return response()->json(['ok' => true]);
    }
}
