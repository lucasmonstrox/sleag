# 2ª Fonte de Dados — Apify, Scraping e Resiliência

**Data:** 2026-06-22
**Status:** Documento de investigação técnica/estratégica. Avalia a viabilidade real de uma 2ª fonte de dados para reduzir o risco de fonte única (EchoTik). Combina pesquisa web (jun/2026) com o registro de [fornecedores.md §1.2](./fornecedores.md).
**Escopo:** Apify e scraping gerenciado como fonte complementar/fallback: actors disponíveis, cobertura BR, custo, manutenção, e o teto fundamental de o que é obtível.
**Relação:** Responde ao risco de fonte única de [qualidade-dados.md §3](./qualidade-dados.md). Detalha a opção citada em [unit-economics.md §5](./unit-economics.md) e [fornecedores.md §1.2](./fornecedores.md). Cruza com [compliance.md §5 (legalidade de scraping)](./compliance.md) e [infra.md §4 (coleta em escala)](./infra.md).

> **Conclusão antecipada (importante).** A pesquisa **derruba a expectativa** de que uma 2ª fonte por scraping resolva o risco de fonte única **no Brasil, hoje**. Dois bloqueios: (1) **nenhum actor de TikTok Shop confirmado cobre o BR**; (2) **GMV/vendas reais são inscrapeáveis em qualquer fonte** — todos batem no mesmo teto de estimativa. A 2ª fonte continua valendo como **resiliência futura**, não como upgrade de qualidade.

---

## 1. Por que se cogitou uma 2ª fonte

[qualidade-dados.md §3](./qualidade-dados.md) levantou: a EchoTik é **single point of failure** (cota travável, termos incertos, metodologia que pode derivar). A mitigação arquitetural já existe no desenho — a fonte é **camada substituível** (`DataSource`) e pode ser **composta** (primário + reconciliação), com a coluna `source` em todo fato ([ingestao §4.1](./ingestao.md)). A pergunta deste doc: **a 2ª fonte por scraping é viável e vale a pena?**

---

## 2. O teto fundamental: GMV real é inscrapeável

O achado que reordena a decisão:

