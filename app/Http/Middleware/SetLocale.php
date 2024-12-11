<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Request;

class SetLocale
{



    public function handle($request, Closure $next)
    {
        $locale = Request::getPreferredLanguage(['en', 'pt', 'es']); // Adicione os idiomas suportados
        App::setLocale($locale);

        return $next($request);
    }
}
