<?php

namespace Modules\Configuracoes\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBrandingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage_branding') ?? false;
    }

    public function rules(): array
    {
        return [
            'logo' => ['nullable', 'image', 'max:2048'],
            'favicon' => ['nullable', 'file', 'mimes:png,ico,svg', 'max:1024'],
            'login_background' => ['nullable', 'image', 'max:5120'],
            'login_overlay_gif' => ['nullable', 'file', 'mimes:gif,webp', 'max:10240'],
            'logo_url' => ['nullable', 'url', 'max:2048'],
            'favicon_url' => ['nullable', 'url', 'max:2048'],
            'login_background_link' => ['nullable', 'url', 'max:2048'],
            'login_overlay_gif_url' => ['nullable', 'url', 'max:2048', 'regex:/^https?:\\/\\/.+\\.(gif|webp)(\\?.*)?$/i'],
            'clear_login_background' => ['sometimes', 'boolean'],
            'clear_login_overlay_gif' => ['sometimes', 'boolean'],
        ];
    }
}
