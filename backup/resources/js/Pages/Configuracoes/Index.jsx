import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import Modal from '@/Components/Modal.jsx';
import InputError from '@/Components/InputError.jsx';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { textareaBaseClass } from '@/lib/formStyles';

export default function ConfiguracoesIndex({ groups = {}, branding = {}, can = {} }) {
    const groupKeys = Object.keys(groups);
    const [editing, setEditing] = useState(null);

    const editableSetting = useMemo(() => {
        if (!editing) {
            return null;
        }

        return groups?.documents?.find((setting) => setting.key === editing) ?? null;
    }, [editing, groups]);

    const { data, setData, post, processing, errors, reset } = useForm({
        settings: editableSetting
            ? [{ key: editableSetting.key, value: editableSetting.value ?? '' }]
            : [],
    });

    const startEditing = (setting) => {
        setEditing(setting.key);
        setData('settings', [
            {
                key: setting.key,
                value: setting.value ?? '',
            },
        ]);
    };

    const closeEditing = () => {
        setEditing(null);
        reset('settings');
    };

    const submitSetting = (event) => {
        event.preventDefault();
        post(route('configuracoes.store'), {
            preserveScroll: true,
            onSuccess: closeEditing,
        });
    };

    const brandingForm = useForm({
        logo: null,
        favicon: null,
        login_background: null,
        login_background_link: branding?.login_background_link ?? '',
        clear_login_background: false,
    });

    const logoInputRef = useRef(null);
    const faviconInputRef = useRef(null);
    const backgroundInputRef = useRef(null);

    useEffect(() => {
        const currentLink = branding?.login_background_link ?? '';
        if (brandingForm.data.login_background_link !== currentLink) {
            brandingForm.setData('login_background_link', currentLink);
        }

        if (brandingForm.data.clear_login_background) {
            brandingForm.setData('clear_login_background', false);
        }
    }, [branding?.login_background_link]);

    const normalizedBackgroundLink = (brandingForm.data.login_background_link ?? '').trim();
    const currentBackgroundLink = (branding?.login_background_link ?? '').trim();
    const hasBrandingChanges = Boolean(
        brandingForm.data.logo ||
            brandingForm.data.favicon ||
            brandingForm.data.login_background ||
            brandingForm.data.clear_login_background ||
            normalizedBackgroundLink !== currentBackgroundLink,
    );

    const submitBranding = (event) => {
        event.preventDefault();

        if (!hasBrandingChanges) {
            return;
        }

        brandingForm.post(route('configuracoes.branding.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                brandingForm.reset({
                    logo: null,
                    favicon: null,
                    login_background: null,
                    login_background_link: '',
                    clear_login_background: false,
                });
                if (logoInputRef.current) {
                    logoInputRef.current.value = '';
                }
                if (faviconInputRef.current) {
                    faviconInputRef.current.value = '';
                }
                if (backgroundInputRef.current) {
                    backgroundInputRef.current.value = '';
                }
            },
        });
    };

    const defaultTab = groupKeys[0] ?? (can.manageBranding ? 'branding' : undefined);

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Preferencias do sistema</h2>}>
            <Head title="Configuracoes" />

            <div className="space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-12">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-900">
                            Parametros do sistema
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {defaultTab ? (
                            <Tabs defaultValue={defaultTab} className="w-full">
                                <TabsList className="flex flex-wrap gap-2 bg-slate-100 p-1">
                                    {groupKeys.map((group) => (
                                        <TabsTrigger key={group} value={group} className="capitalize">
                                            {group.replace('_', ' ')}
                                        </TabsTrigger>
                                    ))}
                                    {can.manageBranding && <TabsTrigger value="branding">Identidade visual</TabsTrigger>}
                                </TabsList>
                                {groupKeys.map((group) => (
                                    <TabsContent key={group} value={group} className="mt-4">
                                        <div className="space-y-4">
                                            {groups[group].map((setting) => (
                                                <div
                                                    key={setting.id}
                                                    className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-800">
                                                                {setting.label}
                                                            </p>
                                                            <p className="text-xs text-slate-500">{setting.key}</p>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={setting.key !== 'documents.epi_delivery_declaration'}
                                                            onClick={() => startEditing(setting)}
                                                        >
                                                            Editar
                                                        </Button>
                                                    </div>
                                                    <Separator className="my-3" />
                                                    <p className="text-sm text-muted-foreground">
                                                        Valor atual: <strong>{setting.value ?? '-'}</strong>
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                ))}
                                {can.manageBranding && (
                                    <TabsContent value="branding" className="mt-4">
                                        <form onSubmit={submitBranding} className="space-y-6">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-3">
                                                    <p className="text-sm font-medium text-slate-800">Logo principal</p>
                                                    {branding.logo_url ? (
                                                        <img
                                                            src={branding.logo_url}
                                                            alt="Logo atual"
                                                            className="h-16 w-auto rounded border border-slate-200 bg-white object-contain p-2"
                                                        />
                                                    ) : (
                                                        <p className="text-xs text-muted-foreground">Nenhuma imagem configurada.</p>
                                                    )}
                                                    <input
                                                        ref={logoInputRef}
                                                        id="logo"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(event) => brandingForm.setData('logo', event.target.files?.[0] ?? null)}
                                                    />
                                                    <div className="flex items-center gap-3">
                                                        <Button type="button" variant="outline" onClick={() => logoInputRef.current?.click()}>
                                                            Selecionar arquivo
                                                        </Button>
                                                        {brandingForm.data.logo && (
                                                            <p className="text-xs text-slate-500">{brandingForm.data.logo.name}</p>
                                                        )}
                                                    </div>
                                                    <InputError message={brandingForm.errors.logo} />
                                                </div>
                                                <div className="space-y-3">
                                                    <p className="text-sm font-medium text-slate-800">Favicon</p>
                                                    {branding.favicon_url ? (
                                                        <img
                                                            src={branding.favicon_url}
                                                            alt="Favicon atual"
                                                            className="h-12 w-12 rounded border border-slate-200 bg-white object-contain p-2"
                                                        />
                                                    ) : (
                                                        <p className="text-xs text-muted-foreground">Nenhum favicon configurado.</p>
                                                    )}
                                                    <input
                                                        ref={faviconInputRef}
                                                        id="favicon"
                                                        type="file"
                                                        accept="image/png,image/x-icon,image/svg+xml"
                                                        className="hidden"
                                                        onChange={(event) => brandingForm.setData('favicon', event.target.files?.[0] ?? null)}
                                                    />
                                                    <div className="flex items-center gap-3">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => faviconInputRef.current?.click()}
                                                        >
                                                            Selecionar arquivo
                                                        </Button>
                                                        {brandingForm.data.favicon && (
                                                            <p className="text-xs text-slate-500">{brandingForm.data.favicon.name}</p>
                                                        )}
                                                    </div>
                                                    <InputError message={brandingForm.errors.favicon} />
                                                </div>
                                            </div>

                                            <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                    <p className="text-sm font-medium text-slate-800">Fundo da tela de login</p>
                                                    {brandingForm.data.clear_login_background && (
                                                        <span className="text-xs font-semibold text-amber-600">
                                                            Fundo será removido
                                                        </span>
                                                    )}
                                                </div>
                                                {branding.login_background_url ? (
                                                    <img
                                                        src={branding.login_background_url}
                                                        alt="Fundo atual"
                                                        className="h-32 w-full rounded-md border border-slate-200 object-cover"
                                                    />
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">
                                                        Nenhuma imagem configurada.
                                                    </p>
                                                )}
                                                <input
                                                    ref={backgroundInputRef}
                                                    id="login_background"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(event) => {
                                                        const file = event.target.files?.[0] ?? null;
                                                        brandingForm.setData('login_background', file);
                                                        if (file) {
                                                            brandingForm.setData('clear_login_background', false);
                                                        }
                                                    }}
                                                />
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <Button type="button" variant="outline" onClick={() => backgroundInputRef.current?.click()}>
                                                        Selecionar arquivo
                                                    </Button>
                                                    {brandingForm.data.login_background && (
                                                        <p className="text-xs text-slate-500">
                                                            {brandingForm.data.login_background.name}
                                                        </p>
                                                    )}
                                                </div>
                                                <InputError message={brandingForm.errors.login_background} />

                                                <div className="space-y-2">
                                                    <label htmlFor="login_background_link" className="text-sm font-medium text-slate-700">
                                                        Ou definir um link de imagem
                                                    </label>
                                                    <input
                                                        id="login_background_link"
                                                        type="url"
                                                        placeholder="https://exemplo.com/imagem.jpg"
                                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                                                        value={brandingForm.data.login_background_link}
                                                        onChange={(event) => {
                                                            brandingForm.setData('login_background_link', event.target.value);
                                                            brandingForm.setData('clear_login_background', false);
                                                        }}
                                                    />
                                                    <InputError message={brandingForm.errors.login_background_link} />
                                                </div>

                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="flex flex-wrap gap-3">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => {
                                                                brandingForm.setData('login_background', null);
                                                                brandingForm.setData('login_background_link', '');
                                                                brandingForm.setData('clear_login_background', true);
                                                                if (backgroundInputRef.current) {
                                                                    backgroundInputRef.current.value = '';
                                                                }
                                                            }}
                                                        >
                                                            Remover fundo
                                                        </Button>
                                                    </div>
                                                    <p className="text-xs text-slate-500">
                                                        {branding.login_background_is_default
                                                            ? 'Utilizando o fundo padrão do sistema.'
                                                            : 'Visualização atual conforme imagem acima.'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <Button type="submit" disabled={brandingForm.processing || !hasBrandingChanges}>
                                                    {brandingForm.processing ? 'Salvando...' : 'Salvar identidade visual'}
                                                </Button>
                                            </div>
                                        </form>
                                    </TabsContent>
                                )}
                            </Tabs>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Nenhuma configuracao cadastrada ainda.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Modal show={!!editableSetting} onClose={closeEditing}>
                <form onSubmit={submitSetting}>
                    <div className="space-y-4 p-6">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">
                                Editar declaracao da ficha de entrega
                            </h3>
                            <p className="text-sm text-slate-500">
                                Ajuste o texto exibido na declaracao do documento de entrega de EPI.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="declaration" className="text-sm font-medium text-slate-700">
                                Declaracao
                            </label>
                            <textarea
                                id="declaration"
                                rows={6}
                                className={textareaBaseClass}
                                value={data.settings?.[0]?.value ?? ''}
                                onChange={(event) =>
                                    setData('settings', [
                                        {
                                            key: 'documents.epi_delivery_declaration',
                                            value: event.target.value,
                                        },
                                    ])
                                }
                            />
                            <InputError message={errors['settings.0.value']} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
                        <Button type="button" variant="outline" onClick={closeEditing}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
