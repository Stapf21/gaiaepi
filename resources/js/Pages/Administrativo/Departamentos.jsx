import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import InputError from '@/Components/InputError.jsx';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { inputBaseClass, textareaBaseClass } from '@/lib/formStyles';

export default function Departamentos({ companies = [], departments = [], epis = [] }) {
    const [editingDepartment, setEditingDepartment] = useState(null);

    const departmentForm = useForm({
        company_id: '',
        name: '',
        code: '',
        description: '',
        default_epi_items: [],
    });

    const deleteForm = useForm({});

    const kitItems = departmentForm.data.default_epi_items ?? [];

    const emptyKitItem = () => ({
        epi_id: '',
        quantity: 1,
        notes: '',
        size: '',
        validity_days: '',
        is_required: false,
    });

    const addKitItem = () => {
        departmentForm.setData('default_epi_items', [...kitItems, emptyKitItem()]);
    };

    const updateKitItem = (index, field, value) => {
        departmentForm.setData(
            'default_epi_items',
            kitItems.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item,
            ),
        );
    };

    const removeKitItem = (index) => {
        departmentForm.setData(
            'default_epi_items',
            kitItems.filter((_, itemIndex) => itemIndex !== index),
        );
    };

    const kitItemError = (index, field) => departmentForm.errors?.[`default_epi_items.${index}.${field}`];

    const startEditing = (department) => {
        setEditingDepartment(department);
        departmentForm.setData({
            company_id: department.company?.id ?? '',
            name: department.name ?? '',
            code: department.code ?? '',
            description: department.description ?? '',
            default_epi_items: (department.default_epi_items ?? []).map((item) => ({
                epi_id: item.epi_id ?? '',
                quantity: item.quantity ?? 1,
                notes: item.notes ?? '',
                size: item.size ?? '',
                validity_days: item.validity_days ?? '',
                is_required: Boolean(item.is_required),
            })),
        });
    };

    const cancelEditing = () => {
        setEditingDepartment(null);
        departmentForm.reset();
    };

    const submit = (event) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                departmentForm.reset();
                setEditingDepartment(null);
            },
        };

        if (editingDepartment) {
            departmentForm.put(route('configuracoes.departments.update', editingDepartment.id), options);
        } else {
            departmentForm.post(route('configuracoes.departments.store'), options);
        }
    };

    const handleDelete = (department) => {
        if (!confirm(`Deseja realmente excluir o departamento "${department.name}"?`)) {
            return;
        }

        deleteForm.delete(route('configuracoes.departments.destroy', department.id), {
            preserveScroll: true,
            onSuccess: () => {
                if (editingDepartment?.id === department.id) {
                    cancelEditing();
                }
            },
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Administrativo</h2>}>
            <Head title="Departamentos" />

            <div className="space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-12">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Departamentos</h1>
                    <p className="text-sm text-muted-foreground">
                        Cadastre departamentos e vincule-os a suas respectivas empresas.
                    </p>
                </div>
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-900">
                            {editingDepartment ? 'Editar departamento' : 'Novo departamento'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="department_company" className="text-sm font-medium text-slate-700">
                                    Empresa
                                </label>
                                <select
                                    id="department_company"
                                    className={inputBaseClass}
                                    value={departmentForm.data.company_id}
                                    onChange={(event) => departmentForm.setData('company_id', event.target.value)}
                                    required
                                >
                                    <option value="">Selecione uma empresa</option>
                                    {companies.map((company) => (
                                        <option key={company.id} value={company.id}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={departmentForm.errors.company_id} />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="department_name" className="text-sm font-medium text-slate-700">
                                    Nome do departamento
                                </label>
                                <input
                                    id="department_name"
                                    type="text"
                                    className={inputBaseClass}
                                    value={departmentForm.data.name}
                                    onChange={(event) => departmentForm.setData('name', event.target.value)}
                                    required
                                />
                                <InputError message={departmentForm.errors.name} />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="department_code" className="text-sm font-medium text-slate-700">
                                    Codigo interno (opcional)
                                </label>
                                <input
                                    id="department_code"
                                    type="text"
                                    className={inputBaseClass}
                                    value={departmentForm.data.code}
                                    onChange={(event) => departmentForm.setData('code', event.target.value)}
                                />
                                <InputError message={departmentForm.errors.code} />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="department_description" className="text-sm font-medium text-slate-700">
                                    Descricao (opcional)
                                </label>
                                <textarea
                                    id="department_description"
                                    className={textareaBaseClass}
                                    value={departmentForm.data.description}
                                    onChange={(event) => departmentForm.setData('description', event.target.value)}
                                />
                                <InputError message={departmentForm.errors.description} />
                            </div>

                            <div className="md:col-span-2 space-y-4 rounded-lg border border-slate-200 p-4">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">Kit padrao de EPIs por setor</p>
                                        <p className="text-xs text-slate-500">
                                            Defina os itens sugeridos automaticamente ao registrar entregas para este setor.
                                        </p>
                                    </div>
                                    <Button type="button" variant="outline" size="sm" onClick={addKitItem}>
                                        Adicionar item
                                    </Button>
                                </div>

                                {kitItems.length === 0 ? (
                                    <p className="text-sm text-slate-500">Nenhum item cadastrado para este kit.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {kitItems.map((item, index) => (
                                            <div key={`kit-item-${index}`} className="rounded-lg border border-slate-200 p-3">
                                                <div className="grid gap-3 md:grid-cols-12">
                                                    <div className="space-y-1 md:col-span-4">
                                                        <label className="text-xs font-medium text-slate-600">Item de EPI</label>
                                                        <select
                                                            className={inputBaseClass}
                                                            value={item.epi_id}
                                                            onChange={(event) =>
                                                                updateKitItem(index, 'epi_id', event.target.value ? Number(event.target.value) : '')
                                                            }
                                                        >
                                                            <option value="">Selecione um item</option>
                                                            {epis.map((epi) => (
                                                                <option key={epi.id} value={epi.id}>
                                                                    {epi.name}
                                                                    {epi.code ? ` (${epi.code})` : ''}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <InputError message={kitItemError(index, 'epi_id')} />
                                                    </div>

                                                    <div className="space-y-1 md:col-span-2">
                                                        <label className="text-xs font-medium text-slate-600">Quantidade</label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            className={inputBaseClass}
                                                            value={item.quantity}
                                                            onChange={(event) => {
                                                                const value = event.target.value;
                                                                updateKitItem(index, 'quantity', value === '' ? '' : Number(value));
                                                            }}
                                                        />
                                                        <InputError message={kitItemError(index, 'quantity')} />
                                                    </div>

                                                    <div className="space-y-1 md:col-span-2">
                                                        <label className="text-xs font-medium text-slate-600">Tamanho</label>
                                                        <input
                                                            type="text"
                                                            className={inputBaseClass}
                                                            value={item.size ?? ''}
                                                            onChange={(event) => updateKitItem(index, 'size', event.target.value)}
                                                            placeholder="Opcional"
                                                        />
                                                        <InputError message={kitItemError(index, 'size')} />
                                                    </div>

                                                    <div className="space-y-1 md:col-span-2">
                                                        <label className="text-xs font-medium text-slate-600">Validade (dias)</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            className={inputBaseClass}
                                                            value={item.validity_days ?? ''}
                                                            onChange={(event) => {
                                                                const value = event.target.value;
                                                                updateKitItem(index, 'validity_days', value === '' ? '' : Number(value));
                                                            }}
                                                            placeholder="Opcional"
                                                        />
                                                        <InputError message={kitItemError(index, 'validity_days')} />
                                                    </div>

                                                    <div className="md:col-span-2 flex items-end justify-end">
                                                        <Button type="button" variant="ghost" size="sm" onClick={() => removeKitItem(index)}>
                                                            Remover
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-1 md:col-span-9">
                                                        <label className="text-xs font-medium text-slate-600">Observações</label>
                                                        <input
                                                            type="text"
                                                            className={inputBaseClass}
                                                            value={item.notes ?? ''}
                                                            onChange={(event) => updateKitItem(index, 'notes', event.target.value)}
                                                            placeholder="Opcional"
                                                        />
                                                        <InputError message={kitItemError(index, 'notes')} />
                                                    </div>

                                                    <div className="md:col-span-3 flex items-center gap-2">
                                                        <input
                                                            id={`kit-required-${index}`}
                                                            type="checkbox"
                                                            className="h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-200"
                                                            checked={Boolean(item.is_required)}
                                                            onChange={(event) => updateKitItem(index, 'is_required', event.target.checked)}
                                                        />
                                                        <label htmlFor={`kit-required-${index}`} className="text-xs font-medium text-slate-600">
                                                            Obrigatório
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 md:col-span-2">
                                <Button type="submit" disabled={departmentForm.processing}>
                                    {departmentForm.processing
                                        ? 'Salvando...'
                                        : editingDepartment
                                            ? 'Atualizar departamento'
                                            : 'Salvar departamento'}
                                </Button>
                                {editingDepartment && (
                                    <Button type="button" variant="outline" onClick={cancelEditing}>
                                        Cancelar edicao
                                    </Button>
                                )}
                            </div>
                        </form>

                        <div className="overflow-hidden rounded-lg border border-slate-200">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Departamento
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Empresa
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Codigo
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Kit padrao
                                        </th>
                                        <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Acoes
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {departments.length === 0 ? (
                                        <tr>
                                            <td className="px-4 py-4 text-sm text-slate-500" colSpan={5}>
                                                Nenhum departamento cadastrado.
                                            </td>
                                        </tr>
                                    ) : (
                                        departments.map((department) => (
                                            <tr key={department.id}>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-semibold text-slate-800">{department.name}</p>
                                                    {department.description && (
                                                        <p className="text-xs text-slate-500">{department.description}</p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600">
                                                    {department.company?.name ?? '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600">
                                                    {department.code ?? '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600">
                                                    {department.default_epi_items?.length ? (
                                                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                                                            {department.default_epi_items.length} itens
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400">Sem kit</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => startEditing(department)}>
                                                            Editar
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(department)}
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
