import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import InputError from '@/Components/InputError.jsx';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { inputBaseClass, textareaBaseClass } from '@/lib/formStyles';

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

    const submit = (event) => {
        event.preventDefault();
        post(route('catalogoepi.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Novo EPI</h2>}>
            <Head title="Cadastrar EPI" />

            <div className="mx-auto max-w-4xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col gap-1">
                        <CardTitle className="text-base font-semibold text-slate-800">
                            Informações do equipamento
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Registre os dados principais do EPI para controle de estoque e rastreabilidade.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-8">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="category_id" className="text-sm font-medium text-slate-700">
                                        Categoria
                                    </label>
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
                                    <label htmlFor="name" className="text-sm font-medium text-slate-700">
                                        Nome do EPI
                                    </label>
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
                                    <label htmlFor="ca_number" className="text-sm font-medium text-slate-700">
                                        Número do CA
                                    </label>
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
                                    <label htmlFor="unit" className="text-sm font-medium text-slate-700">
                                        Unidade
                                    </label>
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
                                    <label htmlFor="size" className="text-sm font-medium text-slate-700">
                                        Tamanho / medida
                                    </label>
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
                                    <label htmlFor="min_stock" className="text-sm font-medium text-slate-700">
                                        Estoque mínimo
                                    </label>
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
                                    <label htmlFor="max_stock" className="text-sm font-medium text-slate-700">
                                        Estoque máximo
                                    </label>
                                    <input
                                        id="max_stock"
                                        type="number"
                                        min="0"
                                        className={inputBaseClass}
                                        value={data.max_stock}
                                        onChange={(event) => setData('max_stock', event.target.value)}
                                    />
                                    <InputError message={errors.max_stock} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="return_days" className="text-sm font-medium text-slate-700">
                                        Devolução (dias)
                                    </label>
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
                                    <label htmlFor="unit_cost" className="text-sm font-medium text-slate-700">
                                        Custo unitário (R$)
                                    </label>
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
                                    <label htmlFor="description" className="text-sm font-medium text-slate-700">
                                        Descrição
                                    </label>
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

                            <div className="flex items-center gap-2">
                                <input
                                    id="requires_validation"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={data.requires_validation}
                                    onChange={(event) => setData('requires_validation', event.target.checked)}
                                />
                                <label htmlFor="requires_validation" className="text-sm text-slate-700">
                                    EPI requer validação / certificação periódica
                                </label>
                            </div>

                        <div className="flex items-center justify-end gap-3">
                            <Button asChild variant="outline">
                                <Link href={route('catalogoepi.index')}>Cancelar</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
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
