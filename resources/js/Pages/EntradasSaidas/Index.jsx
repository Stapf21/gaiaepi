import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { inputBaseClass } from '@/lib/formStyles';
import { AlertTriangle, ClipboardList, FileText, PackageCheck, Pencil, Repeat2, Trash2 } from 'lucide-react';

const statusColor = {
    entregue: 'bg-indigo-100 text-indigo-700',
    em_uso: 'bg-amber-100 text-amber-700',
    devolvido: 'bg-emerald-100 text-emerald-700',
    perdido: 'bg-rose-100 text-rose-700',
};

const statusLabel = {
    entregue: 'Entregue',
    em_uso: 'Em uso',
    devolvido: 'Devolvido',
    perdido: 'Perdido',
};

const totalItems = (items = []) => items.reduce((total, item) => total + (item.quantity ?? 0), 0);

export default function EntradasSaidasIndex({ stats = {}, deliveries }) {
    const deleteForm = useForm({});
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const handleDelete = (url) => {
        if (!url) {
            return;
        }

        if (!window.confirm('Deseja realmente excluir esta movimentacao? Essa acao nao pode ser desfeita.')) {
            return;
        }

        deleteForm.delete(url, {
            preserveScroll: true,
        });
    };

    const entries = Number(stats.entries ?? 0);
    const outputs = Number(stats.deliveries ?? 0);
    const openReturns = Number(stats.openReturns ?? 0);
    const baseDeliveries = deliveries?.data ?? [];

    const deliveredItems = useMemo(
        () => baseDeliveries.reduce((sum, delivery) => sum + totalItems(delivery.items), 0),
        [baseDeliveries],
    );

    const filteredDeliveries = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return baseDeliveries.filter((delivery) => {
            if (statusFilter !== 'all' && delivery.status !== statusFilter) {
                return false;
            }

            if (!query) {
                return true;
            }

            const code = String(delivery.code ?? delivery.id ?? '').toLowerCase();
            const employee = String(delivery.employee ?? '').toLowerCase();
            const itemNames = (delivery.items ?? [])
                .map((item) => String(item.name ?? '').toLowerCase())
                .join(' ');

            return code.includes(query) || employee.includes(query) || itemNames.includes(query);
        });
    }, [baseDeliveries, searchQuery, statusFilter]);

    const completedReturns = useMemo(
        () => baseDeliveries.filter((delivery) => delivery.status === 'devolvido').length,
        [baseDeliveries],
    );

    const lostItems = useMemo(
        () => baseDeliveries.filter((delivery) => delivery.status === 'perdido').length,
        [baseDeliveries],
    );

    const avgItemsPerDelivery = useMemo(
        () => (baseDeliveries.length ? (deliveredItems / baseDeliveries.length).toFixed(1) : '0.0'),
        [baseDeliveries.length, deliveredItems],
    );

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Entradas & Saidas</h2>}>
            <Head title="Entradas & Saidas" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                                <Repeat2 className="mr-1 h-3 w-3" />
                                Fluxo operacional
                            </Badge>
                            <Badge variant="outline" className="border-blue-100 bg-white text-blue-700">
                                <PackageCheck className="mr-1 h-3 w-3" />
                                Controle de movimentacoes
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-semibold text-slate-900">Entradas e saidas</h1>
                        <p className="text-sm text-muted-foreground">Acompanhe entregas, retornos previstos e historico de movimentacoes.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('entradassaidas.create')}>Registrar movimentacao</Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card className="border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide text-slate-600">Entradas registradas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-slate-900">{entries}</p>
                            <p className="text-xs text-muted-foreground">Entradas de reposicao e compra contabilizadas.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide text-slate-600">Saidas realizadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-slate-900">{outputs}</p>
                            <p className="text-xs text-muted-foreground">Movimentacoes de entrega para colaboradores.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-rose-100 bg-gradient-to-br from-rose-50 via-white to-rose-50 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide text-slate-600">Pendencias de devolucao</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-slate-900">{openReturns}</p>
                            <p className="text-xs text-muted-foreground">Itens em uso aguardando retorno.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-blue-100 bg-gradient-to-br from-slate-50 via-white to-blue-50 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide text-slate-600">Itens movimentados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-slate-900">{deliveredItems}</p>
                            <p className="text-xs text-muted-foreground">Volume total entregue no periodo listado.</p>
                        </CardContent>
                    </Card>
                </div>

                <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    <Card className="border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 shadow-sm">
                        <CardContent className="p-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Panorama das movimentacoes</p>
                            <h2 className="mt-1 text-xl font-semibold text-slate-900">Visao consolidada do periodo</h2>
                            <p className="mt-1 text-sm text-slate-600">Resumo de volume entregue e controle de pendencias de retorno.</p>

                            <div className="mt-4 grid gap-3 sm:grid-cols-4">
                                <div className="rounded-lg border border-blue-100 bg-white px-3 py-2">
                                    <p className="text-xs text-blue-700">Itens entregues</p>
                                    <p className="text-sm font-semibold text-slate-900">{deliveredItems}</p>
                                </div>
                                <div className="rounded-lg border border-blue-100 bg-white px-3 py-2">
                                    <p className="text-xs text-blue-700">Total de saidas</p>
                                    <p className="text-sm font-semibold text-slate-900">{outputs}</p>
                                </div>
                                <div className="rounded-lg border border-blue-100 bg-white px-3 py-2">
                                    <p className="text-xs text-blue-700">Retornos pendentes</p>
                                    <p className="text-sm font-semibold text-slate-900">{openReturns}</p>
                                </div>
                                <div className="rounded-lg border border-blue-100 bg-white px-3 py-2">
                                    <p className="text-xs text-blue-700">Media por movimentacao</p>
                                    <p className="text-sm font-semibold text-slate-900">{avgItemsPerDelivery}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium text-slate-700">Sinalizadores</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2">
                                <span className="inline-flex items-center gap-2 font-medium text-rose-700">
                                    <AlertTriangle className="h-4 w-4" />
                                    Devolucoes pendentes
                                </span>
                                <span className="font-semibold text-rose-700">{openReturns}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2">
                                <span className="inline-flex items-center gap-2 font-medium text-blue-700">
                                    <ClipboardList className="h-4 w-4" />
                                    Movimentacoes listadas
                                </span>
                                <span className="font-semibold text-blue-700">{baseDeliveries.length}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2">
                                <span className="inline-flex items-center gap-2 font-medium text-emerald-700">
                                    <PackageCheck className="h-4 w-4" />
                                    Devolvidos
                                </span>
                                <span className="font-semibold text-emerald-700">{completedReturns}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                                <span className="inline-flex items-center gap-2 font-medium text-slate-700">
                                    <Trash2 className="h-4 w-4" />
                                    Perdidos
                                </span>
                                <span className="font-semibold text-slate-700">{lostItems}</span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-800">Ultimas movimentacoes de saida</CardTitle>
                        <p className="text-sm text-muted-foreground">Consulte itens entregues, status atual e acoes de manutencao.</p>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 space-y-4 rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50/60 to-white p-4">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                <div className="flex-1 space-y-2">
                                    <label htmlFor="movement_search" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Buscar por codigo, colaborador ou item
                                    </label>
                                    <input
                                        id="movement_search"
                                        type="text"
                                        className={inputBaseClass}
                                        placeholder="Ex: #1204, Joao, Capacete"
                                        value={searchQuery}
                                        onChange={(event) => setSearchQuery(event.target.value)}
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</span>
                                    {[
                                        { id: 'all', label: 'Todos' },
                                        { id: 'em_uso', label: 'Em uso' },
                                        { id: 'devolvido', label: 'Devolvido' },
                                        { id: 'entregue', label: 'Entregue' },
                                        { id: 'perdido', label: 'Perdido' },
                                    ].map((option) => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() => setStatusFilter(option.id)}
                                            className={
                                                statusFilter === option.id
                                                    ? 'rounded-full border border-blue-700 bg-blue-700 px-3 py-1 text-xs font-medium text-white'
                                                    : 'rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100'
                                            }
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-blue-100 bg-white/80 px-3 py-2 text-xs text-slate-600">
                                <span>
                                    Exibindo <strong className="text-slate-900">{filteredDeliveries.length}</strong> de{' '}
                                    <strong className="text-slate-900">{baseDeliveries.length}</strong> movimentacoes
                                </span>
                                <span className="inline-flex items-center gap-1 text-rose-700">
                                    <AlertTriangle className="h-3.5 w-3.5" />
                                    Pendentes: <strong>{openReturns}</strong>
                                </span>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-slate-200">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-blue-50/70">
                                        <TableHead>Codigo</TableHead>
                                        <TableHead>Itens entregues</TableHead>
                                        <TableHead>Colaborador</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Entrega</TableHead>
                                        <TableHead>Retorno previsto</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Acoes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDeliveries.length ? (
                                        filteredDeliveries.map((delivery) => (
                                            <TableRow key={delivery.id} className="transition-colors hover:bg-slate-50">
                                                <TableCell className="font-medium">
                                                    <Link href={delivery.show_url} className="text-blue-700 hover:underline">
                                                        {delivery.code ?? `#${delivery.id}`}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        {delivery.items?.length ? (
                                                            delivery.items.map((item) => (
                                                                <div key={item.id} className="text-sm leading-5">
                                                                    {item.name}{' '}
                                                                    <span className="text-xs text-slate-500">(x{item.quantity})</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-slate-500">-</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{delivery.employee ?? '-'}</TableCell>
                                                <TableCell>{totalItems(delivery.items)}</TableCell>
                                                <TableCell>{delivery.delivered_at ?? '-'}</TableCell>
                                                <TableCell>{delivery.expected_return_at ?? '-'}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={statusColor[delivery.status] ?? 'bg-slate-200 text-slate-700'}>
                                                            {statusLabel[delivery.status] ?? delivery.status}
                                                        </Badge>
                                                        {delivery.document?.url ? (
                                                            <Button variant="ghost" size="icon" asChild title="Ver documento">
                                                                <a href={delivery.document.url} target="_blank" rel="noopener noreferrer">
                                                                    <FileText className="h-4 w-4 text-slate-600" />
                                                                </a>
                                                            </Button>
                                                        ) : null}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" asChild title="Editar movimentacao">
                                                            <Link href={delivery.edit_url}>
                                                                <Pencil className="h-4 w-4 text-slate-600" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Excluir movimentacao"
                                                            onClick={() => handleDelete(delivery.destroy_url)}
                                                            disabled={deleteForm.processing}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-rose-600" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center text-sm text-muted-foreground">
                                                Nenhuma movimentacao encontrada para os filtros aplicados.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
