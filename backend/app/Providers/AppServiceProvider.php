<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $request = request();
        if (str_starts_with($request->getRequestUri(), '/cordoba')) {
            URL::forceRootUrl(rtrim((string) config('app.url'), '/'));
        }
    }
}
