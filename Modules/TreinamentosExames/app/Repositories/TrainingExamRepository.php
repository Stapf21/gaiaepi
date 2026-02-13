<?php

namespace Modules\TreinamentosExames\Repositories;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Modules\TreinamentosExames\Models\Exam;
use Modules\TreinamentosExames\Models\ExamEmployee;
use Modules\TreinamentosExames\Models\Training;
use Modules\TreinamentosExames\Models\TrainingEmployee;

class TrainingExamRepository
{
    public static function upcomingTrainings(int $perPage = 15): LengthAwarePaginator
    {
        return TrainingEmployee::query()
            ->with(['employee', 'training'])
            ->orderByDesc('scheduled_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    public static function upcomingExams(int $perPage = 15): LengthAwarePaginator
    {
        return ExamEmployee::query()
            ->with(['employee', 'exam'])
            ->orderByDesc('scheduled_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    public static function stats(): Collection
    {
        return collect([
            'trainingsScheduled' => TrainingEmployee::whereNull('completed_at')->count(),
            'examsScheduled' => ExamEmployee::whereNull('completed_at')->count(),
            'trainingsCompleted' => TrainingEmployee::whereNotNull('completed_at')->count(),
        ]);
    }

    public static function createTraining(array $attributes): Training
    {
        return Training::create([
            'title' => $attributes['title'],
            'code' => $attributes['code'] ?? null,
            'description' => $attributes['description'] ?? null,
            'validity_months' => $attributes['validity_months'] ?? null,
            'workload_hours' => $attributes['workload_hours'] ?? null,
            'mandatory' => (bool) ($attributes['mandatory'] ?? false),
            'metadata' => $attributes['metadata'] ?? null,
        ]);
    }

    public static function createExam(array $attributes): Exam
    {
        return Exam::create([
            'title' => $attributes['title'],
            'code' => $attributes['code'] ?? null,
            'type' => $attributes['exam_type'] ?? null,
            'validity_months' => $attributes['validity_months'] ?? null,
            'description' => $attributes['description'] ?? null,
            'metadata' => $attributes['metadata'] ?? null,
        ]);
    }

    public static function examTypes(): array
    {
        return [
            ['value' => 'admissional', 'label' => 'Admissional'],
            ['value' => 'periódico', 'label' => 'Periódico'],
            ['value' => 'retorno_ao_trabalho', 'label' => 'Retorno ao trabalho'],
            ['value' => 'mudança_de_função', 'label' => 'Mudança de função'],
            ['value' => 'demissional', 'label' => 'Demissional'],
            ['value' => 'outro', 'label' => 'Outro'],
        ];
    }
}
