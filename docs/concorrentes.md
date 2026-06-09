# Concorrentes — Inteligência de Mercado para TikTok Shop

**Documentação interna TIKSPY** · Data: 2026-06-09

> **Lema:** "Descubra onde o dinheiro está antes dos outros."

---

## Nota de metodologia

Este documento foi construído a partir de pesquisa web combinada com **verificação adversarial** (cada concorrente passou por uma segunda checagem que confrontou as afirmações originais com fontes primárias e independentes). Sempre que houve conflito, prevaleceram os valores **corrigidos/verificados**, especialmente em preços.

Avisos importantes para quem ler:

- **Preços e features mudam com frequência.** Muitas páginas de pricing são renderizadas via JS, exigem login ou bloqueiam coleta automatizada (HTTP 403/522), então alguns valores são "mais prováveis" e não "confirmados ao vivo". Onde isso acontece, está sinalizado.
- **Quase todas as ferramentas de terceiros usam scraping + IA**, não API oficial do TikTok. Os números de GMV/vendas são **estimativas direcionais**, não dados transacionais auditados. As próprias empresas (Kalodata, WinningHunter) admitem isso.
- **Datas-chave de mercado:** TikTok Shop foi lançado oficialmente no Brasil em **8 de maio de 2025**. Os dados de mercado deste documento refletem o balanço de 1 ano (maio/2026).
- Claims de marketing (ex.: "73% de acurácia", "fundadores ex-TikTok", "98% de precisão") são tratados como alegações das próprias empresas, não como fatos verificados.

---

## 1. Panorama do mercado de inteligência para TikTok Shop

O ecossistema de ferramentas que disputam (direta ou indiretamente) o espaço do TIKSPY pode ser dividido em **seis categorias funcionais**:

### A) Analytics oficial nativo (gratuito, first-party)
Painéis do próprio TikTok. Dados reais, porém limitados à conta do usuário ou à lente de anúncios.
- **TikTok Shop Seller Center / Shop Analytics / Data Compass** — métricas da própria loja.
- **TikTok Shop Product Opportunities** — descoberta oficial de lacunas demanda x oferta.
- **TikTok Creative Center (Top Products / Top Ads / Trends)** — tendências baseadas em **anúncios**, não vendas reais, mas em PT-BR e grátis.
- *(Novo em 2026:* **TikTok Market Scope** — inteligência competitiva real, mas *gated* para marcas/anunciantes via vendas.*)*

### B) Product research / analytics nativo de TikTok Shop (pagos)
O coração da concorrência direta. Descoberta de produtos + criadores + lojas + lives.
- **Kalodata**, **FastMoss** (os dois líderes globais), **EchoTik** (budget), **Shoplus/TikMeta**, **Tikstar**, **TabCut**, **SimpTok** (free).

### C) Adspy / inteligência de criativos
Foco em anúncios pagos. Cobrem a "capacidade 2" (criativos dos melhores) mas não venda orgânica.
- **Pipiads** (líder em TikTok ads), **Minea**, **BigSpy**, **SocialPeta** (enterprise), **AdSpy** e **Dropispy** (Meta-only — irrelevantes para TikTok Shop).

### D) All-in-one (adspy + sales tracker de TikTok Shop)
Misturam espionagem de criativos com dados de venda estimados.
- **WinningHunter**, **FindNiche**, **Sell The Trend**, **Dropship Spy**.

### E) Ferramentas adjacentes / complementares
Resolvem peças do quebra-cabeça, não competem nas 4 capacidades centrais.
- **Dashboardly** e **HiveHQ** (profit/operações via API oficial), **kiero** (atribuição de afiliados), **Pentos** e **Exolyt** (content intelligence sem venda), **SociaVault** (API de scraping — potencial fornecedor), **ZIK Analytics**, **Shophunter/PPSPY/SpySales/Koala** (Shopify intelligence), **tokfy** (geração de criativos por IA — possível parceiro), **Hunter Hub** (Mercado Livre).

### F) Concorrentes brasileiros (PT-BR) — diretos e de posicionamento
- **Diretos de dados:** **VYRAL** (o mais próximo do TIKSPY em PT-BR), **Gloda via ABLELIVE**, **Hunterfy** (pouca informação pública).
- **De posicionamento (infoprodutos):** cursos, mentorias e comunidades (MVM, DOTTS, TikTok Shop Sem Segredo, Mapa do TikTok Shop, Udemy) — disputam atenção/orçamento, não funcionalidade.

> **Conclusão do panorama:** os líderes globais (Kalodata, FastMoss) dominam volume de dados; a maior parte ignora score de viabilidade consolidado e alertas proativos. **No Brasil**, a vantagem de "estar em PT-BR" **já não é exclusiva** — Kalodata, FastMoss e Pipiads têm português, e VYRAL/Gloda/Hunterfy são nativos BR. O espaço defensável do TIKSPY está em **score proprietário (cap. 3) + alertas cruzando conteúdo x venda (cap. 4) + profundidade no catálogo BR**, não em "ser o único em PT-BR".

---

## 2. Tabela comparativa

| Ferramenta | Foco | Preço inicial | Free/Trial | Brasil/PT-BR | Sobreposição c/ TIKSPY |
|---|---|---|---|---|---|
| **Kalodata** | Product research / all-in-one TikTok Shop | US$45,90/mês* | Trial 7d (sem cartão) | Dados BR sim; PT no app mobile | **Alta** (benchmark) |
| **FastMoss** | Product research TikTok Shop | ~US$47-59/mês | Trial 7d | Dados BR sim; UI PT-BR sim | **Alta** (benchmark) |
| **EchoTik** | Analytics budget TikTok Shop | US$9,90/mês (anual) | **Free** real | Dados ~8 países; PT-BR não conf. | Alta (preço-âncora) |
| **Shoplus / TikMeta** | All-in-one TikTok Shop | US$39/mês | Trial 3d | **Não** (6 países asiáticos+UK) | Alta (1 e 2) |
| **VYRAL** 🇧🇷 | Product/creative research PT-BR | R$49/mês | Garantia 7d | **Sim, nativo** | **Alta e direta (BR)** |
| **Gloda (ABLELIVE)** 🇧🇷 | Analytics produto/criador/live | ~US$18,98/mês | Free trial (~3d) | **Sim, via ABLELIVE** | Alta (1, 2) |
| **Hunterfy** 🇧🇷 | "Inteligência p/ TikTok Shop" | Desconhecido | Desconhecido | Sim (PT-BR) | Posicional (mais próximo) |
| **Pipiads** | Adspy TikTok/Meta + TikTok Shop | US$49/mês (30k créditos) | Trial 500 créditos | Dados sim; UI PT (16 idiomas) | Alta (cap. 2; parcial 1) |
| **Minea** | Adspy multi-plataforma + TikTok Shop | US$49/mês | Trial 200 créditos | Landing PT; preços USD | Parcial |
| **WinningHunter** | Adspy + sales tracker TikTok Shop | €49/mês | Trial 3d | "19+ países"; sem PT-BR | Alta (1, 2, 3 parcial) |
| **FindNiche** | Product research dropshipping | US$12/mês (+Free) | Free + trial US$1 | Sem PT-BR (EN/ZH) | Parcial (1, 3 conceito) |
| **Sell The Trend** | All-in-one dropshipping | US$29,97/mês | Trial 14d | Não | Baixa-média |
| **Dropship Spy** | Pesquisa de viabilidade por IA | US$29 (créditos únicos) | 1 busca grátis | Não | Baixa-média |
| **Tikstar** | Analytics TikTok Shop | US$49/mês | Free 5 queries/dia | Não confirmado | Baixa-média |
| **TabCut** | Analytics TikTok Shop | Contact-led (incerto) | Free trial | **Não** (sem PT) | Moderada (1, 2) |
| **SimpTok** | Product research **gratuito** | **US$0** | **100% grátis** | Não (US-only) | Média (ameaça ao free) |
| **BigSpy** | Adspy multi-plataforma | US$9/mês | Trial US$1 (Pro 3d) | UI PT-BR sim | Média (cap. 2) |
| **SocialPeta** | Adspy enterprise | Sob consulta | Trial 3d | Não | Baixa |
| **AdSpy** | Adspy **Meta-only** | US$149/mês | Não | Não / sem TikTok | Baixa (irrelevante) |
| **Dropispy** | Adspy **Meta-only** | €29,90/mês | Free | Não / sem TikTok | Baixa (irrelevante) |
| **Pentos** | Content intelligence | US$99/mês | Sem free | Não conf. | Parcial (só conteúdo) |
| **Exolyt** | Social intelligence | €0 (Free) / €250 | **Free** | UI PT; sem dados BR | Baixa |
| **Dashboardly** | Profit/reconciliação (API oficial) | US$29/mês | Trial 14d (c/ cartão) | Não conf. | Baixa (complementar) |
| **HiveHQ** | Profit + bot de afiliados | US$0 (até 250 pedidos) | **Free** | US/UK; sem BR | Baixa (complementar) |
| **kiero** | Atribuição de afiliados | Free / £150/mês | **Free** | UK-first; sem BR | Baixa-média |
| **SociaVault** | API de scraping (devs) | US$29 (pacote único) | 50 créditos grátis | Sem localização | Fornecedor, não rival |
| **ZIK Analytics** | Product research eBay/Shopify | US$39,90/mês | Trial US$1/7d | PT-BR "em breve" | Baixa (outra plataforma) |
| **Hunter Hub** 🇧🇷 | Gestão Mercado Livre/Shopee | R$97/mês | Trial 7d (sem cartão) | Sim (mas não TikTok Shop) | Baixa (benchmark de modelo) |
| **TikTok Seller/Creative Center** | Oficial nativo | **Gratuito** | **Free** | **Sim, PT-BR** | Parcial (baseline) |
| **Cursos/mentorias BR** | Infoproduto | R$97-997 | Garantia 7d | Sim | Posicionamento (não produto) |

