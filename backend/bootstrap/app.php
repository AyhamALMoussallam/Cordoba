<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\PostTooLargeException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
    $middleware->trustProxies(at: '*');

    $middleware->redirectGuestsTo(
        fn (Request $request) => $request->is('api/*') || preg_match('~(?:^|/)api(?:/|$)~', $request->path()) === 1
            ? null
            : route('login')
    );
})
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request): bool => preg_match('~(?:^|/)api(?:/|$)~', $request->path()) === 1 || $request->expectsJson()
        );

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if (preg_match('~(?:^|/)api(?:/|$)~', $request->path()) === 1 || $request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
        });

        $exceptions->render(function (ValidationException $e, Request $request) {
            if (preg_match('~(?:^|/)api(?:/|$)~', $request->path()) === 1 || $request->expectsJson()) {
                $message = collect($e->errors())->flatten()->first() ?: 'Ø¨ÙŠØ§Ù†Ø§Øª ØºÙŠØ± ØµØ­ÙŠØ­Ø©';

                return response()->json([
                    'message' => $message,
                    'errors' => $e->errors(),
                ], 422);
            }
        });

        $exceptions->render(function (PostTooLargeException $e, Request $request) {
            if (preg_match('~(?:^|/)api(?:/|$)~', $request->path()) === 1 || $request->expectsJson()) {
                return response()->json(['message' => 'Ø­Ø¬Ù… Ø§Ù„Ù…Ù„Ù Ø£ÙƒØ¨Ø± Ù…Ù† Ø§Ù„Ø­Ø¯ Ø§Ù„Ù…Ø³Ù…ÙˆØ­'], 413);
            }
        });

        $exceptions->render(function (ModelNotFoundException|NotFoundHttpException $e, Request $request) {
            if (preg_match('~(?:^|/)api(?:/|$)~', $request->path()) === 1 || $request->expectsJson()) {
                return response()->json(['message' => 'Ø§Ù„Ø¹Ù†ØµØ± ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯'], 404);
            }
        });
    })->create();

