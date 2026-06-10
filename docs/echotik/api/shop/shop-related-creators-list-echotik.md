# Lista de Criadores Relacionados à Loja — EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/369406776e0) · **`GET /api/v3/echotik/seller/influencer/list`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz

Lista os **criadores (influencers) que vendem produtos** de uma loja identificada por `seller_id`, com vendas e GMV gerados por cada um para aquela loja, ordenável por seguidores/vendas/GMV. Este endpoint **não traz o detalhe completo do criador** — para isso, use a seção de detalhes de criador. Aqui o foco é "quem move as vendas desta loja".

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `seller_id` | string | **Sim** | id da loja | Loja-alvo. |
| `seller_influencer_sort_field` | integer | Não | `1` = total_followers_cnt · `2` = total_sale_cnt · `3` = total_sale_gmv_amt | Campo de ordenação. |
| `sort_type` | integer | Não | `0` = ascendente · `1` = descendente | Direção da ordenação. |
| `page_num` | integer | **Sim** | 1 … 100000 | Número da página (começa em 1). |
| `page_size` | integer | **Sim** | máx **10** | Itens por página. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/seller/influencer/list?seller_id=7495539486134995508&seller_influencer_sort_field=3&sort_type=1&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]`
| Campo | Tipo | O que é |
|---|---|---|
| `avatar` | string | URL da foto de perfil do criador. EchoTik recomenda baixar via interface de download. |
| `nick_name` | string | Apelido/nome de exibição do criador. (sem descrição — display name.) |
| `region` | string | Região do criador (ex.: `BR`). (sem descrição.) |
| `seller_id` | string | Id da loja a que este criador está associado (eco do parâmetro). (sem descrição.) |
| `total_digg_cnt` | integer | Total de curtidas (likes) do criador. (sem descrição — "digg" é a curtida no TikTok.) |
| `total_followers_cnt` | integer | Total de seguidores do criador. (sem descrição.) |
| `total_following_cnt` | integer | Total de contas que o criador segue. (sem descrição.) |
| `total_sale_cnt` | integer | Vendas totais (unid.) que o criador gerou para esta loja. |
| `total_sale_gmv_amt` | integer | GMV total que o criador gerou para esta loja (estimado). |
| `unique_id` | string | Handle/@username único do criador no TikTok. (sem descrição — provavelmente o `@unique_id` público.) |
| `user_id` | string | Id de usuário do criador no TikTok. (sem descrição.) |

## Notas & gotchas
- **Strings numéricas**: `seller_id`, `user_id` e `unique_id` como string.
- Métricas de venda/GMV (`total_sale_cnt`, `total_sale_gmv_amt`) são **atribuídas à loja consultada**, não os números globais do criador.
- **GMV estimado**.
- Para perfil completo do criador (séries, todos os produtos vendidos etc.), consultar os endpoints de creator.
- Dado **offline T+1**.

## Relevância para o TIKSPY
- Mostra **quais afiliados/criadores impulsionam um concorrente** — insumo para a área de Lojas/Concorrência e para descobrir criadores a recrutar.
- Ordenar por GMV revela os "top sellers" de afiliados de cada loja, cruzável com a lista de criadores.

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
  /api/v3/echotik/seller/influencer/list:
    get:
      summary: Shop Related Creators List - EchoTik
      deprecated: false
      description: >-
        Retrieve the list of sales creators associated with the store through
        seller_id. This interface will not return specific details of the
        creators. For more detailed creator data, it can be obtained in the
        creator details section.
      tags:
        - Shop
      parameters:
        - name: seller_id
          in: query
          description: Shop ID
          required: true
          schema:
            type: string
        - name: seller_influencer_sort_field
          in: query
          description: >-
            List sorting enumeration.1=total_followers_cnt 2=total_sale_cnt
            3=total_sale_gmv_amt
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
                            To access the profile picture/cover of this
                            influencer, please use the download interface.
                        nick_name:
                          type: string
                        region:
                          type: string
                        seller_id:
                          type: string
                        total_digg_cnt:
                          type: integer
                        total_followers_cnt:
                          type: integer
                        total_following_cnt:
                          type: integer
                        total_sale_cnt:
                          type: integer
                          title: Total sales of influencers
                        total_sale_gmv_amt:
                          type: integer
                          title: Total sales GMV of influencers
                        unique_id:
                          type: string
                        user_id:
                          type: string
                      x-apifox-orders:
                        - avatar
                        - nick_name
                        - region
                        - seller_id
                        - total_digg_cnt
                        - total_followers_cnt
                        - total_following_cnt
                        - total_sale_cnt
                        - total_sale_gmv_amt
                        - unique_id
                        - user_id
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
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Shop
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-369406776-run
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
