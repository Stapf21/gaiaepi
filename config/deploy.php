<?php

return [
    'branch' => env('DEPLOY_BRANCH', 'main'),
    'script_path' => env('DEPLOY_SCRIPT_PATH', 'scripts/deploy.sh'),
    'log_file' => env('DEPLOY_LOG_FILE', 'storage/logs/deploy.log'),
    'lock_file' => env('DEPLOY_LOCK_FILE', 'storage/app/deploy.lock'),
    'allow_web_trigger' => filter_var(env('ALLOW_WEB_DEPLOY', false), FILTER_VALIDATE_BOOLEAN),
];
