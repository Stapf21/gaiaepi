import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, ClipboardList, PackagePlus, ShieldCheck, Tags } from 'lucide-react';

export default function CatalogoEpiIndex({ stats = {}, epis }) {
    const totalEpis = Number(stats.totalEpis ?? 0);
    const categories = Number(stats.categories ?? 0);
    const stockMinAlerts = Number(stats.stockMinAlerts ?? 0);

    const withCa = useMemo(
        () => (epis?.data ?? []).filter((epi) => Boolean(epi.ca_number)).length,
        [epis?.data],
    );

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Catálogo de EPIs</h2>}>
            <Head title="Catálogo de EPIs" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200">
                                <ClipboardList className="mr-1 h-3 w-3" />
                                Catálogo técnico
                            </Badge>
                            <Badge variant="outline" className="border-blue-100 bg-card text-blue-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200">
                                <ShieldCheck className="mr-1 h-3 w-3" />
                                Controle de itens
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-semibold text-foreground">Catálogo de EPIs</h1>
                        <p className="text-sm text-muted-foreground">Acompanhe itens cadastrados, categorias e sinalizadores de estoque.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('catalogoepi.create')}>
                            <PackagePlus className="mr-2 h-4 w-4" />
                            Novo EPI
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-border bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">EPIs cadastrados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-foreground">{totalEpis}</p>
                            <p className="text-xs text-muted-foreground">Total de equipamentos disponíveis no catálogo.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Categorias</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-foreground">{categories}</p>
                            <p className="text-xs text-muted-foreground">Organização por tipo e uso operacional.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-gradient-to-br from-rose-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Alertas de estoque mínimo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-foreground">{stockMinAlerts}</p>
                            <p className="text-xs text-muted-foreground">Itens com necessidade de reposição.</p>
                        </CardContent>
                    </Card>
                </div>

                <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    <Card className="border-border bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40 shadow-sm">
                        <CardContent className="p-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Panorama do catálogo</p>
                            <h2 className="mt-1 text-xl font-semibold text-foreground">Visão consolidada dos equipamentos</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Consistência do cadastro e distribuição dos itens por categoria.</p>

                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-lg border border-border bg-card/70 dark:bg-slate-950/40 px-3 py-2">
                                    <p className="text-xs text-blue-700">Com número de CA</p>
                                    <p className="text-sm font-semibold text-foreground">{withCa}</p>
                                </div>
                                <div className="rounded-lg border border-border bg-card/70 dark:bg-slate-950/40 px-3 py-2">
                                    <p className="text-xs text-blue-700">Sem número de CA</p>
                                    <p className="text-sm font-semibold text-foreground">{Math.max(0, totalEpis - withCa)}</p>
                                </div>
                                <div className="rounded-lg border border-border bg-card/70 dark:bg-slate-950/40 px-3 py-2">
                                    <p className="text-xs text-blue-700">Média por categoria</p>
                                    <p className="text-sm font-semibold text-foreground">
                                        {categories > 0 ? (totalEpis / categories).toFixed(1) : '0.0'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium text-muted-foreground">Sinalizadores</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2">
                                <span className="inline-flex items-center gap-2 font-medium text-rose-700">
                                    <AlertTriangle className="h-4 w-4" />
                                    Alertas ativos
                                </span>
                                <span className="font-semibold text-rose-700">{stockMinAlerts}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-blue-50/70 dark:bg-blue-500/10 px-3 py-2">
                                <span className="inline-flex items-center gap-2 font-medium text-blue-700">
                                    <Tags className="h-4 w-4" />
                                    Categorias
                                </span>
                                <span className="font-semibold text-blue-700">{categories}</span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-foreground">Inventário</CardTitle>
                        <p className="text-sm text-muted-foreground">Lista dos EPIs cadastrados com dados principais e acesso rápido.</p>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto rounded-lg border border-border">
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
                                                <TableCell className="font-medium text-foreground">{epi.name}</TableCell>
                                                <TableCell>{epi.category ?? '-'}</TableCell>
                                                <TableCell>{epi.ca_number ?? '-'}</TableCell>
                                                <TableCell>{epi.unit}</TableCell>
                                                <TableCell>{epi.return_days ?? '-'}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button asChild variant="outline" size="sm">
                                                            <Link href={route('catalogoepi.show', epi.id)}>Ver</Link>
                                                        </Button>
                                                        <Button asChild variant="outline" size="sm">
                                                            <Link href={route('catalogoepi.edit', epi.id)}>Editar</Link>
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
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