*\*Kalodata: possível aumento recente para US$49,99 (Starter) / US$109,99 (Professional) — confirmar no site logado.*

---

## 3. Perfis detalhados por concorrente

### 3.1 Concorrentes diretos globais (benchmark)

#### Kalodata — https://www.kalodata.com/
**O que é:** Plataforma SaaS de analytics e inteligência do ecossistema TikTok Shop, líder de mercado junto à FastMoss. Rastreia 100M+ produtos, 200M+ criadores e 300M+ vídeos (até ~500 dias de histórico), atualizados diariamente. É o concorrente mais próximo do TIKSPY em proposta de valor.

**Público:** Afiliados, vendedores/lojistas, marcas e criadores — exatamente o público do TIKSPY.

**Features-chave:** pesquisa de produtos com filtros (categoria, receita, unidades, crescimento, nº de lojas concorrentes, janela diária/semanal/mensal); recomendação de **"potential products"** (emergentes antes do pico); banco de 200M+ criadores filtrável mostrando quem promove cada produto + vendas estimadas; **shop analysis** (assortimento, performance, histórico de concorrentes); analytics de vídeos e lives vinculados a produtos; **Open API** (só no Enterprise) com 6 módulos e 20+ endpoints; exportação de contatos de criadores e créditos de IA no Professional; app mobile Android/iOS (com video download, image search, login TikTok e **notificações**).

**Preços (USD):** Starter ~US$45,90/mês (~US$38,30 no anual, ~US$499/ano); Professional ~US$99,90/mês (~US$83,20 no anual, ~US$1.099/ano); Enterprise sob consulta (estimativas de terceiros ~US$229-599/mês). ⚠️ Uma fonte (simptok, jan/2026) reporta **aumento recente para US$49,99 / US$109,99** — não confirmado por outras fontes; verificar logado (a página /pricing retorna HTTP 403).
Limites: Starter = 50 buscas/dia, 10 lojas/criadores por resultado, histórico 90 dias; Professional = 250 buscas/dia, 500 lojas/criadores, 180 dias, 2.000 créditos de IA/mês.

**Geografia:** Cobre o **Brasil** com dados reais (URLs com `region=BR`). O app mobile (Apple App Store) lista **9 idiomas incluindo Português** — ou seja, a tese de "Kalodata não tem PT-BR" está **desatualizada**. Falta confirmar se a UI web tem PT-BR completo e se é PT-BR ou PT-PT.

**Como obtém dados:** Scraping de canais públicos + modelos de IA para estimar GMV/vendas/ad spend. A própria empresa avisa que valores são **direcionais** e não devem ser usados em alta precisão (ex.: acerto de comissões). Alega 73% de acurácia para prever virais em 72h (**claim de marketing, não verificado**).

**Forças:** marca líder e credibilidade; base de dados enorme e diária; cobre as 4 frentes do TIKSPY num só produto; já cobre o BR; trial sem cartão + plano de entrada acessível; Open API.

**Fraquezas:** dados são estimativas (discrepâncias relatadas); plano Starter limitado; recursos avançados atrás de paywall caro; **sem score proprietário consolidado** de viabilidade (oferece métricas brutas e "potential products", não um índice único); relatos de surpresas de cobrança. *(Nota: a fraqueza "não tem alertas" enfraqueceu — o app tem notificações.)*

**Relevância ao TIKSPY:** **Concorrente DIRETO e benchmark.** Difícil bater em volume de dados. O caminho do TIKSPY é diferenciação por **score acionável (cap. 3)**, **alertas/monitoramento contínuo (cap. 4)** e profundidade/atendimento BR — não por mais dados brutos.

---

#### FastMoss — https://www.fastmoss.com/
**O que é:** Plataforma global de analytics de TikTok Shop, co-líder com a Kalodata. Declara **3,8M+ usuários** e **19+ países/regiões**. ~3 anos de histórico de dados. Sediada em Culver City, CA.

**Público:** Vendedores, marcas, afiliados, criadores e agências.

**Features-chave:** rankings/leaderboards de produtos em alta, trend charts, estimativas de GMV/vendas; inteligência de criadores/afiliados com dados de contato; inteligência competitiva de lojas (revenue estimado); **biblioteca de criativos de anúncios**; analytics de LIVE (GMV por live, quase tempo real); recursos de IA (transcrição/scripts); ranking de criadores por **"Sales Efficiency"** (GMV por 1.000 views); monitoramento de vídeos + exportação; **API customizada só no Enterprise**.

**Preços (USD, voláteis — página renderizada via JS/login):** tiers oficiais **Basic / Pro / Team / Enterprise** (não existe "Premium"). Faixas observadas: Basic ~US$47-59; intermediário ~US$89-125; topo ~US$139-209 (algumas fontes citam "Ultimate" até US$209). Anual economiza ~30%; trial 7 dias com renovação automática. A oferta de "~US$29 no 1º mês" **não foi confirmada oficialmente**.

**Geografia:** Cobre o **Brasil** (URLs `region=BR` válidas) e tem **interface em PT-BR** ("Painel de controle", "Pulsação do Mercado"). Premiação correta: "Top Performer" (SourceForge/Slashdot), não "Leader".

**Como obtém dados:** Scraping de canais públicos (não é parceiro oficial de API). Menos transparente que a Kalodata sobre metodologia.

**Forças:** marca líder; ampla cobertura geográfica incl. BR/PT-BR; atualizações frequentes; biblioteca de criativos e analytics de LIVE robustos.

**Fraquezas:** dados estimados; pouca transparência de metodologia; **sem score proprietário**; alertas real-time não são o foco central; API só no Enterprise; tier topo caro.

**Relevância ao TIKSPY:** **Altíssima sobreposição.** Já tem PT-BR e BR, então o TIKSPY não vence por idioma — precisa vencer por **score proprietário**, **alertas/cruzamento conteúdo x venda** e foco em afiliados/criadores BR.

---

#### EchoTik — https://echotik.live
**O que é:** Plataforma de analytics de TikTok Shop de **baixo custo** (operada pela EchoSell/EchoTik AI, Singapura; lançada em 2022; 800k+ usuários). Combina dashboards, leaderboards e extensão de navegador. Tem produto de API separado (**KeyAPI**, até ~1.000 dias de histórico).

**Público:** Sellers, afiliados, influenciadores, marcas, dropshippers — quase idêntico ao TIKSPY.

**Features-chave:** 60+ indicadores de seleção de produto; leaderboards "Top Sold", "Hot Promoted", "New Products"; **"Dark Horse Creators"** (oportunidades emergentes); rankings de lojas (local e cross-border); **Product Monitor (20-1.000x/mês), Live Monitor (5-300x/mês) e Videos Monitor** — recurso de monitoramento/alerta; extensão Chrome/Edge; calculadora de taxas; **AI Toolbox com ~11 ferramentas de IA**; analytics de influencer (90 dias).

**Preços (USD — valores mensais equivalentes quando pago anualmente, ~30% off):** Free $0; Basic $9,90; Pro $19,10; Enterprise $29,10. O preço mensal regular do Basic é **$13,90** (não há mensal puro de $19,90/$29,90 — isso era confusão). Garantia 7 dias. O claim "~75% mais barato que Kalodata" é marketing não verificado.

