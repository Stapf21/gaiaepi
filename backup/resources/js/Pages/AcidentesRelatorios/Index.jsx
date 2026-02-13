import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const severityColor = {
    leve: 'bg-emerald-100 text-emerald-700',
    moderado: 'bg-amber-100 text-amber-700',
    grave: 'bg-orange-100 text-orange-700',
    critico: 'bg-rose-100 text-rose-700',
};

const statusColor = {
    em_investigacao: 'bg-indigo-100 text-indigo-700',
    em_tratamento: 'bg-amber-100 text-amber-700',
    encerrado: 'bg-emerald-100 text-emerald-700',
};

export default function AcidentesRelatoriosIndex({ stats = {}, accidents }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Acidentes & Relatórios</h2>}>
            <Head title="Acidentes & Relatórios" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <Button asChild>
                        <Link href={route('acidentesrelatorios.create')}>
                            Registrar acidente
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    {[
                        { label: 'Total de acidentes', value: stats.totalAccidents ?? 0 },
                        { label: 'Em investigação', value: stats.openInvestigations ?? 0 },
                        { label: 'Encerrados', value: stats.closedAccidents ?? 0 },
                        { label: 'Tipos cadastrados', value: stats.types ?? 0 },
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
                        <CardTitle className="text-base font-semibold text-slate-800">
                            Ocorrências recentes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Protocolo</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Gravidade</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {accidents?.data?.length ? (
                                    accidents.data.map((accident) => (
                                        <TableRow key={accident.id}>
                                            <TableCell className="font-medium">{accident.protocol}</TableCell>
                                            <TableCell>{accident.type}</TableCell>
                                            <TableCell>{accident.occurred_at ?? '-'}</TableCell>
                                            <TableCell>
                                                <Badge className={severityColor[accident.severity] ?? 'bg-slate-200 text-slate-700'}>
                                                    {accident.severity}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={statusColor[accident.status] ?? 'bg-slate-200 text-slate-700'}>
                                                    {accident.status.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                                            Nenhum acidente registrado.
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
