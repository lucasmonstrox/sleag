# Compliance Jurídico — LGPD, Termos do TikTok, Licença EchoTik e Scraping

**Data:** 2026-06-22
**Status:** Documento de investigação jurídica (mapeamento de risco + decisões a tomar). **Não é parecer jurídico** — subsidia a contratação de assessoria especializada.
**Escopo:** Avaliar a legalidade do modelo SLEAG — coletar dados públicos do TikTok Shop via fornecedor terceiro (EchoTik), **acumular histórico próprio** e **revender inteligência** por assinatura no Brasil. Cobre LGPD, Termos de Serviço do TikTok/TikTok Shop, termos de revenda da EchoTik e legalidade de scraping (relevante para a "2ª fonte").
**Relação:** Endereça a pendência registrada em [fornecedores.md §1.1](./fornecedores.md) ("ler licença de revenda EchoTik") e [ingestao.md §12 Fase 1](./ingestao.md). Cruza com [infra.md §7 (RLS/segurança)](./infra.md) e [visao-geral.md](./visao-geral.md).

> **Aviso.** As afirmações abaixo são baseadas em pesquisa pública (jun/2026) com fontes citadas. Onde a fonte não foi confirmada, está marcado **[NÃO CONFIRMADO]**. Leis, termos e jurisprudência mudam — reconfirme na fonte e valide com advogado antes de decisão de produção.

---

## 1. Sumário executivo — o veredito honesto

O modelo do SLEAG é **viável, mas não é "porto seguro"**. O risco não está em *olhar* dados públicos — está em **acumular PII de pessoas físicas (criadores) num banco próprio e revendê-la como inteligência**. Três frentes de risco, em ordem de gravidade:

| # | Risco | Gravidade | Por quê | Onde mitigar |
|---|---|---|---|---|
| 1 | **Revenda sem licença do fornecedor** | 🔴 Alta | A EchoTik **não publica** termos de revenda; `echotik.live/terms` = 404. Revender o dado de um fornecedor sem licença de redistribuição é o risco contratual central. | §4 — obter licença por escrito |
| 2 | **LGPD: revender base com PII de criadores** | 🔴 Alta | Doutrina BR entende que raspar PII, sintetizar base e vendê-la **vai além do que o legítimo interesse autoriza**. | §2 — minimização + LIA + canal de oposição |
| 3 | **ToS do TikTok (via 2ª fonte/scraping)** | 🟡 Média | Comprar da EchoTik desloca o risco de ToS pro fornecedor. Raspar o TikTok **direto** (Apify/2ª fonte) reintroduz esse risco no SLEAG. | §3, §5 — adiar scraping direto |

**A decisão estrutural que destrava tudo:** o produto deve vender **inteligência derivada e agregada** (scores, rankings, tendências), **não o dado pessoal bruto**. Quanto mais o output for "número agregado de mercado" e menos for "ficha do criador fulano", menor o risco nas três frentes.

---

## 2. LGPD (Lei 13.709/2018)

### 2.1 Dados de criadores e lojistas SÃO dados pessoais

A LGPD define dado pessoal como "informação relacionada a pessoa natural identificada ou identificável" (art. 5º, I). Nome do criador, `@handle`, foto, região e **métricas atreladas a uma pessoa física identificável** caem no escopo. Lojista PJ (CNPJ) não é titular — mas dados de contato/sócios pessoa física, sim.
> Fonte: [Lei 13.709/2018 — Planalto](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)

### 2.2 "Dado público" NÃO sai da LGPD

