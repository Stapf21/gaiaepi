# Progresso do Sistema de Gestão de EPI

## Visão Geral Atual
- Base construída em Laravel 12 com Breeze (React + Inertia), Tailwind CSS e shadcn/ui.
- Estrutura modular configurada com `nwidart/laravel-modules` e módulos iniciais criados.
- Seeds criaram papéis iniciais (admin, gerente, coordenador, líder) e usuário administrador padrão.

## Funcionalidades Implementadas
- **Arquitetura**: módulos Dashboard, Configurações, Funcionários, Catálogo de EPIs, Entradas/Saídas, Treinamentos/Exames e Acidentes/Relatórios já possuem rotas, controladores iniciais, repositórios e models.
- **Migrations**: tabelas principais para funcionários, EPIs, estoque, movimentações, treinamentos, exames e acidentes criadas.
- **Seeds**: dados básicos de roles/perfis e estrutura mínima do sistema.
- **Frontend**: páginas React/Inertia com listagem/resumo inicial para cada módulo; layout global com Tailwind + shadcn/ui.

## Pendências Críticas
- Ajustar namespaces PSR-4 restantes dentro dos módulos (ex.: repositórios e models que ainda apontam para caminhos antigos como `Modules\Funcionarios\App\Models`).
- Executar `composer dump-autoload` após a correção dos namespaces e garantir que não haja erros.
- Implementar operações completas de CRUD, validação e regras de negócio para cada módulo.
- Construir serviços de domínio para controle de estoque, alertas de validade e geração de relatórios/PDF.
- Aplicar permissões (Spatie) nas rotas e componentes de interface.
- Preencher seeds ou factories com dados de teste realistas.
- Escrever testes automatizados (feature/integration) cobrindo fluxos principais.

## Próximos Passos Recomendados
1. Revisar e corrigir namespaces e imports restantes; confirmar autoload com `composer dump-autoload`.
2. Implementar camadas de serviço e repositórios para cada módulo, cobrindo regras de negócio (estoque, alertas, relatórios).
3. Completar CRUDs (create/update/delete) e validações nas rotas/requests, adicionando testes correspondentes.
4. Integrar geração de relatórios em PDF e disparo de alertas de EPI vencido.
5. Configurar políticas/permissões por perfil e ajustar interface para respeitar o nível de acesso.
6. Popular banco com seeds/factories abrangentes e preparar scripts de migração de dados se necessário.
7. Implementar cenário de testes automatizados e pipeline de verificação.

## Observações
- Artisan `serve` está configurado para `127.0.0.1:9000`; Vite (`npm run dev`) deve estar em execução durante o desenvolvimento.
- Credenciais atuais: `admin@epi.local` / `Senha@123`.
