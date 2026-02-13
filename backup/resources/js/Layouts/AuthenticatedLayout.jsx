import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Link, usePage } from '@inertiajs/react';
import clsx from 'clsx';
import { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    ArrowLeftRight,
    GraduationCap,
    AlertTriangle,
    Settings,
    Menu,
    X,
    Building2,
    GitBranch,
    IdCard,
    Warehouse,
    Shield,
} from 'lucide-react';

const navGroups = [
    {
        title: 'Operacional',
        items: [
            {
                label: 'Dashboard',
                routeName: 'dashboard',
                icon: LayoutDashboard,
                permission: 'view_dashboard',
            },
            {
                label: 'Funcionarios',
                routeName: 'funcionarios.index',
                icon: Users,
                permission: 'manage_employees',
            },
            {
                label: 'Entradas & Saidas',
                routeName: 'entradassaidas.index',
                icon: ArrowLeftRight,
                permission: 'manage_deliveries',
            },
        ],
    },
    {
        title: 'Administrativo',
        items: [
            {
                label: 'Empresas',
                routeName: 'administrativo.cadastros.empresas',
                icon: Building2,
                permission: 'manage_settings',
            },
            {
                label: 'Departamentos',
                routeName: 'administrativo.cadastros.departamentos',
                icon: GitBranch,
                permission: 'manage_settings',
            },
            {
                label: 'Cargos',
                routeName: 'administrativo.cadastros.cargos',
                icon: IdCard,
                permission: 'manage_settings',
            },
            {
                label: 'Estoque',
                routeName: 'administrativo.estoque.index',
                icon: Warehouse,
                permission: 'manage_inventory',
            },
        ],
    },
    {
        title: 'Gestao de Pessoas',
        items: [
            {
                label: 'Treinamentos & Exames',
                routeName: 'treinamentosexames.index',
                icon: GraduationCap,
                permission: 'manage_training',
            },
            {
                label: 'Acidentes & Relatorios',
                routeName: 'acidentesrelatorios.index',
                icon: AlertTriangle,
                permission: 'manage_reports',
            },
        ],
    },
    {
        title: 'Configuracoes',
        items: [
            {
                label: 'Preferencias do sistema',
                routeName: 'configuracoes.index',
                icon: Settings,
                permission: 'manage_settings',
            },
            {
                label: 'Usuario',
                routeName: 'configuracoes.usuarios.index',
                icon: Shield,
                permission: 'manage_users',
            },
        ],
    },
];

function buildLink(routeHelper, routeName) {
    if (!routeName) {
        return '#';
    }

    if (typeof routeHelper?.has === 'function' && !routeHelper.has(routeName)) {
        return '#';
    }

    try {
        return route(routeName, undefined, false);
    } catch (error) {
        return '#';
    }
}

export default function AuthenticatedLayout({ header, children }) {
    const { auth, branding } = usePage().props;
    const user = auth?.user ?? { name: 'Usuario' };
    const permissions = auth?.permissions ?? [];
    const hasPermission = (permission) => !permission || permissions.includes(permission);
    const filteredNavGroups = navGroups
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => hasPermission(item.permission)),
        }))
        .filter((group) => group.items.length > 0);
    const routeHelper = route();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const logoUrl = branding?.logo_url ?? null;

    const initials = user.name
        ?.split(' ')
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') ?? 'US';

    return (
        <div className="flex min-h-screen bg-slate-100">
            <aside
                className={clsx(
                    'fixed inset-y-0 left-0 z-30 w-72 transform border-r border-slate-200 bg-white shadow-sm transition-transform duration-200 lg:static lg:translate-x-0',
                    { '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen },
                )}
            >
                <div className="flex h-16 items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2 text-base font-semibold text-slate-900">
                        {logoUrl ? (
                            <>
                                <img src={logoUrl} alt="Logo" className="h-8 w-auto" />
                                <span className="sr-only">Gestao EPI</span>
                            </>
                        ) : (
                            <>
                                <ApplicationLogo className="h-8 w-8" />
                                <span>Gestao EPI</span>
                            </>
                        )}
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <Separator />
                <ScrollArea className="h-[calc(100vh-8rem)] px-4 py-4">
                    {filteredNavGroups.map((group) => (
                        <div key={group.title} className="mb-6">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                {group.title}
                            </p>
                            <nav className="space-y-1">
                                {group.items.map((item) => {
                                    const href = buildLink(routeHelper, item.routeName);
                                    const isActive =
                                        href !== '#'
                                            ? routeHelper?.current?.(`${item.routeName}`)
                                            : false;

                                    const IconComponent = item.icon;
                                    return (
                                        <Link
                                            key={item.label}
                                            href={href}
                                            className={clsx(
                                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100',
                                                isActive
                                                    ? 'bg-slate-900 text-white shadow'
                                                    : 'text-slate-600 hover:text-slate-900',
                                            )}
                                        >
                                            <IconComponent className="h-5 w-5" aria-hidden="true" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </ScrollArea>
                <Separator />
                <div className="flex items-center gap-3 px-6 py-4">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-slate-200 text-sm font-semibold text-slate-700">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                </div>
            </aside>

            <div className="flex flex-1 flex-col">
                <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setSidebarOpen((state) => !state)}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                            <NavigationMenu className="hidden lg:flex">
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuLink className="text-sm font-medium text-slate-600">
                                            Sistema modular
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                            {header && <div className="lg:pl-4">{header}</div>}
                        </div>

                        <Dropdown>
                            <Dropdown.Trigger>
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <span className="hidden text-sm font-medium text-slate-700 sm:inline-flex">
                                        {user.name}
                                    </span>
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-slate-200 text-xs font-semibold text-slate-700">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="end" className="w-48">
                                <Dropdown.Link href={route('profile.edit')}>
                                    Meu perfil
                                </Dropdown.Link>
                                <Dropdown.Link method="post" href={route('logout')} as="button">
                                    Sair
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <main className="flex-1 bg-slate-50">
                    <div className="min-h-[calc(100vh-4rem)]">{children}</div>
                </main>
            </div>
        </div>
    );
}
