import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import InputError from '@/Components/InputError.jsx';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { inputBaseClass } from '@/lib/formStyles';

export default function Empresas({ companies = [] }) {
    const [editingCompany, setEditingCompany] = useState(null);

    const companyForm = useForm({
        name: '',
        legal_name: '',
        document: '',
        email: '',
        phone: '',
    });

    const deleteForm = useForm({});

    const startEditing = (company) => {
        setEditingCompany(company);
        companyForm.setData({
            name: company.name ?? '',
            legal_name: company.legal_name ?? '',
            document: company.document ?? '',
            email: company.email ?? '',
            phone: company.phone ?? '',
        });
    };

    const cancelEditing = () => {
        setEditingCompany(null);
        companyForm.reset();
    };

    const submit = (event) => {
        event.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                companyForm.reset();
                setEditingCompany(null);
            },
        };

        if (editingCompany) {
            companyForm.put(route('configuracoes.companies.update', editingCompany.id), options);
        } else {
            companyForm.post(route('configuracoes.companies.store'), options);
        }
    };

    const handleDelete = (company) => {
        if (!confirm(`Deseja realmente excluir a empresa "${company.name}"?`)) {
            return;
        }

        deleteForm.delete(route('configuracoes.companies.destroy', company.id), {
            preserveScroll: true,
            onSuccess: () => {
                if (editingCompany?.id === company.id) {
                    cancelEditing();
                }
            },
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Administrativo</h2>}>
            <Head title="Empresas" />

            <div className="space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-12">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Empresas</h1>
                    <p className="text-sm text-muted-foreground">
                        Cadastre e gerencie as empresas utilizadas em todos os cadastros do sistema.
                    </p>
                </div>
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-foreground">
                            {editingCompany ? 'Editar empresa' : 'Nova empresa'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="company_name" className="text-sm font-medium text-muted-foreground">
                                    Nome da empresa
                                </label>
                                <input
                                    id="company_name"
                                    type="text"
                                    className={inputBaseClass}
                                    value={companyForm.data.name}
                                    onChange={(event) => companyForm.setData('name', event.target.value)}
                                    required
                                />
                                <InputError message={companyForm.errors.name} />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="company_legal_name" className="text-sm font-medium text-muted-foreground">
                                    Razao social (opcional)
                                </label>
                                <input
                                    id="company_legal_name"
                                    type="text"
                                    className={inputBaseClass}
                                    value={companyForm.data.legal_name}
                                    onChange={(event) => companyForm.setData('legal_name', event.target.value)}
                                />
                                <InputError message={companyForm.errors.legal_name} />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="company_document" className="text-sm font-medium text-muted-foreground">
                                    Documento (CNPJ)
                                </label>
                                <input
                                    id="company_document"
                                    type="text"
                                    className={inputBaseClass}
                                    value={companyForm.data.document}
                                    onChange={(event) => companyForm.setData('document', event.target.value)}
                                />
                                <InputError message={companyForm.errors.document} />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="company_email" className="text-sm font-medium text-muted-foreground">
                                    E-mail
                                </label>
                                <input
                                    id="company_email"
                                    type="email"
                                    className={inputBaseClass}
                                    value={companyForm.data.email}
                                    onChange={(event) => companyForm.setData('email', event.target.value)}
                                />
                                <InputError message={companyForm.errors.email} />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="company_phone" className="text-sm font-medium text-muted-foreground">
                                    Telefone (opcional)
                                </label>
                                <input
                                    id="company_phone"
                                    type="text"
                                    className={inputBaseClass}
                                    value={companyForm.data.phone}
                                    onChange={(event) => companyForm.setData('phone', event.target.value)}
                                />
                                <InputError message={companyForm.errors.phone} />
                            </div>

                            <div className="flex items-center gap-3 md:col-span-2">
                                <Button type="submit" disabled={companyForm.processing}>
                                    {companyForm.processing
                                        ? 'Salvando...'
                                        : editingCompany
                                            ? 'Atualizar empresa'
                                            : 'Salvar empresa'}
                                </Button>
                                {editingCompany && (
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
                                            Empresa
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Contato
                                        </th>
                                        <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Acoes
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card">
                                    {companies.length === 0 ? (
                                        <tr>
                                            <td className="px-4 py-4 text-sm text-muted-foreground" colSpan={3}>
                                                Nenhuma empresa cadastrada.
                                            </td>
                                        </tr>
                                    ) : (
                                        companies.map((company) => (
                                            <tr key={company.id}>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-semibold text-foreground">{company.name}</p>
                                                    {company.document && (
                                                        <p className="text-xs text-muted-foreground">CNPJ: {company.document}</p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                                    {company.email ?? '—'}
                                                    {company.phone && (
                                                        <span className="block text-xs text-muted-foreground">{company.phone}</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => startEditing(company)}>
                                                            Editar
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(company)}
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
