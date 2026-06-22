# Ativação, Retenção e North Star

**Data:** 2026-06-22
**Status:** Documento de investigação de produto/growth. Define o framework de métricas que **não existe** hoje — a régua que diz se o produto está funcionando.
**Escopo:** A métrica North Star, o funil de ativação (time-to-first-value), o loop de hábito diário em mecânica, e o que instrumentar. Responde "como saber se o motor de alertas vira retenção?".
**Relação:** Operacionaliza o "hábito diário" de [visao-geral.md §4](./visao-geral.md). Mede o que [alertas.md §1](./alertas.md) chama de driver de retenção (e cujo tracking "alerta lido→ação" foi flagado como inexistente em [alertas §6](./alertas.md)). Sustenta o valor que justifica o [pricing.md](./pricing.md).

> **Por que isto antes de mais features.** Construir mais funcionalidade sem saber se a atual retém é gastar no escuro. O produto já tem motor de alertas, SCORE, descoberta — mas **zero instrumentação de produto**. Sem a régua, toda decisão de roadmap é opinião.

---

## 1. A North Star: a oportunidade que virou ação

A métrica que melhor captura o valor entregue **e** prediz receita:

> **NSM = nº de oportunidades acionadas por usuário ativo / semana.**
> Uma "oportunidade acionada" = o usuário **viu** um insight (alerta, produto no SCORE, criador no matchmaking) **e agiu** (salvou, exportou, abriu o produto no TikTok, adicionou à watchlist, marcou "vou promover").

Por que esta e não outras:

| Candidata | Por que **não** é a North Star |
|---|---|
| Logins/semana | Mede presença, não valor. Usuário pode logar e não achar nada. |
| Alertas enviados | Mede **nosso** output, não valor pro usuário. Pode ser spam. |
| MRR | É resultado, não driver. Não diz *por que* cresce ou cai. |
| **Oportunidades acionadas** ✅ | Captura o "aha" repetido: o produto entregou algo que o usuário **usou**. É o loop de valor fechado. |

A North Star do SLEAG **tem que medir ação, não consumo** — porque a promessa ([visao-geral](./visao-geral.md)) é *acionar* dinheiro, não informar. Um usuário que aciona 5 oportunidades/semana está ganhando dinheiro com o produto e **não vai cancelar**.

---

## 2. O funil (AARRR adaptado)

| Etapa | Definição no SLEAG | Sinal de saúde |
|---|---|---|
| **Aquisição** | Signup | (ver doc de GTM, a fazer) |
| **Ativação** | Chegou ao **primeiro valor**: 1ª oportunidade relevante vista (§3) | % que ativa em ≤ 1ª sessão |
| **Retenção** | Volta e **aciona** oportunidades recorrentemente (§4) | Curva de retenção D1/D7/D30; DAU/MAU |
| **Receita** | Converte trial→pago; sobe de tier | Trial→paid %, expansão Essencial→Pro |
| **Referência** | Indica (parcerias com mentores, [concorrentes §6.4](./concorrentes.md)) | NPS, indicações |

> **O gargalo provável** deste produto é **Ativação → Retenção**, não Aquisição. Um usuário que faz signup, não acha nada útil na 1ª sessão e nunca configura um alerta **churna silenciosamente**. É aí que o framework precisa de foco.

---

## 3. Ativação — o primeiro valor (TTFV)

**Time-to-first-value** = tempo do signup até a 1ª oportunidade relevante. Quanto menor, maior a retenção. O risco do SLEAG: o usuário novo **não sabe o que procurar** e vê uma tela de dados crus.

### 3.1 O "aha moment"

Hipótese: o aha é **"esse produto/criador é exatamente o que eu procurava, e eu não sabia"**. Acontece quando o usuário vê uma oportunidade **relevante ao nicho dele** — não o top global genérico.

### 3.2 Mecânicas de ativação (a maioria não existe)

| Mecânica | Efeito | Status |
|---|---|---|
| **Capturar nicho no onboarding** | Personaliza a 1ª tela → relevância imediata | 🔴 Não existe (e habilita o affiliate POV de [descoberta-criadores §3.2](./descoberta-criadores.md)) |
| **Regras de alerta pré-criadas** | 1º alerta chega sem o usuário configurar nada ([alertas §7.3](./alertas.md)) | 🔴 Não existe |
| **"Oportunidade do dia" no 1º login** | Entrega valor antes de qualquer esforço | 🔴 Não existe |
| **Checklist de ativação** | Guia: defina nicho → crie alerta → adicione à watchlist | 🔴 Não existe |

> **A regra de alerta pré-criada é a alavanca de maior retorno:** o motor de alertas existe, mas um usuário que não cria nenhuma regra **nunca recebe alerta** — logo nunca entra no loop de hábito. Pré-criar 2–3 regras de alto valor baseadas no nicho transforma "produto passivo" em "produto que te procura" no dia 1.

---

## 4. O loop de hábito diário (modelo Hook)

A [visao-geral](./visao-geral.md) quer **hábito diário**. Hábito não nasce de feature, nasce de **loop**. Mapeando o Hook (Eyal) ao SLEAG:

```
GATILHO (externo)  →  o ALERTA chega (WhatsApp/email/push)        [o motor já faz isto]
       ↓
AÇÃO               →  abrir, ver a oportunidade, agir              [precisa ser 1 toque]
       ↓
RECOMPENSA         →  "achei dinheiro antes dos outros"            [variável = vicia]
   (variável)         nem todo alerta é ouro → a incerteza é o que prende
       ↓
INVESTIMENTO       →  watchlist, refinar regra, salvar             [aumenta o valor do próximo ciclo]
       ↑__________________________________________________________|
```

