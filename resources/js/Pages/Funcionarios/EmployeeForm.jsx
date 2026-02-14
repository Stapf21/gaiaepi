import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import InputError from '@/Components/InputError.jsx';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { inputBaseClass } from '@/lib/formStyles';
import { ClipboardList, ShieldCheck, UserPlus, Users } from 'lucide-react';

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

    const selectedCompany = useMemo(
        () => companies.find((company) => Number(company.id) === Number(data.company_id)),
        [companies, data.company_id],
    );

    const selectedDepartment = useMemo(
        () => departments.find((department) => Number(department.id) === Number(data.department_id)),
        [data.department_id, departments],
    );

    const selectedPosition = useMemo(
        () => positions.find((position) => Number(position.id) === Number(data.position_id)),
        [data.position_id, positions],
    );

    const statusLabel = useMemo(() => {
        const found = statuses.find((status) => status.value === data.status);
        return found?.label ?? data.status;
    }, [data.status, statuses]);

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

            <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200">
                                {isEdit ? <Users className="mr-1 h-3 w-3" /> : <UserPlus className="mr-1 h-3 w-3" />}
                                {isEdit ? 'Edição de colaborador' : 'Cadastro de colaborador'}
                            </Badge>
                            <Badge variant="outline" className="border-blue-100 bg-white text-blue-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200">
                                <ShieldCheck className="mr-1 h-3 w-3" />
                                Operação de RH
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-semibold text-foreground">{headerTitle}</h1>
                        <p className="text-sm text-muted-foreground">Preencha os dados do colaborador e associe aos cadastros existentes.</p>
                    </div>
                </div>

                <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    <Card className="border-border bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40 shadow-sm">
                        <CardContent className="p-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Resumo do cadastro</p>
                            <h2 className="mt-1 text-xl font-semibold text-foreground">Conferência dos vínculos</h2>
                            <p className="mt-1 text-sm text-slate-600">Valide empresa, departamento e cargo antes de salvar.</p>

                            <div className="mt-4 grid gap-3 sm:grid-cols-4">
                                <div className="rounded-lg border border-border bg-card/70 dark:bg-slate-950/40 px-3 py-2">
                                    <p className="text-xs text-blue-700">Empresa</p>
                                    <p className="text-sm font-semibold text-foreground">{selectedCompany?.name ?? '-'}</p>
                                </div>
                                <div className="rounded-lg border border-border bg-card/70 dark:bg-slate-950/40 px-3 py-2">
                                    <p className="text-xs text-blue-700">Departamento</p>
                                    <p className="text-sm font-semibold text-foreground">{selectedDepartment?.name ?? '-'}</p>
                                </div>
                                <div className="rounded-lg border border-border bg-card/70 dark:bg-slate-950/40 px-3 py-2">
                                    <p className="text-xs text-blue-700">Cargo</p>
                                    <p className="text-sm font-semibold text-foreground">{selectedPosition?.name ?? '-'}</p>
                                </div>
                                <div className="rounded-lg border border-border bg-card/70 dark:bg-slate-950/40 px-3 py-2">
                                    <p className="text-xs text-blue-700">Status</p>
                                    <p className="text-sm font-semibold text-foreground">{statusLabel ?? '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium text-muted-foreground">Checklist</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-slate-600">
                            <div className="rounded-lg bg-blue-50/70 dark:bg-blue-500/10 px-3 py-2">
                                <p className="font-medium text-blue-700">Obrigatórios</p>
                                <p>Empresa, nome e status.</p>
                            </div>
                            <div className="rounded-lg bg-muted dark:bg-slate-900/40 px-3 py-2">
                                <p className="font-medium text-muted-foreground">Documentos</p>
                                <p>Preencha matrícula, CPF e RG para rastreio.</p>
                            </div>
                            {departmentChanged ? (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
                                    <p className="font-medium">Departamento alterado</p>
                                    <p className="mt-1">Após salvar, aplique o kit padrão do novo setor.</p>
                                    <Button type="button" size="sm" variant="outline" className="mt-2" onClick={openKitModal}>
                                        Aplicar kit agora
                                    </Button>
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>
                </section>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-base font-semibold text-slate-800">Informações principais</CardTitle>
                            <p className="text-sm text-muted-foreground">Dados pessoais, vínculos e endereço do colaborador.</p>
                        </div>
                        <ClipboardList className="h-5 w-5 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-8">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="company_id" className="text-sm font-medium text-muted-foreground">Empresa</label>
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
                                    <label htmlFor="department_id" className="text-sm font-medium text-muted-foreground">Departamento</label>
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
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="position_id" className="text-sm font-medium text-muted-foreground">Cargo</label>
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
                                    <label htmlFor="status" className="text-sm font-medium text-muted-foreground">Status</label>
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
                                    <label htmlFor="name" className="text-sm font-medium text-muted-foreground">Nome completo</label>
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
                                    <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email</label>
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
                                    <label htmlFor="registration_number" className="text-sm font-medium text-muted-foreground">Matrícula</label>
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
                                    <label htmlFor="cpf" className="text-sm font-medium text-muted-foreground">CPF</label>
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
                                    <label htmlFor="rg" className="text-sm font-medium text-muted-foreground">RG</label>
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
                                    <label htmlFor="birth_date" className="text-sm font-medium text-muted-foreground">Data de nascimento</label>
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
                                    <label htmlFor="hire_date" className="text-sm font-medium text-muted-foreground">Data de admissão</label>
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
                                    <label htmlFor="termination_date" className="text-sm font-medium text-muted-foreground">Data de desligamento</label>
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
                                        <label htmlFor="address_street" className="text-sm font-medium text-muted-foreground">Rua</label>
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
                                        <label htmlFor="address_number" className="text-sm font-medium text-muted-foreground">Número</label>
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
                                        <label htmlFor="address_complement" className="text-sm font-medium text-muted-foreground">Complemento</label>
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
                                        <label htmlFor="address_district" className="text-sm font-medium text-muted-foreground">Bairro</label>
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
                                        <label htmlFor="address_city" className="text-sm font-medium text-muted-foreground">Cidade</label>
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
                                        <label htmlFor="address_state" className="text-sm font-medium text-muted-foreground">Estado</label>
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
                                        <label htmlFor="address_zip" className="text-sm font-medium text-muted-foreground">CEP</label>
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
