<?php

namespace Modules\TreinamentosExames\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTrainingExamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'type' => $this->input('type', 'training'),
            'mandatory' => $this->boolean('mandatory'),
        ]);
    }

    public function rules(): array
    {
        $context = $this->input('type', 'training');

        $common = [
            'type' => ['required', Rule::in(['training', 'exam'])],
            'title' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:120'],
            'description' => ['nullable', 'string'],
            'validity_months' => ['nullable', 'integer', 'min:0'],
        ];

        if ($context === 'exam') {
            return array_merge($common, [
                'exam_type' => ['nullable', 'string', 'max:120'],
                'metadata' => ['nullable', 'array'],
            ]);
        }

        return array_merge($common, [
            'workload_hours' => ['nullable', 'integer', 'min:0'],
            'mandatory' => ['boolean'],
            'metadata' => ['nullable', 'array'],
        ]);
    }
}
