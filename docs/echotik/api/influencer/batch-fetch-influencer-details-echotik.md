# Batch fetch influencer details - EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/368752029e0) · **`GET /api/v3/echotik/influencer/detail`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz

Busca os detalhes de criadores em lote, por `user_ids` ou `unique_ids` (até 10 por chamada, separados por vírgula). Retorna o mesmo formato de objeto da Influencer List, mas para um conjunto pontual de criadores conhecidos — ideal para hidratar fichas já salvas (ex.: criadores favoritados/monitorados) sem varrer a lista inteira. **Um de `user_ids` ou `unique_ids` é obrigatório.** Dados offline (T+1).

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `user_ids` | string | Condicional | Até 10 IDs separados por vírgula (ex.: `100034034780479488,100037587565707264`) | IDs internos dos criadores. **Obrigatório se `unique_ids` não for enviado.** |
| `unique_ids` | string | Condicional | Até 10 @handles separados por vírgula | Handles públicos do TikTok. **Obrigatório se `user_ids` não for enviado.** |

> Pelo menos um dos dois deve ser informado. Máximo de 10 criadores por requisição.

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/influencer/detail?user_ids=104962950695723008,100037587565707264" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota. O título do schema indica explicitamente: "para a descrição dos campos retornados, consulte a Influencer List".

### Campos de `data[]`
> São os mesmos campos da Influencer List. Resumo (todos na ordem do `x-apifox-orders`):

| Campo | Tipo | O que é |
|---|---|---|
| `avatar` | string | URL da foto de perfil (expira; use download API se der erro). |
| `avg_30d_price` | integer | Preço médio de venda nos últimos 30 dias. |
| `category` | string | Nicho/categoria principal do criador. |
| `contact_email` | string | E-mail de contato (pode vir vazio). |
| `ec_score` | number | Rating EchoTik. |
| `first_crawl_dt` | integer | Data do primeiro crawl (`yyyyMMdd`). |
| `gender` | string | Gênero inferido (confiável só na US). |
| `influencer_video_duration_level` | string | JSON-string: distribuição de duração dos vídeos. |
| `influencer_video_publish_hour` | string | JSON-string: distribuição de horário de publicação. |
| `influencer_video_publish_week` | string | JSON-string: distribuição por dia da semana. |
| `interaction_rate` | number | Taxa de interação/engajamento. |
| `language` | string | Idioma do criador (ex.: `en`). |
| `most_category_product` | string | JSON-string: categoria de produto mais vendida. |
| `most_views_video` | string | ID do vídeo mais visto. |
| `nick_name` | string | Nome de exibição. |
| `off_mark` | integer | Conta cancelada: `0`=ativa, `>0`=possivelmente cancelada. |
| `per_video_product_views_avg_7d_cnt` | integer | Média de views de vídeos de produto nos últimos 7 dias. |
| `region` | string | País/região do criador. |
| `sales_flag` | integer | Tipo de venda: `1`=vídeo, `2`=live, `3`=vídeo+live, `4`=vitrine. |
| `seller_id` | null | ID da loja vinculada (declarado `null` no schema; pode vir preenchido na prática). |
| `show_case_flag` | integer | Vitrine habilitada: `1`=sim, `0`=não. |
| `signature` | string | Bio/assinatura do perfil. |
| `total_comments_cnt` | integer | Total de comentários. |
| `total_digg_1d_cnt` | integer | Incremento de curtidas no último 1 dia. |
| `total_digg_30d_cnt` | integer | Incremento de curtidas em 30 dias. |
| `total_digg_7d_cnt` | integer | Incremento de curtidas em 7 dias. |
| `total_digg_90d_cnt` | integer | Incremento de curtidas em 90 dias. |
| `total_digg_cnt` | integer | Total de curtidas. |
| `total_followers_1d_cnt` | integer | Crescimento de seguidores em 1 dia. |
| `total_followers_30d_cnt` | integer | Crescimento de seguidores em 30 dias. |
| `total_followers_7d_cnt` | integer | Crescimento de seguidores em 7 dias. |
| `total_followers_90d_cnt` | integer | Crescimento de seguidores em 90 dias. |
| `total_followers_cnt` | integer | Total de seguidores. |
| `total_following_cnt` | integer | Total de contas seguidas. |
| `total_likes_cnt` | integer | Total de curtidas acumuladas (presente no schema de detalhe; provavelmente equivalente a `total_digg_cnt`). |
| `total_live_cnt` | integer | Total de lives. |
| `total_post_video_cnt` | integer | Total de vídeos publicados. |
| `total_product_30d_cnt` | integer | Produtos vendidos em 30 dias. |
| `total_product_cnt` | integer | Total de produtos promovidos. |
| `total_sale_cnt` | integer | Total de vendas (estimado). |
| `total_sale_gmv_30d_amt` | integer | GMV em 30 dias (estimado). |
| `total_sale_gmv_amt` | integer | GMV total (estimado). |
| `total_shares_cnt` | integer | Total de compartilhamentos. |
| `total_video_product_30d_cnt` | integer | Produtos vendidos via vídeo em 30 dias. |
| `total_video_sale_30d_cnt` | integer | Vendas via vídeo em 30 dias (estimado). |
| `total_views_cnt` | integer | Total de visualizações. |
| `unique_id` | string | @handle do TikTok. |
| `user_id` | string | ID interno do criador. |

