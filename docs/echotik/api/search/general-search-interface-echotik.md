# Busca Geral (caixa de pesquisa) — EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/372747489e0) · **`GET /api/v3/echotik/search/items`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz

É a busca da própria caixa de pesquisa da EchoTik: cobre **criadores, produtos, lojas, vídeos e lives** em um único endpoint, selecionando o que buscar via `type`. Suporta segmentação de palavras (word segmentation), busca fuzzy e busca exata. Use para alimentar um campo de pesquisa global que precisa retornar qualquer tipo de entidade. Não é um endpoint em tempo-real do TikTok: serve dados do índice próprio da EchoTik (Offline / T+1).

Limites importantes:
- Retorna no máximo **30** entradas por chamada.
- Diferente das interfaces de listagem, **não** traz muitas métricas/campos. Para dados completos, chame a interface de detalhes da entidade correspondente.
- Busca fuzzy: exige casar duas ou mais palavras. Busca exata: exige casar todas as palavras.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `sk` | string | Sim | termo de busca | Palavra(s)-chave a buscar. |
| `region` | string | Não | código de região (ex: `BR`, `US`) | Filtra por região. Se vazio, **não** filtra. |
| `type` | inteiro | Sim | `1`=criador (influencer), `2`=produto, `3`=loja (seller), `4`=vídeo, `5`=live | Tipo de entidade a buscar. Os campos retornados dependem deste valor. |
| `size` | inteiro | Sim | máx. `30` | Quantidade de entradas a retornar (teto de 30). |
| `searchType` | inteiro | Não | `0`=fuzzy (default), `1`=exata | Modo de correspondência. Fuzzy casa 2+ palavras; exata casa todas. |
| `sortType` | inteiro | Não | válido só quando `type=2` (produto), default `2` | Ordenação de produtos (ver tabela abaixo). |

#### Valores de `sortType` (apenas `type=2`)
| Valor | Ordena por |
|---|---|
| `0` | Relevância |
| `1` | `spu_avg_price` (preço médio do SPU) |
| `2` | `total_sale_7d_cnt` (vendas nos últimos 7 dias) — **default** |
| `3` | `total_sale_gmv_7d_amt` (GMV dos últimos 7 dias) |
| `4` | `total_sale_cnt` (vendas totais) |
| `5` | `total_sale_gmv_amt` (GMV total) |
| `6` | `total_ifl_cnt` (total de influenciadores vinculados) |
| `7` | `total_video_cnt` (total de vídeos) |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/search/items?sk=spirit&region=US&type=1&size=10&searchType=0" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota. Aqui `data` é um **array** de entidades; o conjunto de campos varia conforme `type`.

### Campos de `data[]` (exemplo com `type=1`, criador)
Ordem conforme o exemplo oficial da EchoTik:

| Campo | Tipo | O que é |
|---|---|---|
| `avatar` | string (URL) | URL do avatar do criador. |
| `category` | string | Categoria/nicho do criador (ex: `Entertainment`). |
| `region` | string | Região do criador (ex: `US`). |
| `highlight` | objeto/null | (não documentado — provavelmente os trechos do texto que casaram com a busca, para destaque/highlight; `null` quando não há.) |
| `contact_email` | string | E-mail de contato do criador. |
| `influencer_level` | string | Nível/tier do influenciador (ex: `'4'`). (não documentado em detalhe — provavelmente escala de relevância da EchoTik.) |
| `nick_name` | string | Nome de exibição do criador. |
| `total_digg_cnt` | inteiro | Total de curtidas (diggs) acumuladas. |
| `total_followers_cnt` | inteiro | Total de seguidores. |
| `total_live_cnt` | inteiro | Total de lives realizadas. |
| `total_live_views_cnt` | inteiro | Total de visualizações em lives. |
| `total_post_video_cnt` | inteiro | Total de vídeos publicados. |
| `total_product_cnt` | inteiro | Total de produtos associados/vendidos pelo criador. |
| `total_sale_cnt` | inteiro | Total de unidades vendidas. |
| `total_sale_gmv_amt` | número | GMV total (valor de vendas). |
| `total_views_cnt` | inteiro | Total de visualizações de vídeos. |
| `unique_id` | string | Handle (@) único do criador. |
| `user_id` | string | ID interno do usuário/criador. |

