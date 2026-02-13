import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import InputError from '@/Components/InputError.jsx';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { inputBaseClass } from '@/lib/formStyles';

const emptyAddress = {
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    zip_code: '',
};

export default function EmployeeForm({
    mode = 'create',
    companies = [],
    departments = [],
    positions = [],
    statuses = [],
    employee = null,
    links = {},
}) {
    const isEdit = mode === 'edit';
    const initialData = {
        company_id: employee?.company_id ?? '',
        department_id: employee?.department_id ?? '',
        position_id: employee?.position_id ?? '',
        name: employee?.name ?? '',
        email: employee?.email ?? '',
        registration_number: employee?.registration_number ?? '',
        cpf: employee?.cpf ?? '',
        rg: employee?.rg ?? '',
        status: employee?.status ?? statuses?.[0]?.value ?? 'ativo',
        birth_date: employee?.birth_date ?? '',
        hire_date: employee?.hire_date ?? '',
        termination_date: employee?.termination_date ?? '',
        phone: employee?.phone ?? '',
        mobile_phone: employee?.mobile_phone ?? '',
        work_shift: employee?.work_shift ?? '',
        address: {
            ...emptyAddress,
            ...(employee?.address ?? {}),
        },
    };

    const { data, setData, post, put, processing, errors } = useForm(initialData);

    const selectedCompanyId = data.company_id ? Number(data.company_id) : null;
    const selectedDepartmentId = data.department_id ? Number(data.department_id) : null;

    const filteredDepartments = departments.filter(
        (department) => !selectedCompanyId || department.company_id === selectedCompanyId,
    );

    const filteredPositions = positions.filter((position) => {
        const sameCompany = !selectedCompanyId || position.company_id === selectedCompanyId;
        const sameDepartment = !selectedDepartmentId || position.department_id === selectedDepartmentId;

        if (!selectedCompanyId && !selectedDepartmentId) {
            return true;
        }

        return sameCompany && sameDepartment;
    });

    const submit = (event) => {
        event.preventDefault();

        if (isEdit && employee?.update_url) {
            put(employee.update_url);
            return;
        }

        post(route('funcionarios.store'));
    };

    const updateAddress = (field, value) => {
        setData('address', { ...data.address, [field]: value });
    };

    const cancelUrl = links?.cancel ?? route('funcionarios.index');
    const pageTitle = isEdit ? 'Editar funcionário' : 'Cadastrar funcionário';
    const headerTitle = isEdit ? 'Editar funcionário' : 'Novo funcionário';
    const submitLabel = isEdit ? 'Salvar alterações' : 'Salvar colaborador';

    const originalDepartmentId = employee?.department_id ?? '';
    const departmentChanged =
        isEdit &&
        originalDepartmentId !== '' &&
        data.department_id !== '' &&
        Number(originalDepartmentId) !== Number(data.department_id);

    const manualKitUrl =
        departmentChanged && employee?.id && data.department_id
            ? route('entradassaidas.create', {
                  employee: employee.id,
                  department: data.department_id,
                  kit_prompt: true,
              })
            : null;

    const openKitModal = () => {
        if (!manualKitUrl) {
            return;
        }

        const confirmed = confirm(
            'Salve as alterações antes de registrar o kit para o novo setor. Deseja abrir o registro agora?',
        );

        if (!confirmed) {
            return;
        }

        router.visit(manualKitUrl);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">{headerTitle}</h2>}>
            <Head title={pageTitle} />

            <div className="mx-auto max-w-4xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col gap-1">
                        <CardTitle className="text-base font-semibold text-slate-800">
                            Informações principais
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Preencha os dados do colaborador e associe aos cadastros existentes.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-8">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="company_id" className="text-sm font-medium text-slate-700">
                                        Empresa
                                    </label>
                                    <select
                                        id="company_id"
                                        className={inputBaseClass}
                                        value={data.company_id}
                                        onChange={(event) =>
                                            setData('company_id', event.target.value ? Number(event.target.value) : '')
                                        }
                                        required
                                    >
                                        <option value="">Selecione...</option>
                                        {companies.map((company) => (
                                            <option key={company.id} value={company.id}>
                                                {company.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.company_id} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="department_id" className="text-sm font-medium text-slate-700">
                                        Departamento
                                    </label>
                                    <select
                                        id="department_id"
                                        className={inputBaseClass}
                                        value={data.department_id}
                                        onChange={(event) =>
                                            setData('department_id', event.target.value ? Number(event.target.value) : '')
                                        }
                                    >
                                        <option value="">Selecione...</option>
                                        {filteredDepartments.map((department) => (
                                            <option key={department.id} value={department.id}>
                                                {department.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.department_id} />
                                    {departmentChanged && (
                                        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                                            <p>
                                                Após salvar, você poderá aplicar o kit padrão do novo setor automaticamente.
                                            </p>
                                            <div className="mt-2">
                                                <Button type="button" size="sm" variant="outline" onClick={openKitModal}>
                                                    Aplicar kit agora
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="position_id" className="text-sm font-medium text-slate-700">
                                        Cargo
                                    </label>
                                    <select
                                        id="position_id"
                                        className={inputBaseClass}
                                        value={data.position_id}
                                        onChange={(event) =>
                                            setData('position_id', event.target.value ? Number(event.target.value) : '')
                                        }
                                    >
                                        <option value="">Selecione...</option>
                                        {filteredPositions.map((position) => (
                                            <option key={position.id} value={position.id}>
                                                {position.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.position_id} />
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
                                        {statuses.map((status) => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.status} />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-slate-700">
                                        Nome completo
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
                                    <label htmlFor="email" className="text-sm font-medium text-slate-700">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        className={inputBaseClass}
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <label htmlFor="registration_number" className="text-sm font-medium text-slate-700">
                                        Matrícula
                                    </label>
                                    <input
                                        id="registration_number"
                                        type="text"
                                        className={inputBaseClass}
                                        value={data.registration_number}
                                        onChange={(event) => setData('registration_number', event.target.value)}
                                    />
                                    <InputError message={errors.registration_number} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="cpf" className="text-sm font-medium text-slate-700">
                                        CPF
                                    </label>
                                    <input
                                        id="cpf"
                                        type="text"
                                        className={inputBaseClass}
                                        value={data.cpf}
                                        onChange={(event) => setData('cpf', event.target.value)}
                                    />
                                    <InputError message={errors.cpf} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="rg" className="text-sm font-medium text-slate-700">
                                        RG
                                    </label>
                                    <input
                                        id="rg"
                                        type="text"
                                        className={inputBaseClass}
                                        value={data.rg}
                                        onChange={(event) => setData('rg', event.target.value)}
                                    />
                                    <InputError message={errors.rg} />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <label htmlFor="birth_date" className="text-sm font-medium text-slate-700">
                                        Data de nascimento
                                    </label>
                                    <input
                                        id="birth_date"
                                        type="date"
                                        className={inputBaseClass}
                                        value={data.birth_date}
                                        onChange={(event) => setData('birth_date', event.target.value)}
                                    />
                                    <InputError message={errors.birth_date} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="hire_date" className="text-sm font-medium text-slate-700">
                                        Data de admissão
                                    </label>
                                    <input
                                        id="hire_date"
                                        type="date"
                                        className={inputBaseClass}
                                        value={data.hire_date}
                                        onChange={(event) => setData('hire_date', event.target.value)}
                                    />
                                    <InputError message={errors.hire_date} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="termination_date" className="text-sm font-medium text-slate-700">
                                        Data de desligamento
                                    </label>
                                    <input
                                        id="termination_date"
                                        type="date"
                                        className={inputBaseClass}
                                        value={data.termination_date ?? ''}
                                        onChange={(event) => setData('termination_date', event.target.value)}
                                    />
                                    <InputError message={errors.termination_date} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">Endereço</p>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="address_street" className="text-sm font-medium text-slate-700">
                                            Rua
                                        </label>
                                        <input
                                            id="address_street"
                                            type="text"
                                            className={inputBaseClass}
                                            value={data.address.street}
                                            onChange={(event) => updateAddress('street', event.target.value)}
                                        />
                                        <InputError message={errors['address.street']} />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="address_number" className="text-sm font-medium text-slate-700">
                                            Número
                                        </label>
                                        <input
                                            id="address_number"
                                            type="text"
                                            className={inputBaseClass}
                                            value={data.address.number}
                                            onChange={(event) => updateAddress('number', event.target.value)}
                                        />
                                        <InputError message={errors['address.number']} />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="address_complement" className="text-sm font-medium text-slate-700">
                                            Complemento
                                        </label>
                                        <input
                                            id="address_complement"
                                            type="text"
                                            className={inputBaseClass}
                                            value={data.address.complement}
                                            onChange={(event) => updateAddress('complement', event.target.value)}
                                        />
                                        <InputError message={errors['address.complement']} />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="address_district" className="text-sm font-medium text-slate-700">
                                            Bairro
                                        </label>
                                        <input
                                            id="address_district"
                                            type="text"
                                            className={inputBaseClass}
                                            value={data.address.district}
                                            onChange={(event) => updateAddress('district', event.target.value)}
                                        />
                                        <InputError message={errors['address.district']} />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="address_city" className="text-sm font-medium text-slate-700">
                                            Cidade
                                        </label>
                                        <input
                                            id="address_city"
                                            type="text"
                                            className={inputBaseClass}
                                            value={data.address.city}
                                            onChange={(event) => updateAddress('city', event.target.value)}
                                        />
                                        <InputError message={errors['address.city']} />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="address_state" className="text-sm font-medium text-slate-700">
                                            Estado
                                        </label>
                                        <input
                                            id="address_state"
                                            type="text"
                                            className={inputBaseClass}
                                            value={data.address.state}
                                            onChange={(event) => updateAddress('state', event.target.value)}
                                        />
                                        <InputError message={errors['address.state']} />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="address_zip" className="text-sm font-medium text-slate-700">
                                            CEP
                                        </label>
                                        <input
                                            id="address_zip"
                                            type="text"
                                            className={inputBaseClass}
                                            value={data.address.zip_code}
                                            onChange={(event) => updateAddress('zip_code', event.target.value)}
                                        />
                                        <InputError message={errors['address.zip_code']} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Processando...' : submitLabel}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={cancelUrl}>Cancelar</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