| Estágio | O que o SLEAG tem | O que falta |
|---|---|---|
| **Gatilho** | Motor de alertas multicanal ([alertas.md](./alertas.md)) | Email real ([alertas §4.2](./alertas.md)); cadência por plano |
| **Ação** | UI de eventos | "1 toque": do alerta direto à oportunidade acionável |
| **Recompensa** | A oportunidade em si | **Variabilidade calibrada** — alerta sempre-igual perde graça; sinal/ruído ([alertas §1](./alertas.md)) é a recompensa |
| **Investimento** | Watchlist, regras | Tornar o investimento **visível** ("sua watchlist te poupou X horas") |

> **A recompensa variável é a chave psicológica** e liga direto em [emergentes.md §6](./emergentes.md): se o detector é ruidoso, a recompensa vira frustração e o loop quebra. Se é certeiro mas raro, o gatilho some. **A calibração do detector É a calibração do hábito.**

---

## 5. Retenção — mecânicas

| Mecânica | Como funciona | Tie-in |
|---|---|---|
| **Digest diário** | 1 resumo com as melhores oportunidades — cria o ritual diário sem spam | [alertas §7.2](./alertas.md), [pricing](./pricing.md) (Essencial) |
| **Watchlist como investimento** | Quanto mais o usuário monitora, mais o produto vale pra ele (custo de troca) | [modelo-dados-usuario §4.1](./modelo-dados-usuario.md) |
| **Qualidade do alerta** | Sinal/ruído alto mantém o canal vivo; ruído treina a ignorar | [alertas §1](./alertas.md) |
| **Streak/consistência** (avaliar) | "7 dias acompanhando o mercado" — reforço de hábito | a desenhar (cuidado: pode soar gamey demais p/ ferramenta séria) |
| **Re-engajamento** | "3 emergentes apareceram no seu nicho enquanto você esteve fora" | precisa do tracking de ausência |

---

## 6. O que instrumentar (nada existe hoje)

[alertas §6](./alertas.md) já flagou: **não há tracking de "alerta lido→ação"**. Sem eventos de produto, a North Star é incalculável. O mínimo a instrumentar:

| Evento | Para medir |
|---|---|
| `signup`, `onboarding_completed`, `niche_set` | Ativação |
| `first_opportunity_viewed`, `first_rule_created` | TTFV |
| `alert_delivered` → `alert_opened` → `opportunity_actioned` | **North Star** (o loop) |
| `watchlist_add`, `export`, `search` | Investimento + uso (cruza com `USO_CICLO` do [mock](../apps/web/features/conta/mocks.ts)) |
| `session_start` (com dias-desde-último) | Retenção/frequência |

> Já há **dado parcial latente**: `notification_deliveries` registra `delivered/read` ([alertas §5](./alertas.md)) — metade do loop (entrega→leitura) **já é capturável**. Falta a outra metade: **leitura→ação**. Conectar o `read` do WhatsApp a um evento de ação fecha a North Star com pouca infra nova.

---

## 7. Como isto realimenta o resto

- **Calibra o SCORE e os emergentes** — o `opportunity_actioned` é um **rótulo de relevância** ([score.md §3](./score.md)): oportunidades acionadas que deram certo são ground-truth pra calibrar o detector. O loop de produto vira loop de ML.
- **Justifica o pricing** — "usuários Pro acionam 4× mais que Essencial" é o argumento de upgrade ([pricing §6](./pricing.md)).
- **Mede a qualidade do matchmaking** — criadores recomendados que foram acionados validam o fit score ([descoberta-criadores §4](./descoberta-criadores.md)).

---

## 8. Roadmap

| Fase | Entrega |
|---|---|
| **Agora** | Instrumentação mínima (§6): eventos de signup, ativação, e o loop alerta→ação |
| **+ativação** | Onboarding com captura de nicho + 2–3 regras pré-criadas + "oportunidade do dia" |
| **+North Star** | Dashboard interno da NSM; curva de retenção D1/D7/D30 por coorte |
| **+loop** | "1 toque" do alerta à ação; re-engajamento por ausência |
| **+calibração** | Usar `opportunity_actioned` como rótulo pro backtest de SCORE/emergentes (§7) |

---

## 9. Pontos abertos

- **Definição exata de "ação"** — quais eventos contam (salvar? exportar? abrir no TikTok? marcar promovido?). Define a North Star.
- **Janela da NSM** — semanal (proposto) vs. diária (o produto é de hábito diário).
- **Stack de analytics** — PostHog/Amplitude vs. eventos próprios no Postgres? (custo + LGPD — [compliance §2.5](./compliance.md)).
- **Streak/gamificação** — cabe no tom "ferramenta séria, não motivação" ([visao-geral](./visao-geral.md))? Avaliar com cuidado.
- **Aha moment real** — a hipótese de §3.1 precisa de validação com usuários reais.
- **TTFV alvo** — qual é o "rápido o suficiente" (mesma sessão? primeiro dia?).

---

*O produto tem o motor (alertas) mas não tem a régua (métricas) nem o on-ramp (ativação). A ação de maior valor é a **instrumentação mínima do loop alerta→ação** (§6) — sem ela, não dá pra saber se algo retém, e metade do loop (entrega→leitura) já está capturável em `notification_deliveries`. Medir vem antes de otimizar.*
