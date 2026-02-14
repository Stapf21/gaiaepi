import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import InputError from '@/Components/InputError.jsx';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { inputBaseClass, textareaBaseClass } from '@/lib/formStyles';
import { ClipboardList, PackagePlus, ShieldCheck } from 'lucide-react';

export default function Entrada({ epis = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        epi_id: '',
        quantity: 1,
        unit_cost: '',
        supplier: '',
        invoice_number: '',
        invoice_date: '',
        acquired_at: new Date().toISOString().slice(0, 10),
        expires_at: '',
        notes: '',
    });

    const selectedEpi = useMemo(
        () => epis.find((epi) => Number(epi.id) === Number(data.epi_id)),
        [data.epi_id, epis],
    );

    const estimatedTotal = useMemo(() => {
        const quantity = Number(data.quantity ?? 0);
        const unitCost = Number(data.unit_cost ?? 0);

        if (!quantity || !unitCost) {
            return null;
        }

        return (quantity * unitCost).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }, [data.quantity, data.unit_cost]);

    const submit = (event) => {
        event.preventDefault();

        post(route('administrativo.estoque.entrada.store'), {
            preserveScroll: true,
            onSuccess: () =>
                reset({
                    epi_id: '',
                    quantity: 1,
                    unit_cost: '',
                    supplier: '',
                    invoice_number: '',
                    invoice_date: '',
                    acquired_at: new Date().toISOString().slice(0, 10),
                    expires_at: '',
                    notes: '',
                }),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Administrativo</h2>}>
            <Head title="Entrada de estoque" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200">
                                <PackagePlus className="mr-1 h-3 w-3" />
                                Entrada de estoque
                            </Badge>
                            <Badge variant="outline" className="border-blue-100 bg-white text-blue-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200">
                                <ShieldCheck className="mr-1 h-3 w-3" />
                                Registro operacional
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-semibold text-foreground">Registrar entrada</h1>
                        <p className="text-sm text-muted-foreground">Informe os dados da compra ou reposicao para atualizar o saldo.</p>
                    </div>
                </div>

                <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    <Card className="border-border bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40 shadow-sm">
                        <CardContent className="p-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Resumo da entrada</p>
                            <h2 className="mt-1 text-xl font-semibold text-foreground">Conferencia antes do registro</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Selecione o item e preencha os dados para registrar no estoque.</p>

                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-lg border border-border bg-card/70 dark:bg-slate-950/40 px-3 py-2">
                                    <p className="text-xs text-blue-700">EPI selecionado</p>
                                    <p className="text-sm font-semibold text-foreground">{selectedEpi?.name ?? '-'}</p>
                                </div>
                                <div className="rounded-lg border border-border bg-card/70 dark:bg-slate-950/40 px-3 py-2">
                                    <p className="text-xs text-blue-700">Quantidade</p>
                                    <p className="text-sm font-semibold text-foreground">{data.quantity || 0}</p>
                                </div>
                                <div className="rounded-lg border border-border bg-card/70 dark:bg-slate-950/40 px-3 py-2">
                                    <p className="text-xs text-blue-700">Valor estimado</p>
                                    <p className="text-sm font-semibold text-foreground">{estimatedTotal ?? '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium text-muted-foreground">Checklist</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-muted-foreground">
                            <div className="rounded-lg bg-blue-50/70 dark:bg-blue-500/10 px-3 py-2">
                                <p className="font-medium text-blue-700">Campos obrigatorios</p>
                                <p>EPI e quantidade.</p>
                            </div>
                            <div className="rounded-lg bg-muted dark:bg-slate-900/40 px-3 py-2">
                                <p className="font-medium text-muted-foreground">Campos recomendados</p>
                                <p>Custo, fornecedor e documento fiscal.</p>
                            </div>
                            <div className="rounded-lg bg-amber-50/70 dark:bg-amber-500/10 px-3 py-2">
                                <p className="font-medium text-amber-700">Validade</p>
                                <p>Preencha a validade para itens com vencimento.</p>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-base font-semibold text-foreground">Formulario de entrada</CardTitle>
                            <p className="text-sm text-muted-foreground">Dados da compra, documento e observacoes.</p>
                        </div>
                        <ClipboardList className="h-5 w-5 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="entry_epi" className="text-sm font-medium text-muted-foreground">EPI</label>
                                    <select
                                        id="entry_epi"
                                        className={inputBaseClass}
                                        value={data.epi_id}
                                        onChange={(event) =>
                                            setData('epi_id', event.target.value ? Number(event.target.value) : '')
                                        }
                                        required
                                    >
                                        <option value="">Selecione...</option>
                                        {epis.map((epi) => (
                                            <option key={epi.id} value={epi.id}>
                                                {epi.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.epi_id} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="entry_quantity" className="text-sm font-medium text-muted-foreground">Quantidade</label>
                                    <input
                                        id="entry_quantity"
                                        type="number"
                                        min="1"
                                        className={inputBaseClass}
                                        value={data.quantity}
                                        onChange={(event) =>
                                            setData('quantity', event.target.value ? Number(event.target.value) : '')
                                        }
                                        required
                                    />
                                    <InputError message={errors.quantity} />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="entry_unit_cost" className="text-sm font-medium text-muted-foreground">Custo unitario (R$)</label>
                                    <input
                                        id="entry_unit_cost"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className={inputBaseClass}
                                        value={data.unit_cost}
                                        onChange={(event) => setData('unit_cost', event.target.value)}
                                    />
                                    <InputError message={errors.unit_cost} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="entry_supplier" className="text-sm font-medium text-muted-foreground">Fornecedor (opcional)</label>
                                    <input
                                        id="entry_supplier"
                                        type="text"
                                        className={inputBaseClass}
                                        value={data.supplier}
                                        onChange={(event) => setData('supplier', event.target.value)}
                                    />
                                    <InputError message={errors.supplier} />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="entry_invoice_number" className="text-sm font-medium text-muted-foreground">Nota fiscal / documento (opcional)</label>
                                    <input
                                        id="entry_invoice_number"
                                        type="text"
                                        className={inputBaseClass}
                                        value={data.invoice_number}
                                        onChange={(event) => setData('invoice_number', event.target.value)}
                                    />
                                    <InputError message={errors.invoice_number} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="entry_invoice_date" className="text-sm font-medium text-muted-foreground">Data do documento (opcional)</label>
                                    <input
                                        id="entry_invoice_date"
                                        type="date"
                                        className={inputBaseClass}
                                        value={data.invoice_date}
                                        onChange={(event) => setData('invoice_date', event.target.value)}
                                    />
                                    <InputError message={errors.invoice_date} />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="entry_acquired_at" className="text-sm font-medium text-muted-foreground">Data de aquisicao (opcional)</label>
                                    <input
                                        id="entry_acquired_at"
                                        type="date"
                                        className={inputBaseClass}
                                        value={data.acquired_at}
                                        onChange={(event) => setData('acquired_at', event.target.value)}
                                    />
                                    <InputError message={errors.acquired_at} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="entry_expires_at" className="text-sm font-medium text-muted-foreground">Validade do EPI (opcional)</label>
                                    <input
                                        id="entry_expires_at"
                                        type="date"
                                        className={inputBaseClass}
                                        value={data.expires_at}
                                        onChange={(event) => setData('expires_at', event.target.value)}
                                    />
                                    <InputError message={errors.expires_at} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="entry_notes" className="text-sm font-medium text-muted-foreground">Observacoes (opcional)</label>
                                <textarea
                                    id="entry_notes"
                                    className={textareaBaseClass}
                                    rows={3}
                                    value={data.notes}
                                    onChange={(event) => setData('notes', event.target.value)}
                                />
                                <InputError message={errors.notes} />
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-3">
                                <Button type="button" variant="outline" asChild>
                                    <Link href={route('administrativo.estoque.index')}>Voltar</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Registrando...' : 'Registrar entrada'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
