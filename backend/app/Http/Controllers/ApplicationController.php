<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Position;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ApplicationController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'applications' => Application::query()->latest()->get()->map->toFrontend()->values(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'positionId' => ['required', 'integer', 'exists:positions,id'],
            'cv' => ['required', 'file', 'mimes:pdf', 'max:5120'],
        ], [
            'name.required' => 'أدخل الاسم',
            'email.required' => 'أدخل البريد الإلكتروني',
            'email.email' => 'البريد الإلكتروني غير صحيح',
            'phone.required' => 'أدخل رقم الهاتف',
            'positionId.required' => 'اختر الوظيفة',
            'positionId.exists' => 'الوظيفة المختارة غير متاحة',
            'cv.required' => 'أرفق السيرة الذاتية بصيغة PDF',
            'cv.mimes' => 'السيرة الذاتية يجب أن تكون ملف PDF',
            'cv.max' => 'حجم الملف يجب ألا يتجاوز 5 ميغابايت',
        ]);

        $position = Position::query()->findOrFail($data['positionId']);
        $file = $request->file('cv');
        $path = $file->store('cvs', 'local');

        $original = basename(str_replace(["\0", '/', '\\'], '', $file->getClientOriginalName()));
        if ($original === '' || ! str_ends_with(strtolower($original), '.pdf')) {
            $original = 'cv.pdf';
        }

        Application::query()->create([
            'position_id' => $position->id,
            'position_title' => $position->title,
            'name' => trim($data['name']),
            'email' => strtolower(trim($data['email'])),
            'phone' => trim($data['phone']),
            'cv_path' => $path,
            'cv_original_name' => $original,
        ]);

        return response()->json(['ok' => true], 201);
    }

    public function download(Application $application): StreamedResponse
    {
        if (! Storage::disk('local')->exists($application->cv_path)) {
            abort(404, 'الملف غير موجود');
        }

        return Storage::disk('local')->download(
            $application->cv_path,
            $application->cv_original_name,
            ['Content-Type' => 'application/pdf']
        );
    }

    public function destroy(Application $application): JsonResponse
    {
        Storage::disk('local')->delete($application->cv_path);
        $application->delete();

        return response()->json(['ok' => true]);
    }
}
