import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    AlertTriangle,
    ArrowDownCircle,
    Clock3,
    DollarSign,
    Package,
    ShieldAlert,
    Sparkles,
    TrendingUp,
    Users,
    X,
} from 'lucide-react';

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

function formatMoney(value) {
    const number = Number(value ?? 0);
    return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function buildSparklinePoints(values, width = 120, height = 32) {
    const safeValues = values.length > 0 ? values : [1, 1, 1, 1, 1, 1, 1];
    const min = Math.min(...safeValues);
    const max = Math.max(...safeValues);
    const range = max - min || 1;
    const pad = 2;

    return safeValues
        .map((value, index) => {
            const x = pad + (index * (width - pad * 2)) / (safeValues.length - 1 || 1);
            const y = height - pad - ((value - min) * (height - pad * 2)) / range;
            return `${x},${y}`;
        })
        .join(' ');
}

function buildSparklineSeries(baseValue) {
    const value = Number(baseValue ?? 0);

    if (value <= 0) {
        return [1, 2, 1, 2, 1, 2, 1];
    }

    return [
        Math.max(1, Math.round(value * 0.62)),
        Math.max(1, Math.round(value * 0.74)),
        Math.max(1, Math.round(value * 0.68)),
        Math.max(1, Math.round(value * 0.82)),
        Math.max(1, Math.round(value * 0.76)),
        Math.max(1, Math.round(value * 0.92)),
        value,
    ];
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
                className="w-full max-w-2xl rounded-lg bg-background text-foreground shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <h3 className="text-base font-semibold text-foreground">{title}</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="max-h-[60vh] space-y-4 overflow-y-auto px-4 py-4">{children}</div>
            </div>
        </div>
    );
}

