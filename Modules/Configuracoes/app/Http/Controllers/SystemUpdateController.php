<?php

namespace Modules\Configuracoes\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\Process\Process;

class SystemUpdateController extends Controller
{
    public function index(): Response
    {
        $branch = config('deploy.branch', 'main');
        $scriptPath = base_path(config('deploy.script_path', 'scripts/deploy.sh'));
        $logPath = base_path(config('deploy.log_file', 'storage/logs/deploy.log'));
        $lockPath = base_path(config('deploy.lock_file', 'storage/app/deploy.lock'));

        $currentCommit = $this->resolveGitVersion('HEAD');
        $remoteCommit = $this->resolveRemoteVersion($branch);

        return Inertia::render('Configuracoes/Updates/Index', [
            'deploy' => [
                'branch' => $branch,
                'allow_web_trigger' => (bool) config('deploy.allow_web_trigger', false),
                'running' => File::exists($lockPath),
                'script_exists' => File::exists($scriptPath),
                // Keep legacy keys for backwards compatibility with the page.
                'current_version' => $currentCommit,
                'remote_version' => $remoteCommit,

                // Extra version metadata (more user-friendly than raw commit hashes).
                'current_commit' => $currentCommit,
                'remote_commit' => $remoteCommit,
                'current_tag' => $this->resolveGitTag('HEAD'),
                'remote_tag' => $this->resolveRemoteTag(),
                'behind_commits' => $this->resolveBehindCount($branch),
                'update_available' => $currentCommit && $remoteCommit && $currentCommit !== $remoteCommit,
                'log_lines' => $this->tailFile($logPath, 120),
                'log_file' => str_replace(base_path() . DIRECTORY_SEPARATOR, '', $logPath),
            ],
        ]);
    }

    public function run(): RedirectResponse
    {
        if (!config('deploy.allow_web_trigger', false)) {
            return back()->with('error', 'Execucao via painel desativada. Ative ALLOW_WEB_DEPLOY=true no .env da VPS.');
        }

        if (PHP_OS_FAMILY === 'Windows') {
            return back()->with('error', 'Execucao via painel foi projetada para Linux na VPS.');
        }

        $scriptRelativePath = config('deploy.script_path', 'scripts/deploy.sh');
        $scriptPath = base_path($scriptRelativePath);
        $lockPath = base_path(config('deploy.lock_file', 'storage/app/deploy.lock'));

        $currentCommit = $this->resolveGitVersion('HEAD');
        $remoteCommit = $this->resolveRemoteVersion($branch);

        if (!File::exists($scriptPath)) {
            return back()->with('error', 'Script de deploy nao encontrado em ' . $scriptRelativePath . '.');
        }

        if (File::exists($lockPath)) {
            return back()->with('warning', 'Ja existe uma atualizacao em execucao.');
        }

        $logPath = base_path(config('deploy.log_file', 'storage/logs/deploy.log'));
        File::ensureDirectoryExists(dirname($logPath));
        if (!File::exists($logPath)) {
            File::put($logPath, '');
        }

        $command = sprintf(
            'cd %s && nohup bash %s >> %s 2>&1 &',
            escapeshellarg(base_path()),
            escapeshellarg($scriptRelativePath),
            escapeshellarg(config('deploy.log_file', 'storage/logs/deploy.log'))
        );

        Process::fromShellCommandline($command, base_path())->run();

        return back()->with('success', 'Atualizacao iniciada. Recarregue esta pagina para acompanhar o log.');
    }

    private function resolveGitVersion(string $reference): ?string
    {
        $output = $this->runCommand(['git', 'rev-parse', '--short', $reference]);

        return $output !== '' ? $output : null;
    }

    private function resolveRemoteVersion(string $branch): ?string
    {
        $output = $this->runCommand(['git', 'ls-remote', '--heads', 'origin', $branch]);
        if ($output === '') {
            return null;
        }

        [$hash] = preg_split('/\s+/', $output);

        return $hash ? substr($hash, 0, 7) : null;
    }

    private function runCommand(array $command): string
    {
        $process = new Process($command, base_path(), timeout: 8);
        $process->run();

        if (!$process->isSuccessful()) {
            return '';
        }

        return trim($process->getOutput());
    }

    

    private function resolveGitTag(string $reference): ?string
    {
        // Returns the closest reachable tag (e.g. v1.2.3). Empty when none.
        $output = $this->runCommand(['git', 'describe', '--tags', '--abbrev=0', $reference]);

        return $output !== '' ? $output : null;
    }

    private function resolveRemoteTag(): ?string
    {
        // Returns the latest tag name on origin, sorted by version-like name.
        // Note: this does not fetch; it queries the remote directly.
        $output = $this->runCommand(['git', 'ls-remote', '--tags', '--sort=-v:refname', 'origin']);
        if ($output === '') {
            return null;
        }

        foreach (preg_split('/?
/', trim($output)) as $line) {
            if ($line === '' || str_contains($line, '^{}')) {
                continue;
            }

            [, $ref] = preg_split('/\s+/', $line, 2);
            if (!$ref) {
                continue;
            }

            $tag = str_replace('refs/tags/', '', trim($ref));
            if ($tag !== '') {
                return $tag;
            }
        }

        return null;
    }

    private function resolveBehindCount(string $branch): ?int
    {
        // If the server has a tracked origin/<branch>, show how many commits it's behind.
        $remoteRef = "origin/{$branch}";

        $hasRemote = $this->runCommand(['git', 'rev-parse', '--verify', $remoteRef]);
        if ($hasRemote === '') {
            return null;
        }

        $output = $this->runCommand(['git', 'rev-list', '--count', "HEAD..{$remoteRef}"]);
        if ($output === '' || !is_numeric($output)) {
            return null;
        }

        return (int) $output;
    }
private function tailFile(string $path, int $maxLines = 120): array
    {
        if (!File::exists($path)) {
            return [];
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES);
        if ($lines === false) {
            return [];
        }

        return array_slice($lines, -$maxLines);
    }
}
