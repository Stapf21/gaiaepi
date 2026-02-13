import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const statusLabel = {
    agendado: 'Agendado',
    concluido: 'Concluído',
    atrasado: 'Atrasado',
    cancelado: 'Cancelado',
    apto: 'Apto',
    inapto: 'Inapto',
    pendente: 'Pendente',
};

export default function TreinamentosExamesIndex({ stats = {}, trainings, exams }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Treinamentos & Exames</h2>}>
            <Head title="Treinamentos & Exames" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <Button asChild>
                        <Link href={route('treinamentosexames.create')}>
                            Novo treinamento ou exame
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        { label: 'Treinamentos agendados', value: stats.trainingsScheduled ?? 0 },
                        { label: 'Exames agendados', value: stats.examsScheduled ?? 0 },
                        { label: 'Treinamentos concluídos', value: stats.trainingsCompleted ?? 0 },
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

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Próximos treinamentos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Treinamento</TableHead>
                                        <TableHead>Colaborador</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {trainings?.data?.length ? (
                                        trainings.data.map((training) => (
                                            <TableRow key={training.id}>
                                                <TableCell className="font-medium">{training.title}</TableCell>
                                                <TableCell>{training.employee}</TableCell>
                                                <TableCell>{training.scheduled_at ?? '-'}</TableCell>
                                                <TableCell>
                                                    <Badge>{statusLabel[training.status] ?? training.status}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                                                Nenhum treinamento agendado.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Próximos exames
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Exame</TableHead>
                                        <TableHead>Colaborador</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {exams?.data?.length ? (
                                        exams.data.map((exam) => (
                                            <TableRow key={exam.id}>
                                                <TableCell className="font-medium">{exam.title}</TableCell>
                                                <TableCell>{exam.employee}</TableCell>
                                                <TableCell>{exam.scheduled_at ?? '-'}</TableCell>
                                                <TableCell>
                                                    <Badge>{statusLabel[exam.status] ?? exam.status}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                                                Nenhum exame agendado.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
