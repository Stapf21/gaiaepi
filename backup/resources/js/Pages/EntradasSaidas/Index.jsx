import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Pencil, Trash2 } from 'lucide-react';

const statusColor = {
    entregue: 'bg-indigo-100 text-indigo-700',
    em_uso: 'bg-amber-100 text-amber-700',
    devolvido: 'bg-emerald-100 text-emerald-700',
    perdido: 'bg-rose-100 text-rose-700',
};

const formatStatus = (status) => status.replace('_', ' ');

const totalItems = (items = []) =>
    items.reduce((total, item) => total + (item.quantity ?? 0), 0);

export default function EntradasSaidasIndex({ stats = {}, deliveries }) {
    const deleteForm = useForm({});

    const handleDelete = (url) => {
        if (!url) {
            return;
        }

        if (!window.confirm('Deseja realmente excluir esta movimentacao? Essa acao nao pode ser desfeita.')) {
            return;
        }

        deleteForm.delete(url, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Entradas & Saidas</h2>}>
            <Head title="Entradas & Saidas" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        { label: 'Entradas registradas', value: stats.entries ?? 0 },
                        { label: 'Saidas realizadas', value: stats.deliveries ?? 0 },
                        { label: 'Pendencias de devolucao', value: stats.openReturns ?? 0 },
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
                            Ultimas movimentacoes de saida
                        </CardTitle>
                        <Button asChild>
                            <Link href={route('entradassaidas.create')}>
                                Registrar movimentacao
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Codigo</TableHead>
                                    <TableHead>Itens entregues</TableHead>
                                    <TableHead>Colaborador</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Entrega</TableHead>
                                    <TableHead>Retorno previsto</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Acoes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {deliveries?.data?.length ? (
                                    deliveries.data.map((delivery) => (
                                        <TableRow key={delivery.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={delivery.show_url}
                                                    className="text-indigo-600 hover:underline"
                                                >
                                                    {delivery.code ?? `#${delivery.id}`}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {delivery.items?.length ? (
                                                        delivery.items.map((item) => (
                                                            <div key={item.id} className="text-sm leading-5">
                                                                {item.name}{' '}
                                                                <span className="text-xs text-slate-500">
                                                                    (x{item.quantity})
                                                                </span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-sm text-slate-500">-</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{delivery.employee ?? '-'}</TableCell>
                                            <TableCell>{totalItems(delivery.items)}</TableCell>
                                            <TableCell>{delivery.delivered_at ?? '-'}</TableCell>
                                            <TableCell>{delivery.expected_return_at ?? '-'}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={statusColor[delivery.status] ?? 'bg-slate-200 text-slate-700'}>
                                                        {formatStatus(delivery.status)}
                                                    </Badge>
                                                    {delivery.document?.url ? (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                            title="Ver documento"
                                                        >
                                                            <a
                                                                href={delivery.document.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <FileText className="h-4 w-4 text-slate-600" />
                                                            </a>
                                                        </Button>
                                                    ) : null}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" asChild title="Editar movimentacao">
                                                        <Link href={delivery.edit_url}>
                                                            <Pencil className="h-4 w-4 text-slate-600" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Excluir movimentacao"
                                                        onClick={() => handleDelete(delivery.destroy_url)}
                                                        disabled={deleteForm.processing}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-rose-600" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-sm text-muted-foreground">
                                            Nenhuma movimentacao encontrada.
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
