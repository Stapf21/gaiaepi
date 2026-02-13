import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import InputError from '@/Components/InputError.jsx';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { inputBaseClass, textareaBaseClass } from '@/lib/formStyles';
import { ClipboardList, PackagePlus, ShieldCheck, Tags } from 'lucide-react';

export default function CatalogoEpiCreate({ categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        name: '',
        ca_number: '',
        description: '',
        unit: 'unidade',
        size: '',
        min_stock: '',
        max_stock: '',
        return_days: '',
        requires_validation: false,
        unit_cost: '',
    });

    const selectedCategory = useMemo(
        () => categories.find((category) => Number(category.id) === Number(data.category_id)),
        [categories, data.category_id],
    );

    const hasStockRangeConflict = useMemo(() => {
        const minStock = Number(data.min_stock ?? 0);
        const maxStock = Number(data.max_stock ?? 0);

        if (!data.min_stock || !data.max_stock) {
            return false;
        }

        return maxStock < minStock;
    }, [data.max_stock, data.min_stock]);

    const submit = (event) => {
        event.preventDefault();
        post(route('catalogoepi.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Novo EPI</h2>}>
            <Head title="Cadastrar EPI" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                                <PackagePlus className="mr-1 h-3 w-3" />
                                Cadastro de EPI
                            </Badge>
                            <Badge variant="outline" className="border-blue-100 bg-white text-blue-700">
                                <ShieldCheck className="mr-1 h-3 w-3" />
                                Controle padrao
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-semibold text-slate-900">Novo EPI</h1>
                        <p className="text-sm text-muted-foreground">Registre os dados do equipamento para estoque e rastreabilidade.</p>
                    </div>
                </div>

                <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    <Card className="border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 shadow-sm">
                        <CardContent className="p-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Resumo do cadastro</p>
                            <h2 className="mt-1 text-xl font-semibold text-slate-900">Conferencia dos campos</h2>
                            <p className="mt-1 text-sm text-slate-600">Valide categoria, identificacao e parametros de estoque antes de salvar.</p>

                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-lg border border-blue-100 bg-white px-3 py-2">
                                    <p className="text-xs text-blue-700">Categoria</p>
                                    <p className="text-sm font-semibold text-slate-900">{selectedCategory?.name ?? '-'}</p>
                                </div>
                                <div className="rounded-lg border border-blue-100 bg-white px-3 py-2">
                                    <p className="text-xs text-blue-700">Unidade</p>
                                    <p className="text-sm font-semibold text-slate-900">{data.unit || '-'}</p>
                                </div>
                                <div className="rounded-lg border border-blue-100 bg-white px-3 py-2">
                                    <p className="text-xs text-blue-700">Validacao periodica</p>
                                    <p className="text-sm font-semibold text-slate-900">{data.requires_validation ? 'Sim' : 'Nao'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium text-slate-700">Checklist</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-slate-600">
                            <div className="rounded-lg bg-blue-50 px-3 py-2">
                                <p className="font-medium text-blue-700">Obrigatorios</p>
                                <p>Categoria, nome e unidade.</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 px-3 py-2">
                                <p className="font-medium text-slate-700">Recomendados</p>
                                <p>CA, estoque minimo e custo unitario.</p>
                            </div>
                            <div className="rounded-lg bg-amber-50 px-3 py-2">
                                <p className="font-medium text-amber-700">Atencao</p>
                                <p>Estoque maximo nao deve ser menor que o minimo.</p>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-base font-semibold text-slate-800">Informacoes do equipamento</CardTitle>
                            <p className="text-sm text-muted-foreground">Dados principais do EPI para controle e reposicao.</p>
                        </div>
                        <ClipboardList className="h-5 w-5 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-8">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="category_id" className="text-sm font-medium text-slate-700">Categoria</label>
                                    <select
                                        id="category_id"
                                        className={inputBaseClass}
                                        value={data.category_id}
                                        onChange={(event) => setData('category_id', event.target.value ? Number(event.target.value) : '')}
                                        required
                                    >
                                        <option value="">Selecione...</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category_id} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-slate-700">Nome do EPI</label>
                                    <input
                                        id="name"
                                        type="text"
                                        className={inputBaseClass}
                                        value={data.name}
                                        onChange={(event) => setData('name', event.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="ca_number" className="text-sm font-medium text-slate-700">Numero do CA</label>
                                    <input
                                        id="ca_number"
                                        type="text"
                                        className={inputBaseClass}
                                        value={data.ca_number}
                                        onChange={(event) => setData('ca_number', event.target.value)}
                                    />
                                    <InputError message={errors.ca_number} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="unit" className="text-sm font-medium text-slate-700">Unidade</label>
                                    <input
                                        id="unit"
                                        type="text"
                                        className={inputBaseClass}
                                        value={data.unit}
                                        onChange={(event) => setData('unit', event.target.value)}
                                        required
                                    />
                                    <InputError message={errors.unit} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="size" className="text-sm font-medium text-slate-700">Tamanho / medida</label>
                                    <input
                                        id="size"
                                        type="text"
                                        className={inputBaseClass}
                                        value={data.size}
                                        onChange={(event) => setData('size', event.target.value)}
                                    />
                                    <InputError message={errors.size} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="min_stock" className="text-sm font-medium text-slate-700">Estoque minimo</label>
                                    <input
                                        id="min_stock"
                                        type="number"
                                        min="0"
                                        className={inputBaseClass}
                                        value={data.min_stock}
                                        onChange={(event) => setData('min_stock', event.target.value)}
                                    />
                                    <InputError message={errors.min_stock} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="max_stock" className="text-sm font-medium text-slate-700">Estoque maximo</label>
                                    <input
                                        id="max_stock"
                                        type="number"
                                        min="0"
                                        className={inputBaseClass}
                                        value={data.max_stock}
                                        onChange={(event) => setData('max_stock', event.target.value)}
                                    />
                                    <InputError message={errors.max_stock} />
                                    {hasStockRangeConflict ? (
                                        <p className="text-xs font-medium text-rose-600">Estoque maximo menor que o minimo.</p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="return_days" className="text-sm font-medium text-slate-700">Devolucao (dias)</label>
                                    <input
                                        id="return_days"
                                        type="number"
                                        min="0"
                                        className={inputBaseClass}
                                        value={data.return_days}
                                        onChange={(event) => setData('return_days', event.target.value)}
                                    />
                                    <InputError message={errors.return_days} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="unit_cost" className="text-sm font-medium text-slate-700">Custo unitario (R$)</label>
                                    <input
                                        id="unit_cost"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className={inputBaseClass}
                                        value={data.unit_cost}
                                        onChange={(event) => setData('unit_cost', event.target.value)}
                                    />
                                    <InputError message={errors.unit_cost} />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="description" className="text-sm font-medium text-slate-700">Descricao</label>
                                    <textarea
                                        id="description"
                                        rows={4}
                                        className={textareaBaseClass}
                                        value={data.description}
                                        onChange={(event) => setData('description', event.target.value)}
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                <input
                                    id="requires_validation"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border border-slate-300 text-blue-600 focus:ring-blue-500"
                                    checked={data.requires_validation}
                                    onChange={(event) => setData('requires_validation', event.target.checked)}
                                />
                                <label htmlFor="requires_validation" className="text-sm text-slate-700">
                                    EPI requer validacao / certificacao periodica
                                </label>
                                <Tags className="ml-auto h-4 w-4 text-slate-400" />
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <Button asChild variant="outline">
                                    <Link href={route('catalogoepi.index')}>Cancelar</Link>
                                </Button>
                                <Button type="submit" disabled={processing || hasStockRangeConflict}>
                                    {processing ? 'Salvando...' : 'Salvar EPI'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
