<?php

namespace Modules\Configuracoes\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id' => ['required', 'exists:companies,id'],
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:120'],
            'description' => ['nullable', 'string'],
            'default_epi_items' => ['sometimes', 'array'],
            'default_epi_items.*.epi_id' => ['required_with:default_epi_items', 'exists:epis,id'],
            'default_epi_items.*.quantity' => ['nullable', 'integer', 'min:1'],
            'default_epi_items.*.notes' => ['nullable', 'string'],
            'default_epi_items.*.size' => ['nullable', 'string', 'max:120'],
            'default_epi_items.*.validity_days' => ['nullable', 'integer', 'min:0'],
            'default_epi_items.*.is_required' => ['nullable', 'boolean'],
        ];
    }
}
