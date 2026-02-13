import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import InputError from '@/Components/InputError.jsx';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { inputBaseClass, textareaBaseClass } from '@/lib/formStyles';

export default function AcidentesRelatoriosCreate({ types = [], employees = [], severityOptions = [], statusOptions = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        protocol: '',
        accident_type_id: '',
        occurred_at: new Date().toISOString().slice(0, 10),
        occurred_time: '',
        location: '',
        severity: severityOptions?.[0]?.value ?? 'leve',
        status: statusOptions?.[0]?.value ?? 'em_investigacao',
        description: '',
        root_cause: '',
        corrective_action: '',
        reported_by: '',
        employee_ids: [],
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('acidentesrelatorios.store'));
    };

    const handleEmployeesChange = (event) => {
        const selected = Array.from(event.target.selectedOptions).map((option) => Number(option.value));
        setData('employee_ids', selected);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Novo registro de acidente</h2>}>
            <Head title="Registrar acidente" />

            <div className="mx-auto max-w-4xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col gap-1">
                        <CardTitle className="text-base font-semibold text-slate-800">
                            Detalhes do incidente
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Informe os dados principais para acompanhamento das ações corretivas e estatísticas.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="protocol" className="text-sm font-medium text-slate-700">
                                        Protocolo
                                    </label>
                                    <input
                                        id="protocol"
                                        type="text"
                                        className={inputBaseClass}
                                        value={data.protocol}
                                        onChange={(event) => setData('protocol', event.target.value)}
                                        placeholder="AC-2025-001"
                                    />
                                    <InputError message={errors.protocol} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="accident_type_id" className="text-sm font-medium text-slate-700">
                                        Tipo de ocorrência
                                    </label>
                                    <select
                                        id="accident_type_id"
                                        className={inputBaseClass}
                                        value={data.accident_type_id}
                                        onChange={(event) => setData('accident_type_id', event.target.value ? Number(event.target.value) : '')}
                                        required
                                    >
                                        <option value="">Selecione...</option>
                                        {types.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.accident_type_id} />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="occurred_at" className="text-sm font-medium text-slate-700">
                                        Data do acidente
                                    </label>
                                    <input
                                        id="occurred_at"
                                        type="date"
                                        className={inputBaseClass}
                                        value={data.occurred_at}
                                        onChange={(event) => setData('occurred_at', event.target.value)}
                                        required
                                    />
                                    <InputError message={errors.occurred_at} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="occurred_time" className="text-sm font-medium text-slate-700">
                                        Horário
                                    </label>
                                    <input
                                        id="occurred_time"
                                        type="time"
                                        className={inputBaseClass}
                                        value={data.occurred_time ?? ''}
                                        onChange={(event) => setData('occurred_time', event.target.value)}
                                    />
                                    <InputError message={errors.occurred_time} />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="severity" className="text-sm font-medium text-slate-700">
                                        Gravidade
                                    </label>
                                    <select
                                        id="severity"
                                        className={inputBaseClass}
                                        value={data.severity}
                                        onChange={(event) => setData('severity', event.target.value)}
                                        required
                                    >
                                        {severityOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.severity} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="status" className="text-sm font-medium text-slate-700">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        className={inputBaseClass}
                                        value={data.status}
                                        onChange={(event) => setData('status', event.target.value)}
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.status} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="location" className="text-sm font-medium text-slate-700">
                                    Localização
                                </label>
                                <input
                                    id="location"
                                    type="text"
                                    className={inputBaseClass}
                                    value={data.location}
                                    onChange={(event) => setData('location', event.target.value)}
                                />
                                <InputError message={errors.location} />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium text-slate-700">
                                    Descrição do acidente
                                </label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    className={textareaBaseClass}
                                    value={data.description}
                                    onChange={(event) => setData('description', event.target.value)}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="root_cause" className="text-sm font-medium text-slate-700">
                                        Causa raiz
                                    </label>
                                    <textarea
                                        id="root_cause"
                                        rows={3}
                                        className={textareaBaseClass}
                                        value={data.root_cause}
                                        onChange={(event) => setData('root_cause', event.target.value)}
                                    />
                                    <InputError message={errors.root_cause} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="corrective_action" className="text-sm font-medium text-slate-700">
                                        Ação corretiva
                                    </label>
                                    <textarea
                                        id="corrective_action"
                                        rows={3}
                                        className={textareaBaseClass}
                                        value={data.corrective_action}
                                        onChange={(event) => setData('corrective_action', event.target.value)}
                                    />
                                    <InputError message={errors.corrective_action} />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="reported_by" className="text-sm font-medium text-slate-700">
                                        Registrado por
                                    </label>
                                    <select
                                        id="reported_by"
                                        className={inputBaseClass}
                                        value={data.reported_by ?? ''}
                                        onChange={(event) => setData('reported_by', event.target.value ? Number(event.target.value) : '')}
                                    >
                                        <option value="">Selecione...</option>
                                        {employees.map((employee) => (
                                            <option key={employee.id} value={employee.id}>
                                                {employee.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.reported_by} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="employee_ids" className="text-sm font-medium text-slate-700">
                                        Envolvidos
                                    </label>
                                    <select
                                        id="employee_ids"
                                        multiple
                                        className={`${inputBaseClass} h-32`}
                                        value={data.employee_ids.map(String)}
                                        onChange={handleEmployeesChange}
                                    >
                                        {employees.map((employee) => (
                                            <option key={employee.id} value={employee.id}>
                                                {employee.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.employee_ids} />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        reset();
                                        setData('severity', severityOptions?.[0]?.value ?? 'leve');
                                        setData('status', statusOptions?.[0]?.value ?? 'em_investigacao');
                                    }}
                                >
                                    Limpar
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={route('acidentesrelatorios.index')}>Cancelar</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Registrando...' : 'Salvar registro'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
