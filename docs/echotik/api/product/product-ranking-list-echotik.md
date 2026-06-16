# Ranking de Produtos (Product Ranking List - EchoTik)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/369236547e0) · **`GET /api/v3/echotik/product/ranklist`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz
Retorna o **ranking de produtos** de um mercado para uma data e ciclo (diário/semanal/mensal), em duas modalidades: best-sellers (por vendas) ou em destaque/featured (por nº de criadores). Os valores numéricos retornados são o **incremento do período do ranking** (não acumulados de sempre). Biblioteca offline T+1. É a fonte direta de telas tipo "Top produtos do dia/semana/mês" por categoria e região.

**Detalhes do ciclo (do próprio spec):**
- `date` no formato `yyyy-MM-dd`.
- Ranking **semanal** sai toda **segunda-feira**; ranking **mensal** sai no **1º dia do mês**.
- `product_rank_field=1` = ranking de mais vendidos; `=2` = ranking em destaque (featured). *(Nota: a descrição do parâmetro `product_rank_field` lista `1=total_sale_cnt 2=total_ifl_cnt`, ou seja, ordena por vendas ou por nº de criadores — consistente com "best-selling" vs "featured".)*

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `date` | string | Sim | `yyyy-MM-dd` | Data do ranking. Para semanal use a segunda-feira; para mensal, o 1º dia do mês. |
| `region` | string | Sim | código de região, ex.: `US`, `BR` | Mercado do ranking. |
| `product_rank_field` | int | Sim | `1`=mais vendidos (total_sale_cnt), `2`=em destaque/featured (total_ifl_cnt) | Critério/tipo do ranking. |
| `rank_type` | int | Sim | `1`=diário, `2`=semanal, `3`=mensal | Ciclo do ranking. |
| `category_id` | string | Não | — | Filtra por categoria L1. |
| `category_l2_id` | string | Não | — | Filtra por categoria L2. |
| `category_l3_id` | string | Não | — | Filtra por subcategoria L3. |
| `page_num` | int | Sim | 1..100000 | Página (começa em 1). |
| `page_size` | int | Sim | **máx. 10** | Itens por página. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/product/ranklist?date=2026-06-08&region=BR&product_rank_field=1&rank_type=2&category_id=601450&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` (e HTTP 200) significa sucesso; `code != 0` ou HTTP 500 com "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]` (uma linha por produto no ranking)
| Campo | Tipo | O que é |
|---|---|---|
| `category_id` | string | ID da categoria de 1º nível (L1) do produto. |
| `category_l2_id` | string | ID da categoria de 2º nível (L2). |
| `category_l3_id` | string | ID da subcategoria (L3). |
| `max_price` | number | Maior preço entre os SKUs. |
| `min_price` | number | Menor preço entre os SKUs. |
| `product_commission_rate` | number | Taxa de comissão do produto. |
| `product_id` | string | ID único do produto (chave para detalhes, vídeos, lives, criadores, tendência). |
| `product_name` | string | Nome do produto. |
| `region` | string | Código de região do produto. |
| `spu_avg_price` | number | Preço médio dos SKUs (SPU). |
| `total_ifl_cnt` | int | Total de criadores que venderam o produto (no contexto do ranking, base do `product_rank_field=2`). |
| `total_live_cnt` | int | Total de sessões de live associadas. |
| `total_sale_cnt` | int | **Crescimento de vendas durante o período do ranking** (incremento, não acumulado total). |
| `total_sale_gmv_amt` | number | **Crescimento de GMV durante o período do ranking** (incremento). |
| `total_video_cnt` | int | Total de vídeos associados. |

## Notas & gotchas
- **Os valores são o incremento do período do ranking**, não acumulados de sempre — `total_sale_cnt`/`total_sale_gmv_amt` aqui = ganho dentro do ciclo (diário/semanal/mensal).
- A `date` precisa bater com o ciclo: segunda-feira para semanal, 1º dia do mês para mensal.
- Vendas/GMV são **ESTIMATIVAS**; unidade do GMV não documentada.
- `page_size` máx. 10; dado T+1.
- O ranking traz um subconjunto enxuto de campos — para o bloco completo de métricas, hidrate via `batch-fetch-product-details` usando o `product_id`.

