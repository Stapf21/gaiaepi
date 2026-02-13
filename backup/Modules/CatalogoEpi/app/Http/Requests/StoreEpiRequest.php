<?php

namespace Modules\CatalogoEpi\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEpiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:epi_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'ca_number' => ['nullable', 'string', 'max:120'],
            'description' => ['nullable', 'string'],
            'unit' => ['required', 'string', 'max:50'],
            'size' => ['nullable', 'string', 'max:50'],
            'min_stock' => ['nullable', 'integer', 'min:0'],
            'max_stock' => ['nullable', 'integer', 'min:0'],
            'return_days' => ['nullable', 'integer', 'min:0'],
            'requires_validation' => ['nullable', 'boolean'],
            'unit_cost' => ['nullable', 'numeric', 'min:0'],
            'metadata' => ['nullable', 'array'],
        ];
    }

    protected function passedValidation(): void
    {
        $this->merge([
            'requires_validation' => (bool) $this->boolean('requires_validation'),
        ]);
    }
}
