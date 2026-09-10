<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Governorate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class LocationController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'governorates' => Governorate::query()->orderBy('id')->get()->map->toFrontend()->values(),
            'branches' => Branch::query()->orderBy('id')->get()->map->toFrontend()->values(),
        ]);
    }

    public function storeGovernorate(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:governorates,name'],
        ], [
            'name.required' => 'أدخل اسم المحافظة',
            'name.unique' => 'هذه المحافظة موجودة مسبقاً',
        ]);

        $governorate = Governorate::query()->create([
            'name' => trim($data['name']),
        ]);

        return response()->json(['governorate' => $governorate->toFrontend()], 201);
    }

    public function updateGovernorate(Request $request, Governorate $governorate): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('governorates', 'name')->ignore($governorate->id)],
        ]);

        $governorate->update(['name' => trim($data['name'])]);

        return response()->json(['governorate' => $governorate->fresh()->toFrontend()]);
    }

    public function destroyGovernorate(Governorate $governorate): JsonResponse
    {
        $governorate->delete();

        return response()->json(['ok' => true]);
    }

    public function storeBranch(Request $request): JsonResponse
    {
        $data = $this->validatedBranch($request);
        $branch = Branch::query()->create($data);

        return response()->json(['branch' => $branch->toFrontend()], 201);
    }

    public function updateBranch(Request $request, Branch $branch): JsonResponse
    {
        $data = $this->validatedBranch($request, true);
        $branch->fill($data);
        $branch->save();

        return response()->json(['branch' => $branch->fresh()->toFrontend()]);
    }

    public function destroyBranch(Branch $branch): JsonResponse
    {
        $branch->delete();

        return response()->json(['ok' => true]);
    }

    private function validatedBranch(Request $request, bool $partial = false): array
    {
        $data = $request->validate([
            'governorateId' => [$partial ? 'sometimes' : 'required', 'integer', 'exists:governorates,id'],
            'address' => [$partial ? 'sometimes' : 'required', 'string', 'max:500'],
            'manager' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'lat' => ['nullable', 'numeric'],
            'lng' => ['nullable', 'numeric'],
        ], [
            'governorateId.required' => 'اختر المحافظة',
            'governorateId.exists' => 'المحافظة غير موجودة',
            'address.required' => 'أدخل عنوان الفرع',
        ]);

        if (isset($data['governorateId']) && ! Governorate::query()->whereKey($data['governorateId'])->exists()) {
            throw ValidationException::withMessages([
                'governorateId' => 'المحافظة غير موجودة',
            ]);
        }

        $payload = [];
        if (array_key_exists('governorateId', $data)) {
            $payload['governorate_id'] = $data['governorateId'];
        }
        if (array_key_exists('address', $data)) {
            $payload['address'] = trim($data['address']);
        }
        if (array_key_exists('manager', $data)) {
            $payload['manager'] = trim((string) $data['manager']);
        }
        if (array_key_exists('phone', $data)) {
            $payload['phone'] = trim((string) $data['phone']);
        }
        if (array_key_exists('lat', $data)) {
            $payload['lat'] = $data['lat'];
        }
        if (array_key_exists('lng', $data)) {
            $payload['lng'] = $data['lng'];
        }

        return $payload;
    }
}
