import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, PackageSearch, ShieldCheck } from 'lucide-react';

function formatMoney(value) {
    if (value === null || value === undefined || value === '') {
        return '-';
    }

    const numeric = Number(value);

    if (Number.isNaN(numeric)) {
        return '-';
    }

    return numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function CatalogoEpiShow({ epi }) {
    const handleDelete = () => {
        if (!confirm(`Excluir o EPI "${epi?.name ?? ''}"?`)) {
            return;
        }
        router.delete(route('catalogoepi.destroy', epi.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Detalhes do EPI</h2>}>
            <Head title="Detalhes do EPI" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                                <PackageSearch className="mr-1 h-3 w-3" />
                                Detalhes do EPI
                            </Badge>
                            <Badge variant="outline" className="border-blue-100 bg-white text-blue-700">
                                <ShieldCheck className="mr-1 h-3 w-3" />
                                Consulta tecnica
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-semibold text-slate-900">{epi?.name ?? 'EPI'}</h1>
                        <p className="text-sm text-muted-foreground">{epi?.category ?? 'Sem categoria'}</p>
                    </div>
                    {epi?.requires_validation ? (
                        <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">Requer validacao</Badge>
                    ) : (
                        <Badge variant="secondary">Sem validacao</Badge>
                    )}
                </div>

                <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    <Card className="border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 shadow-sm">
                        <CardContent className="p-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Resumo tecnico</p>
                            <h2 className="mt-1 text-xl font-semibold text-slate-900">Visao consolidada do equipamento</h2>
                            <p className="mt-1 text-sm text-slate-600">Dados de identificacao, estoque e custo para consulta rapida.</p>

                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-lg border border-blue-100 bg-white px-3 py-2">
                                    <p className="text-xs text-blue-700">CA</p>
                                    <p className="text-sm font-semibold text-slate-900">{epi?.ca_number ?? '-'}</p>
                                </div>
                                <div className="rounded-lg border border-blue-100 bg-white px-3 py-2">
                                    <p className="text-xs text-blue-700">Unidade</p>
                                    <p className="text-sm font-semibold text-slate-900">{epi?.unit ?? '-'}</p>
                                </div>
                                <div className="rounded-lg border border-blue-100 bg-white px-3 py-2">
                                    <p className="text-xs text-blue-700">Custo unitario</p>
                                    <p className="text-sm font-semibold text-slate-900">{formatMoney(epi?.unit_cost)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium text-slate-700">Estoque</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2">
                                <span className="font-medium text-blue-700">Minimo</span>
                                <span className="font-semibold text-blue-700">{epi?.min_stock ?? '-'}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                                <span className="font-medium text-slate-700">Maximo</span>
                                <span className="font-semibold text-slate-700">{epi?.max_stock ?? '-'}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                                <span className="font-medium text-slate-700">Devolucao (dias)</span>
                                <span className="font-semibold text-slate-700">{epi?.return_days ?? '-'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-base font-semibold text-slate-800">Informacoes detalhadas</CardTitle>
                            <p className="text-sm text-muted-foreground">Dados completos do equipamento cadastrado.</p>
                        </div>
                        <ClipboardList className="h-5 w-5 text-slate-400" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500">Tamanho / medida</p>
                                <p className="text-sm font-medium text-slate-800">{epi?.size ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500">Categoria</p>
                                <p className="text-sm font-medium text-slate-800">{epi?.category ?? '-'}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Descricao</p>
                                <p className="text-sm text-slate-700">{epi?.description ?? 'Sem descricao.'}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <Button asChild variant="outline">
                                <Link href={route('catalogoepi.index')}>Voltar</Link>
                            </Button>
                            <div className="flex items-center gap-2">
                                <Button asChild variant="outline">
                                    <Link href={route('catalogoepi.edit', epi.id)}>Editar</Link>
                                </Button>
                                <Button variant="destructive" type="button" onClick={handleDelete}>
                                    Excluir
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
