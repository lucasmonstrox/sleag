# Criadores que Venderam o Produto (Product Association Sales Creator List - EchoTik)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/369158959e0) · **`GET /api/v3/echotik/product/influencer/list`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz
Lista os **criadores/influenciadores associados a um produto** (`product_id`) — quem promoveu/vendeu aquele item — com métricas resumidas de cada criador e a contribuição estimada deles para as vendas do produto. Biblioteca offline T+1. Não traz o perfil completo do criador (para detalhe do criador há a seção de influenciadores); aqui é a visão "quem moveu este produto". Ordenável por seguidores, likes, vendas/GMV por produto, vídeos, views etc.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `product_id` | string | Sim | — | Produto cujos criadores associados se quer. |
| `product_influencer_sort_field` | int | Não | `1`=total_followers_cnt, `2`=total_digg_cnt, `3`=per_product_ifl_sale_cnt, `4`=per_product_ifl_gmv_amt, `5`=total_post_video_cnt, `6`=total_views_cnt, `7`=total_live_views_cnt | Campo de ordenação. |
| `sort_type` | int | Não | `0`=asc, `1`=desc | Direção da ordenação. |
| `page_num` | int | Sim | 1..100000 | Página (começa em 1). |
| `page_size` | int | Sim | **máx. 10** | Itens por página. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/product/influencer/list?product_id=1729382310407603945&product_influencer_sort_field=4&sort_type=1&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` (e HTTP 200) significa sucesso; `code != 0` ou HTTP 500 com "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]` (uma linha por criador)
| Campo | Tipo | O que é |
|---|---|---|
| `avatar` | string | URL da foto de perfil do criador. Se não for acessível, use o endpoint de download de imagem (expira/requer permissão). |
| `category` | string | Categoria/nicho do criador (não documentado pela EchoTik — provavelmente a categoria principal de conteúdo, ex.: "Beauty"). |
| `nick_name` | string | Nome de exibição do criador. |
| `per_product_ifl_gmv_amt` | int | **GMV estimado** que este criador gerou vendendo **este produto específico**. |
| `per_product_ifl_sale_cnt` | int | **Vendas estimadas** deste criador para **este produto específico**. |
| `product_id` | string | ID do produto (ecoa o parâmetro). |
| `region` | string | Região do criador (código tipo `US`, `ID`). |
| `total_digg_cnt` | int | Total de curtidas (likes) recebidas pelo criador. |
| `total_followers_cnt` | int | Total de seguidores do criador. |
| `total_following_cnt` | int | Total de contas que o criador segue (não documentado pela EchoTik — provavelmente "following count"). |
| `total_live_cnt` | int | Total de lives do criador (não documentado pela EchoTik — provavelmente nº de sessões de live). |
| `total_live_views_cnt` | int | Total de visualizações nas lives do criador (não documentado pela EchoTik — provavelmente views de live; é uma opção de ordenação `7`). |
| `total_post_video_cnt` | int | Total de vídeos publicados pelo criador. |
| `total_views_cnt` | int | Total de views dos vídeos do criador. |
| `user_id` | string | ID único do criador (chave para buscar o detalhe do criador na seção de influenciadores). |

## Notas & gotchas
- `per_product_ifl_sale_cnt` / `per_product_ifl_gmv_amt` são a contribuição **só deste produto** — não confunda com totais do criador.
- Vendas/GMV são **ESTIMATIVAS**; unidade do GMV não documentada (confirmar moeda vs centavos).
- `avatar` pode exigir o endpoint de download de imagem.
- Os campos `category`, `total_following_cnt`, `total_live_cnt`, `total_live_views_cnt` vêm sem descrição no spec — inferidos pelo nome.
- `page_size` máx. 10; dado T+1.

