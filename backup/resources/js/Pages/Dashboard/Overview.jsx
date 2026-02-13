import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

function formatRemainingDays(days) {
    if (days === null || days === undefined) {
        return 'Sem previsao de devolucao';
    }

    if (days === 0) {
        return 'Vence hoje';
    }

    if (days > 0) {
        return `Faltam ${days} dia${days > 1 ? 's' : ''}`;
    }

    const abs = Math.abs(days);
    return `Vencido ha ${abs} dia${abs > 1 ? 's' : ''}`;
}

function Modal({ open, title, onClose, children }) {
    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl rounded-lg bg-white shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="max-h-[60vh] space-y-4 overflow-y-auto px-4 py-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default function Overview({
    stats = {},
    alerts = [],
    lowStockItems = [],
    recentAlerts = [],
}) {
    const [openModal, setOpenModal] = useState(null);

    const hasAlerts = alerts.length > 0;
    const hasLowStock = lowStockItems.length > 0;

    const statsConfig = useMemo(
        () => [
            {
                key: 'alertaEpi',
                label: 'Alertas de EPIs',
                description: 'Itens com vencimento proximo ou vencidos.',
                action: {
                    type: 'modal',
                    modal: 'alerts',
                    label: 'Visualizar',
                    disabled: !hasAlerts,
                },
            },
            {
                key: 'estoqueBaixo',
                label: 'Estoque baixo',
                description: 'Produtos abaixo do limite configurado.',
                action: {
                    type: 'modal',
                    modal: 'stock',
                    label: 'Visualizar',
                    disabled: !hasLowStock,
                },
            },
            {
                key: 'funcionariosAtivos',
                label: 'Funcionarios ativos',
                description: 'Colaboradores com EPIs alocados.',
                action: {
                    type: 'link',
                    href: route('funcionarios.index'),
                    label: 'Ver funcionarios',
                },
            },
            {
                key: 'episEmUso',
                label: 'EPIs em uso',
                description: 'Itens entregues recentemente.',
                action: {
                    type: 'link',
                    href: route('entradassaidas.index'),
                    label: 'Ver entregas',
                },
            },
        ],
        [hasAlerts, hasLowStock],
    );

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Visao geral</h2>}>
            <Head title="Dashboard" />

            <div className="space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-12">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                            Painel administrativo
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Panorama geral dos EPIs, equipe e alertas operacionais.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">Exportar resumo</Button>
                        <Button asChild>
                            <Link href={route('entradassaidas.create')}>
                                Nova movimentacao
                            </Link>
                        </Button>
                    </div>
                </div>

                <section>
                    <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                        Indicadores rapidos
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {statsConfig.map((stat) => (
                            <Card key={stat.key} className="shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-medium text-gray-700">
                                        {stat.label}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="text-3xl font-semibold text-gray-900">
                                        {stats?.[stat.key] ?? 0}
                                    </p>
                                    <Separator className="bg-gray-200" />
                                    <p className="text-xs text-muted-foreground">
                                        {stat.description}
                                    </p>
                                    {stat.action?.type === 'modal' && (
                                        <div className="pt-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setOpenModal(stat.action.modal)}
                                                disabled={stat.action.disabled}
                                            >
                                                {stat.action.label}
                                            </Button>
                                        </div>
                                    )}
                                    {stat.action?.type === 'link' && (
                                        <div className="pt-2">
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={stat.action.href}>{stat.action.label}</Link>
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium text-gray-700">
                                Evolucao de uso de EPIs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Grafico em desenvolvimento.
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium text-gray-700">
                                Alertas recentes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-muted-foreground">
                            {recentAlerts.length === 0 ? (
                                <p>Sem alertas pendentes no momento.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {recentAlerts.map((alert) => (
                                        <li
                                            key={alert.id}
                                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                                        >
                                            <p className="font-semibold text-slate-900">
                                                {alert.employee ?? 'Funcionario desconhecido'}
                                            </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {alert.epi ?? 'EPI'} • {formatRemainingDays(alert.days_remaining)}
                                                    {alert.expected_return_at ? ` • Previsto: ${alert.expected_return_at}` : ''}
                                                </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </section>
            </div>

            <Modal
                open={openModal === 'alerts'}
                onClose={() => setOpenModal(null)}
                title="Alertas de EPIs"
            >
                {alerts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum alerta de EPI no momento.</p>
                ) : (
                    <ul className="space-y-3">
                        {alerts.map((alert) => (
                            <li
                                key={alert.id}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
                            >
                                <p className="text-sm font-semibold text-slate-900">
                                    {alert.employee ?? 'Funcionario desconhecido'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {alert.epi ?? 'EPI'} • {formatRemainingDays(alert.days_remaining)}
                                    {alert.expected_return_at ? ` • Previsto para ${alert.expected_return_at}` : ''}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </Modal>

            <Modal
                open={openModal === 'stock'}
                onClose={() => setOpenModal(null)}
                title="Itens com estoque baixo"
            >
                {lowStockItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum item abaixo do estoque minimo.</p>
                ) : (
                    <ul className="space-y-3">
                        {lowStockItems.map((item) => (
                            <li
                                key={item.id}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
                            >
                                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    Em estoque: {item.current_stock} • Minimo desejado: {item.min_stock ?? '—'}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
