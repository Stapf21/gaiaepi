<?php

namespace Modules\AcidentesRelatorios\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAccidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'status' => $this->input('status', 'em_investigacao'),
        ]);
    }

    public function rules(): array
    {
        return [
            'protocol' => ['nullable', 'string', 'max:120', 'unique:accidents,protocol'],
            'accident_type_id' => ['required', 'exists:accident_types,id'],
            'occurred_at' => ['required', 'date'],
            'occurred_time' => ['nullable', 'date_format:H:i'],
            'location' => ['nullable', 'string', 'max:255'],
            'severity' => ['required', Rule::in(['leve', 'moderado', 'grave', 'critico'])],
            'description' => ['nullable', 'string'],
            'root_cause' => ['nullable', 'string'],
            'corrective_action' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['em_investigacao', 'em_tratamento', 'encerrado'])],
            'reported_by' => ['nullable', 'exists:employees,id'],
            'employee_ids' => ['nullable', 'array'],
            'employee_ids.*' => ['exists:employees,id'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