## Relevância para o SLEAG
- **Fonte direta do "produtos mais vendidos"** do dashboard de mercado (métrica nº 1), por dia/semana/mês e por categoria/região.
- Descoberta rápida de produtos em ascensão sem precisar montar filtros manuais.
- Combina com detalhes em lote para enriquecer os cards do dashboard.

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
  /api/v3/echotik/product/ranklist:
    get:
      summary: Product Ranking List - EchoTik
      deprecated: false
      description: >-
        1. The values returned in the ranking are the incremental data of the
        current period

        2. The date field is in yyyy-MM-dd format, and the ranking is divided
        into three types: daily/weekly/monthly. Weekly ranking: every Monday,
        monthly ranking: the first day of each month.

        3. product_rank_field=1 represents the best-selling ranking,
        product_rank_field=2 represents the featured ranking
      tags:
        - Product
      parameters:
        - name: date
          in: query
          description: List date, yyyy-MM-dd format
          required: true
          schema:
            type: string
        - name: region
          in: query
          description: Region code, region, e.g. US
          required: true
          schema:
            type: string
        - name: category_id
          in: query
          description: ''
          required: false
          schema:
            type: string
        - name: category_l2_id
          in: query
          description: ''
          required: false
          schema:
            type: string
        - name: category_l3_id
          in: query
          description: ''
          required: false
          schema:
            type: string
        - name: product_rank_field
          in: query
          description: Ranking field1=total_sale_cnt 2=total_ifl_cnt
          required: true
          schema:
            type: integer
        - name: rank_type
          in: query
          description: >-
            The ranking cycle is as follows: 1 = Daily Ranking, 2 = Weekly
            Ranking, 3 = Monthly Ranking.
          required: true
          schema:
            type: integer
        - name: page_num
          in: query
          description: Page numbers start from 1 and go up to a maximum of 100,000.
          required: true
          schema:
            type: integer
        - name: page_size
          in: query
          description: The maximum number of pages is 10.
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: integer
                  message:
                    type: string
                  data:
                    type: array
                    items:
                      type: object
                      properties:
                        category_id:
                          type: string
                        category_l2_id:
                          type: string
                        category_l3_id:
                          type: string
                        max_price:
                          type: number
                          title: SKU highest price
                        min_price:
                          type: number
                          title: SKU lowest price
                        product_commission_rate:
                          type: number
                          title: Commission rate
                        product_id:
                          type: string
                        product_name:
                          type: string
                        region:
                          type: string
                        spu_avg_price:
                          type: number
                          title: Average price per SKU
                        total_ifl_cnt:
                          type: integer
                          title: Total number of sales creators
                        total_live_cnt:
                          type: integer
                          title: Total live stream sessions
                        total_sale_cnt:
                          type: integer
                          title: Sales growth during the ranking period
                        total_sale_gmv_amt:
                          type: number
                          title: Sales GMV increase during the ranking period
                        total_video_cnt:
                          type: integer
                          title: Total video count
                      x-apifox-orders:
                        - category_id
                        - category_l2_id
                        - category_l3_id
                        - max_price
                        - min_price
                        - product_commission_rate
                        - product_id
                        - product_name
                        - region
                        - spu_avg_price
                        - total_ifl_cnt
                        - total_live_cnt
                        - total_sale_cnt
                        - total_sale_gmv_amt
                        - total_video_cnt
                      x-apifox-ignore-properties: []
                  requestId:
                    type: string
                x-apifox-orders:
                  - 01K8T4J1Y6K2HB1J2KD925Q4KC
                required:
                  - code
                  - message
                  - data
                  - requestId
                x-apifox-refs:
                  01K8T4J1Y6K2HB1J2KD925Q4KC:
                    $ref: '#/components/schemas/%E5%95%86%E5%93%81%E6%A6%9C%E5%8D%95'
                x-apifox-ignore-properties:
                  - code
                  - message
                  - data
                  - requestId
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Product
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-369236547-run
components:
  schemas:
    商品榜单:
      type: object
      properties:
        code:
          type: integer
        message:
          type: string
        data:
          type: array
          items:
            type: object
            properties:
              category_id:
                type: string
              category_l2_id:
                type: string
              category_l3_id:
                type: string
              max_price:
                type: number
                title: SKU highest price
              min_price:
                type: number
                title: SKU lowest price
              product_commission_rate:
                type: number
                title: Commission rate
              product_id:
                type: string
              product_name:
                type: string
              region:
                type: string
              spu_avg_price:
                type: number
                title: Average price per SKU
              total_ifl_cnt:
                type: integer
                title: Total number of sales creators
              total_live_cnt:
                type: integer
                title: Total live stream sessions
              total_sale_cnt:
                type: integer
                title: Sales growth during the ranking period
              total_sale_gmv_amt:
                type: number
                title: Sales GMV increase during the ranking period
              total_video_cnt:
                type: integer
                title: Total video count
            x-apifox-orders:
              - category_id
              - category_l2_id
              - category_l3_id
              - max_price
              - min_price
              - product_commission_rate
              - product_id
              - product_name
              - region
              - spu_avg_price
              - total_ifl_cnt
              - total_live_cnt
              - total_sale_cnt
              - total_sale_gmv_amt
              - total_video_cnt
            x-apifox-ignore-properties: []
        requestId:
          type: string
      required:
        - code
        - message
        - data
        - requestId
      x-apifox-orders:
        - code
        - message
        - data
        - requestId
      x-apifox-ignore-properties: []
      x-apifox-folder: ''
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
