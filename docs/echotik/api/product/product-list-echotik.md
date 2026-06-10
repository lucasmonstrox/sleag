# Lista de Produtos (Product List - EchoTik)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/369082708e0) · **`GET /api/v3/echotik/product/list`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz
Endpoint central de **descoberta e filtragem de produtos** do TikTok Shop. Puxa da biblioteca offline da EchoTik (atualização diária T+1), então é ideal para varreduras em larga escala e exploração de catálogo — não para dado "ao vivo". Aceita dezenas de filtros (categoria, faixa de vendas, GMV, preço, comissão, número de criadores/vídeos, rating, frete grátis, gestão fully-managed, loja de marca, cross-border, etc.) e ordenação por várias métricas. Retorna, por produto, um bloco enorme de métricas agregadas e janeladas (1/7/15/30/60/90 dias) de vendas, GMV, vídeos, lives e criadores. É a base de telas de descoberta de produtos vencedores e análise de concorrência.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params

**Obrigatórios**

| Param | Tipo | Valores / Default | O que faz |
|---|---|---|---|
| `region` | string | código de região, ex.: `US`, `BR` | Mercado a consultar. Obrigatório. |
| `page_num` | int | 1..100000 | Página (começa em 1). |
| `page_size` | int | **máx. 10** | Itens por página. |

**Filtros de categoria**

| Param | Tipo | O que faz |
|---|---|---|
| `category_id` | string | Filtra por categoria de 1º nível (L1). |
| `category_l2_id` | string | Filtra por categoria de 2º nível (L2). |
| `category_l3_id` | string | Filtra por subcategoria (L3). |

**Filtros de faixa (min/max)** — todos opcionais; combine min e max para um intervalo:

| Param (min/max) | Tipo | O que faz |
|---|---|---|
| `min_total_sale_cnt` / `max_total_sale_cnt` | int | Faixa de **vendas totais** (acumuladas). |
| `min_total_sale_30d_cnt` / `max_total_sale_30d_cnt` | int | Faixa de vendas nos **últimos 30 dias**. |
| `min_spu_avg_price` / `max_spu_avg_price` | number | Faixa de **preço médio** dos SKUs do produto. |
| `min_product_commission_rate` / `max_product_commission_rate` | number | Faixa de **taxa de comissão** do produto. |
| `min_total_ifl_cnt` / `max_total_ifl_cnt` | int | Faixa de **número de criadores** que venderam o produto. |
| `min_total_video_cnt` / `max_total_video_cnt` | int | Faixa de **número de vídeos** de venda. |
| `min_total_views_cnt` / `max_total_views_cnt` | int | Faixa de **views** dos vídeos de venda. |
| `min_product_rating` / `max_product_rating` | number | Faixa de **nota de avaliação** do produto (0–5). |
| `min_review_count` / `max_review_count` | int | Faixa de **número de reviews**. |
| `min_total_sale_gmv_amt` / `max_total_sale_gmv_amt` | number | Faixa de **GMV total**. |
| `min_total_sale_gmv_30d_amt` / `max_total_sale_gmv_30d_amt` | number | Faixa de **GMV nos últimos 30 dias**. |
| `min_first_crawl_dt` / `max_first_crawl_dt` | int | Faixa da **data da 1ª captura** do produto pela EchoTik, formato `yyyyMMdd` (proxy de "quando o produto apareceu/ficou conhecido"). |

**Filtros booleanos / enum**

| Param | Tipo | Valores | O que faz |
|---|---|---|---|
| `sales_trend_flag` | int | `0`=estável, `1`=subindo, `2`=caindo | Tendência de vendas nos últimos 7 dias. |
| `is_s_shop` | int | `0`=não, `1`=fully-managed | Filtra loja totalmente gerida (modelo "fully managed"). |
| `free_shipping` | int | `0`=não, `1`=sim | Filtra frete grátis. |
| `sales_flag` | int | `1`=e-commerce por vídeo, `2`=e-commerce por live | Principal método de venda. |
| `off_mark` | int | `0`=à venda | Use `off_mark=0` para excluir produtos descontinuados. |
| `from_flag` | int | `1`=loja local, `2`=loja cross-border | Tipo de loja. |
| `is_hot` | int | `0`=não, `1`=sim | Filtra produto best-seller / em destaque. |
| `shop_type` | int | `0`=não, `1`=sim | Filtra loja de marca (brand store). |

**Ordenação**

