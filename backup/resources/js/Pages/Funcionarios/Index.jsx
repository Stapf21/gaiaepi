import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function FuncionariosIndex({ stats = {}, employees }) {
    const pagination = employees?.links ?? [];

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Funcionários</h2>}>
            <Head title="Funcionários" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <div className="grid gap-4 md:grid-cols-4">
                    {[
                        { label: 'Total', value: stats.totalEmployees ?? 0 },
                        { label: 'Ativos', value: stats.activeEmployees ?? 0 },
                        { label: 'Empresas', value: stats.companies ?? 0 },
                        { label: 'Cargos', value: stats.positions ?? 0 },
                    ].map((item) => (
                        <Card key={item.label} className="shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    {item.label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Colaboradores
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Lista dos funcionários cadastrados e status atual.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href={route('funcionarios.create')}>
                                Novo funcionário
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[420px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
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
                                            <TableRow key={employee.id}>
                                                <TableCell className="font-medium">
                                                    <Link
                                                        href={employee.show_url}
                                                        className="text-slate-900 underline-offset-2 hover:underline"
                                                    >
                                                        {employee.name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {employee.company ?? '—'}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {employee.department ?? '—'}
                                                </TableCell>
                                                <TableCell>{employee.position ?? '—'}</TableCell>
                                                <TableCell>
                                                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium uppercase text-slate-700">
                                                        {employee.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    {employee.hire_date ?? '-'}
                                                </TableCell>
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
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
