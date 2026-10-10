<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\RateController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;

Route::get('/rates', [RateController::class, 'index']);
Route::get('/faqs', [FaqController::class, 'index']);
Route::get('/locations', [LocationController::class, 'index']);
Route::get('/settings', [SettingsController::class, 'show']);
Route::get('/positions', [PositionController::class, 'index']);
Route::post('/applications', [ApplicationController::class, 'store'])->middleware('throttle:8,1');

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:8,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/account', [AuthController::class, 'updateAccount']);

    Route::post('/rates', [RateController::class, 'store']);
    Route::put('/rates/{rate}', [RateController::class, 'update']);
    Route::delete('/rates/{rate}', [RateController::class, 'destroy']);

    Route::post('/faqs', [FaqController::class, 'store']);
    Route::put('/faqs/{faq}', [FaqController::class, 'update']);
    Route::delete('/faqs/{faq}', [FaqController::class, 'destroy']);

    Route::post('/governorates', [LocationController::class, 'storeGovernorate']);
    Route::put('/governorates/{governorate}', [LocationController::class, 'updateGovernorate']);
    Route::delete('/governorates/{governorate}', [LocationController::class, 'destroyGovernorate']);

    Route::post('/branches', [LocationController::class, 'storeBranch']);
    Route::put('/branches/{branch}', [LocationController::class, 'updateBranch']);
    Route::delete('/branches/{branch}', [LocationController::class, 'destroyBranch']);

    Route::put('/settings', [SettingsController::class, 'update']);

    Route::post('/positions', [PositionController::class, 'store']);
    Route::put('/positions/{position}', [PositionController::class, 'update']);
    Route::delete('/positions/{position}', [PositionController::class, 'destroy']);

    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::get('/applications/{application}/cv', [ApplicationController::class, 'download']);
    Route::delete('/applications/{application}', [ApplicationController::class, 'destroy']);
});
