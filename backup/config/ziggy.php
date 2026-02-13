<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Absolute URLs
    |--------------------------------------------------------------------------
    |
    | Define se o helper `route()` do Ziggy deve sempre gerar URLs absolutas.
    | Mantendo como `false`, garantimos que os links expostos ao frontend sejam
    | relativos ao host atual, evitando inconsistências quando o APP_URL do
    | backend não corresponde ao domínio em que o SPA está rodando.
    |
    */
    'absolute' => false,
];
