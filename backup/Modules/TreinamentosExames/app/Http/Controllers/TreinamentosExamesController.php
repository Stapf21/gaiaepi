<?php

namespace Modules\TreinamentosExames\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Modules\TreinamentosExames\Http\Requests\StoreTrainingExamRequest;
use Modules\TreinamentosExames\Repositories\TrainingExamRepository;

class TreinamentosExamesController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('TreinamentosExames/Index', [
            'stats' => TrainingExamRepository::stats(),
            'trainings' => TrainingExamRepository::upcomingTrainings()->through(function ($record) {
                return [
                    'id' => $record->id,
                    'title' => $record->training?->title,
                    'employee' => $record->employee?->name,
                    'scheduled_at' => optional($record->scheduled_at)->format('d/m/Y'),
                    'status' => $record->status,
                ];
            }),
            'exams' => TrainingExamRepository::upcomingExams(5)->through(function ($record) {
                return [
                    'id' => $record->id,
                    'title' => $record->exam?->title,
                    'employee' => $record->employee?->name,
                    'scheduled_at' => optional($record->scheduled_at)->format('d/m/Y'),
                    'status' => $record->result,
                ];
            }),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('TreinamentosExames/Create', [
            'examTypes' => TrainingExamRepository::examTypes(),
        ]);
    }

    public function store(StoreTrainingExamRequest $request): RedirectResponse
    {
        $data = collect($request->validated())->map(function ($value) {
            return $value === '' ? null : $value;
        })->toArray();

        if (isset($data['validity_months']) && $data['validity_months'] !== null) {
            $data['validity_months'] = (int) $data['validity_months'];
        }

        if (($data['type'] ?? 'training') === 'exam') {
            TrainingExamRepository::createExam($data);
            $message = 'Exame cadastrado com sucesso.';
        } else {
            if (isset($data['workload_hours']) && $data['workload_hours'] !== null) {
                $data['workload_hours'] = (int) $data['workload_hours'];
            }

            TrainingExamRepository::createTraining($data);
            $message = 'Treinamento cadastrado com sucesso.';
        }

        return redirect()
            ->route('treinamentosexames.index')
            ->with('success', $message);
    }
}
