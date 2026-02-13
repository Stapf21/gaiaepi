import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import InputError from '@/Components/InputError.jsx';
import Modal from '@/Components/Modal.jsx';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { inputBaseClass, textareaBaseClass } from '@/lib/formStyles';

const emptyItem = () => ({
    epi_id: '',
    quantity: 1,
    notes: '',
    origin: null,
});

export default function MovementForm({
    mode = 'create',
    delivery = null,
    epis = [],
    employees = [],
    statuses = [],
    departmentKits = [],
    departments = [],
    kitStock = [],
    prefill = {},
}) {
    const isEdit = mode === 'edit';

    const initialItems = isEdit && delivery?.items?.length
        ? delivery.items.map((item) => ({
              epi_id: item.epi_id ?? '',
              quantity: item.quantity ?? 1,
              notes: item.notes ?? '',
              origin: item.origin ?? null,
          }))
        : [emptyItem()];

    const initialStatus = isEdit
        ? delivery?.status ?? statuses?.[0]?.value ?? 'entregue'
        : statuses?.[0]?.value ?? 'entregue';

    const { data, setData, post, put, processing, errors, reset } = useForm({
        items: initialItems,
        notes: delivery?.notes ?? '',
        employee_id: delivery?.employee_id ?? prefill?.employee_id ?? '',
        delivered_at: delivery?.delivered_at ?? new Date().toISOString().slice(0, 10),
        expected_return_at: delivery?.expected_return_at ?? '',
        status: initialStatus,
    });

    const [manualDepartmentId, setManualDepartmentId] = useState(
        prefill?.department_id ? Number(prefill.department_id) : '',
    );
    const [handledDepartments, setHandledDepartments] = useState([]);
    const [kitPromptFlag, setKitPromptFlag] = useState(Boolean(prefill?.kit_prompt));
    const [noKitDepartmentId, setNoKitDepartmentId] = useState(null);
    const [kitModal, setKitModal] = useState({
        open: false,
        department: null,
        departmentId: null,
        items: [],
    });

    const statusOptions = useMemo(
        () =>
            statuses.map((status) => ({
                value: status.value,
                label: status.label,
            })),
        [statuses],
    );

    const departmentLookup = useMemo(() => {
        const map = {};

        departments.forEach((department) => {
            map[department.id] = department;
        });

        return map;
    }, [departments]);

    const stockByEpiId = useMemo(() => {
        const map = {};

        kitStock.forEach((item) => {
            map[item.id] = item.available ?? null;
        });

        return map;
    }, [kitStock]);

    const kitsByDepartment = useMemo(() => {
        const map = {};

        departmentKits.forEach((kit) => {
            map[kit.department_id] = kit;
        });

        return map;
    }, [departmentKits]);

    const selectedEmployee = useMemo(() => {
        if (!data.employee_id) {
            return null;
        }

        return employees.find((employee) => Number(employee.id) === Number(data.employee_id)) ?? null;
    }, [employees, data.employee_id]);

    const selectedDepartmentId = manualDepartmentId || selectedEmployee?.department_id || null;
    const currentDepartment = selectedDepartmentId ? departmentLookup[selectedDepartmentId] : null;
    const currentKit = selectedDepartmentId ? kitsByDepartment[selectedDepartmentId] : null;

    const itemError = (index, field) => errors?.[`items.${index}.${field}`];

    const markDepartmentHandled = (departmentId) => {
        if (!departmentId) {
            return;
        }

        setHandledDepartments((prev) => (prev.includes(departmentId) ? prev : [...prev, departmentId]));
    };

    const openKitModal = (kit) => {
        setKitModal({
            open: true,
            department: kit.department,
            departmentId: kit.department_id,
            items: (kit.items ?? []).map((item) => ({
                ...item,
                available: stockByEpiId[item.epi_id] ?? null,
            })),
        });
    };

    const closeKitModal = () => {
        setKitModal((prev) => ({
            ...prev,
            open: false,
        }));
    };

    const cancelKitModal = () => {
        markDepartmentHandled(kitModal.departmentId);
        closeKitModal();
    };

    useEffect(() => {
        if (!selectedDepartmentId) {
            return;
        }

        const kit = kitsByDepartment[selectedDepartmentId];

        if (!kit) {
            setNoKitDepartmentId(selectedDepartmentId);
            return;
        }

        setNoKitDepartmentId(null);

        if (handledDepartments.includes(selectedDepartmentId) && !kitPromptFlag) {
            return;
        }

        openKitModal(kit);
        setKitPromptFlag(false);
    }, [selectedDepartmentId, kitsByDepartment, handledDepartments, kitPromptFlag]);

    const updateItem = (index, field, value) => {
        setData(
            'items',
            data.items.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item,
            ),
        );
    };

    const addItem = () => {
        setData('items', [...data.items, emptyItem()]);
    };

    const removeItem = (index) => {
        if (data.items.length === 1) {
            return;
        }

        setData(
            'items',
            data.items.filter((_, itemIndex) => itemIndex !== index),
        );
    };

    const applyDepartmentKit = () => {
        if (!kitModal.departmentId) {
            return;
        }

        const insufficientItems = kitModal.items.filter((item) => {
            if (item.available === null) {
                return false;
            }

            return Number(item.quantity ?? 0) > Number(item.available ?? 0);
        });

        if (insufficientItems.length) {
            const summary = insufficientItems
                .map((item) => `${item.epi ?? 'EPI'} (disp.: ${item.available ?? 0})`)
                .join(', ');

            if (!confirm(`Estoque insuficiente para ${summary}. Aplicar parcial mesmo assim?`)) {
                return;
            }
        }

        setData(
            'items',
            kitModal.items.map((item) => ({
                epi_id: item.epi_id ? Number(item.epi_id) : '',
                quantity: item.quantity ?? 1,
                notes: item.notes ?? '',
                origin: 'kit',
                meta: {
                    department: kitModal.department,
                    size: item.size ?? null,
                    validity_days: item.validity_days ?? null,
                },
            })),
        );

        markDepartmentHandled(kitModal.departmentId);
        closeKitModal();
    };

    const submit = (event) => {
        event.preventDefault();

        if (isEdit && delivery) {
            put(delivery.update_url ?? route('entradassaidas.update', delivery.id), {
                preserveScroll: true,
            });

            return;
        }

        post(route('entradassaidas.store'), {
            onSuccess: () =>
                reset({
                    items: [emptyItem()],
                    notes: '',
                    employee_id: '',
                    delivered_at: new Date().toISOString().slice(0, 10),
                    expected_return_at: '',
                    status: statuses?.[0]?.value ?? 'entregue',
                }),
        });
    };

    const pageTitle = isEdit ? 'Editar movimentação' : 'Registrar movimentação';
    const headerTitle = isEdit ? 'Editar movimentação' : 'Nova movimentação';
    const submitLabel = isEdit ? 'Salvar alterações' : 'Registrar movimentação';
    const totalQuantity = useMemo(
        () => data.items.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0),
        [data.items],
    );

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">{headerTitle}</h2>}>
            <Head title={pageTitle} />

            <div className="mx-auto max-w-5xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                                Fluxo operacional
                            </Badge>
                            <Badge variant="outline" className="border-blue-100 bg-white text-blue-700">
                                Entrega de EPIs
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-semibold text-slate-900">{headerTitle}</h1>
                        <p className="text-sm text-muted-foreground">
                            {isEdit
                                ? 'Ajuste os dados da movimenta??o, itens e status de entrega.'
                                : 'Registre a entrega de EPIs com kit sugerido e itens avulsos.'}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="rounded-lg border border-blue-100 bg-white px-3 py-2">
                            <p className="text-xs text-blue-700">Itens</p>
                            <p className="font-semibold text-slate-900">{data.items.length}</p>
                        </div>
                        <div className="rounded-lg border border-blue-100 bg-white px-3 py-2">
                            <p className="text-xs text-blue-700">Quantidade</p>
                            <p className="font-semibold text-slate-900">{totalQuantity}</p>
                        </div>
                    </div>
                </div>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col gap-1">
                        <CardTitle className="text-base font-semibold text-slate-800">
                            {isEdit ? 'Atualize os dados da movimentação' : 'Registro rápido'}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {isEdit
                                ? 'Ajuste os itens entregues e detalhes da movimentação.'
                                : 'Registre a entrega de EPIs para os colaboradores.'}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-8">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="employee_id" className="text-sm font-medium text-slate-700">
                                        Colaborador
                                    </label>
                                    <select
                                        id="employee_id"
                                        className={inputBaseClass}
                                        value={data.employee_id}
                                        onChange={(event) => {
                                            setData('employee_id', event.target.value ? Number(event.target.value) : '');
                                            setManualDepartmentId('');
                                        }}
                                        required
                                    >
                                        <option value="">Selecione...</option>
                                        {employees.map((employeeOption) => (
                                            <option key={employeeOption.id} value={employeeOption.id}>
                                                {employeeOption.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.employee_id} />
                                    {selectedEmployee?.department && (
                                        <p className="text-xs text-slate-500">
                                            Setor vinculado: {selectedEmployee.department}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="manual_department" className="text-sm font-medium text-slate-700">
                                        Departamento
                                    </label>
                                    <select
                                        id="manual_department"
                                        className={inputBaseClass}
                                        value={manualDepartmentId || selectedEmployee?.department_id || ''}
                                        onChange={(event) => {
                                            const value = event.target.value ? Number(event.target.value) : '';
                                            setManualDepartmentId(value);
                                            if (value) {
                                                setHandledDepartments((prev) => prev.filter((departmentId) => departmentId !== value));
                                            }
                                        }}
                                    >
                                        <option value="">
                                            {selectedEmployee?.department
                                                ? `Usar setor do colaborador (${selectedEmployee.department})`
                                                : 'Selecione um setor'}
                                        </option>
                                        {departments.map((department) => (
                                            <option key={department.id} value={department.id}>
                                                {department.name}
                                                {department.has_kit ? '' : ' (sem kit)'}
                                            </option>
                                        ))}
                                    </select>
                                    {noKitDepartmentId === selectedDepartmentId && (
                                        <p className="text-xs text-amber-600">
                                            Este setor não possui kit padrão configurado.
                                        </p>
                                    )}
                                    {!selectedDepartmentId && (
                                        <p className="text-xs text-slate-500">Selecione um colaborador ou setor para sugerir o kit.</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="status" className="text-sm font-medium text-slate-700">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        className={inputBaseClass}
                                        value={data.status}
                                        onChange={(event) => setData('status', event.target.value)}
                                        required
                                    >
                                        {statusOptions.map((status) => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.status} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="delivered_at" className="text-sm font-medium text-slate-700">
                                        Data da entrega
                                    </label>
                                    <input
                                        id="delivered_at"
                                        type="date"
                                        className={inputBaseClass}
                                        value={data.delivered_at}
                                        onChange={(event) => setData('delivered_at', event.target.value)}
                                        required
                                    />
                                    <InputError message={errors.delivered_at} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="expected_return_at" className="text-sm font-medium text-slate-700">
                                        Devolução prevista (opcional)
                                    </label>
                                    <input
                                        id="expected_return_at"
                                        type="date"
                                        className={inputBaseClass}
                                        value={data.expected_return_at}
                                        onChange={(event) => setData('expected_return_at', event.target.value)}
                                    />
                                    <InputError message={errors.expected_return_at} />
                                </div>
                            </div>

                            <div className="space-y-3 rounded-lg border border-slate-200 p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            Kit padrão do setor {currentDepartment ? `— ${currentDepartment.name}` : ''}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Aplique o kit sugerido ou adicione itens avulsos logo abaixo.
                                        </p>
                                    </div>
                                    {currentKit && (
                                        <Button type="button" variant="outline" size="sm" onClick={() => openKitModal(currentKit)}>
                                            Revisar kit
                                        </Button>
                                    )}
                                </div>

                                {currentKit ? (
                                    <div className="space-y-1 text-sm text-slate-700">
                                        {(currentKit.items ?? []).map((item, index) => (
                                            <div key={`${item.id}-${index}`} className="flex flex-wrap gap-2">
                                                <span className="font-medium">{item.epi ?? 'EPI'}</span>
                                                <span>Qtd: {item.quantity ?? 1}</span>
                                                {item.size && <span>Tamanho: {item.size}</span>}
                                                {item.validity_days && (
                                                    <span>Validade: {item.validity_days} dias</span>
                                                )}
                                                {item.is_required && (
                                                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                                                        Obrigatório
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500">Nenhum kit disponível para o setor selecionado.</p>
                                )}
                                {noKitDepartmentId === selectedDepartmentId && (
                                    <p className="text-xs text-slate-500">
                                        Configure um kit em Administrativo &gt; Departamentos para acelerar o lançamento.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-800">Itens</p>
                                    <Button type="button" variant="outline" onClick={addItem}>
                                        Adicionar item
                                    </Button>
                                </div>

                                {data.items.map((item, index) => (
                                    <div key={`item-${index}`} className="rounded-lg border border-slate-200 p-4">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <p className="text-sm font-semibold text-slate-800">Item #{index + 1}</p>
                                            <div className="flex items-center gap-2">
                                                {item.origin === 'kit' && (
                                                    <Badge variant="outline" className="text-slate-600">
                                                        Adicionado via kit do setor
                                                    </Badge>
                                                )}
                                                {data.items.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeItem(index)}
                                                    >
                                                        Remover
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-3 grid gap-4 md:grid-cols-12">
                                            <div className="space-y-2 md:col-span-6">
                                                <label className="text-xs font-medium text-slate-600">Item de EPI</label>
                                                <select
                                                    className={inputBaseClass}
                                                    value={item.epi_id}
                                                    onChange={(event) =>
                                                        updateItem(
                                                            index,
                                                            'epi_id',
                                                            event.target.value ? Number(event.target.value) : '',
                                                        )
                                                    }
                                                    required
                                                >
                                                    <option value="">Selecione</option>
                                                    {epis.map((epi) => (
                                                        <option key={epi.id} value={epi.id}>
                                                            {epi.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={itemError(index, 'epi_id')} />
                                            </div>

                                            <div className="space-y-2 md:col-span-3">
                                                <label className="text-xs font-medium text-slate-600">Quantidade</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className={inputBaseClass}
                                                    value={item.quantity}
                                                    onChange={(event) =>
                                                        updateItem(index, 'quantity', Number(event.target.value) || 1)
                                                    }
                                                />
                                                <InputError message={itemError(index, 'quantity')} />
                                            </div>

                                            <div className="space-y-2 md:col-span-3">
                                                <label className="text-xs font-medium text-slate-600">
                                                    Observações
                                                </label>
                                                <input
                                                    type="text"
                                                    className={inputBaseClass}
                                                    value={item.notes ?? ''}
                                                    onChange={(event) => updateItem(index, 'notes', event.target.value)}
                                                    placeholder="Opcional"
                                                />
                                                <InputError message={itemError(index, 'notes')} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="notes" className="text-sm font-medium text-slate-700">
                                    Observações gerais (opcional)
                                </label>
                                <textarea
                                    id="notes"
                                    className={textareaBaseClass}
                                    rows={3}
                                    value={data.notes}
                                    onChange={(event) => setData('notes', event.target.value)}
                                />
                                <InputError message={errors.notes} />
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Processando...' : submitLabel}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={route('entradassaidas.index')}>Cancelar</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Modal show={kitModal.open} onClose={cancelKitModal}>
                <div className="space-y-4 p-6">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Kit padrão do setor — {kitModal.department ?? 'Setor'}
                        </h2>
                        <p className="text-sm text-slate-600">
                            Confirme os itens sugeridos para aplicar automaticamente na movimentação.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="grid gap-2 text-sm font-medium text-slate-600 md:grid-cols-12">
                            <span className="md:col-span-4">Item</span>
                            <span className="md:col-span-2">Tamanho</span>
                            <span className="md:col-span-2">Quantidade</span>
                            <span className="md:col-span-2">Validade</span>
                            <span className="md:col-span-2 text-right">Obrigatório</span>
                        </div>
                        <div className="space-y-1">
                            {kitModal.items.map((item, index) => (
                                <div
                                    key={`${item.id}-${index}`}
                                    className="grid items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 md:grid-cols-12"
                                >
                                    <span className="font-semibold md:col-span-4">{item.epi ?? 'EPI'}</span>
                                    <span className="md:col-span-2">{item.size ?? '-'}</span>
                                    <span className="md:col-span-2">{item.quantity ?? 1}</span>
                                    <span className="md:col-span-2">
                                        {item.validity_days ? `${item.validity_days} dias` : '-'}
                                    </span>
                                    <span className="md:col-span-2 text-right">
                                        {item.is_required ? (
                                            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                                                Obrigatório
                                            </Badge>
                                        ) : (
                                            <span className="text-slate-400">Opcional</span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500">Você poderá adicionar itens extras após aplicar o kit.</p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={cancelKitModal}>
                            Cancelar
                        </Button>
                        <Button type="button" onClick={applyDepartmentKit}>
                            Aplicar kit
                        </Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
