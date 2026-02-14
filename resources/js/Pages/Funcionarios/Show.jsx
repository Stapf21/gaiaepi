import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import InputError from '@/Components/InputError.jsx';
import Modal from '@/Components/Modal.jsx';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { inputBaseClass, textareaBaseClass } from '@/lib/formStyles';
import { AlertTriangle, PackageCheck, Repeat2, ShieldCheck, User } from 'lucide-react';

const employeeStatusClass = {
    ativo: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    afastado: 'border-amber-200 bg-amber-50 text-amber-700',
    desligado: 'border-rose-200 bg-rose-50 text-rose-700',
};

const deliveryStatusClass = {
    entregue: 'bg-indigo-100 text-indigo-700',
    em_uso: 'bg-amber-100 text-amber-700',
    devolvido: 'bg-emerald-100 text-emerald-700',
    perdido: 'bg-rose-100 text-rose-700',
};

const formatStatus = (status) => {
    if (!status) {
        return '-';
    }

    return String(status)
        .replace('_', ' ')
        .replace(/^\w/, (char) => char.toUpperCase());
};

export default function FuncionariosShow({ employee, history = {}, links = {}, prompts = {}, can = {} }) {
    const stats = [
        { label: 'Total de entregas', value: history?.stats?.total ?? 0, tone: 'from-blue-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40' },
        { label: 'Entregas em aberto', value: history?.stats?.open ?? 0, tone: 'from-amber-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40' },
        { label: 'Itens em uso', value: history?.stats?.active_items ?? 0, tone: 'from-indigo-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40' },
        { label: 'Última entrega', value: history?.stats?.last_delivery_at ?? '-', tone: 'from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40' },
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

    const openDeliveries = Number(history?.stats?.open ?? 0);
    const totalDeliveries = Number(history?.stats?.total ?? 0);

    const pendingItems = useMemo(
        () => deliveries.reduce((sum, delivery) => sum + Number(delivery.pending_items ?? 0), 0),
        [deliveries],
    );

    const startKitFlow = () => {
        setKitPromptOpen(false);
        router.visit(links?.apply_kit ?? route('entradassaidas.create', { employee: employee.id, kit_prompt: true }));
    };

    const goBack = () => {
        if (typeof window !== 'undefined' && window.history && window.history.length > 1) {
            window.history.back();
            return;
        }

        if (links?.back) {
            router.visit(links.back);
            return;
        }

        router.visit(route('funcionarios.index'));
    };

    const handleDelete = () => {
        if (!can?.delete) return;
        if (!window.confirm('Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.')) {
            return;
        }

        router.delete(route('funcionarios.destroy', employee.id), {
            preserveScroll: true,
        });
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
            <Head title={`Histórico - ${employee?.name ?? 'Funcionário'}`} />

            <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200">
                                <User className="mr-1 h-3 w-3" />
                                Perfil do colaborador
                            </Badge>
                            <Badge variant="outline" className="border-blue-100 bg-white text-blue-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200">
                                <Repeat2 className="mr-1 h-3 w-3" />
                                Histórico de movimentações
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-semibold text-foreground">{employee?.name ?? 'Funcionário'}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {employee?.position ?? 'Cargo não informado'} · {employee?.department ?? 'Setor não informado'}
                        </p>
                        {employee?.company ? <p className="text-xs text-muted-foreground">{employee.company}</p> : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" type="button" onClick={goBack}>
                            Voltar
                        </Button>
                        {links?.edit ? (
                            <Button variant="outline" asChild>
                                <Link href={links.edit}>Editar dados</Link>
                            </Button>
                        ) : null}
                        {links?.apply_kit && employee?.status !== 'desligado' ? (
                            <Button variant="outline" onClick={() => setKitPromptOpen(true)}>
                                Aplicar kit do setor
                            </Button>
                        ) : null}
                        {links?.new_delivery ? (
                            <Button asChild>
                                <Link href={links.new_delivery}>Registrar entrega</Link>
                            </Button>
                        ) : null}
                        {employee?.status !== 'desligado' ? (
                            <Button variant="destructive" onClick={() => setTerminateModalOpen(true)}>
                                Demitir colaborador
                            </Button>
                        ) : null}
                        {can?.delete ? (
                            <Button variant="destructive" type="button" onClick={handleDelete}>
                                Excluir cadastro
                            </Button>
                        ) : null}
                    </div>
                </div>

                <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    <Card className="border-border bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40 shadow-sm">
                        <CardContent className="p-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Visão geral do colaborador</p>
                            <h2 className="mt-1 text-xl font-semibold text-foreground">Acompanhamento de entregas e status</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Resumo da situação do colaborador no controle de EPIs.</p>

                            <div className="mt-4 grid gap-3 sm:grid-cols-4">
                                {stats.map((item) => (
                                    <div key={item.label} className={`rounded-lg border border-blue-100 bg-gradient-to-br ${item.tone} px-3 py-2`}>
                                        <p className="text-xs text-blue-700">{item.label}</p>
                                        <p className="text-sm font-semibold text-foreground">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium text-muted-foreground">Sinalizadores</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between rounded-lg bg-blue-50/70 dark:bg-blue-500/10 px-3 py-2">
                                <span className="inline-flex items-center gap-2 font-medium text-blue-700">
                                    <ShieldCheck className="h-4 w-4" />
                                    Status atual
                                </span>
                                <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${employeeStatusClass[employee?.status] ?? 'border-border bg-muted text-muted-foreground dark:bg-slate-900/40 dark:text-slate-200'}`}>
                                    {formatStatus(employee?.status)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-amber-50/70 dark:bg-amber-500/10 px-3 py-2">
                                <span className="inline-flex items-center gap-2 font-medium text-amber-700">
                                    <AlertTriangle className="h-4 w-4" />
                                    Entregas em aberto
                                </span>
                                <span className="font-semibold text-amber-700">{openDeliveries}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-muted dark:bg-slate-900/40 px-3 py-2">
                                <span className="inline-flex items-center gap-2 font-medium text-muted-foreground">
                                    <PackageCheck className="h-4 w-4" />
                                    Itens pendentes
                                </span>
                                <span className="font-semibold text-muted-foreground">{pendingItems}</span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="shadow-sm lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-foreground">Dados cadastrais</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="space-y-3 text-sm text-muted-foreground">
                                <div className="flex flex-col">
                                    <dt className="text-xs uppercase text-muted-foreground">Registro</dt>
                                    <dd className="font-medium">{employee?.registration_number ?? '-'}</dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="text-xs uppercase text-muted-foreground">E-mail</dt>
                                    <dd className="font-medium">{employee?.email ?? '-'}</dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="text-xs uppercase text-muted-foreground">Telefone</dt>
                                    <dd className="font-medium">{employee?.phone ?? employee?.mobile_phone ?? '-'}</dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="text-xs uppercase text-muted-foreground">Admissão</dt>
                                    <dd className="font-medium">{employee?.hire_date ?? '-'}</dd>
                                </div>
                                {employee?.termination_date ? (
                                    <div className="flex flex-col">
                                        <dt className="text-xs uppercase text-muted-foreground">Desligamento</dt>
                                        <dd className="font-medium">{employee.termination_date}</dd>
                                    </div>
                                ) : null}
                            </dl>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-foreground">Histórico de entregas</CardTitle>
                            <p className="text-sm text-muted-foreground">Total de movimentações registradas: {totalDeliveries}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {deliveries.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                                    Nenhuma entrega registrada para este funcionário.
                                </div>
                            ) : (
                                deliveries.map((delivery) => (
                                    <div key={delivery.id} className="rounded-lg border border-border bg-card/70 dark:bg-slate-950/40 p-4 shadow-sm">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <p className="text-base font-semibold text-foreground">{delivery.code}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Entregue em {delivery.delivered_at ?? '-'}
                                                    {delivery.expected_return_at ? (
                                                        <span className="ml-2">· Previsto para {delivery.expected_return_at}</span>
                                                    ) : null}
                                                    {delivery.returned_at ? (
                                                        <span className="ml-2 text-emerald-600">· Devolvido em {delivery.returned_at}</span>
                                                    ) : null}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={deliveryStatusClass[delivery.status] ?? 'bg-slate-200 text-muted-foreground'}>
                                                    {formatStatus(delivery.status)}
                                                </Badge>
                                                <Link href={delivery.show_url} className="text-xs font-medium text-blue-600 hover:underline">
                                                    Ver detalhes
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="mt-3 border-t border-slate-100 pt-3">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Itens entregues</p>
                                            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                                {delivery.items.map((item) => (
                                                    <li key={item.id} className="flex items-center justify-between">
                                                        <span>{item.epi ?? 'EPI'}</span>
                                                        <span className="font-semibold text-foreground">x{item.quantity}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {delivery.logs?.length ? (
                                            <div className="mt-4 rounded-md bg-muted dark:bg-slate-900/40 p-3">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Últimas movimentações</p>
                                                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                                                    {delivery.logs.map((log) => (
                                                        <li key={log.id} className="flex flex-col gap-0.5">
                                                            <span className="font-medium text-muted-foreground">
                                                                {log.created_at ?? '-'} · {log.action}
                                                            </span>
                                                            {log.notes ? <span className="text-muted-foreground">{log.notes}</span> : null}
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

                {latestReport ? (
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-foreground">Relatório de demissão</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <span>
                                    Gerado em <span className="font-semibold text-foreground">{latestReport.terminated_at ?? '-'}</span>
                                </span>
                                {latestReport.by ? (
                                    <span>
                                        por <span className="font-semibold text-foreground">{latestReport.by}</span>
                                    </span>
                                ) : null}
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-lg border border-border p-3 text-center">
                                    <p className="text-xs uppercase text-muted-foreground">Itens entregues</p>
                                    <p className="text-2xl font-semibold text-foreground">{latestReport.summary?.total_items ?? 0}</p>
                                </div>
                                <div className="rounded-lg border border-border p-3 text-center">
                                    <p className="text-xs uppercase text-muted-foreground">Itens pendentes</p>
                                    <p className="text-2xl font-semibold text-amber-600">{latestReport.summary?.pending_items ?? 0}</p>
                                </div>
                                <div className="rounded-lg border border-border p-3 text-center">
                                    <p className="text-xs uppercase text-muted-foreground">Entregas em aberto</p>
                                    <p className="text-2xl font-semibold text-foreground">{latestReport.summary?.open_deliveries ?? 0}</p>
                                </div>
                            </div>

                            {latestReport.pending_items?.length ? (
                                <div className="rounded-lg border border-dashed border-amber-200 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Itens pendentes de devolução</p>
                                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                        {latestReport.pending_items.map((item, index) => (
                                            <li key={`${item.delivery_id}-${index}`} className="flex flex-wrap gap-2">
                                                <span className="font-medium">{item.epi ?? 'EPI'}</span>
                                                <span className="text-muted-foreground">Qtd: {item.quantity}</span>
                                                <span className="text-muted-foreground">Entrega: {item.delivery_code}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Sem pendências registradas no relatório.</p>
                            )}
                        </CardContent>
                    </Card>
                ) : null}
            </div>

            <Modal show={kitPromptOpen} onClose={() => setKitPromptOpen(false)}>
                <div className="space-y-4 p-6">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Aplicar kit padrão do setor?</h2>
                        <p className="text-sm text-muted-foreground">Deseja registrar agora a entrega do kit padrão de EPIs para este colaborador?</p>
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
                        <h2 className="text-lg font-semibold text-foreground">Demitir colaborador</h2>
                        <p className="text-sm text-muted-foreground">A demissão encerrará o vínculo e gerará o relatório dos EPIs entregues e pendentes.</p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="termination_date" className="text-sm font-medium text-muted-foreground">Data de desligamento</label>
                        <input
                            id="termination_date"
                            type="date"
                            className={inputBaseClass}
                            value={terminateForm.data.termination_date}
                            onChange={(event) => terminateForm.setData('termination_date', event.target.value)}
                            required
                        />
                        <InputError message={terminateForm.errors.termination_date} />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="termination_reason" className="text-sm font-medium text-muted-foreground">Motivo</label>
                        <input
                            id="termination_reason"
                            type="text"
                            className={inputBaseClass}
                            value={terminateForm.data.reason}
                            onChange={(event) => terminateForm.setData('reason', event.target.value)}
                            required
                        />
                        <InputError message={terminateForm.errors.reason} />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="termination_notes" className="text-sm font-medium text-muted-foreground">Observações (opcional)</label>
                        <textarea
                            id="termination_notes"
                            className={textareaBaseClass}
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
