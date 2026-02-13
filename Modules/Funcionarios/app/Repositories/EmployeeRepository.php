<?php

namespace Modules\Funcionarios\Repositories;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Modules\Funcionarios\Models\Company;
use Modules\Funcionarios\Models\Employee;
use Modules\Funcionarios\Models\Position;

class EmployeeRepository
{
    public static function paginatedList(int $perPage = 15, ?string $search = null): LengthAwarePaginator
    {
        return Employee::query()
            ->select([
                'id',
                'company_id',
                'department_id',
                'position_id',
                'name',
                'email',
                'status',
                'hire_date',
                'registration_number',
            ])
            ->with([
                'company:id,name',
                'department:id,name',
                'position:id,name',
            ])
            ->when($search, function ($query) use ($search) {
                $term = '%' . trim($search) . '%';
                $query->where(function ($inner) use ($term) {
                    $inner->where('name', 'like', $term)
                        ->orWhere('registration_number', 'like', $term);
                });
            })
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();
    }

    public static function create(array $attributes): Employee
    {
        return Employee::create($attributes);
    }

    public static function update(Employee $employee, array $attributes): Employee
    {
        $employee->update($attributes);

        return $employee->refresh();
    }

    public static function terminate(Employee $employee, array $attributes): Employee
    {
        $employee->update([
            'status' => 'desligado',
            'termination_date' => $attributes['termination_date'],
            'metadata' => array_merge($employee->metadata ?? [], [
                'termination_reason' => $attributes['reason'],
                'termination_notes' => $attributes['notes'] ?? null,
            ]),
        ]);

        return $employee->refresh();
    }

    public static function stats(): Collection
    {
        return collect([
            'totalEmployees' => Employee::count(),
            'activeEmployees' => Employee::where('status', 'ativo')->count(),
            'companies' => Company::count(),
            'positions' => Position::count(),
        ]);
    }
}

