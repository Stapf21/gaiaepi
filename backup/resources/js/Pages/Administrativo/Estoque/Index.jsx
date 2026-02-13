
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import InputError from '@/Components/InputError.jsx';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import clsx from 'clsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { inputBaseClass, textareaBaseClass } from '@/lib/formStyles';

export default function EstoqueIndex({
    items = [],
    catalogStats = {},
    epis,
    episOptions = [],
    categories = [],
}) {
    const totalItems = items.length;
    const belowMinCount = items.filter((item) => item.is_below_min).length;

    const totalCatalog = catalogStats.totalEpis ?? 0;
    const categoryCount = catalogStats.categories ?? 0;
    const minAlerts = catalogStats.stockMinAlerts ?? 0;

    const entryForm = useForm({
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

    const submitEntry = (event) => {
        event.preventDefault();
        entryForm.post(route('administrativo.estoque.entrada.store'), {
            preserveScroll: true,
            onSuccess: () =>
                entryForm.reset({
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

    const [editingCategory, setEditingCategory] = useState(null);
    const categoryForm = useForm({
        name: '',
        default_return_days: '',
        description: '',
    });
    const deleteCategoryForm = useForm({});

    const startEditingCategory = (category) => {
        setEditingCategory(category);
        categoryForm.setData({
            name: category.name ?? '',
            default_return_days: category.default_return_days ?? '',
            description: category.description ?? '',
        });
    };

    const cancelEditingCategory = () => {
        setEditingCategory(null);
        categoryForm.reset();
    };

    const submitCategory = (event) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                categoryForm.reset();
                setEditingCategory(null);
            },
        };

        if (editingCategory) {
            categoryForm.put(route('configuracoes.epi-categories.update', editingCategory.id), options);
        } else {
            categoryForm.post(route('configuracoes.epi-categories.store'), options);
        }
    };

    const handleDeleteCategory = (category) => {
        if (!confirm(`Deseja realmente excluir a categoria "${category.name}"?`)) {
            return;
        }

        deleteCategoryForm.delete(route('configuracoes.epi-categories.destroy', category.id), {
            preserveScroll: true,
            onSuccess: () => {
                if (editingCategory?.id === category.id) {
                    cancelEditingCategory();
                }
            },
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Administrativo</h2>}>
            <Head title="Estoque" />

            <div className="space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-12">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Gestão de EPIs e estoque</h1>
                        <p className="text-sm text-muted-foreground">
                            Controle centralizado do catálogo de EPIs, posição de estoque e reposições.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                            <Link href={route('catalogoepi.create')}>Novo EPI</Link>
                        </Button>
                        <Button asChild>
                            <Link href="#entrada">Registrar entrada</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                                Itens monitorados
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-slate-900">{totalItems}</p>
                            <p className="text-xs text-muted-foreground">
                                EPIs com movimentações e controle de estoque.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                                Abaixo do mínimo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-slate-900">{belowMinCount}</p>
                            <p className="text-xs text-muted-foreground">
                                Itens que atingiram ou ultrapassaram o limite mínimo definido.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                                EPIs cadastrados
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-slate-900">{totalCatalog}</p>
                            <p className="text-xs text-muted-foreground">
                                Total de itens disponíveis no catálogo.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                                Categorias e alertas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-slate-900">{categoryCount}</p>
                            <p className="text-xs text-muted-foreground">
                                Categorias ativas • Alertas mínimos: {minAlerts}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-sm">
                    <CardContent className="px-0 py-0">
                        <Tabs defaultValue="stock">
                            <TabsList className="flex flex-wrap gap-2 bg-slate-100 p-2">
                                <TabsTrigger value="stock">Posição de estoque</TabsTrigger>
                                <TabsTrigger value="catalog">Catálogo de EPIs</TabsTrigger>
                                <TabsTrigger value="entry">Entrada de estoque</TabsTrigger>
                                <TabsTrigger value="categories">Categorias de EPI</TabsTrigger>
                            </TabsList>

                            <TabsContent value="stock" className="px-6 py-6 space-y-4">
                                {items.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        Nenhuma movimentação de estoque registrada até o momento.
                                    </p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-slate-200">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                        Item
                                                    </th>
                                                    <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                        Entradas
                                                    </th>
                                                    <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                        Entregas
                                                    </th>
                                                    <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                        Disponível
                                                    </th>
                                                    <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                        Mínimo
                                                    </th>
                                                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 bg-white">
                                                {items.map((item) => (
                                                    <tr
                                                        key={item.id}
                                                        className={item.is_below_min ? 'bg-red-50/60' : undefined}
                                                    >
                                                        <td className="px-4 py-3">
                                                            <p className="text-sm font-semibold text-slate-900">
                                                                {item.name}
                                                            </p>
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-sm text-slate-700">
                                                            {item.total_entries}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-sm text-slate-700">
                                                            {item.total_deliveries}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-sm font-semibold text-slate-900">
                                                            {item.available}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-sm text-slate-700">
                                                            {item.min_stock ?? '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            {item.is_below_min ? (
                                                                <Badge variant="destructive">Abaixo do mínimo</Badge>
                                                            ) : (
                                                                <Badge variant="outline">Ok</Badge>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="catalog" className="px-6 py-6 space-y-4">
                                <div className="overflow-x-auto">
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
                                                        <TableCell>{epi.category ?? '-'}</TableCell>
                                                        <TableCell>{epi.ca_number ?? '-'}</TableCell>
                                                        <TableCell>{epi.unit}</TableCell>
                                                        <TableCell>{epi.return_days ?? '-'}</TableCell>
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
                                </div>
                                {epis?.links && epis.links.length > 1 && (
                                    <nav className="flex flex-wrap gap-2 pt-4">
                                        {epis.links.map((link) => (
                                            <Link
                                                key={link.url ?? link.label}
                                                href={link.url ?? '#'}
                                                className={clsx(
                                                    'rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-600 transition hover:bg-slate-100',
                                                    {
                                                        'bg-slate-900 text-white hover:bg-slate-900': link.active,
                                                        'pointer-events-none opacity-50': !link.url,
                                                    },
                                                )}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                )}
                            </TabsContent>

                            <TabsContent value="entry" className="px-6 py-6 space-y-6" id="entrada">
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">
                                        Registrar entrada de estoque
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Informe os detalhes da compra ou reposição realizada para atualizar os saldos.
                                    </p>
                                </div>
                                <form onSubmit={submitEntry} className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label htmlFor="entry_epi" className="text-sm font-medium text-slate-700">
                                                EPI
                                            </label>
                                            <select
                                                id="entry_epi"
                                                className={inputBaseClass}
                                                value={entryForm.data.epi_id}
                                                onChange={(event) =>
                                                    entryForm.setData(
                                                        'epi_id',
                                                        event.target.value ? Number(event.target.value) : '',
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">Selecione...</option>
                                                {episOptions.map((epi) => (
                                                    <option key={epi.id} value={epi.id}>
                                                        {epi.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={entryForm.errors.epi_id} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="entry_quantity" className="text-sm font-medium text-slate-700">
                                                Quantidade
                                            </label>
                                            <input
                                                id="entry_quantity"
                                                type="number"
                                                min="1"
                                                className={inputBaseClass}
                                                value={entryForm.data.quantity}
                                                onChange={(event) =>
                                                    entryForm.setData(
                                                        'quantity',
                                                        event.target.value ? Number(event.target.value) : '',
                                                    )
                                                }
                                                required
                                            />
                                            <InputError message={entryForm.errors.quantity} />
                                        </div>
                                    </div>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label htmlFor="entry_unit_cost" className="text-sm font-medium text-slate-700">
                                                Custo unitário (R$)
                                            </label>
                                            <input
                                                id="entry_unit_cost"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className={inputBaseClass}
                                                value={entryForm.data.unit_cost}
                                                onChange={(event) => entryForm.setData('unit_cost', event.target.value)}
                                            />
                                            <InputError message={entryForm.errors.unit_cost} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="entry_supplier" className="text-sm font-medium text-slate-700">
                                                Fornecedor (opcional)
                                            </label>
                                            <input
                                                id="entry_supplier"
                                                type="text"
                                                className={inputBaseClass}
                                                value={entryForm.data.supplier}
                                                onChange={(event) => entryForm.setData('supplier', event.target.value)}
                                            />
                                            <InputError message={entryForm.errors.supplier} />
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label htmlFor="entry_invoice_number" className="text-sm font-medium text-slate-700">
                                                Nota fiscal / documento (opcional)
                                            </label>
                                            <input
                                                id="entry_invoice_number"
                                                type="text"
                                                className={inputBaseClass}
                                                value={entryForm.data.invoice_number}
                                                onChange={(event) =>
                                                    entryForm.setData('invoice_number', event.target.value)
                                                }
                                            />
                                            <InputError message={entryForm.errors.invoice_number} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="entry_invoice_date" className="text-sm font-medium text-slate-700">
                                                Data do documento (opcional)
                                            </label>
                                            <input
                                                id="entry_invoice_date"
                                                type="date"
                                                className={inputBaseClass}
                                                value={entryForm.data.invoice_date}
                                                onChange={(event) => entryForm.setData('invoice_date', event.target.value)}
                                            />
                                            <InputError message={entryForm.errors.invoice_date} />
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label htmlFor="entry_acquired_at" className="text-sm font-medium text-slate-700">
                                                Data de aquisição (opcional)
                                            </label>
                                            <input
                                                id="entry_acquired_at"
                                                type="date"
                                                className={inputBaseClass}
                                                value={entryForm.data.acquired_at}
                                                onChange={(event) => entryForm.setData('acquired_at', event.target.value)}
                                            />
                                            <InputError message={entryForm.errors.acquired_at} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="entry_expires_at" className="text-sm font-medium text-slate-700">
                                                Validade do EPI (opcional)
                                            </label>
                                            <input
                                                id="entry_expires_at"
                                                type="date"
                                                className={inputBaseClass}
                                                value={entryForm.data.expires_at}
                                                onChange={(event) => entryForm.setData('expires_at', event.target.value)}
                                            />
                                            <InputError message={entryForm.errors.expires_at} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="entry_notes" className="text-sm font-medium text-slate-700">
                                            Observações (opcional)
                                        </label>
                                        <textarea
                                            id="entry_notes"
                                            className={textareaBaseClass}
                                            rows={3}
                                            value={entryForm.data.notes}
                                            onChange={(event) => entryForm.setData('notes', event.target.value)}
                                        />
                                        <InputError message={entryForm.errors.notes} />
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <Button type="button" variant="outline" onClick={() => entryForm.reset()}>
                                            Limpar
                                        </Button>
                                        <Button type="submit" disabled={entryForm.processing}>
                                            {entryForm.processing ? 'Registrando...' : 'Registrar entrada'}
                                        </Button>
                                    </div>
                                </form>
                            </TabsContent>

                            <TabsContent value="categories" className="px-6 py-6 space-y-6">
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">
                                        Categorias de EPI
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Organize os EPIs em categorias e defina prazos de devolução padrão.
                                    </p>
                                </div>
                                <form onSubmit={submitCategory} className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="category_name" className="text-sm font-medium text-slate-700">
                                            Nome da categoria
                                        </label>
                                        <input
                                            id="category_name"
                                            type="text"
                                            className={inputBaseClass}
                                            value={categoryForm.data.name}
                                            onChange={(event) => categoryForm.setData('name', event.target.value)}
                                            required
                                        />
                                        <InputError message={categoryForm.errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="category_default_return_days"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Dias para devolução padrão (opcional)
                                        </label>
                                        <input
                                            id="category_default_return_days"
                                            type="number"
                                            min="0"
                                            className={inputBaseClass}
                                            value={categoryForm.data.default_return_days}
                                            onChange={(event) =>
                                                categoryForm.setData('default_return_days', event.target.value)
                                            }
                                        />
                                        <InputError message={categoryForm.errors.default_return_days} />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="category_description" className="text-sm font-medium text-slate-700">
                                            Descrição (opcional)
                                        </label>
                                        <textarea
                                            id="category_description"
                                            className={textareaBaseClass}
                                            value={categoryForm.data.description}
                                            onChange={(event) => categoryForm.setData('description', event.target.value)}
                                        />
                                        <InputError message={categoryForm.errors.description} />
                                    </div>

                                    <div className="flex items-center gap-3 md:col-span-2">
                                        <Button type="submit" disabled={categoryForm.processing}>
                                            {categoryForm.processing
                                                ? 'Salvando...'
                                                : editingCategory
                                                    ? 'Atualizar categoria'
                                                    : 'Salvar categoria'}
                                        </Button>
                                        {editingCategory && (
                                            <Button type="button" variant="outline" onClick={cancelEditingCategory}>
                                                Cancelar edição
                                            </Button>
                                        )}
                                    </div>
                                </form>

                                <div className="overflow-hidden rounded-lg border border-slate-200">
                                    <table className="min-w-full divide-y divide-slate-200">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                    Categoria
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                    Devolução padrão
                                                </th>
                                                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                    Ações
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 bg-white">
                                            {categories.length === 0 ? (
                                                <tr>
                                                    <td className="px-4 py-4 text-sm text-slate-500" colSpan={3}>
                                                        Nenhuma categoria cadastrada.
                                                    </td>
                                                </tr>
                                            ) : (
                                                categories.map((category) => (
                                                    <tr key={category.id}>
                                                        <td className="px-4 py-3">
                                                            <p className="text-sm font-semibold text-slate-900">
                                                                {category.name}
                                                            </p>
                                                            {category.description && (
                                                                <p className="text-xs text-slate-500">
                                                                    {category.description}
                                                                </p>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-slate-700">
                                                            {category.default_return_days !== null &&
                                                            category.default_return_days !== undefined
                                                                ? `${category.default_return_days} dias`
                                                                : 'Não definido'}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-sm">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => startEditingCategory(category)}
                                                                >
                                                                    Editar
                                                                </Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteCategory(category)}
                                                                    disabled={deleteCategoryForm.processing}
                                                                >
                                                                    Excluir
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