**Geografia:** Cobre Brasil em **dados** (perfis de loja BR existem), mas a **interface aparece em inglês** mesmo no contexto pt-br. PT-BR completo de UI **não confirmado**.

**Como obtém dados:** Scraping; vendas estimadas; escala atual da home oficial: ~1,8B dados de produto, ~1B dados de influenciador.

**Forças:** preço de entrada **muito baixo** (âncora agressiva contra a qual o TIKSPY terá de se posicionar); free tier real; **tem monitoramento de produto/live/vídeo** (mais perto da capacidade 4); extensão prática; AI Toolbox.

**Fraquezas:** insights mais rasos que Kalodata/FastMoss; análise de competição bloqueada no básico; PT-BR de interface não confirmado; **sem score consolidado**; curva de aprendizado elevada; origem de dados não transparente.

**Relevância ao TIKSPY:** Concorrente direto e o **concorrente de PREÇO**. Pressiona o tier de entrada. Diferenciação: profundidade, score proprietário, foco/atendimento BR e cruzamento conteúdo x venda mais sofisticado.

---

#### Shoplus (ex-TikMeta) — https://www.shoplus.net/
**O que é:** Plataforma all-in-one de analytics de TikTok Shop. **TikMeta foi renomeada para Shoplus** (mesma empresa — não contar como concorrentes separados). Declara 800k+ usuários e base de ~90M+ produtos. Rankings de produtos, lojas, criadores, vídeos, lives, hashtags e sons.

**Público:** Sellers, afiliados, criadores (KOLs), agências de influencer marketing.

**Features-chave:** descoberta de produtos com **dados atualizados de hora em hora** (ads horários; best-sellers/top influencers a cada ~6h); rankings Top 100/300/ilimitado; análise de influencers; inteligência competitiva de lojas; biblioteca de 10.000+ criadores/vídeos em alta; insights de hashtags; analytics de LIVE.

**Preços (USD — confirmados no site oficial):** Basic **US$39/mês** (Top 100, 100 detalhes/dia, 0 sub-contas); Premium **US$49/mês** (Top 300, 300/dia, 2 sub-contas); Professional **US$79/mês** (ilimitado, 5 sub-contas). Toggle anual com desconto. Trial 3 dias sem cartão. ⚠️ Ignorar valores de agregadores (US$45,30/63,70/91,50 ou US$49/69/99) — desatualizados.

**Geografia:** **NÃO cobre o Brasil e NÃO tem PT-BR.** Cobertura = 6 países (UK, Indonésia, Tailândia, Vietnã, Filipinas, Malásia). Cobertura dos EUA é incerta/não confirmada. Interface em inglês + idiomas asiáticos.

**Como obtém dados:** Scraping; precisão "direcionalmente correta".

**Forças:** dedicado ao TikTok; atualização horária; preço de entrada acessível; free trial.

**Fraquezas:** **sem Brasil/PT-BR** (lacuna direta que o TIKSPY explora); UI "bare-bones" com bugs reportados; **sem score proprietário**; sem alertas real-time robustos.

**Relevância ao TIKSPY:** Concorrente direto nas capacidades 1 e 2, mas a **ausência de BR/PT-BR é um ponto fraco-chave** que reforça a vantagem do TIKSPY no mercado brasileiro.

---

### 3.2 Concorrentes brasileiros diretos (PT-BR)

#### VYRAL — https://vyral.com.br/
**O que é:** Plataforma SaaS **brasileira** de inteligência por IA que mostra em tempo real quais vídeos e produtos mais vendem no TikTok Shop, com ganho estimado **em R$ por vídeo** e transcrição por IA dos ganchos/dores/soluções/CTAs vencedores. **É o concorrente local mais direto e mais "parecido" com o TIKSPY** no eixo descoberta + criativos.

**Público:** Afiliados, criadores, dropshippers, donos de loja e iniciantes BR.

**Features-chave:** ranking diário de vídeos que mais lucram (Brasil e EUA) com GMV em R$; transcrição por IA (gancho/dor/solução/CTA); insights de IA sobre por que o vídeo vendeu; filtros por nicho/país/views/vendas; biblioteca pessoal de vídeos salvos; busca por palavra-chave/produto; acesso multidispositivo via navegador. Base de **11.127+ criadores**.

**Preços (BRL — confirmados):** Mensal **R$49/mês** (tabela cheia R$67); Anual **R$247 à vista** (12x R$25,55; tabela cheia R$804) com transcrições/insights/saves **ilimitados**. Mensal limitado a 60 transcrições + 30 insights de IA + 50 saves. Preço promocional "travado" na renovação + escassez ("FALTAM 10 de 100"). Garantia 7 dias. Checkout via **B4You**.

**Geografia:** **Brasil e EUA, 100% PT-BR nativo.**

**Como obtém dados:** Não declarado ("fica 24h analisando"); provável scraping + IA. **Baixa transparência.**

**Forças:** PT-BR nativo + preço baixíssimo (R$49-67/mês); camada de IA que decompõe o porquê do sucesso (algo que o TIKSPY também promete); tração local forte.

**Fraquezas:** foco quase exclusivo em vídeos/criativos; **sem score proprietário de viabilidade**; sem alertas/monitoramento contínuo evidente; estética flertando com infoproduto (escascez + checkout B4You); **reclamação no Reclame Aqui** sobre reembolso e "falta de vídeos para todos os produtos" → sinal de cobertura de catálogo incompleta.

**Relevância ao TIKSPY:** **Sobreposição ALTA e direta no mercado-alvo.** É o **benchmark de preço** (R$49-67/mês). Lacunas exatamente onde o TIKSPY diferencia: **cap. 3 (score)** e **cap. 4 (alertas/monitoramento multi-plataforma)**.

---

#### Gloda (no Brasil via ABLELIVE) — https://www.gloda.vip/en
**O que é:** Plataforma internacional (origem China) de inteligência do ecossistema TikTok/Douyin, usada por 50 mil+ vendedores (claim de marketing; algumas fontes citam 800k global). Entrou no Brasil **em PT-BR via parceria com a ABLELIVE** (maior agência BR de live streaming/microinfluenciadores).

**Público:** Sellers, marcas, criadores, afiliados e **agências de live commerce** (mais B2B/agência que afiliado solo).

**Features-chave:** rastreamento de tendências (produtos/lojas por categoria, faixa de preço, variação diária); monitoramento de criadores com filtros (eficiência, engajamento, conversão, audiência) + **sales score por criador**; **análise detalhada de LIVES** (GMV por live, recorrência); performance de vídeos curtos; **cross-platform (TikTok + Amazon US + Douyin)**; Viral Content Toolkit (10M+ vídeos); creator matching + outreach; Seller Academy.

**Preços (USD — piso confirmado, tiers superiores não públicos):** a partir de **~US$18,98/mês**. Tiers: **Free Trial** (5 buscas/dia, 10 itens, sem export) / **Pro VIP** (2.000 itens, Top 500, 100 exports/mês) / **Enterprise VIP** (5.000 itens, Top 1.000, 500 exports/mês). ⚠️ **Correção:** **NÃO há "busca ilimitada"** — todos os tiers têm 5 buscas/dia. Sem tabela em R$. Trial BR de até 3 dias.

**Geografia:** Cobre o **Brasil com dados em português e GMV em reais** via ABLELIVE (ex.: criadora Alicia Nunes R$489.000; loja Top Elétrico R$476.100). ⚠️ O site global (gloda.vip) renderiza em inglês; o **acesso PT-BR vem por link de cadastro via ABLELIVE**, não pelo domínio principal. Localização BR é recente.

**Como obtém dados:** Não confirmado (API oficial vs scraping); AI-powered.

**Forças:** banco de dados amplo e maduro; recorte BR em PT-BR e reais; **forte em lives** (motor do TikTok Shop BR); preço de entrada baixo; credibilidade local via ABLELIVE.

**Fraquezas:** preços pouco transparentes; sem score proprietário de **viabilidade de produto** (só de criador); sem alertas push evidentes; cobertura BR recente e dependente da parceria; UI global em inglês.

**Relevância ao TIKSPY:** **Alta e estratégica** — é o concorrente "enterprise-grade" que **já chegou ao Brasil em PT-BR**. Diferenciação: score proprietário de viabilidade de produto, alertas real-time configuráveis e UX 100% BR para afiliado individual.

---

#### Hunterfy — https://hunterfy.com.br/
**O que é:** Ferramenta brasileira autodescrita como **"Sua Ferramenta de Inteligência para o TikTok Shop"** — o posicionamento de marca que **mais se aproxima literalmente do TIKSPY**.

