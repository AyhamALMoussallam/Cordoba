<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

Route::get('/{any?}', function () {
    $spa = public_path('spa.html');

    if (! File::exists($spa)) {
        return response(
            'Frontend is not built yet. From the frontend folder run: npm run build',
            503
        );
    }

    $html = File::get($spa);
    $underCordoba = str_starts_with(request()->getRequestUri(), '/cordoba');
    if (! $underCordoba) {
        $html = str_replace('/cordoba/', '/', $html);
    }

    return response($html, 200, [
        'Content-Type' => 'text/html; charset=UTF-8',
    ]);
})->where('any', '.*');