export default function Overview({
    stats = {},
    alerts = [],
    lowStockItems = [],
    recentAlerts = [],
    charts = {},
}) {
    const [openModal, setOpenModal] = useState(null);

    const hasAlerts = alerts.length > 0;
    const hasLowStock = lowStockItems.length > 0;

    const topUsed = charts?.mostUsedEpis ?? [];
    const topValuable = charts?.mostValuableStock ?? [];

    const maxUsed = useMemo(
        () => Math.max(1, ...topUsed.map((item) => Number(item.total ?? 0))),
        [topUsed],
    );
    const maxValue = useMemo(
        () => Math.max(1, ...topValuable.map((item) => Number(item.total_value ?? 0))),
        [topValuable],
    );
    const totalUsedQuantity = useMemo(
        () => topUsed.reduce((sum, item) => sum + Number(item.total ?? 0), 0),
        [topUsed],
    );
    const totalValuableAmount = useMemo(
        () => topValuable.reduce((sum, item) => sum + Number(item.total_value ?? 0), 0),
        [topValuable],
    );
    const overdueAlerts = useMemo(
        () => recentAlerts.filter((alert) => alert.days_remaining !== null && alert.days_remaining <= 0).length,
        [recentAlerts],
    );
    const dueSoonAlerts = useMemo(
        () => recentAlerts.filter((alert) => alert.days_remaining !== null && alert.days_remaining > 0).length,
        [recentAlerts],
    );

    const statsCards = useMemo(
        () => [
            {
                key: 'alertaEpi',
                label: 'Alertas de EPIs',
                value: Number(stats?.alertaEpi ?? 0),
                description: 'Itens proximos do vencimento ou vencidos.',
                icon: AlertTriangle,
                iconClass: 'text-amber-600',
                sparkColor: '#f59e0b',
                actionType: 'modal',
                actionTarget: 'alerts',
                actionLabel: 'Ver alertas',
                actionDisabled: !hasAlerts,
                toneClass: 'from-amber-50 to-white dark:from-slate-950 dark:to-slate-900/40',
                accentClass: 'bg-amber-100 text-amber-700',
            },
            {
                key: 'estoqueBaixo',
                label: 'Estoque baixo',
                value: Number(stats?.estoqueBaixo ?? 0),
                description: 'Produtos abaixo do minimo configurado.',
                icon: ArrowDownCircle,
                iconClass: 'text-rose-600',
                sparkColor: '#ef4444',
                actionType: 'modal',
                actionTarget: 'stock',
                actionLabel: 'Ver itens',
                actionDisabled: !hasLowStock,
                toneClass: 'from-rose-50 to-white dark:from-slate-950 dark:to-slate-900/40',
                accentClass: 'bg-rose-100 text-rose-700',
            },
            {
                key: 'funcionariosAtivos',
                label: 'Funcionarios ativos',
                value: Number(stats?.funcionariosAtivos ?? 0),
                description: 'Colaboradores com vinculo ativo.',
                icon: Users,
                iconClass: 'text-blue-600',
                sparkColor: '#3b82f6',
                actionType: 'link',
                actionTarget: route('funcionarios.index'),
                actionLabel: 'Ver funcionarios',
                toneClass: 'from-blue-50 to-white dark:from-slate-950 dark:to-slate-900/40',
                accentClass: 'bg-blue-100 text-blue-700',
            },
            {
                key: 'episEmUso',
                label: 'EPIs em uso',
                value: Number(stats?.episEmUso ?? 0),
                description: 'Entregas abertas sem devolucao.',
                icon: Package,
                iconClass: 'text-emerald-600',
                sparkColor: '#22c55e',
                actionType: 'link',
                actionTarget: route('entradassaidas.index'),
                actionLabel: 'Ver entregas',
                toneClass: 'from-emerald-50 to-white dark:from-slate-950 dark:to-slate-900/40',
                accentClass: 'bg-emerald-100 text-emerald-700',
            },
        ],
        [hasAlerts, hasLowStock, stats],
    );

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Visao geral</h2>}>
            <Head title="Dashboard" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                                <Sparkles className="mr-1 h-3 w-3" />
                                Dashboard executivo
                            </Badge>
                            <Badge variant="outline" className="border-blue-100 bg-white text-blue-700">
                                <Clock3 className="mr-1 h-3 w-3" />
                                Atualizado agora
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Painel administrativo</h1>
                        <p className="text-sm text-muted-foreground">
                            Panorama geral dos EPIs, equipe e alertas operacionais.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="transition-transform hover:-translate-y-0.5">
                            Exportar resumo
                        </Button>
                        <Button asChild>
                            <Link href={route('entradassaidas.create')}>Nova movimentacao</Link>
                        </Button>
                    </div>
                </div>

                <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    <Card className="border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40 shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-blue-700">Resumo operacional</p>
                                    <p className="mt-1 text-xl font-semibold text-foreground">Status geral do dia</p>
                                    <p className="mt-1 text-sm text-slate-700">
                                        Alertas ativos, entregas em andamento e custo acumulado de estoque.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                                    <div className="rounded-lg border border-border bg-white/90 px-3 py-2">
                                        <p className="text-xs text-blue-700">Alertas</p>
                                        <p className="text-lg font-semibold text-blue-900">{stats?.alertaEpi ?? 0}</p>
                                    </div>
                                    <div className="rounded-lg border border-border bg-white/90 px-3 py-2">
                                        <p className="text-xs text-blue-700">Baixo estoque</p>
                                        <p className="text-lg font-semibold text-blue-900">{stats?.estoqueBaixo ?? 0}</p>
                                    </div>
                                    <div className="rounded-lg border border-border bg-white/90 px-3 py-2">
                                        <p className="text-xs text-blue-700">EPIs em uso</p>
                                        <p className="text-lg font-semibold text-blue-900">{stats?.episEmUso ?? 0}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium text-muted-foreground">Risco de alertas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2 text-sm">
                                <span className="inline-flex items-center gap-2 font-medium text-rose-700">
                                    <ShieldAlert className="h-4 w-4" />
                                    Vencidos
                                </span>
                                <span className="font-semibold text-rose-700">{overdueAlerts}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 text-sm">
                                <span className="inline-flex items-center gap-2 font-medium text-amber-700">
                                    <AlertTriangle className="h-4 w-4" />
                                    Proximos do vencimento
                                </span>
                                <span className="font-semibold text-amber-700">{dueSoonAlerts}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {overdueAlerts > 0
                                    ? 'Existem itens em atraso que precisam de acao imediata.'
                                    : 'Sem atrasos criticos no momento.'}
                            </p>
                        </CardContent>
                    </Card>
                </section>

                <section>
                    <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                        Indicadores rapidos
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {statsCards.map((card) => {
                            const points = buildSparklinePoints(buildSparklineSeries(card.value));
                            const Icon = card.icon;

                            return (
                                <Card
                                    key={card.key}
                                    className={`bg-gradient-to-br ${card.toneClass} shadow-sm transition-all hover:-translate-y-1 hover:shadow-md`}
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="text-base font-medium text-muted-foreground">{card.label}</CardTitle>
                                            <div className={`rounded-md p-2 ${card.accentClass}`}>
                                                <Icon className={`h-4 w-4 ${card.iconClass}`} />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <p className="text-3xl font-semibold text-foreground">{card.value}</p>
                                        <svg width="120" height="32" viewBox="0 0 120 32" aria-hidden="true">
                                            <polyline
                                                fill="none"
                                                stroke={card.sparkColor}
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                points={points}
                                            />
                                        </svg>
                                        <Separator className="bg-border" />
                                        <p className="text-xs text-muted-foreground">{card.description}</p>
                                        {card.actionType === 'modal' && (
                                            <div className="pt-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setOpenModal(card.actionTarget)}
                                                    disabled={card.actionDisabled}
                                                >
                                                    {card.actionLabel}
                                                </Button>
                                            </div>
                                        )}
                                        {card.actionType === 'link' && (
                                            <div className="pt-2">
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={card.actionTarget}>{card.actionLabel}</Link>
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium text-muted-foreground">Top EPIs entregues</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Ranking de produtos por quantidade entregue ({totalUsedQuantity} no total).
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {topUsed.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Sem dados de entregas para exibir.</p>
                            ) : (
                                <div className="rounded-xl border border-border bg-gradient-to-b from-blue-50/40 to-white p-4">
                                    <div className="grid h-72 grid-cols-2 items-end gap-4 border-b border-border pb-2 md:grid-cols-3 lg:grid-cols-6">
                                        {topUsed.slice(0, 6).map((item, index) => {
                                            const value = Number(item.total ?? 0);
                                            const percent = Math.round((value / maxUsed) * 100);
                                            const height = `${Math.max(14, percent)}%`;

                                            return (
                                                <div key={`${item.name}-${index}`} className="flex h-full flex-col items-center justify-end gap-2">
                                                    <span className="text-sm font-semibold text-slate-700">{percent}%</span>
                                                    <div className="flex h-52 w-full items-end justify-center">
                                                        <div
                                                            className="w-full max-w-24 rounded-t-2xl bg-gradient-to-b from-blue-400 to-indigo-500 shadow-sm transition-all duration-500"
                                                            style={{ height }}
                                                            title={`${item.name}: ${value}`}
                                                        />
                                                    </div>
                                                    <p className="w-full truncate text-center text-xs font-medium text-slate-700" title={item.name}>
                                                        {item.name}
                                                    </p>
                                                    <p className="text-sm font-semibold text-foreground">{value}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium text-muted-foreground">Alertas recentes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            {recentAlerts.length === 0 ? (
                                <p className="text-muted-foreground">Sem alertas pendentes no momento.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {recentAlerts.map((alert) => (
                                        <li
                                            key={alert.id}
                                            className="rounded-lg border border-border bg-white/90 px-3 py-2"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-semibold text-foreground">
                                                    {alert.employee ?? 'Funcionario desconhecido'}
                                                </p>
                                                <Badge
                                                    variant={
                                                        alert.days_remaining !== null && alert.days_remaining <= 0
                                                            ? 'destructive'
                                                            : 'outline'
                                                    }
                                                >
                                                    {alert.days_remaining !== null && alert.days_remaining <= 0
                                                        ? 'Vencido'
                                                        : 'Pendente'}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {alert.epi ?? 'EPI'} | {formatRemainingDays(alert.days_remaining)}
                                                {alert.expected_return_at
                                                    ? ` | Previsto: ${alert.expected_return_at}`
                                                    : ''}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium text-muted-foreground">Maior valor em estoque</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Produtos com maior capital parado no estoque ({formatMoney(totalValuableAmount)}).
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {topValuable.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Sem dados de estoque para exibir.</p>
                            ) : (
                                topValuable.map((item, index) => {
                                    const value = Number(item.total_value ?? 0);
                                    const width = `${Math.max(8, Math.round((value / maxValue) * 100))}%`;

                                    return (
                                        <div key={`${item.name}-${index}`} className="space-y-1">
                                            <div className="flex items-center justify-between gap-3 text-sm">
                                                <span className="font-medium text-slate-800">{item.name}</span>
                                                <span className="font-semibold text-foreground">{formatMoney(value)}</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-amber-100">
                                                <div
                                                    className="h-2 rounded-full bg-amber-500 transition-all duration-500"
                                                    style={{ width }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium text-muted-foreground">Acoes rapidas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button asChild className="w-full justify-start">
                                <Link href={route('entradassaidas.create')}>
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    Registrar nova movimentacao
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full justify-start">
                                <Link href={route('administrativo.estoque.index')}>
                                    <Package className="mr-2 h-4 w-4" />
                                    Ver estoque completo
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full justify-start">
                                <Link href={route('funcionarios.index')}>
                                    <Users className="mr-2 h-4 w-4" />
                                    Acessar funcionarios
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full justify-start">
                                <Link href={route('dashboard')}>
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Atualizar indicadores
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </section>
            </div>

            <Modal open={openModal === 'alerts'} onClose={() => setOpenModal(null)} title="Alertas de EPIs">
                {alerts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum alerta de EPI no momento.</p>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg border border-amber-200/30 bg-amber-500/10 dark:border-amber-500/20 dark:bg-amber-500/10 px-3 py-2">
                            <p className="text-xs font-medium uppercase tracking-wide text-amber-700">Total de alertas</p>
                            <Badge className="bg-amber-600 text-white">{alerts.length}</Badge>
                        </div>

                        <ul className="space-y-3">
                            {alerts.map((alert) => {
                                const isOverdue = alert.days_remaining !== null && alert.days_remaining <= 0;

                                return (
                                    <li
                                        key={alert.id}
                                        className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-sm font-semibold text-foreground">
                                                {alert.employee ?? 'Funcionario desconhecido'}
                                            </p>
                                            <Badge variant={isOverdue ? 'destructive' : 'outline'}>
                                                {isOverdue ? 'Vencido' : 'Proximo'}
                                            </Badge>
                                        </div>

                                        <p className="mt-1 text-sm font-medium text-slate-700">{alert.epi ?? 'EPI'}</p>

                                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                                            <span className="rounded-md bg-slate-100 px-2 py-1">
                                                {formatRemainingDays(alert.days_remaining)}
                                            </span>
                                            {alert.expected_return_at ? (
                                                <span className="rounded-md bg-slate-100 px-2 py-1">
                                                    Previsto: {alert.expected_return_at}
                                                </span>
                                            ) : null}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </Modal>

            <Modal open={openModal === 'stock'} onClose={() => setOpenModal(null)} title="Itens com estoque baixo">
                {lowStockItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum item abaixo do estoque minimo.</p>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg border border-rose-200/30 bg-rose-500/10 dark:border-rose-500/20 dark:bg-rose-500/10 px-3 py-2">
                            <p className="text-xs font-medium uppercase tracking-wide text-rose-700">Itens em atencao</p>
                            <Badge className="bg-rose-600 text-white">{lowStockItems.length}</Badge>
                        </div>

                        <ul className="space-y-3">
                            {lowStockItems.map((item) => {
                                const currentStock = Number(item.current_stock ?? 0);
                                const minStock = Number(item.min_stock ?? 0);
                                const deficit = Math.max(0, minStock - currentStock);
                                const critical = currentStock <= 0;

                                return (
                                    <li
                                        key={item.id}
                                        className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-sm font-semibold text-foreground">{item.name}</p>
                                            <Badge variant={critical ? 'destructive' : 'outline'}>
                                                {critical ? 'Critico' : 'Baixo'}
                                            </Badge>
                                        </div>

                                        <div className="mt-2 grid gap-2 text-xs sm:grid-cols-3">
                                            <div className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">
                                                Em estoque: <span className="font-semibold">{currentStock}</span>
                                            </div>
                                            <div className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">
                                                Minimo: <span className="font-semibold">{item.min_stock ?? '-'}</span>
                                            </div>
                                            <div className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">
                                                Deficit: <span className="font-semibold">{deficit}</span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
