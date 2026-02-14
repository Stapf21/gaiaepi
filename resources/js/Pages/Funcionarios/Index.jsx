import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { inputBaseClass } from '@/lib/formStyles';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, BriefcaseBusiness, Building2, Search, ShieldCheck, UserPlus, Users } from 'lucide-react';

function getStatusTone(status) {
    const value = String(status ?? '').toLowerCase();

    if (value.includes('ativo')) {
        return 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200';
    }

    if (value.includes('afast') || value.includes('susp')) {
        return 'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200';
    }

    if (value.includes('inativ') || value.includes('deslig')) {
        return 'border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200';
    }

    return 'border border-border bg-muted text-foreground dark:bg-slate-950/40';
}

export default function FuncionariosIndex({ stats = {}, employees, pagination, filters = {} }) {
    const paginationLinks = Array.isArray(pagination?.links)
        ? pagination.links
        : Array.isArray(employees?.links)
            ? employees.links
            : Array.isArray(employees?.meta?.links)
                ? employees.meta.links
                : [];

    const [search, setSearch] = useState(filters?.search ?? '');
    const firstLoad = useRef(true);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(route('funcionarios.index'), { search: search || undefined }, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

    const prevNext = {
        prev: pagination?.prev
            ?? employees?.prev_page_url
            ?? employees?.links?.prev
            ?? employees?.meta?.prev
            ?? null,
        next: pagination?.next
            ?? employees?.next_page_url
            ?? employees?.links?.next
            ?? employees?.meta?.next
            ?? null,
    };

    const totalEmployees = Number(stats.totalEmployees ?? 0);
    const activeEmployees = Number(stats.activeEmployees ?? 0);
    const companies = Number(stats.companies ?? 0);
    const positions = Number(stats.positions ?? 0);
    const inactiveEmployees = Math.max(0, totalEmployees - activeEmployees);
    const visibleEmployees = Number(employees?.data?.length ?? 0);

    const activeRate = useMemo(() => {
        if (totalEmployees <= 0) {
            return 0;
        }

        return Math.min(100, Math.round((activeEmployees / totalEmployees) * 100));
    }, [activeEmployees, totalEmployees]);

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Funcionários</h2>}>
            <Head title="Funcionários" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200">
                                <Users className="mr-1 h-3 w-3" />
                                Gestão de pessoas
                            </Badge>
                            <Badge variant="outline" className="border-blue-100 bg-white text-blue-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200">
                                <ShieldCheck className="mr-1 h-3 w-3" />
                                Operação ativa
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-semibold text-foreground">Colaboradores</h1>
                        <p className="text-sm text-muted-foreground">Acompanhe funcionários, alocações e situação operacional.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('funcionarios.create')}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Novo funcionário
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            label: 'Total',
                            value: totalEmployees,
                            icon: Users,
                            cardClass: 'border-border bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40',
                            iconClass: 'text-blue-700',
                        },
                        {
                            label: 'Ativos',
                            value: activeEmployees,
                            icon: Activity,
                            cardClass: 'border-border bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40',
                            iconClass: 'text-emerald-700',
                        },
                        {
                            label: 'Empresas',
                            value: companies,
                            icon: Building2,
                            cardClass: 'border-border bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40',
                            iconClass: 'text-indigo-700',
                        },
                        {
                            label: 'Cargos',
                            value: positions,
                            icon: BriefcaseBusiness,
                            cardClass: 'border-border bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40',
                            iconClass: 'text-violet-700',
                        },
                    ].map((item) => {
                        const Icon = item.icon;

                        return (
                            <Card key={item.label} className={clsx('shadow-sm', item.cardClass)}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                            {item.label}
                                        </CardTitle>
                                        <Icon className={clsx('h-4 w-4', item.iconClass)} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-semibold text-foreground">{item.value}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    <Card className="border-border bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40 shadow-sm">
                        <CardContent className="p-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Resumo da equipe</p>
                            <h2 className="mt-1 text-xl font-semibold text-foreground">Panorama de colaboradores</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Taxa de funcionários ativos com base no cadastro atual.</p>

                            <div className="mt-4">
                                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Ativos: {activeEmployees}</span>
                                    <span>Inativos: {inactiveEmployees}</span>
                                </div>
                                <div className="h-2.5 w-full rounded-full bg-muted">
                                    <div className="h-2.5 rounded-full bg-blue-600 transition-all" style={{ width: `${activeRate}%` }} />
                                </div>
                                <p className="mt-2 text-xs font-medium text-blue-700">{activeRate}% da equipe em operação</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium text-muted-foreground">Visão rápida</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg border border-blue-200/40 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10 px-3 py-2 text-sm">
                                <span className="font-medium text-blue-700">Exibindo agora</span>
                                <span className="font-semibold text-blue-700">{visibleEmployees}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 dark:bg-slate-950/40 px-3 py-2 text-sm">
                                <span className="font-medium text-muted-foreground">Filtro ativo</span>
                                <span className="font-semibold text-muted-foreground">{search ? 'Sim' : 'Não'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold text-slate-800">Lista de colaboradores</CardTitle>
                            <p className="text-sm text-muted-foreground">Pesquise por nome ou matrícula para localizar rapidamente.</p>
                        </div>
                        <div className="w-full sm:w-80">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="search"
                                    placeholder="Buscar por nome ou matrícula"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    className={clsx(inputBaseClass, 'pl-9')}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto rounded-lg border border-border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-blue-50/70 dark:bg-slate-950/60">
                                        <TableHead>Nome</TableHead>
                                        <TableHead className="hidden md:table-cell">Empresa</TableHead>
                                        <TableHead className="hidden md:table-cell">Departamento</TableHead>
                                        <TableHead>Cargo</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="hidden sm:table-cell">Admissão</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employees?.data?.length ? (
                                        employees.data.map((employee) => (
                                            <TableRow key={employee.id} className="transition-colors">
                                                <TableCell className="font-medium">
                                                    <Link
                                                        href={employee.show_url}
                                                        className="text-foreground underline-offset-2 hover:underline"
                                                    >
                                                        {employee.name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">{employee.company ?? '-'}</TableCell>
                                                <TableCell className="hidden md:table-cell">{employee.department ?? '-'}</TableCell>
                                                <TableCell>{employee.position ?? '-'}</TableCell>
                                                <TableCell>
                                                    <span className={clsx('rounded-full px-2 py-1 text-xs font-medium uppercase', getStatusTone(employee.status))}>
                                                        {employee.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">{employee.hire_date ?? '-'}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={employee.edit_url}>Editar</Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                                                Nenhum registro encontrado.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {paginationLinks.length > 0 ? (
                            <nav className="flex flex-wrap gap-2 pt-4">
                                {paginationLinks.map((link) => (
                                    <Link
                                        key={link.url ?? link.label}
                                        href={link.url ?? '#'}
                                        className={clsx(
                                            'rounded-md border border-border px-3 py-1 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground',
                                            {
                                                'bg-blue-700 text-white hover:bg-blue-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90': link.active,
                                                'pointer-events-none opacity-50': !link.url,
                                            },
                                        )}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        ) : (
                            (prevNext.prev || prevNext.next) && (
                                <nav className="flex flex-wrap gap-2 pt-4">
                                    <Link
                                        href={prevNext.prev ?? '#'}
                                        className={clsx(
                                            'rounded-md border border-border px-3 py-1 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground',
                                            { 'pointer-events-none opacity-50': !prevNext.prev },
                                        )}
                                    >
                                        Anterior
                                    </Link>
                                    <Link
                                        href={prevNext.next ?? '#'}
                                        className={clsx(
                                            'rounded-md border border-border px-3 py-1 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground',
                                            { 'pointer-events-none opacity-50': !prevNext.next },
                                        )}
                                    >
                                        Próximo
                                    </Link>
                                </nav>
                            )
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