| Param | Tipo | Valores | O que faz |
|---|---|---|---|
| `product_sort_field` | int | `1`=total_sale_cnt, `2`=total_sale_gmv_amt, `3`=spu_avg_price, `4`=total_sale_7d_cnt, `5`=total_sale_30d_cnt, `6`=total_sale_gmv_7d_amt, `7`=total_sale_gmv_30d_amt | Campo de ordenação. |
| `sort_type` | int | `0`=asc, `1`=desc | Direção da ordenação. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/product/list?region=BR&category_id=601450&min_total_sale_30d_cnt=100&product_sort_field=5&sort_type=1&off_mark=0&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` (e HTTP 200) significa sucesso; `code != 0` ou HTTP 500 com "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]` — identificação, categoria e atributos do produto
| Campo | Tipo | O que é |
|---|---|---|
| `category_id` | string | ID da categoria de 1º nível (L1). |
| `category_l2_id` | string | ID da categoria de 2º nível (L2). |
| `category_l3_id` | string | ID da subcategoria (L3). |
| `cover_url` | string | Capa do produto. Vem como **JSON serializado em string** (`[{"url":...,"index":0}]`). Se a URL não for acessível com sua permissão, use o endpoint de download de imagem. |
| `desc_detail` | string | Descrição do produto, como **JSON serializado em string** (lista de blocos `{"type":"text","text":...}`). |
| `discount` | string | Desconto (não documentado pela EchoTik — provavelmente texto/valor do desconto; vem `null` quando não há). |
| `first_crawl_dt` | int | Data da 1ª captura do produto pela EchoTik, `yyyyMMdd`. Proxy de "idade" do produto na base. |
| `free_shipping` | int | Frete grátis? `1`=sim, `0`=não. |
| `is_s_shop` | int | Loja fully-managed? `1`=sim, `0`=não. |
| `max_price` | number | Maior preço entre os SKUs. |
| `min_price` | number | Menor preço entre os SKUs. |
| `off_mark` | int | Indicador de descontinuação; `<2` representa "não descontinuado" (à venda). |
| `product_commission_rate` | int | Taxa de comissão do produto (não documentada a unidade pela EchoTik — provavelmente percentual; no exemplo vem `0`). |
| `product_id` | string | ID único do produto (chave para detalhes, vídeos, lives, reviews, criadores, tendência). |
| `product_name` | string | Nome do produto. |
| `product_rating` | int | Nota média de avaliação (não documentada a escala pela EchoTik — provavelmente 0–5; no exemplo `0` = sem avaliações). |
| `region` | string | Código de região do produto (ex.: `US`). |
| `review_count` | int | Número de reviews. |
| `sale_props` | string | Propriedades de venda (cor, tamanho…) como **JSON serializado em string** (`[{"prop_name":"Color",...}]`). |
| `sales_flag` | int | Método de venda: `1`=vídeo, `2`=live. (No exemplo vem `0` = sem vendas atribuídas a um canal específico; não documentado pela EchoTik — provavelmente `0`=sem vendas/indefinido.) |
| `sales_trend_flag` | int | Tendência de vendas nos últimos 7 dias: `0`=estável, `1`=subindo, `2`=caindo. |
| `seller_id` | string | ID da loja/vendedor (Shop Id). |
| `skus` | string | Lista de SKUs com preço/atributos como **JSON serializado em string** (objeto de preço por SKU). |
| `spu_avg_price` | number | Preço médio dos SKUs do produto (SPU). |
| `specification` | string | Especificações do produto como **JSON serializado em string** (no exemplo `'[]'`). |
| `from_flag` | int | Tipo de loja: `1`=loja local, `2`=cross-border. |
| `is_hot` | int | Best-seller/em destaque? `1`=sim, `0`=não. |
| `shop_type` | int | Loja de marca? `1`=sim, `0`=não. |
| `shipping_price` | string | Preço de frete (vem como string; `'0'` no exemplo). |

> **Observação:** o campo `last_crawl_dt` (data da última captura, `yyyyMMdd`) aparece no `example` do spec, mas **não está declarado** na lista de propriedades/`x-apifox-orders`. Pode vir no payload real mesmo sem estar formalizado no schema.

### Campos de `data[]` — métricas janeladas (padrão repetido)
A EchoTik repete os mesmos grupos de métricas em **janelas temporais**: sufixo `_1d_`, `_7d_`, `_15d_`, `_30d_`, `_60d_`, `_90d_` = **incremento** acumulado naquele período (últimos N dias), e a versão **sem janela** (ex.: `total_sale_cnt`) = **total acumulado** desde sempre. Todas são `int` (contagens) ou GMV em `int`. Importante: as métricas com janela representam o *incremento do período*, não um snapshot.

**Criadores (influencers) que venderam o produto**

| Campo | Tipo | O que é |
|---|---|---|
| `total_ifl_cnt` | int | Total de criadores que venderam o produto (acumulado). |
| `total_ifl_live_1d_cnt` … `total_ifl_live_90d_cnt` | int | Aumento no nº de criadores de **e-commerce por live** nos últimos 1/7/15/30/60/90 dias. |
| `total_ifl_video_1d_cnt` … `total_ifl_video_90d_cnt` | int | Aumento no nº de criadores de **e-commerce por vídeo** nos últimos 1/7/15/30/60/90 dias. |

**Lives associadas ao produto**

| Campo | Tipo | O que é |
|---|---|---|
| `total_live_cnt` | int | Total de sessões de live (acumulado). |
| `total_live_1d_cnt` … `total_live_90d_cnt` | int | Sessões de live nos últimos 1/7/15/30/60/90 dias. |
| `total_live_sale_cnt` | int | Total de vendas em live (acumulado). |
| `total_live_sale_1d_cnt` … `total_live_sale_90d_cnt` | int | Vendas em live nos últimos 1/7/15/30/60/90 dias. |
| `total_live_sale_gmv_amt` | int | GMV total de vendas em live (acumulado). |
| `total_live_sale_gmv_1d_amt` … `total_live_sale_gmv_90d_amt` | int | GMV de live nos últimos 1/7/15/30/60/90 dias. |

**Vendas e GMV gerais (todos os canais)**