Não existe porto seguro para dado público. O art. 7º, §3º permite tratar dados **tornados manifestamente públicos pelo titular** sem novo consentimento — **mas** o §4º preserva os direitos do titular e exige respeito à finalidade, boa-fé e ao interesse público que justificaram a disponibilização. Tornar público um perfil no TikTok não é o mesmo que autorizar que terceiros montem uma base comercial sobre ele.
> Fonte: [L13709 art. 7º](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm); [UFSC — LGPD, dúvidas frequentes](https://lgpd.ufsc.br/duvidas-frequentes/)

### 2.3 Base legal: legítimo interesse (art. 7º, IX), não consentimento

Pedir consentimento de milhões de criadores é inviável. A base correta para perfilamento comercial B2B é o **legítimo interesse**. A ANPD publicou em **fev/2024** o *Guia Orientativo — Legítimo Interesse*, que fixa:

- **Três condições:** finalidade legítima/específica/explícita; situação concreta; compatibilidade com o ordenamento.
- **Teste de balanceamento (LIA — Legitimate Interest Assessment):** ferramenta **obrigatória** de ponderação entre o interesse do controlador e os direitos do titular. Deve ser **documentado**.
- **Legítima expectativa** avaliada por 4 fatores — entre eles a **fonte e forma de coleta** (coleta direta vs. de terceiros vs. de fontes públicas). Dado vindo de **terceiro** (EchoTik) e usado para finalidade que o titular não esperava **pesa contra** o controlador.
- Legítimo interesse **não cobre dados sensíveis**.
> Fontes: [Data Privacy Brasil — Guia do legítimo interesse](https://www.dataprivacybr.org/guia-do-legitimo-interesse-orientacoes-da-anpd/); [Mattos Filho — orientações ANPD](https://www.mattosfilho.com.br/en/unico/anpd-legal-data-processing-brazil/)

### 2.4 O risco específico mais grave do modelo

Há **entendimento doutrinário** de que **raspar dados pessoais, montar base sintetizada e disponibilizá-la para venda viola os direitos dos titulares e princípios da LGPD, indo além do legítimo interesse**. É exatamente a forma bruta do modelo SLEAG (acumular histórico de PII de criadores e revender). É o ponto que mais exige cuidado de design.
> Fontes: [Assis e Mendes — Web scraping e LGPD: riscos](https://assisemendes.com.br/web-scraping-e-lgpd-riscos-juridicos-do-uso-de-dados-publicos/); IAPD — Raspagem e proteção de bases públicas **[validar texto integral — o domínio recusou conexão; conteúdo só via snippet]**

### 2.5 Obrigações concretas

| Obrigação | Detalhe | Status SLEAG |
|---|---|---|
| **Encarregado/DPO** (art. 41) | Canal com titulares e ANPD. Agentes de pequeno porte (Res. CD/ANPD 2/2022) têm **dispensa de nomear**, mas devem manter canal ativo. ANPD tem fiscalizado isso. | A definir |
| **Política de Privacidade** | Dever de transparência (art. 6º). | A criar |
| **Direitos do titular** (art. 18) | Acesso, correção, eliminação, oposição. Em legítimo interesse, o **direito de oposição é central**. | Precisa de canal de opt-out |
| **Notificação de incidentes** | À ANPD e ao titular. | Processo a definir |
| **LIA documentado** | Teste de balanceamento por escrito. | A produzir antes de produção |

### 2.6 Jurisprudência

**[NÃO CONFIRMADO]** que exista decisão sancionadora da ANPD especificamente sobre revenda de inteligência sobre dados públicos. Há o Guia de fev/2024 (orientativo, não vinculante como precedente) e ementários do TJDFT sobre LGPD. Ausência de precedente = **incerteza**, não autorização.

---

## 3. Termos de Serviço do TikTok / TikTok Shop

### 3.1 O ToS do TikTok proíbe scraping

A Seção 3.4 do ToS (US) proíbe expressamente *"scrape, crawl, export or otherwise extract any data or content in any form, for any purpose, from the Platform using any automated system or software, including automated 'bots,' except as approved in writing by TikTok"*, e usar conteúdo do TikTok *"for commercial purposes unless permitted by TikTok or the user"*. O TikTok também combate scraping ativamente, com medidas técnicas e jurídicas.
> Fontes: [TikTok Terms of Service (US)](https://www.tiktok.com/legal/page/us/terms-of-service/en); [TikTok — How We Combat Unauthorized Data Scraping](https://www.tiktok.com/privacy/blog/how-we-combat-scraping/en)

### 3.2 Via oficial (Partner/API) vs. coleta não-oficial

O **TikTok Shop Partner Developer ToS** tem termos próprios. Confirmado nos resultados:
- Proíbe usar a API e os *API Data* (ou permitir que terceiros usem) **para competir com ou replicar serviços** da TT Commerce/Global Services.
- Proíbe remover avisos de copyright/marca/propriedade.
- Exige tratamento conforme leis de privacidade.
- **Cláusula literal "não pode revender API Data": [NÃO CONFIRMADO]** — a página é renderizada por JS e o texto integral não foi extraído. O foco visível das cláusulas é impedir **serviços concorrentes**. ⚠️ **Capturar manualmente o ToS do Partner Center.**
> Fontes: [Partner Center — Developer ToS](https://partner.tiktokshop.com/docv2/page/6506bc942f024f02be400315); [Partner Center — ToS global](https://partner.tiktokshop.com/docv2/page/6506bbf2de672602b7bc0697)

### 3.3 Implicação para a arquitetura

O SLEAG **não acessa o TikTok diretamente** — usa a EchoTik. Isso **desloca o risco contratual de ToS para o fornecedor**, o que é favorável. O risco só retorna ao SLEAG se a **2ª fonte** (Apify/scraping próprio, prevista em [ingestao.md §12 Fase 2](./ingestao.md)) raspar o TikTok diretamente. **Recomendação:** tratar a 2ª fonte como decisão jurídica, não só técnica (§5).

> ⚠️ **Cuidado com a API oficial do TikTok Shop.** Os docs em [docs/tiktok/api/](./tiktok/api/README.md) cobrem a API oficial (de seller/parceiro). Usá-la para *operação de loja* é um caso de uso; usá-la como **fonte de inteligência de mercado para revenda** pode esbarrar na cláusula de "não replicar/competir com serviços". São finalidades distintas — não confundir.

---

## 4. EchoTik — termos de uso e revenda

### 4.1 Quem é a EchoTik

Operada pela **ECHOSELL CORPORATION PTE. LTD.** (8 Burn Road #04-04, Trivex 369977, **Singapura**; contato `support@echosell.com`), com dados em servidores **AWS nos EUA**.
> Correção de premissa: a entidade legal pública é **de Singapura**, não chinesa (ainda que operação/equipe possam estar na China). Relevante para transferência internacional de dados.
> Fonte: [EchoTik Privacy Policy](https://echotik.live/privacy-policy.html)

### 4.2 Não há licença de revenda pública

Verificado:
- A [página de API](https://echotik.live/en/api-service) **não** contém termos de uso/licenciamento/redistribuição.
- O [Help Center](https://help.echotik.live/en/) não expõe ToS.
- `echotik.live/terms` retorna **404**.
- A Privacy Policy cobre apenas os dados **do cliente** (nome, e-mail, pagamento) — **não** os dados de TikTok revendidos, e **não** tem cláusula de propriedade/revenda/sublicenciamento.
- Ativar conta de API exige **contato com o suporte** → sugere **contrato negociado por e-mail/onboarding, não público**.

### 4.3 Conclusão e ação crítica

**[NÃO CONFIRMADO]** que a EchoTik permita revenda. O padrão de mercado para fornecedores de dados B2B é conceder **licença de uso interno**, **proibir redistribuição/revenda do dado bruto** e permitir apenas *insights derivados/agregados* — cobrando um tier "enterprise/redistribution" à parte para quem revende. (Caracterização geral — **não é cláusula confirmada da EchoTik**.)

> 🔴 **Ação bloqueante para produção.** Obter da EchoTik, **por escrito**: (a) se a assinatura/API permite **redistribuição/revenda** dos dados a terceiros (clientes SLEAG); (b) existência de cláusula de **não-concorrência** ou de **uso interno apenas**; (c) o que conta como "dado derivado/agregado" permitido. Sem isso, todo o modelo de revenda fica sobre fundação incerta.

---

## 5. Legalidade de web scraping no Brasil (relevante para a 2ª fonte)

### 5.1 Não há lei que proíba scraping em si

A legalidade depende de **finalidade, dados envolvidos e meio de acesso**. Doutrina e tribunais delimitam usos.
> Fontes: [Migalhas — Os desafios jurídicos do web scraping](https://www.migalhas.com.br/coluna/dados-publicos/378258/os-desafios-juridicos-do-web-scraping)

### 5.2 Precedentes

- **Brasil — Curriculum Tecnologia x Catho Online:** discutiu concorrência desleal e direito sobre base de dados; a defesa sustentou que a informação era pública e o acesso livre. Precedente nacional mais citado para "raspar base de concorrente".
- **EUA — hiQ Labs v. LinkedIn:** o 9º Circuito (2022) firmou que o **CFAA não se aplica** a coleta de dados publicamente acessíveis (sem login). **Mas o caso terminou MAL para o scraper:** consent judgment de **US$ 500 mil**, reconhecimento de *trespass to chattels* e *misappropriation*, e **proibição de continuar raspando**. Lição: scraping de dado público pode não ser crime de acesso, mas **gera responsabilidade civil por quebra de contrato (ToS) e ilícitos**.
> Fontes: [Wikipedia — hiQ v. LinkedIn](https://en.wikipedia.org/wiki/HiQ_Labs_v._LinkedIn); [Morgan Lewis](https://www.morganlewis.com/blogs/sourcingatmorganlewis/2022/12/linkedin-v-hiq-landmark-data-scraping-suit-provides-guidance-to-data-scrapers-and-web-operators)

### 5.3 No Brasil, o contorno é LGPD + concorrência desleal

Os dois vetores de risco do scraping aqui são (a) **LGPD** (finalidade/transparência/necessidade — perfilamento comercial de dado público para finalidade inesperada pode violar direitos mesmo sem exigir consentimento) e (b) **concorrência desleal / responsabilidade civil** (violar termos contratuais, parasitar base alheia).
> Fontes: [Assis e Mendes — Web scraping e LGPD: riscos e sanções](https://assisemendes.com.br/web-scraping-e-lgpd-entenda-os-riscos-juridicos-e-como-evitar-sancoes/)

### 5.4 Decisão recomendada

Tratar a **2ª fonte (scraping direto do TikTok)** como **adiável e de decisão jurídica**: enquanto a fonte primária for a EchoTik, o risco de ToS do TikTok fica no fornecedor. Ativar scraping próprio só após (a) parecer jurídico e (b) desenho de minimização de PII.

---

## 6. Boas práticas de mitigação (o que produtos similares fazem)

| Produto | Mitigação observada | Aplicável ao SLEAG |
|---|---|---|
| **SimilarWeb** | Disclaimers fortes: dados são "estimativas/extrapolações", "fins informativos", "**não autorizados nem aprovados** pelas empresas referidas", "desempenho passado não garante futuro". | ✅ Adotar disclaimers equivalentes |
| **Helium 10** | **Threshold de anonimização**: oculta métricas quando a consulta não atinge um mínimo de usuários (~100) — k-anonymity contra reidentificação. | ✅ Threshold antes de expor métrica individual |
| **Kalodata / FastMoss / EchoTik** | Framing de "dados públicos + estimativa por IA"; ressalva de que valores são **estimados**, não reais. | ✅ Rotular números como estimativa |

> Fontes: [SimilarWeb — Content Disclaimers](https://www.similarweb.com/corp/legal/content-disclaimers/); [Helium 10 — Privacy Policy](https://www.helium10.com/privacy-policy/); [EchoTik blog — accuracy](https://www.echotik.live/blog/echotik-vs-kalodata-vs-fastmoss-more-accurate/)

### 6.1 Checklist de mitigação para o SLEAG

1. **Vender agregado, não bruto** — scores/rankings/tendências como produto; PII de criador apenas quando indispensável e com threshold mínimo (estilo Helium 10).
2. **Disclaimers** — "estimativa/extrapolação", "fins informativos", "não autorizado/aprovado pelo TikTok nem pelos criadores".
3. **LIA documentado** — teste de balanceamento da ANPD formalizado para o legítimo interesse, com finalidade B2B declarada.
4. **Canal de oposição/remoção** — criador pode pedir saída da base (mitiga o risco "base raspada para venda" da §2.4).
5. **Licença de revenda da EchoTik** por escrito (§4.3) — lacuna crítica.
6. **Política de Privacidade + Encarregado** publicados; processo de incidentes.
7. **Transferência internacional** — dados via EchoTik (Singapura/EUA): mapear a base de transferência internacional da LGPD (cap. V).

---

## 7. Decisões a tomar (próximos passos)

| # | Decisão | Dono | Bloqueante p/ produção? |
|---|---|---|---|
| 1 | Obter licença de revenda/redistribuição da EchoTik por escrito | Fundador + Jurídico | 🔴 Sim |
| 2 | Capturar texto integral do TikTok Shop Partner Developer ToS e avaliar cláusula de revenda/replicação | Jurídico | 🟡 Se usar API oficial |
| 3 | Produzir LIA (teste de balanceamento) documentado | Jurídico/DPO | 🔴 Sim |
| 4 | Definir política de minimização: o que do dado de criador (PII) entra no produto vs. fica só interno | Produto + Jurídico | 🔴 Sim |
| 5 | Publicar Política de Privacidade + definir Encarregado + canal de oposição | Jurídico | 🟡 Antes de captar usuários |
| 6 | Decidir status da 2ª fonte (scraping direto) — adiar até parecer | Fundador | 🟢 Não (já adiável) |
| 7 | Contratar assessoria jurídica especializada em LGPD/dados para validar este mapeamento | Fundador | 🔴 Sim |

---

## 8. Pontos abertos / a confirmar

- **EchoTik ToS / licença de revenda** — não público (`/terms` = 404). Obter no onboarding. **[NÃO CONFIRMADO]**
- **TikTok Shop Partner Developer ToS** — cláusula literal sobre revenda de API Data não extraída (página JS). **[NÃO CONFIRMADO]**
- **Decisão sancionadora da ANPD** sobre revenda de inteligência de dados públicos — existência não confirmada. **[NÃO CONFIRMADO]**
- **Fonte IAPD** (raspagem/LGPD) — validar texto integral antes de citar como fonte forte.
- **Transferência internacional** (EchoTik Singapura + AWS EUA) — base legal da LGPD a mapear.

---

*Este documento é mapa de risco, não parecer. A decisão #7 (assessoria jurídica) deve preceder qualquer lançamento comercial.*
