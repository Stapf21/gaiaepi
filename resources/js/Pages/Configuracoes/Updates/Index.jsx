import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function UpdatesIndex({ deploy = {} }) {
    const { flash = {} } = usePage().props;
    const runForm = useForm({});

    const currentVersion = deploy.current_version ?? 'indisponivel';
    const remoteVersion = deploy.remote_version ?? 'indisponivel';
    const updateAvailable =
        deploy.current_version && deploy.remote_version && deploy.current_version !== deploy.remote_version;
    const logLines = Array.isArray(deploy.log_lines) ? deploy.log_lines : [];

    const runDeploy = (event) => {
        event.preventDefault();
        runForm.post(route('configuracoes.atualizacoes.run'), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Atualizacoes do sistema</h2>}>
            <Head title="Atualizacoes" />

            <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-10 pt-6 lg:px-8">
                {(flash.success || flash.warning || flash.error) && (
                    <div className="space-y-2">
                        {flash.success && (
                            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                                {flash.success}
                            </p>
                        )}
                        {flash.warning && (
                            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                                {flash.warning}
                            </p>
                        )}
                        {flash.error && (
                            <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                                {flash.error}
                            </p>
                        )}
                    </div>
                )}

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-900">Painel de deploy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            <StatusItem label="Branch" value={deploy.branch ?? '-'} />
                            <StatusItem label="Versao atual" value={currentVersion} />
                            <StatusItem label="Ultima remota" value={remoteVersion} />
                            <StatusItem label="Status" value={deploy.running ? 'Executando' : 'Parado'} />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <form onSubmit={runDeploy}>
                                <Button
                                    type="submit"
                                    disabled={
                                        runForm.processing ||
                                        deploy.running ||
                                        !deploy.allow_web_trigger ||
                                        !deploy.script_exists
                                    }
                                >
                                    {runForm.processing ? 'Iniciando...' : 'Executar atualizacao'}
                                </Button>
                            </form>
                            <Button variant="outline" asChild>
                                <Link href={route('configuracoes.atualizacoes.index')} preserveScroll>
                                    Recarregar status
                                </Link>
                            </Button>
                            {updateAvailable ? (
                                <span className="text-sm font-medium text-emerald-700">
                                    Existe atualizacao disponivel.
                                </span>
                            ) : (
                                <span className="text-sm text-slate-600">
                                    Sistema sincronizado ou sem comparacao remota.
                                </span>
                            )}
                        </div>

                        {!deploy.allow_web_trigger && (
                            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                                O gatilho web esta desativado. Na VPS, defina <code>ALLOW_WEB_DEPLOY=true</code> no
                                <code> .env</code>.
                            </p>
                        )}
                        {!deploy.script_exists && (
                            <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                                Script de deploy nao encontrado.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-900">
                            Log de atualizacao ({deploy.log_file ?? 'storage/logs/deploy.log'})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="max-h-[480px] max-w-full overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
                            {logLines.length ? logLines.join('\n') : 'Sem logs ainda.'}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

function StatusItem({ label, value }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
        </div>
    );
}
