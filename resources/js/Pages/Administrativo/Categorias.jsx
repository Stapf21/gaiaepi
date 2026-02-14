import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import InputError from '@/Components/InputError.jsx';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { inputBaseClass, textareaBaseClass } from '@/lib/formStyles';

export default function Categorias({ epiCategories = [] }) {
    const [editingCategory, setEditingCategory] = useState(null);

    const categoryForm = useForm({
        name: '',
        default_return_days: '',
        description: '',
    });

    const deleteForm = useForm({});

    const startEditing = (category) => {
        setEditingCategory(category);
        categoryForm.setData({
            name: category.name ?? '',
            default_return_days: category.default_return_days ?? '',
            description: category.description ?? '',
        });
    };

    const cancelEditing = () => {
        setEditingCategory(null);
        categoryForm.reset();
    };

    const submit = (event) => {
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

    const handleDelete = (category) => {
        if (!confirm(`Deseja realmente excluir a categoria "${category.name}"?`)) {
            return;
        }

        deleteForm.delete(route('configuracoes.epi-categories.destroy', category.id), {
            preserveScroll: true,
            onSuccess: () => {
                if (editingCategory?.id === category.id) {
                    cancelEditing();
                }
            },
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Administrativo</h2>}>
            <Head title="Categorias de EPI" />

            <div className="space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-12">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Categorias de EPI</h1>
                    <p className="text-sm text-muted-foreground">
                        Organize os EPIs em categorias e defina prazos de devolucao padrao.
                    </p>
                </div>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-foreground">
                            {editingCategory ? 'Editar categoria' : 'Nova categoria'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="category_name" className="text-sm font-medium text-muted-foreground">
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
                                <label htmlFor="category_default_return_days" className="text-sm font-medium text-muted-foreground">
                                    Dias para devolucao padrao (opcional)
                                </label>
                                <input
                                    id="category_default_return_days"
                                    type="number"
                                    min="0"
                                    className={inputBaseClass}
                                    value={categoryForm.data.default_return_days}
                                    onChange={(event) => categoryForm.setData('default_return_days', event.target.value)}
                                />
                                <InputError message={categoryForm.errors.default_return_days} />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="category_description" className="text-sm font-medium text-muted-foreground">
                                    Descricao (opcional)
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
                                    <Button type="button" variant="outline" onClick={cancelEditing}>
                                        Cancelar edicao
                                    </Button>
                                )}
                            </div>
                        </form>

                        <div className="overflow-hidden rounded-lg border border-border">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-muted/50 dark:bg-slate-950/60">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Categoria
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Devolucao padrao
                                        </th>
                                        <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Acoes
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card">
                                    {epiCategories.length === 0 ? (
                                        <tr>
                                            <td className="px-4 py-4 text-sm text-muted-foreground" colSpan={3}>
                                                Nenhuma categoria cadastrada.
                                            </td>
                                        </tr>
                                    ) : (
                                        epiCategories.map((category) => (
                                            <tr key={category.id}>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {category.name}
                                                    </p>
                                                    {category.description && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {category.description}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                                    {category.default_return_days !== null &&
                                                    category.default_return_days !== undefined
                                                        ? `${category.default_return_days} dias`
                                                        : 'Nao definido'}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => startEditing(category)}
                                                        >
                                                            Editar
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(category)}
                                                            disabled={deleteForm.processing}
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
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
