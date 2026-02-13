<?php

namespace Modules\EntradasSaidas\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'epi_id' => ['required', 'exists:epis,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'unit_cost' => ['nullable', 'numeric', 'min:0'],
            'supplier' => ['nullable', 'string', 'max:255'],
            'invoice_number' => ['nullable', 'string', 'max:120'],
            'invoice_date' => ['nullable', 'date'],
            'acquired_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after_or_equal:acquired_at'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
