# Deploy automatizado (VPS)

## 1) Pipeline (GitHub Actions)

Arquivo: `.github/workflows/deploy.yml`

Configure estes secrets no repositório:

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
- `VPS_PORT` (opcional, padrao 22)
- `VPS_APP_PATH` (caminho da aplicacao na VPS)

Ao fazer `push` na `main`, o workflow conecta via SSH e executa `scripts/deploy.sh`.

## 2) Script idempotente

Arquivo: `scripts/deploy.sh`

O script:

- usa lock file (`storage/app/deploy.lock`) para evitar execucao concorrente
- gera log em `storage/logs/deploy.log`
- valida repositorio limpo
- executa `git pull --ff-only`
- executa `composer install`, migracoes e otimizacoes do Laravel
- opcionalmente executa `npm ci && npm run build`

## 3) Painel web de atualizacoes

Rota: `/configuracoes/atualizacoes`  
Permissao: `manage_settings`

Para permitir executar deploy via botao web, habilite na VPS:

```env
ALLOW_WEB_DEPLOY=true
DEPLOY_BRANCH=main
DEPLOY_SCRIPT_PATH=scripts/deploy.sh
DEPLOY_LOG_FILE=storage/logs/deploy.log
DEPLOY_LOCK_FILE=storage/app/deploy.lock
```

Depois rode:

```bash
php artisan config:clear
php artisan optimize
```

## 4) Seguranca recomendada

- acesso ao painel apenas para perfis administradores
- branch protegida no GitHub
- deploy key SSH exclusiva e sem senha no CI
- backups de banco antes de mudancas estruturais
