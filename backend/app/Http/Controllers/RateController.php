<?php

namespace App\Http\Controllers;

use App\Models\Rate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RateController extends Controller
{
    public function index(): JsonResponse
    {
        $rates = Rate::query()->orderBy('sort_order')->orderBy('id')->get();

        return response()->json([
            'rates' => $rates->map->toFrontend()->values(),
            'updatedAt' => optional($rates->max('updated_at'))?->toJSON() ?? '',
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);

        $rate = Rate::query()->create([
            'code' => strtoupper(trim($data['code'])),
            'name_ar' => trim($data['nameAr']),
            'flag' => trim($data['flag'] ?? ''),
            'buy' => $data['buy'],
            'sell' => $data['sell'],
            'sort_order' => (int) Rate::query()->max('sort_order') + 1,
        ]);

        return response()->json(['rate' => $rate->toFrontend()], 201);
    }

    public function update(Request $request, Rate $rate): JsonResponse
    {
        $data = $this->validated($request, $rate);

        $rate->fill([
            'code' => isset($data['code']) ? strtoupper(trim($data['code'])) : $rate->code,
            'name_ar' => isset($data['nameAr']) ? trim($data['nameAr']) : $rate->name_ar,
            'flag' => array_key_exists('flag', $data) ? trim((string) $data['flag']) : $rate->flag,
            'buy' => $data['buy'] ?? $rate->buy,
            'sell' => $data['sell'] ?? $rate->sell,
        ]);
        $rate->save();

        return response()->json(['rate' => $rate->fresh()->toFrontend()]);
    }

    public function destroy(Rate $rate): JsonResponse
    {
        $rate->delete();

        return response()->json(['ok' => true]);
    }

    private function validated(Request $request, ?Rate $rate = null): array
    {
        $codeRule = ['string', 'max:16'];
        $codeRule[] = $rate
            ? Rule::unique('rates', 'code')->ignore($rate->id)
            : Rule::unique('rates', 'code');

        if ($rate) {
            array_unshift($codeRule, 'sometimes');
        } else {
            array_unshift($codeRule, 'required');
        }

        return $request->validate([
            'code' => $codeRule,
            'nameAr' => $rate ? ['sometimes', 'string', 'max:255'] : ['required', 'string', 'max:255'],
            'flag' => ['nullable', 'string', 'max:32'],
            'buy' => $rate ? ['sometimes', 'numeric', 'min:0'] : ['required', 'numeric', 'min:0'],
            'sell' => $rate ? ['sometimes', 'numeric', 'min:0'] : ['required', 'numeric', 'min:0'],
        ], [
            'code.required' => 'أدخل رمز العملة واسمها',
            'code.unique' => 'رمز العملة مستخدم مسبقاً',
            'nameAr.required' => 'أدخل رمز العملة واسمها',
            'buy.numeric' => 'أدخل أسعاراً رقمية صحيحة',
            'sell.numeric' => 'أدخل أسعاراً رقمية صحيحة',
        ]);
    }
}