> **Diferenças vs Influencer List:** o schema de detalhe inclui `total_likes_cnt` na lista de campos (a List não), e **não** lista `total_live_sale_gmv_30d_amt`, `total_video_sale_gmv_30d_amt`. O Example real (idêntico ao da List) traz campos extras: `per_video_product_views_avg_30d_cnt`, `per_views_avg_30d_cnt`, `product_category_list`, `total_live_sale_gmv_30d_amt`, `total_video_sale_gmv_30d_amt`.

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "avatar": "https://echosell-images.tos-ap-southeast-1.volces.com/user-avatar/252/MS4wLjABAAAAy5s11Qf2mzfNI54PWhh8-QncauRN9BJ1vC8cQywr13QlLh1LiN9Te9gg765ZFLfx.jpg",
      "avg_30d_price": 0,
      "category": "Other",
      "contact_email": "",
      "ec_score": 5.03,
      "first_crawl_dt": 20260305,
      "gender": "",
      "influencer_video_duration_level": "{\"2m\":0,\"30s-60s\":16,\"15s\":0}",
      "interaction_rate": 0.01,
      "language": "en",
      "most_category_product": "[{ \"category_name\":\"Beauty & Personal Care\",\"category_id\":\"601450\"}]",
      "most_views_video": "7611821797465541918",
      "nick_name": "cchan590",
      "off_mark": 0,
      "per_video_product_views_avg_30d_cnt": 20439,
      "per_video_product_views_avg_7d_cnt": 20439,
      "per_views_avg_30d_cnt": 20439,
      "product_category_list": "600154-809992-810504:1,604968-873352-979976:2",
      "region": "US",
      "sales_flag": 1,
      "seller_id": null,
      "show_case_flag": 0,
      "signature": "🌎:biv6888",
      "total_comments_cnt": 57,
      "total_digg_cnt": 14045,
      "total_followers_cnt": 4173,
      "total_following_cnt": 663,
      "total_likes_cnt": 81474,
      "total_post_video_cnt": 18,
      "total_product_cnt": 6,
      "total_sale_cnt": 47,
      "total_sale_gmv_amt": 466,
      "total_shares_cnt": 223,
      "total_views_cnt": 217835,
      "unique_id": "cchan590",
      "user_id": "104962950695723008"
    }
  ],
  "requestId": "0e0b5e10-2c7e-4f84-90e6-52e569e8bc36"
}
```
> (Exemplo resumido — janelas `_1d/_7d/_30d/_90d` e GMV de 30d omitidas, todas com valor `0` no exemplo da página.)

## Notas & gotchas
- Máximo de **10 IDs por chamada**; separar por vírgula simples (ASCII).
- `seller_id` está tipado como `null` no schema de detalhe — trate como nullable.
- Mesmas ressalvas da List: GMV estimado, avatares expiram, IDs em string, campos JSON-em-string.
- Para histórico use `influencer/trend`; este endpoint dá o estado atual (T+1).

## Relevância para o SLEAG
- Endpoint de **hidratação em lote** de criadores monitorados/favoritados, sem custo de varrer a List.
- Útil para sincronizar a base local de criadores acompanhados pelo usuário (até 10 por chamada).

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
  /api/v3/echotik/influencer/detail:
    get:
      summary: Batch fetch influencer details - EchoTik
      deprecated: false
      description: >-
        Retrieve Influencer detail data in bulk through user_id or unique_id, up
        to 10 at a time can be sent, multiple can be separated by English
        commas.


        One of user_ids or unique_ids is required
      tags:
        - Influencer
      parameters:
        - name: user_ids
          in: query
          description: |-
            Multiple, separated by English commas, for example
            100034034780479488,100037587565707264,100049707246170112
          required: false
          schema:
            type: string
        - name: unique_ids
          in: query
          description: ''
          required: false
          schema:
            type: string
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
                  data: &ref_0
                    type: array
                    items:
                      type: object
                      properties:
                        avatar:
                          type: string
                        avg_30d_price:
                          type: integer
                        category:
                          type: string
                        contact_email:
                          type: string
                        ec_score:
                          type: number
                        first_crawl_dt:
                          type: integer
                        gender:
                          type: string
                        influencer_video_duration_level:
                          type: string
                        influencer_video_publish_hour:
                          type: string
                        influencer_video_publish_week:
                          type: string
                        interaction_rate:
                          type: number
                        language:
                          type: string
                        most_category_product:
                          type: string
                        most_views_video:
                          type: string
                        nick_name:
                          type: string
                        off_mark:
                          type: integer
                        per_video_product_views_avg_7d_cnt:
                          type: integer
                        region:
                          type: string
                        sales_flag:
                          type: integer
                        seller_id:
                          type: 'null'
                        show_case_flag:
                          type: integer
                        signature:
                          type: string
                        total_comments_cnt:
                          type: integer
                        total_digg_1d_cnt:
                          type: integer
                        total_digg_30d_cnt:
                          type: integer
                        total_digg_7d_cnt:
                          type: integer
                        total_digg_90d_cnt:
                          type: integer
                        total_digg_cnt:
                          type: integer
                        total_followers_1d_cnt:
                          type: integer
                        total_followers_30d_cnt:
                          type: integer
                        total_followers_7d_cnt:
                          type: integer
                        total_followers_90d_cnt:
                          type: integer
                        total_followers_cnt:
                          type: integer
                        total_following_cnt:
                          type: integer
                        total_likes_cnt:
                          type: integer
                        total_live_cnt:
                          type: integer
                        total_post_video_cnt:
                          type: integer
                        total_product_30d_cnt:
                          type: integer
                        total_product_cnt:
                          type: integer
                        total_sale_cnt:
                          type: integer
                        total_sale_gmv_30d_amt:
                          type: integer
                        total_sale_gmv_amt:
                          type: integer
                        total_shares_cnt:
                          type: integer
                        total_video_product_30d_cnt:
                          type: integer
                        total_video_sale_30d_cnt:
                          type: integer
                        total_views_cnt:
                          type: integer
                        unique_id:
                          type: string
                        user_id:
                          type: string
                      x-apifox-orders:
                        - avatar
                        - avg_30d_price
                        - category
                        - contact_email
                        - ec_score
                        - first_crawl_dt
                        - gender
                        - influencer_video_duration_level
                        - influencer_video_publish_hour
                        - influencer_video_publish_week
                        - interaction_rate
                        - language
                        - most_category_product
                        - most_views_video
                        - nick_name
                        - off_mark
                        - per_video_product_views_avg_7d_cnt
                        - region
                        - sales_flag
                        - seller_id
                        - show_case_flag
                        - signature
                        - total_comments_cnt
                        - total_digg_1d_cnt
                        - total_digg_30d_cnt
                        - total_digg_7d_cnt
                        - total_digg_90d_cnt
                        - total_digg_cnt
                        - total_followers_1d_cnt
                        - total_followers_30d_cnt
                        - total_followers_7d_cnt
                        - total_followers_90d_cnt
                        - total_followers_cnt
                        - total_following_cnt
                        - total_likes_cnt
                        - total_live_cnt
                        - total_post_video_cnt
                        - total_product_30d_cnt
                        - total_product_cnt
                        - total_sale_cnt
                        - total_sale_gmv_30d_amt
                        - total_sale_gmv_amt
                        - total_shares_cnt
                        - total_video_product_30d_cnt
                        - total_video_sale_30d_cnt
                        - total_views_cnt
                        - unique_id
                        - user_id
                      x-apifox-ignore-properties: []
                    title: >-
                      For the returned field description, refer to the
                      Influencer List
                  requestId:
                    type: string
                x-apifox-orders:
                  - 01K8QXV5JN99T2SMHC5TJZBT1G
                x-apifox-refs:
                  01K8QXV5JN99T2SMHC5TJZBT1G:
                    $ref: '#/components/schemas/%E8%BE%BE%E4%BA%BA%E8%AF%A6%E6%83%85'
                    x-apifox-overrides:
                      data: *ref_0
                    required:
                      - data
                required:
                  - code
                  - message
                  - data
                  - requestId
                x-apifox-ignore-properties:
                  - code
                  - message
                  - data
                  - requestId
              example:
                code: 0
                message: success
                data:
                  - avatar: >-
                      https://echosell-images.tos-ap-southeast-1.volces.com/user-avatar/252/MS4wLjABAAAAy5s11Qf2mzfNI54PWhh8-QncauRN9BJ1vC8cQywr13QlLh1LiN9Te9gg765ZFLfx.jpg
                    avg_30d_price: 0
                    category: Other
                    contact_email: ''
                    ec_score: 5.03
                    first_crawl_dt: 20260305
                    gender: ''
                    influencer_video_duration_level: '{"2m":0,"1m-2m":0,"30s-60s":16,"15s-30s":0,"15s":0}'
                    influencer_video_publish_hour: >-
                      {"00":0,"01":0,"02":0,"03":0,"04":2,"05":3,"06":1,"07":4,"08":3,"09":0,"10":2,"11":1,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0}
                    influencer_video_publish_week: '{"1":0,"2":0,"3":0,"4":0,"5":0,"6":15,"7":1}'
                    interaction_rate: 0.01
                    language: en
                    most_category_product: >-
                      [{ "category_name":"Beauty & Personal
                      Care","category_id":"601450"}]
                    most_views_video: '7611821797465541918'
                    nick_name: cchan590
                    off_mark: 0
                    per_video_product_views_avg_30d_cnt: 20439
                    per_video_product_views_avg_7d_cnt: 20439
                    per_views_avg_30d_cnt: 20439
                    product_category_list: >-
                      600154-809992-810504:1,604968-873352-979976:2,601450-849672-601696:3,601450-849160-601506:4,600024-859528-600148:5,600024-859528-600135:6
                    region: US
                    sales_flag: 1
                    seller_id: null
                    show_case_flag: 0
                    signature: 🌎:biv6888
                    total_comments_cnt: 57
                    total_digg_1d_cnt: 0
                    total_digg_30d_cnt: 0
                    total_digg_7d_cnt: 0
                    total_digg_90d_cnt: 0
                    total_digg_cnt: 14045
                    total_followers_1d_cnt: 0
                    total_followers_30d_cnt: 0
                    total_followers_7d_cnt: 0
                    total_followers_90d_cnt: 0
                    total_followers_cnt: 4173
                    total_following_cnt: 663
                    total_likes_cnt: 81474
                    total_live_cnt: 0
                    total_live_sale_gmv_30d_amt: 0
                    total_post_video_cnt: 18
                    total_product_30d_cnt: 0
                    total_product_cnt: 6
                    total_sale_cnt: 47
                    total_sale_gmv_30d_amt: 0
                    total_sale_gmv_amt: 466
                    total_shares_cnt: 223
                    total_video_product_30d_cnt: 0
                    total_video_sale_30d_cnt: 0
                    total_video_sale_gmv_30d_amt: 0
                    total_views_cnt: 217835
                    unique_id: cchan590
                    user_id: '104962950695723008'
                requestId: 0e0b5e10-2c7e-4f84-90e6-52e569e8bc36
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Influencer
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-368752029-run
components:
  schemas:
    达人详情:
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
              avg_30d_price:
                type: integer
              category:
                type: string
              contact_email:
                type: string
              ec_score:
                type: number
              first_crawl_dt:
                type: integer
              gender:
                type: string
              influencer_video_duration_level:
                type: string
              influencer_video_publish_hour:
                type: string
              influencer_video_publish_week:
                type: string
              interaction_rate:
                type: number
              language:
                type: string
              most_category_product:
                type: string
              most_views_video:
                type: string
              nick_name:
                type: string
              off_mark:
                type: integer
              per_video_product_views_avg_7d_cnt:
                type: integer
              region:
                type: string
              sales_flag:
                type: integer
              seller_id:
                type: 'null'
              show_case_flag:
                type: integer
              signature:
                type: string
              total_comments_cnt:
                type: integer
              total_digg_1d_cnt:
                type: integer
              total_digg_30d_cnt:
                type: integer
              total_digg_7d_cnt:
                type: integer
              total_digg_90d_cnt:
                type: integer
              total_digg_cnt:
                type: integer
              total_followers_1d_cnt:
                type: integer
              total_followers_30d_cnt:
                type: integer
              total_followers_7d_cnt:
                type: integer
              total_followers_90d_cnt:
                type: integer
              total_followers_cnt:
                type: integer
              total_following_cnt:
                type: integer
              total_likes_cnt:
                type: integer
              total_live_cnt:
                type: integer
              total_post_video_cnt:
                type: integer
              total_product_30d_cnt:
                type: integer
              total_product_cnt:
                type: integer
              total_sale_cnt:
                type: integer
              total_sale_gmv_30d_amt:
                type: integer
              total_sale_gmv_amt:
                type: integer
              total_shares_cnt:
                type: integer
              total_video_product_30d_cnt:
                type: integer
              total_video_sale_30d_cnt:
                type: integer
              total_views_cnt:
                type: integer
              unique_id:
                type: string
              user_id:
                type: string
            x-apifox-orders:
              - avatar
              - avg_30d_price
              - category
              - contact_email
              - ec_score
              - first_crawl_dt
              - gender
              - influencer_video_duration_level
              - influencer_video_publish_hour
              - influencer_video_publish_week
              - interaction_rate
              - language
              - most_category_product
              - most_views_video
              - nick_name
              - off_mark
              - per_video_product_views_avg_7d_cnt
              - region
              - sales_flag
              - seller_id
              - show_case_flag
              - signature
              - total_comments_cnt
              - total_digg_1d_cnt
              - total_digg_30d_cnt
              - total_digg_7d_cnt
              - total_digg_90d_cnt
              - total_digg_cnt
              - total_followers_1d_cnt
              - total_followers_30d_cnt
              - total_followers_7d_cnt
              - total_followers_90d_cnt
              - total_followers_cnt
              - total_following_cnt
              - total_likes_cnt
              - total_live_cnt
              - total_post_video_cnt
              - total_product_30d_cnt
              - total_product_cnt
              - total_sale_cnt
              - total_sale_gmv_30d_amt
              - total_sale_gmv_amt
              - total_shares_cnt
              - total_video_product_30d_cnt
              - total_video_sale_30d_cnt
              - total_views_cnt
              - unique_id
              - user_id
            x-apifox-ignore-properties: []
          title: 返回的字段说明请参考 达人列表
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
