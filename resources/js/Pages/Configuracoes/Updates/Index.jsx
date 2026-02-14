import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function buildVersionLabel(tag, commit) {
    const safeTag = tag ? String(tag) : null;
    const safeCommit = commit ? String(commit) : null;

    if (safeTag && safeCommit) {
        return `${safeTag} (${safeCommit})`;
    }

    return safeTag ?? safeCommit ?? 'indisponível';
}

export default function UpdatesIndex({ deploy = {} }) {
    const { flash = {} } = usePage().props;
    const runForm = useForm({});

    const currentVersion = buildVersionLabel(deploy.current_tag, deploy.current_commit ?? deploy.current_version);
    const remoteVersion = buildVersionLabel(deploy.remote_tag, deploy.remote_commit ?? deploy.remote_version);
    const behindCommits = deploy.behind_commits === null || deploy.behind_commits === undefined
        ? null
        : Number(deploy.behind_commits);
    const updateAvailable = Boolean(deploy.update_available) || (behindCommits !== null && behindCommits > 0);
    const logLines = Array.isArray(deploy.log_lines) ? deploy.log_lines : [];

    const runDeploy = (event) => {
        event.preventDefault();
        runForm.post(route('configuracoes.atualizacoes.run'), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Atualizações do sistema</h2>}>
            <Head title="Atualizações" />

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
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-semibold text-foreground">Painel de atualização</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Compare a versão atual com a mais recente do repositório e dispare o deploy quando necessário.
                                </p>
                            </div>
                            <Badge
                                variant={updateAvailable ? 'destructive' : 'outline'}
                                className={
                                    updateAvailable
                                        ? 'bg-rose-600 text-white'
                                        : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                }
                            >
                                {updateAvailable ? 'Atualização disponível' : 'Atualizado'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            <StatusItem label="Branch" value={deploy.branch ?? '-'} />
                            <StatusItem label="Versão atual" value={currentVersion} mono />
                            <StatusItem label="Nova versão" value={remoteVersion} mono />
                            <StatusItem
                                label="Atraso"
                                value={
                                    behindCommits === null
                                        ? '-'
                                        : behindCommits === 0
                                            ? '0 commits'
                                            : `${behindCommits} commit${behindCommits > 1 ? 's' : ''}`
                                }
                            />
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
                                    {runForm.processing ? 'Iniciando...' : deploy.running ? 'Em execução...' : 'Executar atualização'}
                                </Button>
                            </form>
                            <Button variant="outline" asChild>
                                <Link href={route('configuracoes.atualizacoes.index')} preserveScroll>
                                    Recarregar status
                                </Link>
                            </Button>
                            <span className="text-sm text-slate-600">
                                Status: <span className="font-semibold text-foreground">{deploy.running ? 'Executando' : 'Parado'}</span>
                            </span>
                        </div>

                        {!deploy.allow_web_trigger && (
                            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                                O gatilho web está desativado. Na VPS, defina <code>ALLOW_WEB_DEPLOY=true</code> no
                                <code> .env</code>.
                            </p>
                        )}
                        {!deploy.script_exists && (
                            <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                                Script de deploy não encontrado.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-foreground">
                            Log de atualização ({deploy.log_file ?? 'storage/logs/deploy.log'})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-[480px] w-full overflow-auto rounded-lg border border-border bg-slate-950 p-4">
                            <pre className="max-w-full whitespace-pre-wrap break-all text-xs leading-relaxed text-slate-100">{logLines.length ? logLines.join('\n') : 'Sem logs ainda.'}</pre>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

function StatusItem({ label, value, mono = false }) {
    return (
        <div className="rounded-lg border border-border bg-card/70 dark:bg-slate-950/40 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className={`mt-1 text-sm font-semibold text-foreground ${mono ? 'break-all font-mono' : ''}`}>{value}</p>
        </div>
    );
}
