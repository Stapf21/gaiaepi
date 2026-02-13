import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function CatalogoEpiIndex({ stats = {}, epis }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Catálogo de EPIs</h2>}>
            <Head title="Catálogo de EPIs" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        { label: 'EPIs cadastrados', value: stats.totalEpis ?? 0 },
                        { label: 'Categorias', value: stats.categories ?? 0 },
                        { label: 'Alertas de estoque mínimo', value: stats.stockMinAlerts ?? 0 },
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
                                Inventário
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Lista dos EPIs cadastrados e dados principais.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href={route('catalogoepi.create')}>
                                Novo EPI
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>CA</TableHead>
                                    <TableHead>Unidade</TableHead>
                                    <TableHead>Devolução (dias)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {epis?.data?.length ? (
                                    epis.data.map((epi) => (
                                        <TableRow key={epi.id}>
                                            <TableCell className="font-medium">{epi.name}</TableCell>
                                            <TableCell>{epi.category ?? '—'}</TableCell>
                                            <TableCell>{epi.ca_number ?? '—'}</TableCell>
                                            <TableCell>{epi.unit}</TableCell>
                                            <TableCell>{epi.return_days ?? '—'}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                                            Nenhum EPI cadastrado até o momento.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