| Campo | Tipo | O que é |
|---|---|---|
| `total_sale_cnt` | int | **Vendas totais** acumuladas do produto. |
| `total_sale_1d_cnt` … `total_sale_90d_cnt` | int | Incremento de vendas nos últimos 1/7/15/30/60/90 dias. |
| `total_sale_gmv_amt` | int | **GMV total** acumulado. |
| `total_sale_gmv_1d_amt` … `total_sale_gmv_90d_amt` | int | Incremento de GMV nos últimos 1/7/15/30/60/90 dias. |

**Vídeos associados ao produto**

| Campo | Tipo | O que é |
|---|---|---|
| `total_video_cnt` | int | Total de vídeos (acumulado). |
| `total_video_1d_cnt` … `total_video_90d_cnt` | int | Vídeos adicionados nos últimos 1/7/15/30/60/90 dias. |
| `total_video_sale_cnt` | int | Total de vendas via vídeo (acumulado). |
| `total_video_sale_1d_cnt` … `total_video_sale_90d_cnt` | int | Incremento de vendas via vídeo nos últimos 1/7/15/30/60/90 dias. |
| `total_video_sale_gmv_amt` | int | GMV total de vendas via vídeo (acumulado). *(O `title` do spec diz "Total video sales", mas pelo nome é o GMV — provavelmente erro de rótulo da EchoTik.)* |
| `total_video_sale_gmv_1d_amt` … `total_video_sale_gmv_90d_amt` | int | Incremento de GMV via vídeo nos últimos 1/7/15/30/60/90 dias. |

**Views de vídeo**

| Campo | Tipo | O que é |
|---|---|---|
| `total_views_cnt` | int | Total de views dos vídeos (acumulado). |
| `total_views_1d_cnt` … `total_views_90d_cnt` | int | Incremento de views nos últimos 1/7/15/30/60/90 dias. |

