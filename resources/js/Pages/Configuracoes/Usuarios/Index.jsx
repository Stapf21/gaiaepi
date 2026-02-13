import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import InputError from '@/Components/InputError.jsx';
import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const roleLabel = (name) =>
    name
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

export default function UsuariosIndex({ users = [], roles = [], permissions = [] }) {
    const [editingUser, setEditingUser] = useState(null);
    const [editingRole, setEditingRole] = useState(null);

    const userForm = useForm({
        name: '',
        email: '',
        password: '',
        roles: [],
    });

    const roleForm = useForm({
        name: '',
        permissions: [],
    });

    const deleteUserForm = useForm({});
    const deleteRoleForm = useForm({});

    const resetUserForm = () => {
        setEditingUser(null);
        userForm.reset({
            name: '',
            email: '',
            password: '',
            roles: [],
        });
        userForm.clearErrors();
    };

    const resetRoleForm = () => {
        setEditingRole(null);
        roleForm.reset({
            name: '',
            permissions: [],
        });
        roleForm.clearErrors();
    };

    const startEditUser = (user) => {
        setEditingUser(user);
        userForm.setData({
            name: user.name,
            email: user.email,
            password: '',
            roles: user.roles ?? [],
        });
    };

    const startEditRole = (role) => {
        setEditingRole(role);
        roleForm.setData({
            name: role.name,
            permissions: role.permissions ?? [],
        });
    };

    const toggleUserRole = (roleName) => {
        const current = Array.isArray(userForm.data.roles) ? userForm.data.roles : [];
        if (current.includes(roleName)) {
            userForm.setData(
                'roles',
                current.filter((role) => role !== roleName),
            );
        } else {
            userForm.setData('roles', [...current, roleName]);
        }
    };

    const toggleRolePermission = (permissionName) => {
        const current = Array.isArray(roleForm.data.permissions) ? roleForm.data.permissions : [];
        if (current.includes(permissionName)) {
            roleForm.setData(
                'permissions',
                current.filter((permission) => permission !== permissionName),
            );
        } else {
            roleForm.setData('permissions', [...current, permissionName]);
        }
    };

    const submitUser = (event) => {
        event.preventDefault();

        if (editingUser) {
            userForm.put(route('configuracoes.usuarios.update', editingUser.id), {
                preserveScroll: true,
                onSuccess: resetUserForm,
            });
        } else {
            userForm.post(route('configuracoes.usuarios.store'), {
                preserveScroll: true,
                onSuccess: resetUserForm,
            });
        }
    };

    const submitRole = (event) => {
        event.preventDefault();

        if (editingRole) {
            roleForm.put(route('configuracoes.roles.update', editingRole.id), {
                preserveScroll: true,
                onSuccess: resetRoleForm,
            });
        } else {
            roleForm.post(route('configuracoes.roles.store'), {
                preserveScroll: true,
                onSuccess: resetRoleForm,
            });
        }
    };

    const deleteUser = (user) => {
        if (!window.confirm(`Excluir o usuario ${user.name}?`)) {
            return;
        }

        deleteUserForm.delete(route('configuracoes.usuarios.destroy', user.id), {
            preserveScroll: true,
        });
    };

    const deleteRole = (role) => {
        if (!window.confirm(`Excluir o perfil ${role.name}?`)) {
            return;
        }

        deleteRoleForm.delete(route('configuracoes.roles.destroy', role.id), {
            preserveScroll: true,
        });
    };

    const permissionsGrouped = useMemo(
        () =>
            permissions.map((permission) => ({
                name: permission.name,
                label: permission.label ?? roleLabel(permission.name),
            })),
        [permissions],
    );

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Usuarios & Permissoes</h2>}>
            <Head title="Usuarios & Permissoes" />

            <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-10 pt-6 lg:grid-cols-2 lg:px-8">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-900">
                            Usuarios do sistema
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="overflow-hidden rounded-lg border border-slate-200">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Perfis</TableHead>
                                        <TableHead className="w-40 text-right">Acoes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length ? (
                                        users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium text-slate-800">{user.name}</TableCell>
                                                <TableCell className="text-sm text-slate-600">{user.email}</TableCell>
                                                <TableCell className="text-sm text-slate-600">
                                                    {user.roles?.length ? user.roles.join(', ') : 'Nenhum'}
                                                </TableCell>
                                                <TableCell className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => startEditUser(user)}>
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => deleteUser(user)}
                                                        disabled={deleteUserForm.processing}
                                                    >
                                                        Excluir
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                                                Nenhum usuario cadastrado.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <form onSubmit={submitUser} className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    {editingUser ? 'Editar usuario' : 'Novo usuario'}
                                </h3>
                                {editingUser && (
                                    <Button type="button" variant="ghost" size="sm" onClick={resetUserForm}>
                                        Cancelar edicao
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="user-name" className="text-sm font-medium text-slate-700">
                                    Nome
                                </label>
                                <input
                                    id="user-name"
                                    type="text"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                                    value={userForm.data.name}
                                    onChange={(event) => userForm.setData('name', event.target.value)}
                                    required
                                />
                                <InputError message={userForm.errors.name} />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="user-email" className="text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <input
                                    id="user-email"
                                    type="email"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                                    value={userForm.data.email}
                                    onChange={(event) => userForm.setData('email', event.target.value)}
                                    required
                                />
                                <InputError message={userForm.errors.email} />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="user-password" className="text-sm font-medium text-slate-700">
                                    {editingUser ? 'Senha (opcional)' : 'Senha temporaria'}
                                </label>
                                <input
                                    id="user-password"
                                    type="password"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                                    value={userForm.data.password}
                                    onChange={(event) => userForm.setData('password', event.target.value)}
                                    placeholder={editingUser ? 'Informe para atualizar' : 'Minimo 8 caracteres'}
                                    {...(editingUser ? {} : { required: true })}
                                />
                                <InputError message={userForm.errors.password} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-slate-700">Perfis de acesso</p>
                                <div className="flex flex-wrap gap-3">
                                    {roles.map((role) => (
                                        <label key={role.id} className="flex items-center gap-2 text-sm text-slate-600">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-slate-300 text-slate-700 focus:ring-slate-500"
                                                checked={userForm.data.roles.includes(role.name)}
                                                onChange={() => toggleUserRole(role.name)}
                                            />
                                            <span>{roleLabel(role.name)}</span>
                                        </label>
                                    ))}
                                </div>
                                <InputError message={userForm.errors.roles} />
                            </div>
                            <div className="flex justify-end gap-3">
                                {editingUser && (
                                    <Button type="button" variant="outline" onClick={resetUserForm}>
                                        Cancelar
                                    </Button>
                                )}
                                <Button type="submit" disabled={userForm.processing}>
                                    {userForm.processing ? 'Salvando...' : editingUser ? 'Atualizar usuario' : 'Criar usuario'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-900">Perfis e permissoes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="overflow-hidden rounded-lg border border-slate-200">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Perfil</TableHead>
                                        <TableHead>Permissoes</TableHead>
                                        <TableHead className="w-40 text-right">Acoes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.length ? (
                                        roles.map((role) => (
                                            <TableRow key={role.id}>
                                                <TableCell className="font-medium text-slate-800">{roleLabel(role.name)}</TableCell>
                                                <TableCell className="text-sm text-slate-600">
                                                    {role.permissions?.length ? role.permissions.join(', ') : 'Nenhuma'}
                                                </TableCell>
                                                <TableCell className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => startEditRole(role)}>
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => deleteRole(role)}
                                                        disabled={deleteRoleForm.processing}
                                                    >
                                                        Excluir
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                                                Nenhum perfil cadastrado.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <form onSubmit={submitRole} className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    {editingRole ? 'Editar perfil' : 'Novo perfil'}
                                </h3>
                                {editingRole && (
                                    <Button type="button" variant="ghost" size="sm" onClick={resetRoleForm}>
                                        Cancelar edicao
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="role-name" className="text-sm font-medium text-slate-700">
                                    Nome do perfil
                                </label>
                                <input
                                    id="role-name"
                                    type="text"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                                    value={roleForm.data.name}
                                    onChange={(event) => roleForm.setData('name', event.target.value)}
                                    required
                                />
                                <InputError message={roleForm.errors.name} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-slate-700">Permissoes</p>
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                    {permissionsGrouped.map((permission) => (
                                        <label key={permission.name} className="flex items-center gap-2 text-sm text-slate-600">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-slate-300 text-slate-700 focus:ring-slate-500"
                                                checked={roleForm.data.permissions.includes(permission.name)}
                                                onChange={() => toggleRolePermission(permission.name)}
                                            />
                                            <span>{permission.label}</span>
                                        </label>
                                    ))}
                                </div>
                                <InputError message={roleForm.errors.permissions} />
                            </div>
                            <div className="flex justify-end gap-3">
                                {editingRole && (
                                    <Button type="button" variant="outline" onClick={resetRoleForm}>
                                        Cancelar
                                    </Button>
                                )}
                                <Button type="submit" disabled={roleForm.processing}>
                                    {roleForm.processing ? 'Salvando...' : editingRole ? 'Atualizar perfil' : 'Criar perfil'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
