import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import InputError from '@/Components/InputError.jsx';
import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { inputBaseClass, textareaBaseClass } from '@/lib/formStyles';

export default function Cargos({ companies = [], departments = [], positions = [] }) {
    const [editingPosition, setEditingPosition] = useState(null);

    const positionForm = useForm({
        company_id: '',
        department_id: '',
        name: '',
        code: '',
        epi_return_days: '',
        description: '',
    });

    const deleteForm = useForm({});

    const filteredDepartments = useMemo(() => {
        if (!positionForm.data.company_id) {
            return departments;
        }

        return departments.filter(
            (department) => department.company?.id === Number(positionForm.data.company_id)
        );
    }, [departments, positionForm.data.company_id]);

    const startEditing = (position) => {
        setEditingPosition(position);
        positionForm.setData({
            company_id: position.company?.id ?? '',
            department_id: position.department?.id ?? '',
            name: position.name ?? '',
            code: position.code ?? '',
            epi_return_days: position.epi_return_days ?? '',
            description: position.description ?? '',
        });
    };

    const cancelEditing = () => {
        setEditingPosition(null);
        positionForm.reset();
    };

    const submit = (event) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                positionForm.reset();
                setEditingPosition(null);
            },
        };

        if (editingPosition) {
            positionForm.put(route('configuracoes.positions.update', editingPosition.id), options);
        } else {
            positionForm.post(route('configuracoes.positions.store'), options);
        }
    };

    const handleDelete = (position) => {
        if (!confirm(`Deseja realmente excluir o cargo "${position.name}"?`)) {
            return;
        }

        deleteForm.delete(route('configuracoes.positions.destroy', position.id), {
            preserveScroll: true,
            onSuccess: () => {
                if (editingPosition?.id === position.id) {
                    cancelEditing();
                }
            },
        });
    };

    const handleCompanyChange = (value) => {
        positionForm.setData((data) => ({
            ...data,
            company_id: value,
            department_id: '',
        }));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Administrativo</h2>}>
            <Head title="Cargos" />

            <div className="space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-12">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Cargos</h1>
                    <p className="text-sm text-muted-foreground">
                        Mantenha os cargos atualizados e configure prazos padrao para devolucao de EPIs.
                    </p>
                </div>
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-foreground">
                            {editingPosition ? 'Editar cargo' : 'Novo cargo'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="position_company" className="text-sm font-medium text-muted-foreground">
                                    Empresa
                                </label>
                                <select
                                    id="position_company"
                                    className={inputBaseClass}
                                    value={positionForm.data.company_id}
                                    onChange={(event) => handleCompanyChange(event.target.value)}
                                    required
                                >
                                    <option value="">Selecione uma empresa</option>
                                    {companies.map((company) => (
                                        <option key={company.id} value={company.id}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={positionForm.errors.company_id} />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="position_department" className="text-sm font-medium text-muted-foreground">
                                    Departamento (opcional)
                                </label>
                                <select
                                    id="position_department"
                                    className={inputBaseClass}
                                    value={positionForm.data.department_id}
                                    onChange={(event) => positionForm.setData('department_id', event.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    {filteredDepartments.map((department) => (
                                        <option key={department.id} value={department.id}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={positionForm.errors.department_id} />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="position_name" className="text-sm font-medium text-muted-foreground">
                                    Nome do cargo
                                </label>
                                <input
                                    id="position_name"
                                    type="text"
                                    className={inputBaseClass}
                                    value={positionForm.data.name}
                                    onChange={(event) => positionForm.setData('name', event.target.value)}
                                    required
                                />
                                <InputError message={positionForm.errors.name} />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="position_code" className="text-sm font-medium text-muted-foreground">
                                    Codigo interno (opcional)
                                </label>
                                <input
                                    id="position_code"
                                    type="text"
                                    className={inputBaseClass}
                                    value={positionForm.data.code}
                                    onChange={(event) => positionForm.setData('code', event.target.value)}
                                />
                                <InputError message={positionForm.errors.code} />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="position_return_days" className="text-sm font-medium text-muted-foreground">
                                    Dias para devolucao de EPI (opcional)
                                </label>
                                <input
                                    id="position_return_days"
                                    type="number"
                                    min="0"
                                    className={inputBaseClass}
                                    value={positionForm.data.epi_return_days}
                                    onChange={(event) => positionForm.setData('epi_return_days', event.target.value)}
                                />
                                <InputError message={positionForm.errors.epi_return_days} />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="position_description" className="text-sm font-medium text-muted-foreground">
                                    Descricao (opcional)
                                </label>
                                <textarea
                                    id="position_description"
                                    className={textareaBaseClass}
                                    value={positionForm.data.description}
                                    onChange={(event) => positionForm.setData('description', event.target.value)}
                                />
                                <InputError message={positionForm.errors.description} />
                            </div>

                            <div className="flex items-center gap-3 md:col-span-2">
                                <Button type="submit" disabled={positionForm.processing}>
                                    {positionForm.processing
                                        ? 'Salvando...'
                                        : editingPosition
                                            ? 'Atualizar cargo'
                                            : 'Salvar cargo'}
                                </Button>
                                {editingPosition && (
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
                                            Cargo
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Empresa
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Departamento
                                        </th>
                                        <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Acoes
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card">
                                    {positions.length === 0 ? (
                                        <tr>
                                            <td className="px-4 py-4 text-sm text-muted-foreground" colSpan={4}>
                                                Nenhum cargo cadastrado.
                                            </td>
                                        </tr>
                                    ) : (
                                        positions.map((position) => (
                                            <tr key={position.id}>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-semibold text-foreground">{position.name}</p>
                                                    {position.epi_return_days !== null && position.epi_return_days !== undefined && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Devolucao padrao: {position.epi_return_days} dias
                                                        </p>
                                                    )}
                                                    {position.description && (
                                                        <p className="text-xs text-muted-foreground">{position.description}</p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                                    {position.company?.name ?? '—'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                                    {position.department?.name ?? '—'}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => startEditing(position)}>
                                                            Editar
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(position)}
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
