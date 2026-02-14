import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import InputError from '@/Components/InputError.jsx';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { inputBaseClass, textareaBaseClass } from '@/lib/formStyles';
import { Activity, AlertTriangle, Boxes, PackageCheck, ShieldCheck, Tags } from 'lucide-react';

export default function EstoqueIndex({
    items = [],
    catalogStats = {},
    epis,
    categories = [],
}) {
    const totalItems = items.length;
    const belowMinCount = items.filter((item) => item.is_below_min).length;

    const totalCatalog = catalogStats.totalEpis ?? 0;
    const categoryCount = catalogStats.categories ?? 0;
    const minAlerts = catalogStats.stockMinAlerts ?? 0;

    const [stockQuery, setStockQuery] = useState('');
    const [stockFilter, setStockFilter] = useState('all');
    const [sortBy, setSortBy] = useState('available');
    const [sortDir, setSortDir] = useState('desc');

    const filteredItems = useMemo(() => {
        const query = stockQuery.trim().toLowerCase();
        let list = [...items];

        if (stockFilter === 'below') {
            list = list.filter((item) => item.is_below_min);
        } else if (stockFilter === 'ok') {
            list = list.filter((item) => !item.is_below_min);
        }

        if (query) {
            list = list.filter((item) => {
                const nameMatch = (item.name ?? '').toLowerCase().includes(query);
                const caMatch = String(item.ca_number ?? '').toLowerCase().includes(query);
                return nameMatch || caMatch;
            });
        }

        list.sort((a, b) => {
            const left = Number(a?.[sortBy] ?? 0);
            const right = Number(b?.[sortBy] ?? 0);
            if (left === right) return 0;
            return sortDir === 'asc' ? left - right : right - left;
        });

        return list;
    }, [items, stockFilter, stockQuery, sortBy, sortDir]);

    const criticalCount = useMemo(
        () => items.filter((item) => Number(item.available ?? 0) <= 0 && Number(item.min_stock ?? 0) > 0).length,
        [items],
    );

    const healthyCount = useMemo(
        () => items.filter((item) => !item.is_below_min).length,
        [items],
    );

    const stockCoverage = useMemo(() => {
        const tracked = items.filter((item) => Number(item.min_stock ?? 0) > 0);

        if (tracked.length === 0) {
            return null;
        }

        const avg = tracked.reduce((sum, item) => {
            const min = Number(item.min_stock ?? 0);
            const available = Number(item.available ?? 0);
            return sum + Math.max(0, (available / min) * 100);
        }, 0) / tracked.length;

        return Math.round(Math.min(avg, 100));
    }, [items]);

    const handleDeleteEpi = (epi) => {
        if (!confirm(`Excluir o EPI "${epi.name}"?`)) {
            return;
        }

        router.delete(route('catalogoepi.destroy', epi.id), {
            preserveScroll: true,
        });
    };

    const [editingCategory, setEditingCategory] = useState(null);
    const categoryForm = useForm({
        name: '',
        default_return_days: '',
        description: '',
    });
    const deleteCategoryForm = useForm({});

    const startEditingCategory = (category) => {
        setEditingCategory(category);
        categoryForm.setData({
            name: category.name ?? '',
            default_return_days: category.default_return_days ?? '',
            description: category.description ?? '',
        });
    };

    const cancelEditingCategory = () => {
        setEditingCategory(null);
        categoryForm.reset();
    };

    const submitCategory = (event) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                categoryForm.reset();
                setEditingCategory(null);
            },
        };

        if (editingCategory) {
            categoryForm.put(route('configuracoes.epi-categories.update', editingCategory.id), options);
        } else {
            categoryForm.post(route('configuracoes.epi-categories.store'), options);
        }
    };

    const handleDeleteCategory = (category) => {
        if (!confirm(`Deseja realmente excluir a categoria "${category.name}"?`)) {
            return;
        }

        deleteCategoryForm.delete(route('configuracoes.epi-categories.destroy', category.id), {
            preserveScroll: true,
            onSuccess: () => {
                if (editingCategory?.id === category.id) {
                    cancelEditingCategory();
                }
            },
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Administrativo</h2>}>
            <Head title="Estoque" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200">
                                <Boxes className="mr-1 h-3 w-3" />
                                Controle de estoque
                            </Badge>
                            <Badge variant="outline" className="border-blue-100 bg-card text-blue-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200">
                                <ShieldCheck className="mr-1 h-3 w-3" />
                                Visao operacional
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-semibold text-foreground">Gestão de EPIs e estoque</h1>
                        <p className="text-sm text-muted-foreground">
                            Controle centralizado do catálogo de EPIs, posição de estoque e reposições.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                            <Link href={route('catalogoepi.create')}>Novo EPI</Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('administrativo.estoque.entrada.create')}>Registrar entrada</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-border bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Itens monitorados
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-foreground">{totalItems}</p>
                            <p className="text-xs text-muted-foreground">EPIs com movimentações e controle de estoque.</p>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-gradient-to-br from-rose-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Abaixo do mínimo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-foreground">{belowMinCount}</p>
                            <p className="text-xs text-muted-foreground">Itens que atingiram ou ultrapassaram o limite mínimo definido.</p>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                EPIs cadastrados
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-foreground">{totalCatalog}</p>
                            <p className="text-xs text-muted-foreground">Total de itens disponíveis no catálogo.</p>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Categorias e alertas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-foreground">{categoryCount}</p>
                            <p className="text-xs text-muted-foreground">Categorias ativas • Alertas mínimos: {minAlerts}</p>
                        </CardContent>
                    </Card>
                </div>

                <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    <Card className="border-border bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40 shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Panorama do estoque</p>
                                    <h2 className="mt-1 text-xl font-semibold text-foreground">Saude operacional dos itens</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Visao consolidada dos itens com cobertura minima, status critico e disponibilidade geral.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                                    <div className="rounded-lg border border-border bg-card/70 dark:bg-slate-950/40 px-3 py-2">
                                        <p className="text-xs text-blue-700">Itens saudaveis</p>
                                        <p className="text-lg font-semibold text-foreground">{healthyCount}</p>
                                    </div>
                                    <div className="rounded-lg border border-border bg-card/70 dark:bg-slate-950/40 px-3 py-2">
                                        <p className="text-xs text-rose-700">Criticos</p>
                                        <p className="text-lg font-semibold text-foreground">{criticalCount}</p>
                                    </div>
                                    <div className="rounded-lg border border-border bg-card/70 dark:bg-slate-950/40 px-3 py-2">
                                        <p className="text-xs text-blue-700">Cobertura media</p>
                                        <p className="text-lg font-semibold text-foreground">{stockCoverage !== null ? `${stockCoverage}%` : '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium text-gray-700">Sinalizadores</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2 text-sm">
                                <span className="inline-flex items-center gap-2 font-medium text-rose-700">
                                    <AlertTriangle className="h-4 w-4" />
                                    Abaixo do minimo
                                </span>
                                <span className="font-semibold text-rose-700">{belowMinCount}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-blue-50/70 dark:bg-blue-500/10 px-3 py-2 text-sm">
                                <span className="inline-flex items-center gap-2 font-medium text-blue-700">
                                    <PackageCheck className="h-4 w-4" />
                                    Em conformidade
                                </span>
                                <span className="font-semibold text-blue-700">{healthyCount}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-muted dark:bg-slate-900/40 px-3 py-2 text-sm">
                                <span className="inline-flex items-center gap-2 font-medium text-muted-foreground">
                                    <Activity className="h-4 w-4" />
                                    Itens filtrados
                                </span>
                                <span className="font-semibold text-muted-foreground">{filteredItems.length}</span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Card className="shadow-sm">
                    <CardContent className="px-0 py-0">
                        <Tabs defaultValue="stock">
                            <TabsList className="flex flex-wrap gap-2 rounded-none bg-muted/50 p-2 dark:bg-slate-950/40">
                                <TabsTrigger value="stock" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Posição de estoque</TabsTrigger>
                                <TabsTrigger value="catalog" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Catálogo de EPIs</TabsTrigger>
                                <TabsTrigger value="categories" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Categorias de EPI</TabsTrigger>
                            </TabsList>

                            <TabsContent value="stock" className="space-y-4 px-6 py-6">
                                <div className="space-y-4 rounded-lg border border-border bg-gradient-to-r from-blue-50/60 to-background dark:from-slate-950 dark:to-slate-900/40 p-4">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                    <div className="flex-1 space-y-2">
                                        <label htmlFor="stock_search" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Buscar por nome ou CA</label>
                                        <input
                                            id="stock_search"
                                            type="text"
                                            className={inputBaseClass}
                                            placeholder="Ex: Capacete, 12345"
                                            value={stockQuery}
                                            onChange={(event) => setStockQuery(event.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Filtro rápido</span>
                                        {[
                                            { id: 'all', label: 'Todos' },
                                            { id: 'below', label: 'Abaixo do mínimo' },
                                            { id: 'ok', label: 'Ok' },
                                        ].map((option) => (
                                            <button
                                                key={option.id}
                                                type="button"
                                                onClick={() => setStockFilter(option.id)}
                                                className={clsx(
                                                    'rounded-full border px-3 py-1 text-xs font-medium transition',
                                                    stockFilter === option.id
                                                        ? 'border-blue-700 bg-blue-700 text-white'
                                                        : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                                )}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <label htmlFor="stock_sort" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ordenar por</label>
                                        <select
                                            id="stock_sort"
                                            className={inputBaseClass}
                                            value={sortBy}
                                            onChange={(event) => setSortBy(event.target.value)}
                                        >
                                            <option value="available">Disponível</option>
                                            <option value="min_stock">Mínimo</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                                            className="rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                                        >
                                            {sortDir === 'asc' ? 'Asc' : 'Desc'}
                                        </button>
                                    </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card/70 dark:bg-slate-950/40 px-3 py-2 text-xs text-muted-foreground">
                                        <span>Exibindo <strong className="text-foreground">{filteredItems.length}</strong> de <strong className="text-foreground">{items.length}</strong> itens</span>
                                        <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-300">
                                            <AlertTriangle className="h-3.5 w-3.5" />
                                            Criticos: <strong>{criticalCount}</strong>
                                        </span>
                                    </div>
                                </div>

                                {items.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">Nenhuma movimentação de estoque registrada até o momento.</p>
                                ) : filteredItems.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-border bg-muted dark:bg-slate-900/40 p-6 text-center text-sm text-muted-foreground">
                                        Nenhum item encontrado para os filtros aplicados.
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-border">
                                            <thead className="bg-blue-50/70 dark:bg-slate-950/60">
                                                <tr>
                                                    <th className="w-5/12 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Item</th>
                                                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Entradas</th>
                                                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Entregas</th>
                                                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Disponível</th>
                                                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mínimo</th>
                                                    <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Risco</th>
                                                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border bg-card">
                                                {filteredItems.map((item) => {
                                                    const minStock = Number(item.min_stock ?? 0);
                                                    const available = Number(item.available ?? 0);
                                                    const ratio = minStock > 0
                                                        ? Math.min(100, Math.round((available / minStock) * 100))
                                                        : null;
                                                    const deficit = minStock > 0 ? Math.max(0, minStock - available) : 0;

                                                    return (
                                                        <tr
                                                            key={item.id}
                                                            className={clsx('transition-colors hover:bg-muted/50 dark:hover:bg-slate-900/40', {
                                                                'bg-red-50/60 hover:bg-red-50 dark:bg-rose-500/10 dark:hover:bg-rose-500/15': item.is_below_min,
                                                            })}
                                                        >
                                                            <td className="w-5/12 px-4 py-3">
                                                                <p className="break-words text-sm font-semibold text-foreground">{item.name}</p>
                                                                {item.ca_number ? (
                                                                    <p className="text-xs text-muted-foreground">CA {item.ca_number}</p>
                                                                ) : null}
                                                            </td>
                                                            <td className="px-4 py-3 text-right text-sm text-muted-foreground">{item.total_entries}</td>
                                                            <td className="px-4 py-3 text-right text-sm text-muted-foreground">{item.total_deliveries}</td>
                                                            <td className="px-4 py-3 text-right text-sm font-semibold text-foreground">{available}</td>
                                                            <td className="px-4 py-3 text-right text-sm text-muted-foreground">{item.min_stock ?? '-'}</td>
                                                            <td className="px-4 py-3 text-center">
                                                                {ratio !== null ? (
                                                                    <div className="flex flex-col items-center gap-1">
                                                                        <div className="h-2 w-24 rounded-full bg-slate-100">
                                                                            <div
                                                                                className={clsx(
                                                                                    'h-2 rounded-full',
                                                                                    available < minStock ? 'bg-rose-500' : 'bg-emerald-500',
                                                                                )}
                                                                                style={{ width: `${ratio}%` }}
                                                                            />
                                                                        </div>
                                                                        <span className="text-[11px] text-muted-foreground">{ratio}%</span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-xs text-slate-400">—</span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                <div className="flex flex-col items-end gap-1">
                                                                    {item.is_below_min ? (
                                                                        <Badge variant="destructive">Abaixo do minimo</Badge>
                                                                    ) : (
                                                                        <Badge variant="outline">Ok</Badge>
                                                                    )}
                                                                    {deficit > 0 ? (
                                                                        <span className="text-xs font-medium text-rose-600">Deficit: {deficit}</span>
                                                                    ) : (
                                                                        <span className="text-xs text-emerald-600">Cobertura estavel</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="catalog" className="space-y-4 px-6 py-6">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-blue-50/70 dark:bg-slate-950/60">
                                                <TableHead>Nome</TableHead>
                                                <TableHead>Categoria</TableHead>
                                                <TableHead>CA</TableHead>
                                                <TableHead>Unidade</TableHead>
                                                <TableHead>Devolução (dias)</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {epis?.data?.length ? (
                                                epis.data.map((epi) => (
                                                    <TableRow key={epi.id} className="transition-colors hover:bg-muted/50 dark:hover:bg-slate-900/40">
                                                        <TableCell className="font-medium">{epi.name}</TableCell>
                                                        <TableCell>{epi.category ?? '-'}</TableCell>
                                                        <TableCell>{epi.ca_number ?? '-'}</TableCell>
                                                        <TableCell>{epi.unit}</TableCell>
                                                        <TableCell>{epi.return_days ?? '-'}</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex flex-wrap justify-end gap-2">
                                                                <Button asChild variant="outline" size="sm">
                                                                    <Link href={route('catalogoepi.show', epi.id)}>Ver</Link>
                                                                </Button>
                                                                <Button asChild variant="outline" size="sm">
                                                                    <Link href={route('catalogoepi.edit', epi.id)}>Editar</Link>
                                                                </Button>
                                                                <Button variant="destructive" size="sm" type="button" onClick={() => handleDeleteEpi(epi)}>
                                                                    Excluir
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                                                        Nenhum EPI cadastrado até o momento.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                {epis?.links && epis.links.length > 1 && (
                                    <nav className="flex flex-wrap gap-2 pt-4">
                                        {epis.links.map((link) => (
                                            <Link
                                                key={link.url ?? link.label}
                                                href={link.url ?? '#'}
                                                className={clsx(
                                                    'rounded-md border border-border px-3 py-1 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground',
                                                    {
                                                        'bg-blue-700 text-white hover:bg-blue-700': link.active,
                                                        'pointer-events-none opacity-50': !link.url,
                                                    },
                                                )}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                )}
                            </TabsContent>

                            <TabsContent value="categories" className="space-y-6 px-6 py-6">
                                <div className="space-y-2">
                                    <h3 className="text-base font-semibold text-foreground">Categorias de EPI</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200">
                                            <Tags className="mr-1 h-3 w-3" />
                                            {categories.length} categorias
                                        </Badge>
                                        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                                            <AlertTriangle className="mr-1 h-3 w-3" />
                                            {minAlerts} alertas de minimo
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Organize os EPIs em categorias e defina prazos de devolução padrão.</p>
                                </div>
                                <form onSubmit={submitCategory} className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="category_name" className="text-sm font-medium text-muted-foreground">Nome da categoria</label>
                                        <input
                                            id="category_name"
                                            type="text"
                                            className={inputBaseClass}
                                            value={categoryForm.data.name}
                                            onChange={(event) => categoryForm.setData('name', event.target.value)}
                                            required
                                        />
                                        <InputError message={categoryForm.errors.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="category_default_return_days" className="text-sm font-medium text-muted-foreground">
                                            Dias para devolução padrão (opcional)
                                        </label>
                                        <input
                                            id="category_default_return_days"
                                            type="number"
                                            min="0"
                                            className={inputBaseClass}
                                            value={categoryForm.data.default_return_days}
                                            onChange={(event) => categoryForm.setData('default_return_days', event.target.value)}
                                        />
                                        <InputError message={categoryForm.errors.default_return_days} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="category_description" className="text-sm font-medium text-muted-foreground">Descrição (opcional)</label>
                                        <textarea
                                            id="category_description"
                                            className={textareaBaseClass}
                                            value={categoryForm.data.description}
                                            onChange={(event) => categoryForm.setData('description', event.target.value)}
                                        />
                                        <InputError message={categoryForm.errors.description} />
                                    </div>
                                    <div className="flex items-center gap-3 md:col-span-2">
                                        <Button type="submit" disabled={categoryForm.processing}>
                                            {categoryForm.processing ? 'Salvando...' : editingCategory ? 'Atualizar categoria' : 'Salvar categoria'}
                                        </Button>
                                        {editingCategory && (
                                            <Button type="button" variant="outline" onClick={cancelEditingCategory}>Cancelar edição</Button>
                                        )}
                                    </div>
                                </form>
                                <div className="overflow-hidden rounded-lg border border-border">
                                    <table className="min-w-full divide-y divide-border">
                                        <thead className="bg-blue-50/70 dark:bg-slate-950/60">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categoria</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Devolução padrão</th>
                                                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border bg-card">
                                            {categories.length === 0 ? (
                                                <tr>
                                                    <td className="px-4 py-4 text-sm text-muted-foreground" colSpan={3}>Nenhuma categoria cadastrada.</td>
                                                </tr>
                                            ) : (
                                                categories.map((category) => (
                                                    <tr key={category.id} className="transition-colors hover:bg-muted/50 dark:hover:bg-slate-900/40">
                                                        <td className="px-4 py-3">
                                                            <p className="text-sm font-semibold text-foreground">{category.name}</p>
                                                            {category.description && <p className="text-xs text-muted-foreground">{category.description}</p>}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                                            {category.default_return_days !== null && category.default_return_days !== undefined
                                                                ? `${category.default_return_days} dias`
                                                                : 'Não definido'}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-sm">
                                                            <div className="flex justify-end gap-2">
                                                                <Button variant="outline" size="sm" onClick={() => startEditingCategory(category)}>Editar</Button>
                                                                <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category)} disabled={deleteCategoryForm.processing}>Excluir</Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
