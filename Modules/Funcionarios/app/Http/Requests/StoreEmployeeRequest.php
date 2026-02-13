<?php

namespace Modules\Funcionarios\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $employee = $this->route('funcionario');
        $employeeId = $employee?->id;

        $uniqueEmail = Rule::unique('employees', 'email');
        $uniqueRegistration = Rule::unique('employees', 'registration_number')
            ->where(fn ($query) => $query->where('company_id', $this->input('company_id')));
        $uniqueCpf = Rule::unique('employees', 'cpf');

        if ($employeeId) {
            $uniqueEmail = $uniqueEmail->ignore($employeeId);
            $uniqueRegistration = $uniqueRegistration->ignore($employeeId);
            $uniqueCpf = $uniqueCpf->ignore($employeeId);
        }

        return [
            'company_id' => ['required', 'exists:companies,id'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'position_id' => ['nullable', 'exists:positions,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', $uniqueEmail],
            'registration_number' => ['nullable', 'string', 'max:50', $uniqueRegistration],
            'cpf' => ['nullable', 'string', 'max:20', $uniqueCpf],
            'rg' => ['nullable', 'string', 'max:30'],
            'status' => ['required', Rule::in(['ativo', 'afastado', 'desligado'])],
            'birth_date' => ['nullable', 'date'],
            'hire_date' => ['nullable', 'date'],
            'termination_date' => ['nullable', 'date', 'after_or_equal:hire_date'],
            'phone' => ['nullable', 'string', 'max:25'],
            'mobile_phone' => ['nullable', 'string', 'max:25'],
            'work_shift' => ['nullable', 'string', 'max:120'],
            'address' => ['nullable', 'array'],
            'address.street' => ['nullable', 'string', 'max:255'],
            'address.number' => ['nullable', 'string', 'max:30'],
            'address.complement' => ['nullable', 'string', 'max:120'],
            'address.district' => ['nullable', 'string', 'max:120'],
            'address.city' => ['nullable', 'string', 'max:120'],
            'address.state' => ['nullable', 'string', 'max:2'],
            'address.zip_code' => ['nullable', 'string', 'max:15'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}


