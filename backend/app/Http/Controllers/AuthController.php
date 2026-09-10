<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ], [
            'email.required' => 'أدخل البريد الإلكتروني وكلمة المرور',
            'password.required' => 'أدخل البريد الإلكتروني وكلمة المرور',
        ]);

        $user = User::query()->where('email', strtolower(trim($data['email'])))->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'بيانات الدخول غير صحيحة',
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('admin')->plainTextToken;

        return response()->json([
            'token' => $token,
            'admin' => $user->toAdmin(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(['ok' => true]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'admin' => $request->user()->toAdmin(),
        ]);
    }

    public function updateAccount(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'currentPassword' => ['required', 'string'],
            'email' => ['nullable', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8', 'regex:/[A-Za-z]/', 'regex:/[0-9]/'],
        ], [
            'currentPassword.required' => 'أدخل كلمة المرور الحالية',
            'email.unique' => 'هذا البريد مستخدم مسبقاً',
            'password.min' => 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل وتحتوي حرفاً ورقماً.',
            'password.regex' => 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل وتحتوي حرفاً ورقماً.',
        ]);

        if (! Hash::check($data['currentPassword'], $user->password)) {
            throw ValidationException::withMessages([
                'currentPassword' => 'كلمة المرور الحالية غير صحيحة',
            ]);
        }

        if (! empty($data['email'])) {
            $user->email = strtolower(trim($data['email']));
        }

        if (! empty($data['password'])) {
            $user->password = $data['password'];
        }

        $user->save();

        return response()->json(['admin' => $user->fresh()->toAdmin()]);
    }
}
