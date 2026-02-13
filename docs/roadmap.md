# Roadmap do Sistema de Gestao de EPIs

## Prioridades de entrega

1. **Dashboard e alertas**
   - Implementar cards com dados reais (estoque, alertas de vencimento, EPIs em uso, funcionarios ativos).
   - Integrar grafico de evolucao de EPIs (usar dados agregados das movimentacoes).
   - Construir feed de alertas (vencimento de EPIs, treinamentos e exames pendentes, estoque minimo).
   - API interna para alimentar widgets do dashboard (services + repositories por modulo).

2. **Modulo Funcionarios & Cargos**
   - Migrations (cargos, setores, funcionarios, historico de cargos).
   - CRUD completo com filtros, importacao CSV e historico.
   - Vinculo com treinamentos, exames e EPIs entregues.

3. **Modulo Catalogo de EPIs**
   - Migrations (categorias, produtos, lembretes, validade obrigatoria).
   - CRUD com controle de estoque e data limite de devolucao.
   - Configuracao de estoque minimo por item e alertas automaticos.
   - Upload de anexos (fichas tecnicas / PDFs).

4. **Modulo Entradas & Saidas**
   - Registro de movimentacoes (entrada, saida, devolucao).
   - Validacoes de estoque / alocacao por funcionario.
   - Relatorios diarios e exportacao CSV/PDF.

5. **Modulo Treinamentos & Exames**
   - Calendario, periodicidade e anexos de certificados.
   - Alerta de proximidade de vencimento.
   - Relatorio individual por funcionario.

6. **Modulo Acidentes & Relatorios**
   - Registro de incidentes, envolvidos, tipos e medidas.
   - Geracao de relatorios PDF e exportacao sintetica.
   - Dashboard especifico com indicadores de seguranca.

7. **Modulo Configuracoes**
   - Hierarquia de usuarios (admin, gerente, coordenador, lider) com permissoes granulares usando Spatie Laravel Permission.
   - Parametros do sistema (estoque minimo padrao, prazos de alertas, templates de email/PDF).
   - Gerenciamento de empresas/unidades, setores e turnos.

## Integracoes tecnicas

- **Relatorios PDF**: utilizar `barryvdh/laravel-dompdf` com templates em React (Inertia renderiza HTML -> PDF) ou view Blade dedicada.
- **Alertas**: jobs agendados (Laravel Scheduler) para vencimento de EPI, treinamentos e estoque minimo.
- **Notificacoes**: canal por email e painel interno; considerar integracao com WhatsApp/Telegram futuramente.
- **Modularizacao**: cada modulo deve expor Service Providers, Repositories e Actions para manter separacao.

## Backlog tecnico inicial

- [ ] Configurar pacote de permissoes (spatie/laravel-permission) e seeds de papeis basicos.
- [ ] Criar camada compartilhada `Core` (helpers, enums, traits) acessivel a todos os modulos.
- [ ] Montar testes de fumaca para rotas principais e pipeline CI simples (`phpunit`, `npm run build`).
- [ ] Documentar padrao de commit e publicacao (README).

