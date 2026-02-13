<?php

require __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

/** @var \Illuminate\Http\Request $request */
$request = Illuminate\Http\Request::create('/login', 'GET', [], [], [], [
    'HTTP_X-Inertia' => 'true',
    'HTTP_X-Requested-With' => 'XMLHttpRequest',
]);

$response = $kernel->handle($request);

echo $response->getContent(), PHP_EOL;

$kernel->terminate($request, $response);