> **Nenhuma fonte — EchoTik, Kalodata, scraping próprio — tem acesso ao GMV/receita real do TikTok Shop.** O que é público é o **"sold count"** (ex.: "10.5k sold") + preço + reviews + rating. "Receita/GMV" é **sempre estimativa = preço × sold count** ([SociaVault](https://sociavault.com/blog/tiktok-shop-analytics-sales-revenue)).

A melhor técnica de todos os players é rastrear o **sold count ao longo do tempo** (delta diário) → velocidade de vendas e GMV **estimado direcional**. É exatamente o que Kalodata/FastMoss fazem (scrape público + IA), e Kalodata admite "small variations from real-world numbers" ([WinningHunter](https://winninghunter.com/insights/kalodata-review/)).

> **Implicação:** scraping próprio **não entrega dado melhor** que a EchoTik — bate no mesmo teto. Ele entrega **independência de fornecedor**, não **qualidade superior**. Isso muda o "porquê" da 2ª fonte de "dado melhor" para "resiliência".

---

## 3. O bloqueio prático: cobertura BR

Levantamento dos actors de Apify para **TikTok Shop**:

| Actor | Preço | Regiões | Brasil? |
|---|---|---|---|
| `pro100chok/tiktok-shop-scraper` | US$2/1.000 ou US$20/mês | US only | ❌ |
| `novi/tiktok-shop-scraper` | US$38/mês + uso | SEA (ID,MY,PH,SG,TH,VN) | ❌ |
| `ace_scraper/tiktok-shop-product-scraper` | US$15/1.000 | ID,MY,TH,VN,PH,SG,US,MX,JP,GB | ❌ |
| `kaix/tiktok-shop-scraper` | US$1/1.000 shops | US,TH,MY,ID,VN,PH,SG,GB | ❌ |

> Fontes: [pro100chok](https://apify.com/pro100chok/tiktok-shop-scraper), [kaix](https://apify.com/kaix/tiktok-shop-scraper), [ace_scraper](https://apify.com/ace_scraper/tiktok-shop-product-scraper).

**Nenhum cobre o Brasil.** É coerente com o TikTok Shop BR ser recém-aberto (mai/2025) — os actors ainda focam US/SEA. Suporte BR: **[não confirmado / provavelmente inexistente hoje]**.

> Os scrapers de **TikTok geral** (vídeos/perfis) **cobrem BR bem** — `apidojo/tiktok-scraper` (US$0,30/1.000, 249 países, [Apify](https://apify.com/apidojo/tiktok-scraper)), `clockworks/tiktok-scraper` (US$1,70/1.000). Mas isso é **sinal social** (views, engajamento), **não e-commerce** (vendas/produtos). Útil para a camada de **conteúdo** do lead-lag ([emergentes §4](./emergentes.md)), não para substituir a EchoTik nos dados de venda.

---

## 4. Custo e manutenção (se fosse viável)

### 4.1 Custo

- Modelo Apify = plataforma (compute CU US$0,13–0,20 + proxy residencial US$7–8/GB + storage) + taxa do actor. Planos: Free, Starter US$29, Scale US$199, Business US$999 ([Apify pricing](https://apify.com/pricing)).
- Para TikTok Shop o que domina é a taxa do actor: ~**US$1–15/1.000 resultados** (sweet spot US$1–2).
- Alternativas: **Bright Data** (~US$1/1.000; dataset TikTok Shop 3,8M records ~US$2,5/1.000, mín. US$250 — BR **[não confirmado]**, [Bright Data](https://brightdata.com/products/datasets/tiktok/shop)); **Zyte** (browser-rendered US$1–16/1.000, [Zyte](https://docs.zyte.com/zyte-api/pricing.html)); **ScraperAPI**.

> Diferente da cota EchoTik (teto manual, [unit-economics §2](./unit-economics.md)), o scraping é **custo variável por volume** — muda a estrutura de custo de "teto fixo" para "paga por resultado".

### 4.2 Manutenção — o custo escondido

- Anti-bot do TikTok é dos mais agressivos (headers criptografados, device/TLS fingerprint, fraud scoring — [ScrapFly](https://scrapfly.io/blog/posts/how-to-scrape-tiktok-python-json)).
- **Endpoints internos mudam a cada 4–8 semanas; frontend a cada 2–4** → manutenção contínua. É o argumento mais forte para **comprar actor mantido** em vez de scraper próprio.
- TikTok Shop é JS-renderizado → precisa headless browser (mais lento/frágil); preços mudam em flash sales ([Data365](https://data365.co/blog/tiktok-shop-scrape)).

---

## 5. A decisão recomendada

| Cenário | Recomendação |
|---|---|
| **2ª fonte para qualidade superior de dado** | ❌ **Não vale** — bate no mesmo teto da EchoTik (§2) |
| **2ª fonte para BR via Apify hoje** | ❌ **Inviável** — nenhum actor cobre BR (§3); validar manualmente antes de qualquer investimento |
| **2ª fonte para resiliência (fonte única)** | 🟡 **Adiar e monitorar** — o valor é real, mas a oferta de scraping BR ainda não existe; reavaliar quando actors BR surgirem |
| **Scraping de conteúdo (vídeos/perfis) BR** | 🟢 **Viável e útil** — para a camada conteúdo do lead-lag ([emergentes §4](./emergentes.md)), não para venda |
| **Scraping próprio direto do TikTok** | ❌ **Adiar** — reintroduz risco de ToS ([compliance §5](./compliance.md)) + manutenção 4–8 semanas; só com parecer jurídico |

> **A melhor mitigação de fonte única hoje não é scraping** — é (a) o desenho `DataSource` substituível já pronto, (b) negociar SLA/cota com a EchoTik ([fornecedores §1.1](./fornecedores.md)), e (c) usar **lojas conectadas via API oficial como calibração/ground-truth** ([qualidade-dados §5.1](./qualidade-dados.md)). O scraping entra quando a oferta BR amadurecer.

---

## 6. Se/quando ativar — o desenho

Quando um actor BR confiável surgir (ou para a camada de conteúdo já hoje):
- **Alimentar as mesmas tabelas** via coluna `source` ([ingestao §4.1](./ingestao.md)) — não um pipeline paralelo.
- **Reconciliação contínua** — comparar EchoTik × scraping para os mesmos produtos/dias; divergência grande = investigar ([qualidade-dados §5.2](./qualidade-dados.md)).
- **Comprar actor mantido** (Apify/Bright Data) em vez de scraper próprio — terceiriza a manutenção de 4–8 semanas.
- **Isolar workers de scraping** + proxies residenciais + concorrência por chave ([infra §4/§10.2](./infra.md)).
- **Tratar como decisão jurídica** (ToS, [compliance §5](./compliance.md)), não só técnica.

---

## 7. Pontos abertos

- **Quando surge actor de TikTok Shop BR** — monitorar Apify/Bright Data; revalidar trimestralmente.
- **Cobertura BR e campos (sold count) do dataset Bright Data** — **[não confirmado]**; testar.
- **Scraping de conteúdo BR para o lead-lag** — viável hoje (apidojo/clockworks); vale ativar antes da venda? (depende de [emergentes §4](./emergentes.md) priorizar conteúdo).
- **Negociar com a EchoTik** SLA/cota como mitigação primária de fonte única (mais barato que 2ª fonte).
- **Custo-benefício real** — só faz sentido quando o produto tiver receita que justifique o custo variável + manutenção.

---

*A investigação inverteu a premissa: a 2ª fonte por scraping **não é upgrade de qualidade** (todos batem no teto de estimativa) e **não está disponível pro BR** (nenhum actor cobre). A resiliência contra fonte única vem, hoje, do **`DataSource` substituível + SLA com a EchoTik + calibração via API oficial** — não do scraping. Reavaliar quando a oferta de dados BR amadurecer.*