> Para `type=2` (produto), `type=3` (loja), `type=4` (vídeo) e `type=5` (live), o array `data[]` traz campos próprios de cada entidade (a EchoTik só publicou exemplo para criador). Os campos `total_sale_7d_cnt`, `total_sale_gmv_7d_amt`, `total_ifl_cnt`, `total_video_cnt` citados em `sortType` indicam que produtos expõem métricas de venda/GMV (7d e total), nº de influenciadores e nº de vídeos. (não documentado em detalhe — valide com chamada `type=2`.)

## Notas & gotchas
- Teto rígido de **30** itens (`size` máx. 30). Não há paginação por offset/cursor aqui — é uma busca de "primeiros resultados", não listagem completa.
- Resposta enxuta de propósito: use endpoints de detalhe para métricas completas.
- `sortType` só tem efeito quando `type=2`.
- `region` vazio = sem filtro (cuidado para não misturar mercados sem querer).
- Este endpoint é Offline (T+1, dados do índice EchoTik) — diferente das interfaces `/realtime/...` que consultam o TikTok ao vivo.

## Relevância para o TIKSPY
- Candidato natural para o campo de busca global do app (autocomplete unificado de criador/produto/loja/vídeo/live).
- Para listas paginadas e métricas completas (ex: tabela de produtos mais vendidos do dashboard), prefira os endpoints de listagem/detalhe específicos; esta busca é para "achar rápido", não para relatórios.

---

<details>
<summary>Spec original (OpenAPI 3.0.1)</summary>

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /api/v3/echotik/search/items:
    get:
      summary: General Search Interface - EchoTik
      deprecated: false
      description: >-
        It provides search functionality for the EchoTik search box, including
        searches for influencers, products, shops, videos, and live streams. The
        interface supports features such as word segmentation, fuzzy search, and
        precise search.

        Note: This interface will only return a maximum of 30 data entries, and
        unlike the list interface, it will not return many metrics, fields, etc.
        If you need more data, please call the relevant details interface.


        Fuzzy search: requires two or more words to match.

        Precise search: requires matching all words.
      tags:
        - Search
      parameters:
        - name: sk
          in: query
          description: Search terms
          required: true
          schema:
            type: string
        - name: region
          in: query
          description: >-
            Region code: This field is optional. If left blank, no filtering
            will be performed.
          required: false
          schema:
            type: string
        - name: type
          in: query
          description: Search type. 1=influencer 2=product 3=seller 4=video 5=live
          required: true
          schema:
            type: integer
        - name: size
          in: query
          description: A maximum of 30 data entries can be returned.
          required: true
          schema:
            type: integer
        - name: searchType
          in: query
          description: 0 = Fuzzy search; 1 = Precise search. Fuzzy search is the default.
          required: false
          schema:
            type: integer
        - name: sortType
          in: query
          description: |-
            Valid only when type=2. The default value is 2.
            sortType=0: Sort by relevance
            sortType=1: Sort by spu_avg_price
            sortType=2: Sort by total_sale_7d_cnt
            sortType=3: Sort by total_sale_gmv_7d_amt
            sortType=4: Sort by total_sale_cnt
            sortType=5: Sort by total_sale_gmv_amt
            sortType=6: Sort by total_ifl_cnt
            sortType=7: Sort by total_video_cnt
          required: false
          schema:
            type: integer
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties: {}
              example:
                code: 0
                message: ok
                data:
                  - avatar: >-
                      https://echosell-images.tos-ap-southeast-1.volces.com/user-avatar/105/MS4wLjABAAAA7fFYOyzWslqGUq5-RPabVG7PBgUbWAnn8gEkAVHojMCMDuO2CvFv3OkZRdQOFbr6.jpg
                    category: Entertainment
                    region: US
                    highlight: null
                    contact_email: spiritamethystt@gmail.com
                    influencer_level: '4'
                    nick_name: Spirit Amethystt 🌺
                    total_digg_cnt: 81730646
                    total_followers_cnt: 1623154
                    total_live_cnt: 1
                    total_live_views_cnt: 34432
                    total_post_video_cnt: 1342
                    total_product_cnt: 19
                    total_sale_cnt: 4582
                    total_sale_gmv_amt: 564100.61
                    total_views_cnt: 151867772
                    unique_id: spiritamethystt
                    user_id: '6720730872091345925'
                requestId: 91c7d5fd-8091-4d4d-aff0-15f947d24e2e
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Search
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-372747489-run
components:
  schemas: {}
  securitySchemes:
    basic:
      type: http
      scheme: basic
servers:
  - url: ''
    description: 正式环境
security: []
```

</details>
