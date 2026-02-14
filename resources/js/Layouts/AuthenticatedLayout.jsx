import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Link, router, usePage } from '@inertiajs/react';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { getSystemTheme, getStoredTheme, setStoredTheme } from '@/lib/theme';
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
    Rocket,
    Laptop,
    Moon,
    Sun,
}
 from 'lucide-react';

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
                label: 'Atualizacoes',
                routeName: 'configuracoes.atualizacoes.index',
                icon: Rocket,
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
    const [theme, setTheme] = useState(() => getStoredTheme());

        useEffect(() => {
        const serverTheme = (user?.theme_preference ?? 'system');
        if (serverTheme !== theme) {
            setStoredTheme(serverTheme);
            setTheme(serverTheme);
        }
    }, [user?.theme_preference]);

const themeLabel = useMemo(() => {
        if (theme === 'dark') return 'Escuro';
        if (theme === 'light') return 'Claro';
        return 'Sistema';
    }, [theme]);

        const resolvedTheme = useMemo(() => (theme === 'system' ? getSystemTheme() : theme), [theme]);
    const isDark = resolvedTheme === 'dark';

const changeTheme = (next) => {
        setStoredTheme(next);
        setTheme(next);

        // Persist for this user (keeps across devices).
        router.put(route('preferences.theme.update'), { theme: next }, {
            preserveScroll: true,
            preserveState: true,
        });
    };
    const logoUrl = branding?.logo_url ?? null;

    const initials = user.name
        ?.split(' ')
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') ?? 'US';

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {sidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-20 bg-slate-900/30 backdrop-blur-[1px] lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Fechar menu lateral"
                />
            )}
            <aside
                className={clsx(
                    'fixed inset-y-0 left-0 z-30 w-72 transform border-r border-border bg-gradient-to-b from-background via-background to-muted/30 shadow-xl transition-transform duration-200 lg:static lg:translate-x-0 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40',
                    { '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen },
                )}
            >
                <div className="flex h-20 items-center justify-between px-5">
                    <Link href="/" className="flex items-center gap-3 text-base font-semibold text-foreground">
                        {logoUrl ? (
                            <>
                                <img
                                    src={logoUrl}
                                    alt="Logo"
                                    className="h-10 w-auto max-w-[130px] object-contain"
                                />
                                <span className="sr-only">Gestao EPI</span>
                            </>
                        ) : (
                            <>
                                <ApplicationLogo className="h-8 w-8" />
                                <div className="leading-tight">
                                    <span className="block">Gestao EPI</span>
                                    <span className="block text-xs font-medium text-muted-foreground">Painel operacional</span>
                                </div>
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
                <ScrollArea className="h-[calc(100vh-9rem)] px-3 py-4">
                    {filteredNavGroups.map((group) => (
                        <div key={group.title} className="mb-6">
                            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
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
                                                'group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition',
                                                isActive
                                                    ? 'border-slate-900 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md dark:border-slate-200 dark:from-slate-50 dark:to-slate-200 dark:text-slate-900'
                                                    : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-950/60 dark:hover:text-white',
                                            )}
                                        >
                                            <IconComponent
                                                className={clsx(
                                                    'h-5 w-5 transition-transform',
                                                    isActive ? 'scale-105 text-white dark:text-slate-900' : 'text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200',
                                                )}
                                                aria-hidden="true"
                                            />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </ScrollArea>
                <Separator />
                <div className="flex items-center gap-3 px-5 py-4">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-muted text-sm font-semibold text-foreground">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                </div>
            </aside>

            <div className="flex flex-1 flex-col">
                <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
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
                                        <NavigationMenuLink className="text-sm font-medium text-muted-foreground">
                                            Sistema modular
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                            {header && <div className="lg:pl-4">{header}</div>}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => changeTheme(isDark ? 'light' : 'dark')}
                                aria-label="Alternar tema"
                                title="Alternar tema"
                            >
                                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>

                            <Dropdown>
                            <Dropdown.Trigger>
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <span className="hidden text-sm font-medium text-foreground sm:inline-flex">
                                        {user.name}
                                    </span>
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-muted text-xs font-semibold text-foreground">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="end" className="w-56">
                                <div className="px-3 pb-2 pt-2">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tema</p>
                                    <div className="mt-2 grid grid-cols-3 gap-1">
                                        <button
                                            type="button"
                                            onClick={() => changeTheme('system')}
                                            className={clsx(
                                                'flex items-center justify-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition',
                                                theme === 'system'
                                                    ? 'border-border bg-accent text-accent-foreground'
                                                    : 'border-transparent text-muted-foreground hover:border-border hover:bg-accent/60 hover:text-foreground',
                                            )}
                                            title="Sistema"
                                        >
                                            <Laptop className="h-3.5 w-3.5" />
                                            Sistema
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => changeTheme('light')}
                                            className={clsx(
                                                'flex items-center justify-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition',
                                                theme === 'light'
                                                    ? 'border-border bg-accent text-accent-foreground'
                                                    : 'border-transparent text-muted-foreground hover:border-border hover:bg-accent/60 hover:text-foreground',
                                            )}
                                            title="Claro"
                                        >
                                            <Sun className="h-3.5 w-3.5" />
                                            Claro
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => changeTheme('dark')}
                                            className={clsx(
                                                'flex items-center justify-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition',
                                                theme === 'dark'
                                                    ? 'border-border bg-accent text-accent-foreground'
                                                    : 'border-transparent text-muted-foreground hover:border-border hover:bg-accent/60 hover:text-foreground',
                                            )}
                                            title="Escuro"
                                        >
                                            <Moon className="h-3.5 w-3.5" />
                                            Escuro
                                        </button>
                                    </div>
                                    <p className="mt-2 text-[11px] text-muted-foreground">Atual: <span className="font-medium text-foreground">{themeLabel}</span></p>
                                </div>
                                <Separator />
                                <Dropdown.Link href={route('profile.edit')}>
                                    Meu perfil
                                </Dropdown.Link>
                                <Dropdown.Link method="post" href={route('logout')} as="button">
                                    Sair
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                        </div>
                    </div>
                </header>

                <main className="flex-1 bg-muted/20 dark:bg-background">
                    <div className="min-h-[calc(100vh-4rem)]">{children}</div>
                </main>
            </div>
        </div>
    );
}
