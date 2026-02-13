<?php

namespace Modules\Configuracoes\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEpiCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $category = $this->route('category');
        $categoryId = is_object($category) ? $category->id : ($category ?? null);

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('epi_categories', 'name')->ignore($categoryId),
            ],
            'description' => ['nullable', 'string'],
            'default_return_days' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