**Status da informação:** ⚠️ **Muito limitada.** O site bloqueia coleta automatizada (falha SSL/TLS; HTTP 403) e não há reviews de terceiros nem snapshots no Wayback. Domínio ativo (Hostinger), conteúdo 100% PT-BR confirmado.

**Features/Preços:** **Desconhecidos.** Provável descoberta de produtos + análise de concorrência (inferido pelo posicionamento). ⚠️ **Não confundir com "Hunter Hub"** (hunterhub.com.br, ferramenta de Mercado Livre) — buscas conflam features e o preço R$29,90 dos dois. O R$29,90 é do Hunter Hub, **não** da Hunterfy.

**Relevância ao TIKSPY:** **Potencialmente o concorrente posicional mais direto** (mesmo nicho, mesma linguagem, mesma promessa). Sobreposição provável nas caps. 1 e 2; caps. 3 e 4 não confirmadas. **Requer investigação direta no site** (idealmente logado).

---

### 3.3 Adspy / inteligência de criativos

#### Pipiads — https://www.pipiads.com/
**O que é:** O **"#1 TikTok Adspy"** — maior banco de anúncios de TikTok do mercado (50M+ ads, ~100k novos/dia, ~200 países). Evoluiu para incluir um **módulo dedicado de TikTok Shop** (descoberta de produtos vencedores + tracking de lojas concorrentes).

**Público:** Dropshippers, gestores de tráfego, agências, media buyers e vendedores de TikTok Shop. DNA mais "paid ads" que "afiliado orgânico".

**Features-chave:** Ad Search (50M+ ads); **TikTok Shop Business** com 3 listas (Best-Selling, New Arrivals, Hot Products); Winning Product / Product Search; **Image Search** (busca reversa por imagem); Advertiser/Store Analysis (gasto, pedidos, audiência, criativos); **Ad Tracker com notificações instantâneas** (limites 2/10/100); Meta Ad Library; add-on de ferramentas de IA (US$11,99-34,99/mês).

**Preços (USD — modelo v2.0 por créditos, sem cap diário):** Basic **US$49/mês (30.000 créditos**, não 10.000), 1 usuário, 2 trackers; Advanced **US$99/mês** (100.000 créditos, 10 trackers); Enterprise **US$900/mês** (1M créditos, 10 usuários); Flexible a partir de **US$180/mês**. Anual ~30% off. ⚠️ Os antigos US$77/155/263 são **planos legados** (descontinuados para novos assinantes em 01/08/2025). Pacotes avulsos: 10k=US$100, 50k=US$200, 100k=US$500. **Free trial: 500 créditos, sem cartão.**

**Geografia:** Cobre **Brasil** (página "Best TikTok Ads - Brazil"; Brasil listado nos países). **Interface em PT** (`/pt/`, 16 idiomas incl. português). Porém sem localização editorial dedicada ao BR nem preço em BRL.

**Como obtém dados:** Scraping de anúncios públicos do TikTok + Meta Ad Library oficial.

**Forças:** maior banco de criativos de TikTok; já tem módulo de TikTok Shop; **Ad Tracker com notificações** (concorre na cap. 4); Image Search; interface PT; marca consolidada (1M+ usuários).

**Fraquezas:** dados derivados de **anúncios**, não venda orgânica total; **sem score proprietário** de viabilidade demanda x concorrência; análise de saturação manual; modelo de créditos pode ficar caro; cobertura BR não especializada.

**Relevância ao TIKSPY:** Concorrente direto de alta sobreposição. **Cap. 2 forte; cap. 1 parcial; cap. 3 = lacuna clara; cap. 4 parcial** (alertas limitados a entidades rastreadas, não descoberta proativa). O TIKSPY se diferencia ao **cruzar criativo com venda real + score + foco em afiliados/orgânico BR**.

---

#### Minea — https://www.minea.com
**O que é:** Plataforma all-in-one francesa de adspy + product research. Banco de **80M+ anúncios ATIVOS** (não "200M+") em Meta + TikTok + Pinterest, com módulos de TikTok Shop.

**Público:** Dropshippers, lojistas, afiliados, gestores de tráfego (foco em ads pagos).

**Features-chave:** adspy multi-plataforma; módulo **TikTok Shop Products** (best-sellers/virais em tempo real); **Trending Shops** (lojas Shopify em alta); **Success Radar** (Top 100 a cada 8h, plano Business); **AI Magic Search** (busca por imagem); análise de lojas; rastreamento de 100k+ lojas; AliExpress Suppliers Finder; Daily Top 10.

**Preços (USD):** Starter **US$49/mês** (10.000 créditos, foco Meta); Premium **US$99/mês** (100.000 créditos, adiciona TikTok/Pinterest + Trending Shops); Business **US$399/mês** (150.000 créditos, adiciona Success Radar). Anual até ~30% off. **Free trial: 200 créditos sem cartão.**

**Geografia:** Existe versão em PT (`minea.com/pt/`) com landing e suporte traduzidos, **mas é tradução de marketing** — preços em USD (não BRL), sem localização de produto nem profundidade no catálogo BR.

**Como obtém dados:** Meta Ad Library oficial + scraping de TikTok/Pinterest/Shopify; dados de venda das Trending Shops são **estimados**.

**Forças:** cobertura multi-plataforma; banco grande; forte para gestores de tráfego.

**Fraquezas:** foco em ads pagos, não no ecossistema orgânico/afiliado do TikTok Shop; sem score de viabilidade; sem alertas cruzados robustos; recursos de TikTok Shop atrás de Kalodata/FastMoss.

**Relevância ao TIKSPY:** Sobreposição parcial. Concorrente no adspy, não no núcleo de inteligência de venda real do TikTok Shop.

---

#### BigSpy — https://bigspy.com
**O que é:** Adspy all-in-one de alto volume: **1B+ anúncios em 10 plataformas principais** (TikTok, Facebook, Instagram, YouTube, X, Pinterest, Yahoo, Google/AdMob, Unity) + ~40 sites de e-commerce. 71 países, 23 idiomas.

**Preços (USD):** Free; Basic **US$9/mês** (só FB/IG); Pro **US$99/mês** (ilimitado; ~US$69 no anual); Group **US$249/mês** (5 seats); VIP Enterprise a partir de ~US$2.000/ano. O **"$1" é trial de 3 dias do plano Pro** que converte em assinatura.

**Geografia:** Cobre Brasil via filtro; **interface em Português [BR]** confirmada no rodapé oficial.

**Forças:** maior volume de anúncios e mais plataformas; trial baixíssimo; IA generativa (geração de imagem/prompt/recomendações).

**Fraquezas:** generalista de **anúncios**, sem dados de venda/GMV do TikTok Shop; profundidade em TikTok Shop inferior a nativos; sem score; sem alertas conteúdo x venda.

**Relevância ao TIKSPY:** Sobreposição média (cap. 2). O diferencial real do TIKSPY aqui é **dado de venda real + foco no ecossistema TikTok Shop**, não o idioma (BigSpy tem PT-BR).

---

#### SocialPeta — https://socialpeta.com/en
**O que é:** Ad intelligence **enterprise**. ~1,7B criativos, 80+ países, 40+ canais. Destaque em estimativa de gasto de concorrentes. Tem módulo de e-commerce (~270M produtos; integra Amazon/AliExpress/Shopify/Etsy) e ferramentas de IA.

**Preços:** **Não público** — enterprise sob consulta. Trial gratuito de 3 dias (não free tier permanente). Considerado caro/overkill para PMEs.

**Geografia:** Global; site só em inglês, sem PT-BR nem recorte BR.

**Relevância ao TIKSPY:** **Baixa.** Público enterprise/agências e preço muito distantes de afiliados/PMEs BR. Toca a cap. 2 em escala de ads, não venda/seller do TikTok Shop.

---

