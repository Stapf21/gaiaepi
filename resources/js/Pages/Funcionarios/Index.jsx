import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, BriefcaseBusiness, Building2, Search, ShieldCheck, UserPlus, Users } from 'lucide-react';

function getStatusTone(status) {
    const value = String(status ?? '').toLowerCase();

    if (value.includes('ativo')) {
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    }

    if (value.includes('afast') || value.includes('susp')) {
        return 'bg-amber-50 text-amber-700 border border-amber-100';
    }

    if (value.includes('inativ') || value.includes('deslig')) {
        return 'bg-rose-50 text-rose-700 border border-rose-100';
    }

    return 'bg-slate-100 text-slate-700 border border-slate-200';
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
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                                <Users className="mr-1 h-3 w-3" />
                                Gestão de pessoas
                            </Badge>
                            <Badge variant="outline" className="border-blue-100 bg-white text-blue-700">
                                <ShieldCheck className="mr-1 h-3 w-3" />
                                Operação ativa
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-semibold text-slate-900">Colaboradores</h1>
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
                            cardClass: 'border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50',
                            iconClass: 'text-blue-700',
                        },
                        {
                            label: 'Ativos',
                            value: activeEmployees,
                            icon: Activity,
                            cardClass: 'border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50',
                            iconClass: 'text-emerald-700',
                        },
                        {
                            label: 'Empresas',
                            value: companies,
                            icon: Building2,
                            cardClass: 'border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50',
                            iconClass: 'text-indigo-700',
                        },
                        {
                            label: 'Cargos',
                            value: positions,
                            icon: BriefcaseBusiness,
                            cardClass: 'border-violet-100 bg-gradient-to-br from-violet-50 via-white to-blue-50',
                            iconClass: 'text-violet-700',
                        },
                    ].map((item) => {
                        const Icon = item.icon;

                        return (
                            <Card key={item.label} className={clsx('shadow-sm', item.cardClass)}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                                            {item.label}
                                        </CardTitle>
                                        <Icon className={clsx('h-4 w-4', item.iconClass)} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-semibold text-slate-900">{item.value}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    <Card className="border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 shadow-sm">
                        <CardContent className="p-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Resumo da equipe</p>
                            <h2 className="mt-1 text-xl font-semibold text-slate-900">Panorama de colaboradores</h2>
                            <p className="mt-1 text-sm text-slate-600">Taxa de funcionários ativos com base no cadastro atual.</p>

                            <div className="mt-4">
                                <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
                                    <span>Ativos: {activeEmployees}</span>
                                    <span>Inativos: {inactiveEmployees}</span>
                                </div>
                                <div className="h-2.5 w-full rounded-full bg-slate-200">
                                    <div className="h-2.5 rounded-full bg-blue-600 transition-all" style={{ width: `${activeRate}%` }} />
                                </div>
                                <p className="mt-2 text-xs font-medium text-blue-700">{activeRate}% da equipe em operação</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium text-slate-700">Visão rápida</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 text-sm">
                                <span className="font-medium text-blue-700">Exibindo agora</span>
                                <span className="font-semibold text-blue-700">{visibleEmployees}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                                <span className="font-medium text-slate-700">Filtro ativo</span>
                                <span className="font-semibold text-slate-700">{search ? 'Sim' : 'Não'}</span>
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
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="search"
                                    placeholder="Buscar por nome ou matrícula"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    className="w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto rounded-lg border border-slate-200">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-blue-50/70">
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
                                            <TableRow key={employee.id} className="transition-colors hover:bg-slate-50">
                                                <TableCell className="font-medium">
                                                    <Link
                                                        href={employee.show_url}
                                                        className="text-slate-900 underline-offset-2 hover:underline"
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
                                            'rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-600 transition hover:bg-slate-100',
                                            {
                                                'bg-blue-700 text-white hover:bg-blue-700': link.active,
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
                                            'rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-600 transition hover:bg-slate-100',
                                            { 'pointer-events-none opacity-50': !prevNext.prev },
                                        )}
                                    >
                                        Anterior
                                    </Link>
                                    <Link
                                        href={prevNext.next ?? '#'}
                                        className={clsx(
                                            'rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-600 transition hover:bg-slate-100',
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
