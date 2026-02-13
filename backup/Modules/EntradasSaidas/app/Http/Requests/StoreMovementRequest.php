<?php

namespace Modules\EntradasSaidas\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMovementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => ['required_without:epi_id', 'array', 'min:1'],
            'items.*.epi_id' => ['required_with:items', 'exists:epis,id'],
            'items.*.quantity' => ['required_with:items', 'integer', 'min:1'],
            'items.*.notes' => ['nullable', 'string'],
            'items.*.delivered_at' => ['nullable', 'date'],
            'items.*.expected_return_at' => ['nullable', 'date'],
            'epi_id' => ['required_without:items', 'nullable', 'exists:epis,id'],
            'quantity' => ['required_without:items', 'nullable', 'integer', 'min:1'],
            'notes' => ['nullable', 'string'],
            'type' => ['sometimes', Rule::in(['delivery'])],
            'employee_id' => ['required', 'exists:employees,id'],
            'delivered_at' => ['required', 'date'],
            'expected_return_at' => ['nullable', 'date', 'after_or_equal:delivered_at'],
            'status' => ['required', Rule::in(['entregue', 'em_uso', 'devolvido', 'perdido'])],
        ];
    }
}