#### AdSpy e Dropispy — adspy Meta-only (irrelevantes na prática)
- **AdSpy** (https://adspy.com): 204M+ anúncios Meta, busca dentro de comentários (diferencial raro). Plano único **US$149/mês**, sem free tier. **Sem TikTok** — eliminatório para o nicho.
- **Dropispy** (https://www.dropispy.com): adspy Meta francês de baixo custo (modelo por créditos). Free €0; Premium **€29,90/mês** (ou ~€14,90 no anual); Business €249,90/mês. **Sem TikTok.**

**Relevância ao TIKSPY:** Baixa. Servem apenas como **benchmark de preço de entrada de mercado** e exemplos de players legados que ficaram fora da transição para TikTok.

---

### 3.4 All-in-one (adspy + sales tracker de TikTok Shop)

#### WinningHunter — https://winninghunter.com
**O que é:** Spy tool all-in-one com **módulo dedicado de TikTok Shop**. Junta biblioteca de anúncios (TikTok + Facebook + Pinterest), Magic AI Search e um **Sales Tracker** que rastreia receita de qualquer loja do TikTok Shop. Talvez o mais próximo do **escopo amplo** do TIKSPY. Cobre 50M+ produtos, 5M+ lojas, 200M+ ads, "19+ países".

**Público:** Dropshippers e sellers que rodam anúncios e querem inteligência de TikTok Shop; gestores de tráfego.

**Features-chave:** **Sales Tracker** (receita diária/semanal/mensal, split ad spend vs orgânico, curva histórica); Product Finder por receita/velocidade/país; Creator Insights (GMV, comissão, demografia); **Live Stream Monitor em tempo real**; **Competitor Analysis** (rastreia lançamentos, preços, promoções automaticamente); Ad Spy; Magic AI Search; remoção de watermark + download.

**Preços (EUR — moeda base; homepage pode exibir USD por geolocalização):** Basic **€49/mês**; Standard **€79/mês** (de €99, "Most Popular"); Premium **€249/mês** (de €359). Trimestral -15%; anual -40% (~€30/€49/€150 por mês). Trial **3 dias** sem cartão.

**Geografia:** "19+ países" com filtro; **sem PT-BR** nem features/preços localizados para o BR (Brasil provavelmente filtrável, mas não nomeado nas fontes).

**Como obtém dados:** Scraping + bibliotecas de ads; vendas **estimadas**. ⚠️ Acurácia: a própria empresa declara **90-95%** (não "98%") e erro de 20-40% em **ambas as direções**; marca lojas <US$30k/mês como não confiáveis.

**Forças:** all-in-one (adspy + sales tracker + lives); cobre as 4 capacidades parcialmente; monitor de lives e criadores com GMV.

**Fraquezas:** acurácia do tracker questionada; preço em EUR e tier premium caro (€249); **sem PT-BR**; **sem score proprietário consolidado**; alertas não são foco central; trial curto.

**Relevância ao TIKSPY:** Sobreposição alta. O TIKSPY se diferencia por **transparência/acurácia honesta do dado**, **score proprietário**, **alertas que cruzam conteúdo x venda** e foco BR/PT-BR. Concorrente importante a posicionar contra (sobretudo no quesito **confiabilidade dos dados**).

---

#### FindNiche — https://findniche.com/tiktok
**O que é:** Product research all-in-one para dropshipping + TikTok Shop. Acha nichos de **alta demanda e baixa concorrência** (conceito próximo da análise de viabilidade do TIKSPY). Cruza AliExpress/Shopify/Amazon. AdSpy de **80M+ anúncios em 4 plataformas** (TikTok, Facebook, Instagram, YouTube).

**Preços (USD):** **Free** (real) / Basic ~**US$12/mês** / Elite ~US$49/mês / Premium ~US$99/mês / VIP-Enterprise ~US$199-499/mês (custom). Anual mais barato. **Trial US$1/3 dias.**

**Geografia:** **Sem UI PT-BR** (site só EN/Chinês Simplificado). Cobertura de dados BR plausível mas não confirmada.

**Forças:** preço de entrada baixo + Free tier; conceito demanda x concorrência; visão cross-plataforma; AdSpy robusto + IA.

**Fraquezas:** mais focado em dropshipping/AliExpress que em afiliados nativos; sem PT-BR; **sem score único proprietário** nem alertas cruzados.

**Relevância ao TIKSPY:** Sobreposição na cap. 1 e conceitualmente na cap. 3 (mas sem score único). Público dropshipping é adjacente, não idêntico.

---

#### Sell The Trend — https://www.sellthetrend.com/
**O que é:** Pesquisa e automação de dropshipping por IA (motor NEXUS AI, 26 data points/produto). 7M+ produtos em 83 nichos. Fontes: AliExpress, Amazon, lojas Shopify.

**Preços (USD):** Lite **US$29,97/mês** (US$19,97 anual); Essential US$49,97/mês (inclui SellShop grátis); Pro US$99,97/mês (TikTok Explorer + TikTok Shop automation). Trial 14 dias (exige cartão anti-spam).

**Geografia:** **Sem BR/PT-BR.**

**Relevância ao TIKSPY:** Baixa-média. Foco dropshipping/importação; inteligência de TikTok Shop é secundária e voltada a descoberta para dropshipping, não venda real/lives/afiliação orgânica.

---

#### Dropship Spy — https://dropship-spy.com
**O que é:** ⚠️ **Reposicionado** — não é mais curadoria de produtos. Hoje é um **motor de pesquisa de viabilidade de produto por IA**: input nome/URL → em ~30s retorna **veredito + confidence score**, cálculo de margem, análise de saturação, tendência de demanda e fontes citadas. Usa 8 fontes ao vivo (TikTok, AliExpress, Amazon, Google Shopping/Trends, Reddit, Meta Ad Library, Shopify).

**Preços (USD — créditos de compra única, sem assinatura):** Starter US$29 (15 créditos); Standard US$59 (50 créditos, mais popular); Pro US$129 (150 créditos). **1 busca grátis sem cartão.** Créditos não expiram.

**Geografia:** Sem PT-BR (provavelmente ausente).

**Relevância ao TIKSPY:** Subiu para média — agora **tem score de viabilidade**, sobrepondo conceitualmente a cap. 3. Porém **sem GMV nativo do TikTok Shop**, sem ecossistema de afiliados e sem BR/PT-BR.

---

### 3.5 Outras ferramentas de product research / nativas

#### Tikstar — https://www.tikstar.com
**O que é:** Analytics de TikTok Shop (shop/produto/vídeo/influencer/hashtag/música). ⚠️ **NÃO é "gratuita/budget"** como se supunha — é freemium com tiers de preço médio-alto.

**Preços (USD — via terceiros; site retornou 522/403):** Freemium (5 queries/dia, só teste); Basic **US$49/mês**; Pro **US$99/mês**; Enterprise **US$499/mês**. ~30% off anual. Diferencial: **exportação de contatos de influenciadores** para outreach.

**Geografia:** Brasil/PT-BR não confirmados (interface provavelmente só inglês). ⚠️ Risco de disponibilidade (site instável na verificação).

**Relevância ao TIKSPY:** Baixa-média. Pressiona o tier de entrada **pago** (~US$49/mês), comparável/acima de Kalodata/FastMoss — não por preço-zero.

---

#### TabCut — https://www.tabcut.com/
**O que é:** Analytics de TikTok Shop (rankings de produtos/influencers/vídeos/lojas/tópicos/lives + descoberta de ads + monitoramento de concorrentes). Atualização a cada 24h. Blog ativo.

**Preços:** **Desconhecidos** (página JS; pricing "contact-led"). Planos confirmados: **Professional Edition** e **Flagship Version** + free trial. Não há tier gratuito permanente confirmado.

**Geografia:** **NÃO cobre Brasil e SEM PT-BR.** Idiomas: EN, ZH, ID, MS, Filipino, TH, VI, JA. Foco US + Sudeste Asiático.

**Relevância ao TIKSPY:** Moderada funcionalmente (caps. 1 e 2), mas **baixa/nenhuma no mercado-alvo BR**. Atualização só a cada 24h reduz overlap nas caps. 3 e 4.

---

#### SimpTok — https://simptok.com/
**O que é:** Ferramenta **100% gratuita** de analytics de TikTok Shop, sem cadastro obrigatório (free beta).

**Features-chave:** Trending Products Dashboard (top 500 por receita); Top Brands Tracker; Category Analytics; New Products Monitor; Sales Forecast e Profit Margin Calculators; Product Name Optimizer; Product Health Checker. ⚠️ **Possui um SCORE PROPRIETÁRIO** (pondera crescimento/volume/receita), unlimited shop tracking, contagem de creators por produto, até 90 dias de histórico e atualização "de hora em hora".

**Preços:** **US$0** — tudo liberado, cadastro não obrigatório.

**Geografia:** **US-only** (US monthly rankings). Sem Brasil/PT-BR.

**Relevância ao TIKSPY:** **Média — principal ameaça ao tier de ENTRADA pago.** Oferece descoberta (cap. 1) e noções de viabilidade/margem (cap. 3) **de graça** — inclusive um score básico. ⚠️ Isso **enfraquece** "score proprietário" e "dados em tempo real" como diferenciais exclusivos. O TIKSPY mantém vantagem em: **foco/cobertura BR e PT-BR**, inteligência competitiva mais profunda que top 500, API, analytics de livestream e base de creators (todos ausentes na SimpTok).

---

### 3.6 Ferramentas adjacentes / complementares (baixa sobreposição)

#### Dashboardly — https://www.dashboardly.io/
Analytics de **lucro e reconciliação** de payouts no nível de pedido/SKU, **parceira oficial** do TikTok Shop (puxa dados via **API oficial OAuth** + TikTok Ads API). Suite de profit/ops: inventário com previsão de demanda, ROI por SKU, Customer LTV, breakdown de receita por canal, multi-shop/agência (até 40 shops).
**Preços (USD):** Brand Starter **US$29/mês** → Enterprise US$399/mês; Agency US$249-599/mês; anual -20%. **Sem free tier** (trial 14 dias com cartão).
**Brasil:** não confirmado (preços só USD).
**Relevância:** Baixa-média/**complementar**. Atua no PRÓPRIO shop (reconciliação), não em inteligência de mercado. Contraste valioso: **API oficial vs scraping**.

#### HiveHQ — https://www.hivehq.ai/
Suite de **profit/operações + bot de recrutamento de afiliados** (banco de 1,5M+ criadores, outreach automatizado ~100k ações/mês, Creator Tracker). Não faz descoberta de produtos nem score de mercado.
**Preços (USD):** Profit Dashboard Free (até 250 pedidos) → Enterprise US$399/mês; Affiliate Bot US$350-400/mês. **US e UK apenas, sem BR.**
**Relevância:** Baixa/complementar. Atua no **pós-decisão** (operar, recrutar, lucrar); o TIKSPY atua no **pré-decisão** (descobrir, validar, monitorar).

#### kiero — https://kierolabs.com/landing
Inteligência de **atribuição/valor de afiliados** ("Creator Score" por qualidade do cliente, Cross-Channel Attribution, Isabel AI). **UK-first**, preços em **GBP** (Free / £150/mês / Enterprise).
**Relevância:** Baixa-média. Toca a cap. 2 por outro ângulo (atribuição), voltado ao **vendedor que gerencia afiliados**, não ao afiliado caçador de produto. Sem BR.

#### Pentos — https://pentos.co
**Content intelligence** de TikTok (músicas/áudios virais, hashtags, contas, benchmarking de criadores). **NÃO cobre TikTok Shop, GMV nem preço de produto.**
**Preços (USD):** Trends Pro US$99/mês; Icon US$299/mês; Mega US$999/mês. Histórico só prospectivo (após colocar tracker, sem backfill).
**Relevância:** Parcial — cobre só **a metade de conteúdo** do cruzamento conteúdo x venda do TIKSPY.

#### Exolyt — https://exolyt.com/
Social intelligence de TikTok (influenciadores, marcas, sentimento, tendências de setor). **Sem TikTok Shop/e-commerce.**
**Preços (EUR):** Basic €0 (free real); Essentials €250/mês; Advanced €600/mês. **UI disponível em Português** (sem recorte de dados BR).
**Relevância:** Baixa. Concorrente tangencial (cap. 2 só pelo conteúdo).

#### SociaVault — https://sociavault.com/
**API de scraping** de redes sociais com endpoints de TikTok Shop (unidades vendidas, preço, estoque, reviews, receita de concorrente, correlação produto-creator). Para **desenvolvedores** ("build a Kalodata clone").
**Preços (USD — pacotes de compra única, não assinatura):** Free 50 créditos; Starter US$29 (6.000); Growth US$79 (20.000); Pro US$199 (75.000); Enterprise US$399 (200.000). Créditos não expiram, sem rate limit.
**Relevância:** **Potencial FORNECEDOR de dados**, não concorrente. Mostra que dados de TikTok Shop são obtidos via scraping de terceiros, não API oficial.

#### ZIK Analytics — https://www.zikanalytics.com/
Product research multi-plataforma (**eBay, Shopify, AliExpress** — não TikTok Shop). Dados de receita reais, Market Insights.
**Preços (USD):** Pro US$39,90/mês; Pro+ US$59,90; Enterprise a partir de US$89,90. Trial US$1/7d. **PT-BR marcado como "em breve".**
**Relevância:** Baixa — plataformas diferentes. Benchmark de modelo.

#### Cluster Shopify (Shophunter / PPSPY / SpySales / Koala Inspector)
Inteligência de **lojas Shopify** (receita estimada, apps/temas, fornecedores, mudanças). **NÃO são nativas de TikTok Shop.**
**Preços (USD):** Shophunter a partir de US$50/mês (trial pago US$1/3d); PPSPY US$39/mês (free trial real; **tem rota /pt**); SpySales US$0 free + US$25/mês; Koala Inspector free (15 tokens) + US$22/mês.
**Relevância:** Baixa/indireta. Benchmark de UX de inteligência competitiva e alertas de mudança (caps. 2 e 4).

#### tokfy — https://tokfy.io/
Ferramenta **brasileira de geração de criativos por IA** (fotos de produto → vídeos virais, avatares, imagens). **NÃO é inteligência de dados.**
**Preços:** Desconhecido (provável SaaS BRL, assinatura agregando IAs).
**Relevância:** Sobreposição quase nula. **Possível PARCEIRO/integração** (descobrir produto no TIKSPY → gerar criativo no tokfy) e útil para delimitar escopo.

#### Hunter Hub — https://hunterhub.com.br/
Plataforma **brasileira** de gestão/inteligência de **Mercado Livre** (e Shopee via extensão Hunter Spy). ⚠️ **NÃO cobre TikTok Shop com dados nativos** (TikTok Shop só aparece no blog). Tem **Score 0-100** (IA com 15 variáveis), lucro real, conciliação de taxas, curva ABC.
**Preços (BRL — confirmados):** Explorador **R$97/mês** (R$77 anual); Caçador **R$197/mês** (R$157); Mestre **R$397/mês** (R$317). +R$29,90/mês por 5.000 vendas. **Trial 7 dias sem cartão.**
**Relevância:** Não concorre em TikTok Shop, mas é o **melhor benchmark BR de modelo de negócio** (score proprietário 0-100 + planos escalonados em reais + trial 7 dias sem cartão). Risco: pode lançar módulo TikTok Shop.

---

### 3.7 Baseline gratuito oficial (o "concorrente zero")

#### TikTok Seller Center / Shop Analytics / Data Compass
Painel oficial gratuito do lojista. Consolidou "Homepage" + "Growth Insights" em **Shop Analytics**: GMV, pedidos por SKU, vendas separadas por **live/vídeo/product card**, ranking de loja por categoria, analytics pós-compra. Alertas de estoque (em Products > Manage Stock). LIVE analytics via TikTok Studio.
**Preços:** Gratuito (a operação tem taxas transacionais por venda à parte). **PT-BR no painel brasileiro** (seller-br.tiktok.com).
**Limitação central:** vê **só a própria loja**. ⚠️ Inteligência competitiva real na TikTok agora existe via **Market Scope** (Ecommerce Insights: market share, concorrentes, Buyer Analysis), mas é **gated** (select customers, via rep de vendas, voltado a marcas/anunciantes).
**Relevância:** Baseline contra o qual o TIKSPY justifica valor: *"o Seller Center mostra a SUA loja; o TIKSPY mostra o mercado todo."*

#### TikTok Shop Product Opportunities
Ferramenta oficial gratuita (Products > Product Opportunities): Featured Products (sub-ofertados), Trending Searches, Trending Video Hashtags, Popular Subcategories, Exclusive Opportunities, auto-register/auto-match, incentivos (NewStar). Baseado em **sinais reais de demanda** (buscas/compras/conteúdo). Atualização periódica (semanal p/ tendências). **Provável no painel BR em PT-BR** (rótulo exato não confirmado).
**Relevância:** Alternativa gratuita oficial **mais próxima da cap. 1**. Mas sem visão por concorrente/afiliado, sem score consolidado, sem alertas, e exige conta de seller (exclui afiliados puros).

#### TikTok Creative Center (Top Products / Top Ads / Trends)
Recurso público gratuito, **em PT-BR desde set/2023**, com filtro de região (incl. Brasil). ⚠️ Top Products é 100% baseado em **anúncios** ("Popularity" = nº de criativos que apresentam o produto; **GMV estimado**, não vendas reais). As ferramentas de IA (Symphony, Product-to-Video, etc.) são grátis mas exigem login Business.
**Relevância:** Sobreposição **parcial**; alternativa gratuita relevante. Não mostra vendas reais, não tem inteligência por afiliado/vendedor, não tem score nem alertas — exatamente os gaps que o TIKSPY preenche.

---

## 4. Contexto Brasil

### 4.1 Timing do TikTok Shop no Brasil

- **Lançamento oficial:** 8 de maio de 2025 (2º mercado LatAm após o México; SEA desde 2021, EUA desde set/2023).
- **Balanço de 1 ano (maio/2026):**
  - **~134 milhões de usuários** na plataforma no Brasil (idade média >30 anos).
  - **GMV médio diário +102x** em um ano.
  - **Lives diárias +20x; GMV de lives +161x.**
  - **Afiliados ativos +46x.**
  - GMV mensal saltou de ~US$1M (mai/25) → US$10,1M (jun) → US$25,7M (jul) → **US$46,1M (ago/25)**, ~+79% MoM de jul→ago (não "quase dobrou").
- **Compra por descoberta:** **57,8%** dos usuários concluem a compra após descobrir o produto no app.
- **Pix:** driver de conversão — **~93% dos adultos** usam Pix (não "85%"); Pix é ~40% das transações de e-commerce.
- **Categorias quentes:** moda feminina, beleza/perfumaria, casa & decoração e eletrônicos (fones, películas, acessórios PC, smartwatches). Beleza liderou ~21% do GMV em ago/2025.
- **Comissões:** **comissão da plataforma ~6%** (taxa de marketplace cobrada do seller, + taxa fixa ~R$2/item abaixo de R$79); **comissão de afiliado** definida pelo seller, faixa prática **15-25% (até ~30%)**. A faixa "5% a 70%" **não foi confirmada**.
- **Regulação:** Lei 15.325, de **6 de janeiro de 2026**, regulamentou a profissão de "profissional de multimídia" (inclui influenciadores).
- **Projeção Santander (jan/2025, pré-lançamento):** até **R$39 bilhões** em GMV até 2028 (5-9% do e-commerce nacional).
- **Mudança recente:** rumores/sinais de **REDUZIR** o requisito de afiliado de 2.000 → 1.000 seguidores (não há elevação para 5.000).
- **GMV Max:** tipo de campanha **padrão/único** para TikTok Shop Ads desde jul/2025.

> **Implicação:** mercado em hipercrescimento e ainda jovem — janela ideal para "descubra antes dos outros". Desafios: dados históricos curtos (dificulta treinar score robusto); comissão pressiona margem do afiliado (ferramenta precisa provar ROI claro); educação de mercado necessária.

### 4.2 A lacuna de ferramentas em PT-BR — reavaliada

⚠️ **Correção importante de tese:** o argumento "só o TIKSPY estará em PT-BR" está **desatualizado**. O cenário real:

- **Globais que JÁ atendem BR/PT-BR:** **Kalodata** (dados BR + PT no app; PT-BR web a confirmar), **FastMoss** (UI PT-BR + region=BR), **Pipiads** (interface PT, dados BR), **BigSpy** (UI PT-BR), **Exolyt** (UI PT).
- **Nativos brasileiros de dados:** **VYRAL** (PT-BR, R$49/mês, o mais direto), **Gloda via ABLELIVE** (PT-BR, reais, forte em lives), **Hunterfy** (PT-BR, info escassa).
- **Não cobrem BR:** Shoplus/TikMeta, EchoTik (UI), TabCut, WinningHunter, Tikstar, SocialPeta, AdSpy, Dropispy, ZIK, cluster Shopify, HiveHQ, kiero.

A vantagem defensável **não é o idioma**, e sim: **score proprietário consolidado + alertas cruzando conteúdo x venda + profundidade no catálogo/logística BR + UX 100% para afiliado/criador brasileiro**.

### 4.3 Os "falsos concorrentes" (infoprodutos/cursos/comunidades)

Disputam **atenção e orçamento** do mesmo público, mas **não entregam dados em tempo real**. São o anti-posicionamento explícito do TIKSPY.

| Produto | Tipo | Preço oficial (BRL) | Observações |
|---|---|---|---|
| **MVM Brasil** (Diogo Kobata) | Curso + Discord + rede de afiliados | **R$497** (12x R$51,40), único | "Mente, Valores, Money" (ex-Mentoria Viral Milionário). Alega +R$150M em vendas. Garantia 7d + estendida 90d (R$5.000 de compensação). Reclamações no Reclame Aqui (Kiwify). |
| **Mentoria DOTTS** (Fátima Maria) | Mentoria | **R$997** de tabela | Comunidade fechada, entrega via Google Drive. ⚠️ R$60-79 visto online = **rateio pirata**, não oficial. |
| **TikTok Shop Sem Segredo** (Octávio Henrique) | Curso + Comunidade TKS | ~**R$497** (Hotmart) | Método "VENDC"/"DRIVE THRU", foco em lives. Reclamação no Reclame Aqui. |
| **Mapa do TikTok Shop** (Universidade Ecommerce) | Curso | **R$97** (de R$197), único, acesso 1 ano | 8 módulos (cadastro, logística, precificação, afiliado). Disclaimer explícito negando garantia de resultado. |
| **Desafio Faturando com TikTok Shop / TikTokiZando** (Lucas Kalango + Iverson Iório, CriadorViral) | Desafio 15 dias + WhatsApp | **R$297** (12x R$30,72), único | Aulas Zoom + missões + bônus livro TikTokiZando. |
| **Udemy (catálogo TikTok Shop)** | Cursos avulsos | ~R$30-120 (promo) | Pagamento único; valores não confirmados na fonte (403). |

⚠️ **Cuidados de classificação:** `negociosegames`, `qualic.com.br` e `arcosscale` são **conteúdo de captação/blog** (agência, contabilidade, consultoria), não cursos pagos clássicos. **MundoSeller** é híbrido (educação + ferramentas SaaS de Mercado Livre/seller), mas **não** entrega inteligência de venda/descoberta/score do TikTok Shop.

> **Padrão observado:** pagamento único de entrada (não assinatura SaaS), forte marketing/comunidade, promessa de faturamento, e — importante — **os cursos verificados NÃO recomendam Kalodata/FastMoss** (ensinam métodos manuais/orgânicos). Há pirataria (rateio) e reclamações de reembolso espalhadas pelo segmento.

---

## 5. Análise de lacunas e oportunidades de diferenciação

Avaliação dos concorrentes contra as **4 capacidades centrais** do TIKSPY:

### Capacidade 1 — Descoberta de produtos (já explodindo E emergentes)
- **Bem coberta** por quase todos os players de dados (Kalodata "potential products", EchoTik "Dark Horse", Shoplus, FastMoss, VYRAL, Gloda) e até pela TikTok oficial (Product Opportunities).
- **Lacuna do mercado:** poucos focam em **emergentes pré-hype com sinal confiável** + **profundidade no catálogo BR**.
- **Onde o TIKSPY ganha:** descoberta de emergentes especificamente calibrada para o mercado brasileiro recém-aberto.

### Capacidade 2 — Inteligência competitiva (afiliados/criativos/estratégia)
- **Bem coberta** por Kalodata, FastMoss, Pipiads (criativos), EchoTik, Gloda, VYRAL (transcrição de criativos), WinningHunter.
- **Lacuna:** cruzar **criativos (conteúdo) com dados de venda real** de forma integrada — Pipiads/Minea têm criativos mas pouco GMV orgânico; VYRAL tem criativos+receita estimada mas raso em loja/seller.
- **Onde o TIKSPY ganha:** cruzamento criativo × venda real + rastreio por afiliado/vendedor + frequência/estratégia.

### Capacidade 3 — Análise de viabilidade com SCORE PROPRIETÁRIO ⭐ (maior oportunidade)
- **Quase ninguém entrega um índice único consolidado** de oportunidade vs saturação cruzando demanda × concorrência × retorno:
  - Kalodata, FastMoss, EchoTik, Shoplus, Pipiads, Gloda, WinningHunter, VYRAL → **entregam métricas brutas/rankings**, não score.
  - **Exceções a observar:** **SimpTok** (tem score básico grátis — US-only), **Hunter Hub/Hunterfy** (score 0-100 em PT-BR, mas Hunter Hub é de Mercado Livre), **Dropship Spy** (veredito + confidence score por IA, sem GMV nativo TikTok Shop), **Gloda** (sales score só por criador).
- **Onde o TIKSPY ganha:** **um SCORE proprietário transparente e acionável de viabilidade de PRODUTO** (não só de criador), calibrado para o BR. Esta é a **diferenciação mais defensável**, desde que o score seja confiável e explicável.

### Capacidade 4 — Monitoramento contínuo + alertas (cruzando conteúdo × venda) ⭐ (segunda maior oportunidade)
- **Foco fraco no mercado:** a maioria é **consulta sob demanda** (dashboards), não **push proativo**.
  - Têm algum monitoramento/alerta: **EchoTik** (Product/Live/Video Monitor), **Pipiads** (Ad Tracker com notificações), **WinningHunter** (Competitor Analysis automático), **Kalodata** (notificações no app), **HiveHQ** (Smart Notification — mas operacional).
  - **Ninguém** faz, de forma central, **cruzamento proativo conteúdo × venda multi-plataforma** com alertas configuráveis.
- **Onde o TIKSPY ganha:** monitoramento contínuo + alertas real-time que **cruzam tendência de conteúdo com tendência de venda** — pilar central, não acessório.

> **Síntese:** o terreno disputado e maduro é caps. 1 e 2. O **espaço aberto e defensável** é **cap. 3 (score proprietário consolidado)** e **cap. 4 (alertas que cruzam conteúdo × venda)**, ambos **ancorados na profundidade BR**.

---

## 6. Recomendações de posicionamento

1. **Cravar o SCORE proprietário como herói do produto (cap. 3).** É a lacuna mais clara entre os líderes. Fazê-lo **transparente e explicável** ("por que este produto é oportunidade e não saturação"), porque o mercado já desconfia de números estimados. Diferencia de Kalodata/FastMoss (métricas brutas), de SimpTok (score raso/US) e de Hunter Hub/Hunterfy (foco ML / TikTok Shop não nativo).

2. **Vender ALERTAS + cruzamento conteúdo × venda como segundo pilar (cap. 4).** "Descubra antes dos outros" exige **push proativo**, não consulta passiva. Nenhum concorrente faz isso de forma central — é onde o lema vira produto.

3. **Não vender "PT-BR" como diferencial único.** Kalodata, FastMoss, Pipiads, VYRAL e Gloda já estão em português. Reposicionar para **profundidade no catálogo/logística BR + atendimento + UX para o afiliado/criador brasileiro** + score + alertas.

4. **Posicionar contra os infoprodutos com honestidade radical.** "Não é curso/mentoria/promessa; é ferramenta de dados reais." Capturar o aluno que **já fez curso** e precisa de dados para executar. Considerar **parcerias de afiliação** com mentores/comunidades (TIKSPY como "a ferramenta oficial" citada).

5. **Ter resposta clara ao baseline gratuito** (Seller Center, Creative Center, Product Opportunities, SimpTok): *"O oficial mostra a SUA loja e tendências de anúncios; o TIKSPY mostra o mercado todo, com vendas reais, score e alertas."*

6. **Disciplina de preço.** O piso de mercado é agressivo: EchoTik US$9,90, VYRAL R$49, FastMoss/Pipiads/Minea US$49, Shoplus US$39, Kalodata US$45,90. Posicionar o **tier de entrada competitivo** (na faixa R$49-R$97 para fazer sentido com o ticket BR e bater VYRAL/Hunter Hub) e reservar **API + alertas real-time + monitoramento avançado** para os tiers superiores.

7. **Confiabilidade do dado como argumento.** WinningHunter (90-95%, erro 20-40%) e Kalodata ("direcional") admitem imprecisão. O TIKSPY pode ganhar confiança ao ser **transparente sobre metodologia e margem de erro** — algo que VYRAL e a maioria não fazem.

8. **Monitorar de perto:** **VYRAL** (rival direto BR por preço/posicionamento), **Gloda/ABLELIVE** (enterprise BR via parceria, forte em lives), **Hunterfy** (posicionamento idêntico — investigar a fundo), **Kalodata** (líder com BR + API + escala) e **Hunter Hub** (pode lançar módulo TikTok Shop).

---

## 7. Fontes consolidadas

**Líderes globais e nativos de TikTok Shop**
- https://www.kalodata.com/ · /pricing · apps.apple.com/gb/app/kalodata/id6670308912
- https://www.fastmoss.com/ · /pricing · /pt/shop-marketing/search?region=BR
- https://echotik.live/pricing · /pricing/annually · help.echotik.live · /en/api-service · keyapi.ai
- https://www.shoplus.net/ · /pricing · /tiktok-shops-analytics · tikmeta.com/en/blogs/shoplus-tiktok-analytics
- https://www.tikstar.com/ · affiliateweapons.com/affiliate-tools/tikstar/
- https://www.tabcut.com/ · /workbench · /user/pricing
- https://simptok.com/ · /price-of-all-tiktok-shop-tools-interactive/

**Concorrentes brasileiros (PT-BR)**
- https://vyral.com.br/ · pay.b4you.com.br · reclameaqui.com.br/b4you/...
- https://www.gloda.vip/en · /en/vip · /pt · businessmoment.com.br/gloda-esta-disponivel-no-brasil-em-parceira-com-a-ablelive/ · ablelive.com.br
- https://hunterfy.com.br/
- https://hunterhub.com.br/ · chromewebstore.google.com/detail/hunter-spy-...

**Adspy / criativos**
- https://www.pipiads.com/ · /tiktok-shop-business · /pt/tiktok-shop-business · affninja.com/pipiads-pricing/ · affinco.com/pipiads-pricing/
- https://www.minea.com/pricing · /pt/ · /tiktok-shop-products
- https://bigspy.com/pricing · /en · affmaven.com/bigspy-pricing-plans/
- https://socialpeta.com/en · /en/ad-spy-tool
- https://adspy.com · winninghunter.com/insights/adspy-review/
- https://dropispy.com/adspy-pricing/

**All-in-one / dropshipping**
- https://winninghunter.com/tiktok-shop · app.winninghunter.com/pricing
- https://findniche.com/tiktok · /en · capterra.com/p/231731/FindNiche/pricing/
- https://www.sellthetrend.com/pricing · /dropshipping-platform
- https://dropship-spy.com/pricing

**Adjacentes / complementares**
- https://www.dashboardly.io/ · /pricing · /features
- https://hivehq.ai/profitdashboard/pricing/ · /affiliate-bot/
- https://kierolabs.com/landing
- https://pentos.co/pricing/
- https://exolyt.com/pricing · /features
- https://sociavault.com/pricing
- https://www.zikanalytics.com/pricing
- https://shophunter.io/ · ppspy.com/rank · spysales.com/ · koala-apps.io/koala-inspector/
- https://tokfy.io/

**Oficial TikTok (baseline gratuito)**
- https://seller-br.tiktok.com/ · seller-us.tiktok.com/university/essay?knowledge_id=813364865828654 · ?knowledge_id=4371484668528427
- https://ads.tiktok.com/business/creativecenter/pc/pt · /business/pt-BR/blog/creative-center-fala-portugues
- https://partner.tiktokshop.com/docv2/page/data-compass-widget · ads.tiktok.com/help/article/about-tiktok-market-scope

**Contexto de mercado Brasil**
- https://newsroom.tiktok.com/pt-br/tiktok-shop-chega-ao-brasil · /compra-por-descoberta-vendas-no-tiktok-shop-cresceram-26x?lang=pt-BR
- https://exame.com/negocios/tiktok-shop-cresce-102-vezes-em-um-ano-e-acelera-compras-por-video-no-brasil/
- https://consumidormoderno.com.br/tiktok-shop-celebra-o-primeiro-ano-com-134-milhoes-de-usuarios... · centraldovarejo.com.br/tiktok-shop-completa-um-ano-no-brasil...
- https://thelowdown.momentum.asia/tiktok-shop-brazil-gmv-grew-close-to-us50m-in-august/
- https://mercadoeconsumo.com.br/29/01/2025/ecommerce/tiktok-shop-pode-representar-de-5-a-9-do-e-commerce-brasileiro-ate-2028/
- https://www.migalhas.com.br/depeso/448450/lei-dos-influenciadores-digitais-15-325-26 · conjur.com.br/2026-jan-15/a-lei-15-325-2026...
- https://gosmarter.com.br/comissoes-tiktok-shop-brasil-custos-margem-seller/
- https://www.statista.com/topics/7881/pix-in-brazil/

**Infoprodutos / cursos BR (concorrentes de posicionamento)**
- https://autoridadevirtual.com.br/ (MVM) · diogokobata.com.br
- https://universidadeecommerce.com/mapadotiktokshop/ (Mapa do TikTok Shop)
- https://cursosdigital10.com.br/cursos/tiktok-shop-sem-segredo/ · hotmart.com/pt-br/marketplace/produtos/tiktok-shop-sem-segredo/W100800183J
- https://lp.criadorviral.com.br/tiktokshop15d (Desafio TikTokiZando)
- https://www.udemy.com/pt/topic/tiktok-shop/
