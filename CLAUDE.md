## Estrutura de pastas por feature

A estrutura abaixo é **base de referência**, não exaustiva. Extenda quando a feature pedir: `hooks/` pode ter outras categorias além de `data/` e `ui/` (ex: `hooks/integrations/` pra WebSocket/SSE, `hooks/analytics/` pra tracking), `services/` pode ter múltiplos arquivos por contexto, `schemas/` cresce conforme novos inputs aparecem. Mantenha os princípios e adapta o resto.

```
products/
├── components/
│   ├── products-page.tsx
│   ├── products-list/              # vira pasta quando tem subcomponentes
│   │   ├── products-list.tsx
│   │   ├── products-list-item.tsx
│   │   └── products-list-empty.tsx
│   └── create-product-modal/
│       ├── create-product-modal.tsx
│       └── create-product-form.tsx
├── hooks/
│   ├── data/
│   │   ├── queries/use-products-query.ts
│   │   └── mutations/use-create-product-mutation.ts
│   └── ui/use-create-product-modal.ts
├── schemas/
│   ├── product.ts                  # entidade
│   └── create-product.ts           # input do form
├── services/products.ts            # único lugar com fetch
├── types/index.ts                  # z.infer dos schemas
├── utils/
│   ├── format.ts                   # formatPrice, formatStock, ...
│   └── discount.ts                 # calculateDiscount, applyCoupon, ...
├── consts.ts
└── index.ts                        # public API (barrel)
```

**Regras**

- `app/**/page.tsx` é fino: importa da feature e renderiza. Sem lógica, sem tipagem.
- Schema Zod é source of truth. Tipos via `z.infer` centralizados em `types/`.
- Hooks: `data/queries` (GET), `data/mutations` (POST/PUT/DELETE), `ui/` (estado e comportamento, sem rede). Outras categorias podem ser adicionadas conforme a feature.
- Utils agrupados por contexto: vários arquivos, várias funções por arquivo. Funções puras, sem hooks/JSX.
- Componente vira pasta quando tem subcomponentes; senão é arquivo solto em `components/`.
- Estrutura sempre nested, mesmo com 1 arquivo.
- **Proibido importar entre features.** Feature não importa de outra feature, nem pelo `index.ts`. Se 2+ features precisam do mesmo código, promove pra `lib/` ou `shared/`.

**Naming**

- Tudo kebab-case nos arquivos.
- Sem sufixo redundante: pasta `schemas/` → `product.ts` (não `product.schema.ts`). Mesma regra pra `services/`.
- Hooks mantêm prefixo `use-` (convenção do React).
- Componente: `PascalCase`. Hook: `useX`. Constante: `SCREAMING_SNAKE_CASE`.
- Promove pra `lib/` ou `shared/` só quando 2+ features usam. Se importa tipo da feature, fica na feature.


<!-- socraticode:start -->

## SocratiCode — Code Intelligence

This project is indexed by SocratiCode as **tikspy**. Use the SocratiCode MCP tools to understand code, assess impact, and navigate safely.

> Run `codebase_status` to check index freshness. Run `codebase_update` to catch up on recent changes.

### Always Do

- **MUST use `codebase_context_search` to consult docs.** Any question about briefing, arquitetura, AI/ML decisions, ontologia (mapas, plays, situações, granadas), product spec, investigações ou qualquer coisa que viva em `docs/**/*.md` ou `apps/synap/docs/**/*.md` — semantic search via SocratiCode primeiro, antes de ler ficheiros manualmente com `Read`/`Grep`/`Glob`. O artifact index cobre a árvore inteira e ranqueia por relevância. Fallback para leitura direta só depois do context_search ter dado o ficheiro/seção a aprofundar.
- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `codebase_impact({target: "symbolOrFile", depth: 3})` and report the blast radius to the user.
- **MUST run `codebase_update()` before committing** to reindex changes and verify the index is fresh.
- **MUST warn the user** if impact analysis returns a large blast radius (>5 files) before proceeding with edits.
- When exploring unfamiliar code, use `codebase_search({query: "concept in natural language"})` to find relevant code. Returns ranked results from the semantic index.
- When you need full context on a specific symbol — callers, callees, definition — use `codebase_symbol({name: "symbolName"})`.
- For docs, architecture, AI/ML specs e ontologia, use `codebase_context_search({query: "concept"})` — searches indexed context artifacts (cobre `docs/` e `apps/synap/docs/`).

### Never Do

- NEVER answer questions about `docs/` ou `apps/synap/docs/` content (AI decisions, ontologia, plays, situações, briefing) without first running `codebase_context_search`. Grep/Read on docs is a fallback, not the entry point.
- NEVER edit a function, class, or method without first running `codebase_impact` on it.
- NEVER ignore a large blast radius from impact analysis — report to user and discuss.
- NEVER rename symbols with find-and-replace — use `codebase_impact` first, then `patch` + `codebase_update`.
- NEVER commit changes without running `codebase_update()` to refresh the index.

### Resources

| Resource | Tool | Use for |
|----------|------|---------|
| Codebase overview, index freshness | `codebase_status` | Check chunk count, watcher state, last operation |
| All functional areas | `codebase_graph_visualize({mode: "interactive"})` | Interactive dependency graph in browser |
| All entry points | `codebase_flow` (no args) | Auto-detected entry points (routes, handlers, mains) |
| Execution flow from entry | `codebase_flow({entrypoint: "name"})` | Step-by-step call tree |
| Schema/docs/architecture/ontologia | `codebase_context_search({query: "..."})` | Semantic search across docs, apps/synap/docs, ontologia, AI specs |
| Blast radius | `codebase_impact({target: "fileOrSymbol"})` | All files that depend on the target |
| Symbol 360° view | `codebase_symbol({name: "symbol"})` | Definition, callers, callees |
| File symbols list | `codebase_symbols({file: "path"})` | All functions/classes/consts in a file |
| Index management | `codebase_index`, `codebase_update`, `codebase_stop` | Full index, incremental update, stop |
| Dependency graph | `codebase_graph_query`, `codebase_graph_stats` | Per-file dependencies, global stats |

<!-- socraticode:end -->

## Extra

Codex will review your output once you are done.