### Exemplo de resposta
Exemplo real do opendoc (1 produto; campos de métrica zerados omitidos por brevidade — todos os `total_*` janelados vêm no payload mesmo quando `0`):
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "category_id": "605248",
      "category_l2_id": "905224",
      "category_l3_id": "906248",
      "cover_url": "[{\"url\":\"https://echosell-images.tos-ap-southeast-1.volces.com/product-cover/352/1729383769606034185_0.jpeg\",\"index\":0}]",
      "desc_detail": "[{\"type\":\"text\",\"text\":\"100% Cotton\",\"sub\":[{\"t\":\"100% Cotton\"}]}, ...]",
      "discount": null,
      "first_crawl_dt": 20230618,
      "free_shipping": 0,
      "from_flag": 1,
      "is_hot": 0,
      "is_s_shop": 0,
      "last_crawl_dt": 20260414,
      "max_price": 23.3,
      "min_price": 23.3,
      "off_mark": 0,
      "product_commission_rate": 0,
      "product_id": "1729383769606034185",
      "product_name": "Black camouflage flag embroidered baseball cap,BG104BCMO-BLACKCAMO,1-Pack",
      "product_rating": 0,
      "region": "US",
      "review_count": 0,
      "sale_props": "[{\"prop_name\":\"Color\",\"has_image\":\"false\",\"prop_id\":\"100000\",\"sale_prop_values\":[{\"image\":\"\",\"property_value_name\":\"BLACKCAMO\",\"property_value_id\":\"7171384541801105198\"}]}, ...]",
      "sales_flag": 0,
      "sales_trend_flag": 0,
      "seller_id": "7494833496812981001",
      "shipping_price": "0",
      "shop_type": 0,
      "skus": "[{\"sku_id\":\"1729383769606099721\",\"sale_prop_value_ids\":\"7171384541801105198_7171384541801137966\",\"real_price\":{\"currency_name\":\"USD\",\"currency_symbol\":\"$\",\"sale_price_decimal\":\"23.3\",\"sale_price_format\":\"23.30\",\"currency\":\"USD\"}}]",
      "specification": "[]",
      "spu_avg_price": 23.3,
      "total_sale_cnt": 1,
      "total_sale_gmv_amt": 19.9,
      "total_ifl_cnt": 0,
      "total_live_cnt": 0,
      "total_video_cnt": 0,
      "total_views_cnt": 0
    }
  ],
  "requestId": "5c2f367b-72d7-4a86-9d9a-332b20b99c6d"
}
```

## Notas & gotchas
- `page_size` é **no máximo 10** — paginação custosa para grandes varreduras; planeje a cota.
- Vários campos são **JSON serializado dentro de uma string**: `cover_url`, `desc_detail`, `sale_props`, `skus`, `specification`. Faça `JSON.parse` no valor.
- Métricas com janela (`_Nd_`) são **incremento do período**, não estado pontual; a versão sem janela é o acumulado total.
- **Vendas e GMV são ESTIMATIVAS** da EchoTik (TikTok não expõe números oficiais por produto). A unidade do GMV não é documentada — confirme empiricamente se vem em unidade da moeda ou em centavos.
- `cover_url` pode exigir o endpoint de download de imagem se a URL direta não for acessível (expira / requer permissão).
- `last_crawl_dt` aparece no exemplo mas não no schema declarado — trate como opcional.
- Dado T+1: nunca é "ao vivo"; pode estar ~1 dia atrasado.

## Relevância para o TIKSPY
- **Motor de descoberta de produtos** (página de produtos / "produtos mais vendidos" do dashboard — métrica nº 1 do produto): filtrar por categoria + faixa de vendas/GMV + tendência.
- **Análise de concorrência e de mercado**: ver quantos criadores/vídeos/lives empurram cada produto e a quebra vídeo vs live.
- Fonte de catálogo para enriquecer outras telas via `product_id` (detalhes, vídeos, lives, criadores, tendência).

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
  /api/v3/echotik/product/list:
    get:
      summary: Product List - EchoTik
      deprecated: false
      description: >-
        Provides product data from EchoTik's offline (T+1 update) library,
        suitable for scenarios requiring large-scale acquisition of product
        data.
      tags:
        - Product
      parameters:
        - name: category_id
          in: query
          description: Product primary category ID
          required: false
          schema:
            type: string
        - name: category_l2_id
          in: query
          description: Product secondary category ID
          required: false
          schema:
            type: string
        - name: category_l3_id
          in: query
          description: Product subcategory ID
          required: false
          schema:
            type: string
        - name: sales_trend_flag
          in: query
          description: Sales trend in the past 7 days, 0=stable 1=up 2=down
          required: false
          schema:
            type: integer
        - name: min_total_sale_cnt
          in: query
          description: Total sales range filter
          required: false
          schema:
            type: integer
        - name: max_total_sale_cnt
          in: query
          description: Total sales range filter
          required: false
          schema:
            type: integer
        - name: min_total_sale_30d_cnt
          in: query
          description: Sales range filter for the last 30 days
          required: false
          schema:
            type: integer
        - name: max_total_sale_30d_cnt
          in: query
          description: Sales range filter for the last 30 days
          required: false
          schema:
            type: integer
        - name: min_spu_avg_price
          in: query
          description: Product SKU average price range filter
          required: false
          schema:
            type: number
        - name: max_spu_avg_price
          in: query
          description: Product SKU average price range filter
          required: false
          schema:
            type: number
        - name: min_product_commission_rate
          in: query
          description: Product commission rate range filtering
          required: false
          schema:
            type: number
        - name: max_product_commission_rate
          in: query
          description: Product commission rate range filtering
          required: false
          schema:
            type: number
        - name: min_total_ifl_cnt
          in: query
          description: Filter by number of sales creators
          required: false
          schema:
            type: integer
        - name: max_total_ifl_cnt
          in: query
          description: Filter by number of sales creators
          required: false
          schema:
            type: integer
        - name: min_total_video_cnt
          in: query
          description: Sales video number range filter
          required: false
          schema:
            type: integer
        - name: max_total_video_cnt
          in: query
          description: Sales video number range filter
          required: false
          schema:
            type: integer
        - name: min_total_views_cnt
          in: query
          description: Filtering by the number of views for sales videos
          required: false
          schema:
            type: integer
        - name: max_total_views_cnt
          in: query
          description: Filtering by the number of views for sales videos
          required: false
          schema:
            type: integer
        - name: min_product_rating
          in: query
          description: Product reviews are filtered by range
          required: false
          schema:
            type: number
        - name: max_product_rating
          in: query
          description: Product reviews are filtered by range
          required: false
          schema:
            type: number
        - name: min_review_count
          in: query
          description: Product review count range filtering
          required: false
          schema:
            type: integer
        - name: max_review_count
          in: query
          description: Product review count range filtering
          required: false
          schema:
            type: integer
        - name: is_s_shop
          in: query
          description: Is it fully managed  0 = No, 1 = Fully managed
          required: false
          schema:
            type: integer
        - name: free_shipping
          in: query
          description: Free shipping  0 = No 1 = Yes
          required: false
          schema:
            type: integer
        - name: min_total_sale_gmv_amt
          in: query
          description: Total GMV range filtering
          required: false
          schema:
            type: number
        - name: max_total_sale_gmv_amt
          in: query
          description: Total GMV range filtering
          required: false
          schema:
            type: number
        - name: min_total_sale_gmv_30d_amt
          in: query
          description: GMV range filtering in the last 30 days
          required: false
          schema:
            type: number
        - name: max_total_sale_gmv_30d_amt
          in: query
          description: GMV range filtering in the last 30 days
          required: false
          schema:
            type: number
        - name: min_first_crawl_dt
          in: query
          description: Time range for the first capture of the product, format yyyyMMdd
          required: false
          schema:
            type: integer
        - name: max_first_crawl_dt
          in: query
          description: Time range for the first capture of the product, format yyyyMMdd
          required: false
          schema:
            type: integer
        - name: sales_flag
          in: query
          description: >-
            Main sales methods: 1. Video e-commerce; 2. Live streaming
            e-commerce
          required: false
          schema:
            type: integer
        - name: product_sort_field
          in: query
          description: >-
            List sorting enumeration 1=total_sale_cnt 2=total_sale_gmv_amt
            3=spu_avg_price 4=total_sale_7d_cnt 5=total_sale_30d_cnt
            6=total_sale_gmv_7d_amt 7=total_sale_gmv_30d_amt
          required: false
          schema:
            type: integer
        - name: sort_type
          in: query
          description: Sort order 0=asc 1=desc
          required: false
          schema:
            type: integer
        - name: off_mark
          in: query
          description: >-
            off_mark=0 indicates products on sale, which can be used to filter
            out discontinued items.
          required: false
          schema:
            type: integer
        - name: from_flag
          in: query
          description: Store Type, Local Store = 1, Cross-border Store = 2
          required: false
          schema:
            type: integer
        - name: is_hot
          in: query
          description: Whether it is a best-selling product, 0=No, 1=Yes
          required: false
          schema:
            type: integer
        - name: shop_type
          in: query
          description: Is it a brand store, 0=No, 1=Yes
          required: false
          schema:
            type: integer
        - name: region
          in: query
          description: Region code, region, such as US
          required: true
          schema:
            type: string
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
                          title: First-level category ID
                        category_l2_id:
                          type: string
                          title: Secondary category ID
                        category_l3_id:
                          type: string
                          title: Third-level category ID
                        cover_url:
                          type: string
                          title: >-
                            If you do not have permission to access the cover
                            image URL, please use the image download interface.
                        desc_detail:
                          type: string
                          title: Product Description
                        discount:
                          type: string
                        first_crawl_dt:
                          type: integer
                          title: First crawl time
                        free_shipping:
                          type: integer
                          title: Free shipping? 1 = Yes 0 = No
                        is_s_shop:
                          type: integer
                          title: Is the store fully managed? 1 = Yes 0 = No
                        max_price:
                          type: number
                          title: Highest SKU price
                        min_price:
                          type: number
                          title: Lowest SKU price
                        off_mark:
                          type: integer
                          title: Offline indicator, <2 represents not offline
                        product_commission_rate:
                          type: integer
                          title: Product commission
                        product_id:
                          type: string
                        product_name:
                          type: string
                        product_rating:
                          type: integer
                        region:
                          type: string
                        review_count:
                          type: integer
                        sale_props:
                          type: string
                        sales_flag:
                          type: integer
                          title: Sales Method 1 = Video 2 = Live Streaming
                        sales_trend_flag:
                          type: integer
                          title: >-
                            Sales trend over the past 7 days: 0 = stable, 1 =
                            rising, 2 = falling.
                        seller_id:
                          type: string
                          title: Shop Id
                        skus:
                          type: string
                        spu_avg_price:
                          type: number
                          title: Average price of product SKU
                        total_ifl_cnt:
                          type: integer
                          title: Total number of sales creators
                        total_ifl_live_15d_cnt:
                          type: integer
                          title: >-
                            The number of live-streaming e-commerce influencers
                            has increased in the past 15 days.
                        total_ifl_live_1d_cnt:
                          type: integer
                          title: >-
                            The number of live-streaming e-commerce influencers
                            has increased in the past 1 days.
                        total_ifl_live_30d_cnt:
                          type: integer
                          title: >-
                            The number of live-streaming e-commerce influencers
                            has increased in the past 30 days.
                        total_ifl_live_60d_cnt:
                          type: integer
                          title: >-
                            The number of live-streaming e-commerce influencers
                            has increased in the past 60 days.
                        total_ifl_live_7d_cnt:
                          type: integer
                          title: >-
                            The number of live-streaming e-commerce influencers
                            has increased in the past 7 days.
                        total_ifl_live_90d_cnt:
                          type: integer
                          title: >-
                            The number of live-streaming e-commerce influencers
                            has increased in the past 90 days.
                        total_ifl_video_15d_cnt:
                          type: integer
                          title: >-
                            Video e-commerce influencer growth in the last 15
                            days
                        total_ifl_video_1d_cnt:
                          type: integer
                          title: >-
                            Video e-commerce influencer growth in the last 1
                            days
                        total_ifl_video_30d_cnt:
                          type: integer
                          title: >-
                            Video e-commerce influencer growth in the last 30
                            days
                        total_ifl_video_60d_cnt:
                          type: integer
                          title: >-
                            Video e-commerce influencer growth in the last 60
                            days
                        total_ifl_video_7d_cnt:
                          type: integer
                          title: >-
                            Video e-commerce influencer growth in the last 7
                            days
                        total_ifl_video_90d_cnt:
                          type: integer
                          title: >-
                            Video e-commerce influencer growth in the last 90
                            days
                        total_live_15d_cnt:
                          type: integer
                          title: Live broadcast sessions in the last 15 days
                        total_live_1d_cnt:
                          type: integer
                          title: Live broadcast sessions in the last 1 days
                        total_live_30d_cnt:
                          type: integer
                          title: Live broadcast sessions in the last 30 days
                        total_live_60d_cnt:
                          type: integer
                          title: Live broadcast sessions in the last 60 days
                        total_live_7d_cnt:
                          type: integer
                          title: Live broadcast sessions in the last 7 days
                        total_live_90d_cnt:
                          type: integer
                          title: Live broadcast sessions in the last 90 days
                        total_live_cnt:
                          type: integer
                          title: Total number of live broadcasts
                        total_live_sale_15d_cnt:
                          type: integer
                          title: Sales from live streams in the past 15 days
                        total_live_sale_1d_cnt:
                          type: integer
                          title: Sales from live streams in the past 1 days
                        total_live_sale_30d_cnt:
                          type: integer
                          title: Sales from live streams in the past 30 days
                        total_live_sale_60d_cnt:
                          type: integer
                          title: Sales from live streams in the past 60 days
                        total_live_sale_7d_cnt:
                          type: integer
                          title: Sales from live streams in the past 7 days
                        total_live_sale_90d_cnt:
                          type: integer
                          title: Sales from live streams in the past 90 days
                        total_live_sale_cnt:
                          type: integer
                          title: Total live streaming sales
                        total_live_sale_gmv_15d_amt:
                          type: integer
                          title: Livestream GMV in the last 15 days
                        total_live_sale_gmv_1d_amt:
                          type: integer
                          title: Livestream GMV in the last 1 days
                        total_live_sale_gmv_30d_amt:
                          type: integer
                          title: Livestream GMV in the last 30 days
                        total_live_sale_gmv_60d_amt:
                          type: integer
                          title: Livestream GMV in the last 60 days
                        total_live_sale_gmv_7d_amt:
                          type: integer
                          title: Livestream GMV in the last 7 days
                        total_live_sale_gmv_90d_amt:
                          type: integer
                          title: Livestream GMV in the last 90 days
                        total_live_sale_gmv_amt:
                          type: integer
                          title: Total live streaming GMV
                        total_sale_15d_cnt:
                          type: integer
                          title: Sales increase in the last 15 days
                        total_sale_1d_cnt:
                          type: integer
                          title: Sales increase in the last 1 days
                        total_sale_30d_cnt:
                          type: integer
                          title: Sales increase in the last 30 days
                        total_sale_60d_cnt:
                          type: integer
                          title: Sales increase in the last 60 days
                        total_sale_7d_cnt:
                          type: integer
                          title: Sales increase in the last 7 days
                        total_sale_90d_cnt:
                          type: integer
                          title: Sales increase in the last 90 days
                        total_sale_cnt:
                          type: integer
                          title: Total sales
                        total_sale_gmv_15d_amt:
                          type: integer
                          title: GMV increase in the last 15 days
                        total_sale_gmv_1d_amt:
                          type: integer
                          title: GMV increase in the last 1 days
                        total_sale_gmv_30d_amt:
                          type: integer
                          title: GMV increase in the last 30 days
                        total_sale_gmv_60d_amt:
                          type: integer
                          title: GMV increase in the last 60 days
                        total_sale_gmv_7d_amt:
                          type: integer
                          title: GMV increase in the last 7 days
                        total_sale_gmv_90d_amt:
                          type: integer
                          title: GMV increase in the last 90 days
                        total_sale_gmv_amt:
                          type: integer
                          title: Total Sales GMV
                        total_video_15d_cnt:
                          type: integer
                          title: Videos added in the recent 15 days
                        total_video_1d_cnt:
                          type: integer
                          title: Videos added in the recent 1 days
                        total_video_30d_cnt:
                          type: integer
                          title: Videos added in the recent 30 days
                        total_video_60d_cnt:
                          type: integer
                          title: Videos added in the recent 60 days
                        total_video_7d_cnt:
                          type: integer
                          title: Videos added in the recent 7 days
                        total_video_90d_cnt:
                          type: integer
                          title: Videos added in the recent 90 days
                        total_video_cnt:
                          type: integer
                          title: Total number of videos
                        total_video_sale_15d_cnt:
                          type: integer
                          title: Increase in video sales over the recent 15 days
                        total_video_sale_1d_cnt:
                          type: integer
                          title: Increase in video sales over the recent 1 days
                        total_video_sale_30d_cnt:
                          type: integer
                          title: Increase in video sales over the recent 30 days
                        total_video_sale_60d_cnt:
                          type: integer
                          title: Increase in video sales over the recent 60 days
                        total_video_sale_7d_cnt:
                          type: integer
                          title: Increase in video sales over the recent 7 days
                        total_video_sale_90d_cnt:
                          type: integer
                          title: Increase in video sales over the recent 90 days
                        total_video_sale_cnt:
                          type: integer
                          title: Total video sales
                        total_video_sale_gmv_15d_amt:
                          type: integer
                          title: GMV increment of video sales in the recent 15 days
                        total_video_sale_gmv_1d_amt:
                          type: integer
                          title: GMV increment of video sales in the recent 1 days
                        total_video_sale_gmv_30d_amt:
                          type: integer
                          title: GMV increment of video sales in the recent 30 days
                        total_video_sale_gmv_60d_amt:
                          type: integer
                          title: GMV increment of video sales in the recent 60 days
                        total_video_sale_gmv_7d_amt:
                          type: integer
                          title: GMV increment of video sales in the recent 7 days
                        total_video_sale_gmv_90d_amt:
                          type: integer
                          title: GMV increment of video sales in the recent 90 days
                        total_video_sale_gmv_amt:
                          type: integer
                          title: Total video sales
                        total_views_15d_cnt:
                          type: integer
                          title: Increment in video views over the last 15 days
                        total_views_1d_cnt:
                          type: integer
                          title: Increment in video views over the last 1 days
                        total_views_30d_cnt:
                          type: integer
                          title: Increment in video views over the last 30 days
                        total_views_60d_cnt:
                          type: integer
                          title: Increment in video views over the last 60 days
                        total_views_7d_cnt:
                          type: integer
                          title: Increment in video views over the last 7 days
                        total_views_90d_cnt:
                          type: integer
                          title: Increment in video views over the last 90 days
                        total_views_cnt:
                          type: integer
                          title: Total video views
                        specification:
                          type: string
                        from_flag:
                          type: integer
                        is_hot:
                          type: integer
                        shop_type:
                          type: integer
                        shipping_price:
                          type: string
                      x-apifox-orders:
                        - category_id
                        - category_l2_id
                        - category_l3_id
                        - cover_url
                        - desc_detail
                        - discount
                        - first_crawl_dt
                        - free_shipping
                        - is_s_shop
                        - max_price
                        - min_price
                        - off_mark
                        - product_commission_rate
                        - product_id
                        - product_name
                        - product_rating
                        - region
                        - review_count
                        - sale_props
                        - sales_flag
                        - sales_trend_flag
                        - seller_id
                        - skus
                        - spu_avg_price
                        - total_ifl_cnt
                        - total_ifl_live_15d_cnt
                        - total_ifl_live_1d_cnt
                        - total_ifl_live_30d_cnt
                        - total_ifl_live_60d_cnt
                        - total_ifl_live_7d_cnt
                        - total_ifl_live_90d_cnt
                        - total_ifl_video_15d_cnt
                        - total_ifl_video_1d_cnt
                        - total_ifl_video_30d_cnt
                        - total_ifl_video_60d_cnt
                        - total_ifl_video_7d_cnt
                        - total_ifl_video_90d_cnt
                        - total_live_15d_cnt
                        - total_live_1d_cnt
                        - total_live_30d_cnt
                        - total_live_60d_cnt
                        - total_live_7d_cnt
                        - total_live_90d_cnt
                        - total_live_cnt
                        - total_live_sale_15d_cnt
                        - total_live_sale_1d_cnt
                        - total_live_sale_30d_cnt
                        - total_live_sale_60d_cnt
                        - total_live_sale_7d_cnt
                        - total_live_sale_90d_cnt
                        - total_live_sale_cnt
                        - total_live_sale_gmv_15d_amt
                        - total_live_sale_gmv_1d_amt
                        - total_live_sale_gmv_30d_amt
                        - total_live_sale_gmv_60d_amt
                        - total_live_sale_gmv_7d_amt
                        - total_live_sale_gmv_90d_amt
                        - total_live_sale_gmv_amt
                        - total_sale_15d_cnt
                        - total_sale_1d_cnt
                        - total_sale_30d_cnt
                        - total_sale_60d_cnt
                        - total_sale_7d_cnt
                        - total_sale_90d_cnt
                        - total_sale_cnt
                        - total_sale_gmv_15d_amt
                        - total_sale_gmv_1d_amt
                        - total_sale_gmv_30d_amt
                        - total_sale_gmv_60d_amt
                        - total_sale_gmv_7d_amt
                        - total_sale_gmv_90d_amt
                        - total_sale_gmv_amt
                        - total_video_15d_cnt
                        - total_video_1d_cnt
                        - total_video_30d_cnt
                        - total_video_60d_cnt
                        - total_video_7d_cnt
                        - total_video_90d_cnt
                        - total_video_cnt
                        - total_video_sale_15d_cnt
                        - total_video_sale_1d_cnt
                        - total_video_sale_30d_cnt
                        - total_video_sale_60d_cnt
                        - total_video_sale_7d_cnt
                        - total_video_sale_90d_cnt
                        - total_video_sale_cnt
                        - total_video_sale_gmv_15d_amt
                        - total_video_sale_gmv_1d_amt
                        - total_video_sale_gmv_30d_amt
                        - total_video_sale_gmv_60d_amt
                        - total_video_sale_gmv_7d_amt
                        - total_video_sale_gmv_90d_amt
                        - total_video_sale_gmv_amt
                        - total_views_15d_cnt
                        - total_views_1d_cnt
                        - total_views_30d_cnt
                        - total_views_60d_cnt
                        - total_views_7d_cnt
                        - total_views_90d_cnt
                        - total_views_cnt
                        - specification
                        - from_flag
                        - is_hot
                        - shop_type
                        - shipping_price
                  requestId:
                    type: string
                x-apifox-orders:
                  - code
                  - message
                  - data
                  - requestId
                x-apifox-refs: {}
                required:
                  - code
                  - message
                  - data
                  - requestId
              example:
                code: 0
                message: success
                data:
                  - category_id: '605248'
                    category_l2_id: '905224'
                    category_l3_id: '906248'
                    cover_url: >-
                      [{
                      "url":"https://echosell-images.tos-ap-southeast-1.volces.com/product-cover/352/1729383769606034185_0.jpeg","index":0}]
                    desc_detail: >-
                      [{"type":"text","text":"100% Cotton","sub":[{"t":"100%
                      Cotton"}]},{"type":"text","text":"Snap
                      closure","sub":[{"t":"Snap
                      closure"}]},{"type":"text","text":"Machine
                      Wash","sub":[{"t":"Machine
                      Wash"}]},{"type":"text","text":"stitching on
                      visor","sub":[{"t":"stitching on
                      visor"}]},{"type":"text","text":"Stretch construction
                      provides a comfortable fit","sub":[{"t":"Stretch
                      construction provides a comfortable fit"}]}]
                    discount: null
                    first_crawl_dt: 20230618
                    free_shipping: 0
                    from_flag: 1
                    is_hot: 0
                    is_s_shop: 0
                    last_crawl_dt: 20260414
                    max_price: 23.3
                    min_price: 23.3
                    off_mark: 0
                    product_commission_rate: 0
                    product_id: '1729383769606034185'
                    product_name: >-
                      Black camouflage flag embroidered baseball
                      cap,BG104BCMO-BLACKCAMO,1-Pack
                    product_rating: 0
                    region: US
                    review_count: 0
                    sale_props: >-
                      [{"prop_name":"Color","has_image":"false","prop_id":"100000","sale_prop_values":[{"image":"","property_value_name":"BLACKCAMO","property_value_id":"7171384541801105198"}]},{"prop_name":"Size","has_image":"false","prop_id":"7171384541801072430","sale_prop_values":[{"image":"","property_value_name":"onesize","property_value_id":"7171384541801137966"}]}]
                    sales_flag: 0
                    sales_trend_flag: 0
                    seller_id: '7494833496812981001'
                    shipping_price: '0'
                    shop_type: 0
                    skus: >-
                      [{"sku_id":"1729383769606099721","sale_prop_value_ids":"7171384541801105198_7171384541801137966","real_price":{"sku_id":"1729383769606099721","symbol_position":1,"show_currency_space":false,"currency_show_mode":1,"currency_name":"USD","currency_symbol":"$","sale_price_decimal":"23.3","sale_price_format":"23.30","single_product_price_format":"23.30","single_product_price_decimal":"23.3","sale_price_integer_part_format":"23","sale_price_decimal_part_format":"30","decimal_point_symbol":".","promotion_deduction_details":{"seller_subtotal_deduction":"3.40","seller_subtotal_deduction_decimal":"3.4"},"price_str":"23.30","price_val":"23.30","currency":"USD"}}]
                    specification: '[]'
                    spu_avg_price: 23.3
                    total_ifl_cnt: 0
                    total_ifl_live_15d_cnt: 0
                    total_ifl_live_1d_cnt: 0
                    total_ifl_live_30d_cnt: 0
                    total_ifl_live_60d_cnt: 0
                    total_ifl_live_7d_cnt: 0
                    total_ifl_live_90d_cnt: 0
                    total_ifl_video_15d_cnt: 0
                    total_ifl_video_1d_cnt: 0
                    total_ifl_video_30d_cnt: 0
                    total_ifl_video_60d_cnt: 0
                    total_ifl_video_7d_cnt: 0
                    total_ifl_video_90d_cnt: 0
                    total_live_15d_cnt: 0
                    total_live_1d_cnt: 0
                    total_live_30d_cnt: 0
                    total_live_60d_cnt: 0
                    total_live_7d_cnt: 0
                    total_live_90d_cnt: 0
                    total_live_cnt: 0
                    total_live_sale_15d_cnt: 0
                    total_live_sale_1d_cnt: 0
                    total_live_sale_30d_cnt: 0
                    total_live_sale_60d_cnt: 0
                    total_live_sale_7d_cnt: 0
                    total_live_sale_90d_cnt: 0
                    total_live_sale_cnt: 0
                    total_live_sale_gmv_15d_amt: 0
                    total_live_sale_gmv_1d_amt: 0
                    total_live_sale_gmv_30d_amt: 0
                    total_live_sale_gmv_60d_amt: 0
                    total_live_sale_gmv_7d_amt: 0
                    total_live_sale_gmv_90d_amt: 0
                    total_live_sale_gmv_amt: 0
                    total_sale_15d_cnt: 0
                    total_sale_1d_cnt: 0
                    total_sale_30d_cnt: 0
                    total_sale_60d_cnt: 0
                    total_sale_7d_cnt: 0
                    total_sale_90d_cnt: 0
                    total_sale_cnt: 1
                    total_sale_gmv_15d_amt: 0
                    total_sale_gmv_1d_amt: 0
                    total_sale_gmv_30d_amt: 0
                    total_sale_gmv_60d_amt: 0
                    total_sale_gmv_7d_amt: 0
                    total_sale_gmv_90d_amt: 0
                    total_sale_gmv_amt: 19.9
                    total_video_15d_cnt: 0
                    total_video_1d_cnt: 0
                    total_video_30d_cnt: 0
                    total_video_60d_cnt: 0
                    total_video_7d_cnt: 0
                    total_video_90d_cnt: 0
                    total_video_cnt: 0
                    total_video_sale_15d_cnt: 0
                    total_video_sale_1d_cnt: 0
                    total_video_sale_30d_cnt: 0
                    total_video_sale_60d_cnt: 0
                    total_video_sale_7d_cnt: 0
                    total_video_sale_90d_cnt: 0
                    total_video_sale_cnt: 0
                    total_video_sale_gmv_15d_amt: 0
                    total_video_sale_gmv_1d_amt: 0
                    total_video_sale_gmv_30d_amt: 0
                    total_video_sale_gmv_60d_amt: 0
                    total_video_sale_gmv_7d_amt: 0
                    total_video_sale_gmv_90d_amt: 0
                    total_video_sale_gmv_amt: 0
                    total_views_15d_cnt: 0
                    total_views_1d_cnt: 0
                    total_views_30d_cnt: 0
                    total_views_60d_cnt: 0
                    total_views_7d_cnt: 0
                    total_views_90d_cnt: 0
                    total_views_cnt: 0
                requestId: 5c2f367b-72d7-4a86-9d9a-332b20b99c6d
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Product
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-369082708-run
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