## Relevância para o TIKSPY
- **Descoberta de criadores** que empurram um produto vencedor → quem contatar para afiliação/parceria.
- Concorrência: ver quais influenciadores um concorrente usa por produto.
- Alimenta a página de detalhe do produto (aba "criadores") e cruza com a seção de influenciadores via `user_id`.

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
  /api/v3/echotik/product/influencer/list:
    get:
      summary: Product Association Sales Creator List - EchoTik
      deprecated: false
      description: >-
        Retrieve the list of influencer data associated with the product using
        the product_id. This interface will not return specific details of the
        influencers; for more influencer detail data, it can be obtained in the
        influencer details section.
      tags:
        - Product
      parameters:
        - name: product_id
          in: query
          description: ''
          required: true
          schema:
            type: string
        - name: product_influencer_sort_field
          in: query
          description: >-
            List sorting enumeration 1=total_followers_cnt 2=total_digg_cnt
            3=per_product_ifl_sale_cnt 4=per_product_ifl_gmv_amt
            5=total_post_video_cnt 6=total_views_cnt 7=total_live_views_cnt
          required: false
          schema:
            type: integer
        - name: sort_type
          in: query
          description: Sort order 0=asc 1=desc
          required: false
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
                        avatar:
                          type: string
                          title: >-
                            If you cannot access the link for the influencer's
                            profile picture, please use the image download
                            interface.
                        category:
                          type: string
                        nick_name:
                          type: string
                        per_product_ifl_gmv_amt:
                          type: integer
                          title: >-
                            The creator's estimated GMV (gross merchandise
                            volume) from the sales of this item
                        per_product_ifl_sale_cnt:
                          type: integer
                          title: >-
                            The creator's estimated sales volume for this
                            product
                        product_id:
                          type: string
                        region:
                          type: string
                        total_digg_cnt:
                          type: integer
                          title: Total likes of creators
                        total_followers_cnt:
                          type: integer
                          title: Total number of followers of the creator
                        total_following_cnt:
                          type: integer
                        total_live_cnt:
                          type: integer
                        total_live_views_cnt:
                          type: integer
                        total_post_video_cnt:
                          type: integer
                          title: Total number of videos published
                        total_views_cnt:
                          type: integer
                          title: Total video views
                        user_id:
                          type: string
                      x-apifox-orders:
                        - avatar
                        - category
                        - nick_name
                        - per_product_ifl_gmv_amt
                        - per_product_ifl_sale_cnt
                        - product_id
                        - region
                        - total_digg_cnt
                        - total_followers_cnt
                        - total_following_cnt
                        - total_live_cnt
                        - total_live_views_cnt
                        - total_post_video_cnt
                        - total_views_cnt
                        - user_id
                      x-apifox-ignore-properties: []
                  requestId:
                    type: string
                x-apifox-orders:
                  - 01K8T1CT26AR9N5Z04XED2TABY
                required:
                  - code
                  - message
                  - data
                  - requestId
                x-apifox-refs:
                  01K8T1CT26AR9N5Z04XED2TABY:
                    $ref: >-
                      #/components/schemas/%E5%95%86%E5%93%81%E5%85%B3%E8%81%94%E8%BE%BE%E4%BA%BA%E5%88%97%E8%A1%A8
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-369158959-run
components:
  schemas:
    商品关联达人列表:
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
              avatar:
                type: string
                title: >-
                  If you cannot access the link for the influencer's profile
                  picture, please use the image download interface.
              category:
                type: string
              nick_name:
                type: string
              per_product_ifl_gmv_amt:
                type: integer
                title: >-
                  The creator's estimated GMV (gross merchandise volume) from
                  the sales of this item
              per_product_ifl_sale_cnt:
                type: integer
                title: The creator's estimated sales volume for this product
              product_id:
                type: string
              region:
                type: string
              total_digg_cnt:
                type: integer
                title: Total likes of creators
              total_followers_cnt:
                type: integer
                title: Total number of followers of the creator
              total_following_cnt:
                type: integer
              total_live_cnt:
                type: integer
              total_live_views_cnt:
                type: integer
              total_post_video_cnt:
                type: integer
                title: Total number of videos published
              total_views_cnt:
                type: integer
                title: Total video views
              user_id:
                type: string
            x-apifox-orders:
              - avatar
              - category
              - nick_name
              - per_product_ifl_gmv_amt
              - per_product_ifl_sale_cnt
              - product_id
              - region
              - total_digg_cnt
              - total_followers_cnt
              - total_following_cnt
              - total_live_cnt
              - total_live_views_cnt
              - total_post_video_cnt
              - total_views_cnt
              - user_id
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
