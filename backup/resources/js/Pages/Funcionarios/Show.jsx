import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import InputError from '@/Components/InputError.jsx';
import Modal from '@/Components/Modal.jsx';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statusBadgeClass =
    'inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-700';

export default function FuncionariosShow({ employee, history = {}, links = {}, prompts = {} }) {
    const stats = [
        { label: 'Total de entregas', value: history?.stats?.total ?? 0 },
        { label: 'Entregas em aberto', value: history?.stats?.open ?? 0 },
        { label: 'Itens em uso', value: history?.stats?.active_items ?? 0 },
        { label: 'Última entrega', value: history?.stats?.last_delivery_at ?? '-' },
    ];

    const deliveries = history?.deliveries ?? [];
    const latestReport = history?.latest_termination ?? null;

    const [kitPromptOpen, setKitPromptOpen] = useState(Boolean(prompts?.kit));
    const [terminateModalOpen, setTerminateModalOpen] = useState(false);

    const terminateForm = useForm({
        termination_date: new Date().toISOString().slice(0, 10),
        reason: '',
        notes: '',
    });

    useEffect(() => {
        if (prompts?.kit) {
            setKitPromptOpen(true);
        }
    }, [prompts]);

    const startKitFlow = () => {
        setKitPromptOpen(false);
        router.visit(links?.apply_kit ?? route('entradassaidas.create', { employee: employee.id, kit_prompt: true }));
    };

    const terminateEmployee = (event) => {
        event.preventDefault();
        terminateForm.post(route('funcionarios.terminate', employee.id), {
            preserveScroll: true,
            onSuccess: () => {
                setTerminateModalOpen(false);
                terminateForm.reset();
            },
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Histórico de entregas</h2>}>
            <Head title={`Histórico • ${employee?.name ?? 'Funcionário'}`} />

            <div className="mx-auto max-w-6xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold text-slate-900">{employee?.name}</h1>
                            {employee?.status && <span className={statusBadgeClass}>{employee.status}</span>}
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                            {employee?.position ?? 'Cargo não informado'} • {employee?.department ?? 'Setor não informado'}
                        </p>
                        {employee?.company && <p className="text-xs text-slate-500">{employee.company}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {links?.edit && (
                            <Button variant="outline" asChild>
                                <Link href={links.edit}>Editar dados</Link>
                            </Button>
                        )}
                        {links?.apply_kit && employee?.status !== 'desligado' && (
                            <Button variant="outline" onClick={() => setKitPromptOpen(true)}>
                                Aplicar kit do setor
                            </Button>
                        )}
                        {links?.new_delivery && (
                            <Button variant="outline" asChild>
                                <Link href={links.new_delivery}>Registrar entrega</Link>
                            </Button>
                        )}
                        {employee?.status !== 'desligado' && (
                            <Button variant="destructive" onClick={() => setTerminateModalOpen(true)}>
                                Demitir colaborador
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((item) => (
                        <Card key={item.label} className="shadow-sm">
                            <CardHeader className="pb-1">
                                <CardTitle className="text-sm font-medium text-slate-600">{item.label}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="shadow-sm lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-900">Dados cadastrais</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="space-y-3 text-sm text-slate-700">
                                <div className="flex flex-col">
                                    <dt className="text-xs uppercase text-slate-500">Registro</dt>
                                    <dd className="font-medium">{employee?.registration_number ?? '-'}</dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="text-xs uppercase text-slate-500">E-mail</dt>
                                    <dd className="font-medium">{employee?.email ?? '-'}</dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="text-xs uppercase text-slate-500">Telefone</dt>
                                    <dd className="font-medium">{employee?.phone ?? employee?.mobile_phone ?? '-'}</dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="text-xs uppercase text-slate-500">Admissão</dt>
                                    <dd className="font-medium">{employee?.hire_date ?? '-'}</dd>
                                </div>
                                {employee?.termination_date && (
                                    <div className="flex flex-col">
                                        <dt className="text-xs uppercase text-slate-500">Desligamento</dt>
                                        <dd className="font-medium">{employee.termination_date}</dd>
                                    </div>
                                )}
                            </dl>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-900">Histórico de entregas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {deliveries.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                                    Nenhuma entrega registrada para este funcionário.
                                </div>
                            ) : (
                                deliveries.map((delivery) => (
                                    <div key={delivery.id} className="rounded-lg border border-slate-200 p-4">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <p className="text-base font-semibold text-slate-900">{delivery.code}</p>
                                                <p className="text-xs text-slate-500">
                                                    Entregue em {delivery.delivered_at ?? '-'}
                                                    {delivery.expected_return_at && (
                                                        <span className="ml-2">
                                                            • Previsto para {delivery.expected_return_at}
                                                        </span>
                                                    )}
                                                    {delivery.returned_at && (
                                                        <span className="ml-2 text-emerald-600">
                                                            • Devolvido em {delivery.returned_at}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={statusBadgeClass}>{delivery.status}</span>
                                                <Link href={delivery.show_url} className="text-xs font-medium text-blue-600 hover:underline">
                                                    Ver detalhes
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="mt-3 border-t border-slate-100 pt-3">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Itens entregues
                                            </p>
                                            <ul className="mt-2 space-y-1 text-sm text-slate-700">
                                                {delivery.items.map((item) => (
                                                    <li key={item.id} className="flex items-center justify-between">
                                                        <span>{item.epi ?? 'EPI'}</span>
                                                        <span className="font-semibold text-slate-900">x{item.quantity}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {delivery.logs?.length ? (
                                            <div className="mt-4 rounded-md bg-slate-50 p-3">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                    Últimas movimentações
                                                </p>
                                                <ul className="mt-2 space-y-1 text-xs text-slate-600">
                                                    {delivery.logs.map((log) => (
                                                        <li key={log.id} className="flex flex-col gap-0.5">
                                                            <span className="font-medium text-slate-700">
                                                                {log.created_at ?? '-'} • {log.action}
                                                            </span>
                                                            {log.notes && <span className="text-slate-500">{log.notes}</span>}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : null}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {latestReport && (
                    <Card className="shadow-sm">
                        <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-900">
                                Relatório de demissão
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                                <span>
                                    Gerado em{' '}
                                    <span className="font-semibold text-slate-900">{latestReport.terminated_at ?? '-'}</span>
                                </span>
                                {latestReport.by && (
                                    <span>
                                        por <span className="font-semibold text-slate-900">{latestReport.by}</span>
                                    </span>
                                )}
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-lg border border-slate-200 p-3 text-center">
                                    <p className="text-xs uppercase text-slate-500">Itens entregues</p>
                                    <p className="text-2xl font-semibold text-slate-900">
                                        {latestReport.summary?.total_items ?? 0}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-3 text-center">
                                    <p className="text-xs uppercase text-slate-500">Itens pendentes</p>
                                    <p className="text-2xl font-semibold text-amber-600">
                                        {latestReport.summary?.pending_items ?? 0}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-3 text-center">
                                    <p className="text-xs uppercase text-slate-500">Entregas em aberto</p>
                                    <p className="text-2xl font-semibold text-slate-900">
                                        {latestReport.summary?.open_deliveries ?? 0}
                                    </p>
                                </div>
                            </div>

                            {latestReport.pending_items?.length ? (
                                <div className="rounded-lg border border-dashed border-amber-200 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                                        Itens pendentes de devolução
                                    </p>
                                    <ul className="mt-2 space-y-1 text-sm text-slate-700">
                                        {latestReport.pending_items.map((item, index) => (
                                            <li key={`${item.delivery_id}-${index}`} className="flex flex-wrap gap-2">
                                                <span className="font-medium">{item.epi ?? 'EPI'}</span>
                                                <span className="text-slate-500">Qtd: {item.quantity}</span>
                                                <span className="text-slate-500">Entrega: {item.delivery_code}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">Sem pendências registradas no relatório.</p>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            <Modal show={kitPromptOpen} onClose={() => setKitPromptOpen(false)}>
                <div className="space-y-4 p-6">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Aplicar kit padrão do setor?</h2>
                        <p className="text-sm text-slate-600">
                            Deseja registrar agora a entrega do kit padrão de EPIs para este colaborador?
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button variant="outline" onClick={() => setKitPromptOpen(false)}>
                            Não agora
                        </Button>
                        <Button onClick={startKitFlow}>Sim, registrar</Button>
                    </div>
                </div>
            </Modal>

            <Modal show={terminateModalOpen} onClose={() => setTerminateModalOpen(false)}>
                <form onSubmit={terminateEmployee} className="space-y-4 p-6">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Demitir colaborador</h2>
                        <p className="text-sm text-slate-600">
                            A demissão encerrará o vínculo e gerará o relatório dos EPIs entregues e pendentes.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="termination_date" className="text-sm font-medium text-slate-700">
                            Data de desligamento
                        </label>
                        <input
                            id="termination_date"
                            type="date"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                            value={terminateForm.data.termination_date}
                            onChange={(event) => terminateForm.setData('termination_date', event.target.value)}
                            required
                        />
                        <InputError message={terminateForm.errors.termination_date} />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="termination_reason" className="text-sm font-medium text-slate-700">
                            Motivo
                        </label>
                        <input
                            id="termination_reason"
                            type="text"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                            value={terminateForm.data.reason}
                            onChange={(event) => terminateForm.setData('reason', event.target.value)}
                            required
                        />
                        <InputError message={terminateForm.errors.reason} />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="termination_notes" className="text-sm font-medium text-slate-700">
                            Observações (opcional)
                        </label>
                        <textarea
                            id="termination_notes"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                            rows={3}
                            value={terminateForm.data.notes ?? ''}
                            onChange={(event) => terminateForm.setData('notes', event.target.value)}
                        />
                        <InputError message={terminateForm.errors.notes} />
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button variant="outline" type="button" onClick={() => setTerminateModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="destructive" disabled={terminateForm.processing}>
                            {terminateForm.processing ? 'Processando...' : 'Confirmar demissão'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
