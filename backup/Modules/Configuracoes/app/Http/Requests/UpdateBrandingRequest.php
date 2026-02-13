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
            'login_background_link' => ['nullable', 'url'],
            'clear_login_background' => ['sometimes', 'boolean'],
        ];
    }
}
