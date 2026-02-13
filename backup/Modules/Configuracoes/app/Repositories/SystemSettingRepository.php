<?php

namespace Modules\Configuracoes\Repositories;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Modules\Configuracoes\Models\SystemSetting;

class SystemSettingRepository
{
    protected const CACHE_PREFIX = 'system_setting.';
    protected const GLOBAL_CACHE_KEY = 'system_setting.all';
    protected const BRANDING_CACHE_KEY = 'system_setting.branding.bundle';

    public static function listGrouped(): Collection
    {
        return SystemSetting::query()
            ->orderBy('group')
            ->orderBy('label')
            ->get()
            ->groupBy('group')
            ->map(function (Collection $settings) {
                return $settings->map(fn (SystemSetting $setting) => [
                    'id' => $setting->id,
                    'key' => $setting->key,
                    'label' => $setting->label,
                    'value' => $setting->value,
                    'type' => $setting->type,
                    'meta' => $setting->meta,
                    'is_encrypted' => $setting->is_encrypted,
                    'updated_at' => optional($setting->updated_at)?->format('Y-m-d H:i:s'),
                ]);
            });
    }

    public static function getAll(): array
    {
        return Cache::rememberForever(self::GLOBAL_CACHE_KEY, function () {
            return SystemSetting::pluck('value', 'key')->toArray();
        });
    }

    public static function getValue(string $key, mixed $default = null): mixed
    {
        $settings = self::getAll();

        return array_key_exists($key, $settings) ? $settings[$key] : $default;
    }

    public static function forget(?string $key = null): void
    {
        if ($key !== null) {
            Cache::forget(self::CACHE_PREFIX.$key);
        }

        Cache::forget(self::GLOBAL_CACHE_KEY);
        Cache::forget(self::BRANDING_CACHE_KEY);
    }

    public static function branding(): array
    {
        $settings = Cache::remember(self::BRANDING_CACHE_KEY, 3600, function () {
            $all = self::getAll();

            return array_filter($all, fn ($value, $key) => str_starts_with($key, 'branding.'), ARRAY_FILTER_USE_BOTH);
        });

        $logoPath = $settings['branding.logo_path'] ?? null;
        $faviconPath = $settings['branding.favicon_path'] ?? null;
        $loginBackgroundPath = $settings['branding.login_background_path'] ?? null;
        $loginBackgroundLink = $settings['branding.login_background_link'] ?? null;

        $defaultBackground = 'https://guiapetfriendly.com.br/wp-content/uploads/2023/06/gaiaviva-guiapetfriendly19.jpg';

        $loginBackgroundUrl = $loginBackgroundLink
            ?: ($loginBackgroundPath ? '/storage/'.$loginBackgroundPath : null);

        if ($loginBackgroundUrl === null) {
            $loginBackgroundUrl = $defaultBackground;
        }

        return [
            'logo_path' => $logoPath,
            'logo_url' => $logoPath ? '/storage/'.$logoPath : null,
            'favicon_path' => $faviconPath,
            'favicon_url' => $faviconPath ? '/storage/'.$faviconPath : null,
            'login_background_path' => $loginBackgroundPath,
            'login_background_link' => $loginBackgroundLink,
            'login_background_url' => $loginBackgroundUrl,
            'login_background_is_default' => $loginBackgroundLink === null && $loginBackgroundPath === null,
        ];
    }
}
