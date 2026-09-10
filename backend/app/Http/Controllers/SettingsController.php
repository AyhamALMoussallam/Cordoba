<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\SocialLink;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SettingsController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json($this->payload());
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'whatsapp' => ['sometimes', 'nullable', 'string', 'max:32'],
            'socialLinks' => ['sometimes', 'array'],
            'socialLinks.*.platform' => ['required_with:socialLinks', 'string', 'max:50'],
            'socialLinks.*.label' => ['required_with:socialLinks', 'string', 'max:100'],
            'socialLinks.*.url' => ['required_with:socialLinks', 'string', 'max:500'],
        ]);

        $setting = Setting::current();

        if (array_key_exists('whatsapp', $data)) {
            $setting->whatsapp = preg_replace('/\D+/', '', (string) $data['whatsapp']) ?? '';
            $setting->save();
        }

        if (array_key_exists('socialLinks', $data)) {
            DB::transaction(function () use ($data) {
                SocialLink::query()->delete();
                foreach (array_values($data['socialLinks']) as $index => $link) {
                    $label = trim($link['label'] ?? '');
                    $url = trim($link['url'] ?? '');
                    if ($label === '' || $url === '') {
                        continue;
                    }
                    SocialLink::query()->create([
                        'platform' => trim($link['platform'] ?? 'other'),
                        'label' => $label,
                        'url' => $url,
                        'sort_order' => $index + 1,
                    ]);
                }
            });
        }

        return response()->json(['settings' => $this->payload()]);
    }

    private function payload(): array
    {
        return [
            'whatsapp' => Setting::current()->whatsapp,
            'socialLinks' => SocialLink::query()->orderBy('sort_order')->orderBy('id')->get()->map->toFrontend()->values(),
        ];
    }
}
