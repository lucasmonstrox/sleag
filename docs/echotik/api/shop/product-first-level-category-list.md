# Lista de Categorias de Produto — Nível 1 (primário)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/372726115e0) · **`GET /api/v3/echotik/category/l1`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz

Retorna a árvore de categorias de produto de **primeiro nível** (categorias-raiz, ex.: "Beauty & Personal Care", "Womenswear & Underwear") no idioma escolhido. É uma **dimensão** (tabela de referência), não um dado transacional: serve para resolver `category_id` ↔ `category_name` em qualquer outro endpoint que devolva apenas o id da categoria.

> **Observação:** as três páginas "Product … Category List" desta pasta `shop/` (níveis 1, 2 e 3) são idênticas às que existem em `product/` — são listas de categorias de produto. Existem aqui porque tanto lojas quanto produtos usam o mesmo dicionário de categorias. Use-as para traduzir ids de categoria em nomes legíveis e para montar filtros em cascata (l1 → l2 → l3).

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `language` | string | Sim | `th-TH`, `en-US`, `id-ID`, `zh-CN`, `ms-MY`, `vi-VN` | Idioma em que `category_name` será retornado. Não há `pt-BR` na lista — para o TIKSPY use `en-US` e traduza/mapeie internamente. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/category/l1?language=en-US" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]`
| Campo | Tipo | O que é |
|---|---|---|
| `category_id` | string | Id da categoria de primeiro nível. Chave para casar com `category_id` em endpoints de loja/produto. |
| `category_level` | string | Nível da categoria na árvore (aqui sempre `1`). (não documentado pela EchoTik — provavelmente o número do nível, como string.) |
| `category_name` | string | Nome legível da categoria no idioma de `language` (ex.: "Beauty & Personal Care"). |
| `language` | string | Eco do idioma usado na requisição (ex.: `en-US`). |
| `parent_id` | string | Id da categoria-pai. No nível 1 não há pai, então tende a vir vazio ou `0`. (não documentado pela EchoTik — provavelmente vazio/`0` no nível raiz.) |

## Notas & gotchas
- Todos os ids vêm como **string** (números longos), nunca converta para `number` — risco de perda de precisão.
- Dado de dimensão e estável: vale a pena **cachear** localmente (não conta como dado transacional e evita gastar cota a cada request).
- Sem paginação: retorna a lista completa do nível 1.

## Relevância para o TIKSPY
- Resolve o `category: "—"` no mapper de produtos e de lojas: com o dicionário l1/l2/l3 cacheado, traduzimos qualquer `category_id` em nome exibível na UI.
- Alimenta os filtros de categoria (dropdown em cascata) das áreas de Produtos, Lojas e Concorrência.

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
  /api/v3/echotik/category/l1:
    get:
      summary: Product First-Level Category List
      deprecated: false
      description: Get first-level category data of products
      tags:
        - Shop/Product category dimension data
      parameters:
        - name: language
          in: query
          description: >-
            The specific language can be selected from: th-TH, en-US, id-ID,
            zh-CN, ms-MY, vi-VN.
          required: true
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
                  data:
                    type: array
                    items:
                      type: object
                      properties:
                        category_id:
                          type: string
                        category_level:
                          type: string
                        category_name:
                          type: string
                        language:
                          type: string
                        parent_id:
                          type: string
                      x-apifox-orders:
                        - category_id
                        - category_level
                        - category_name
                        - language
                        - parent_id
                      x-apifox-ignore-properties: []
                  requestId:
                    type: string
                x-apifox-orders:
                  - 01K8T5WCX04FYGDWFAKMFXN8SD
                required:
                  - code
                  - message
                  - data
                  - requestId
                x-apifox-refs:
                  01K8T5WCX04FYGDWFAKMFXN8SD:
                    $ref: '#/components/schemas/%E5%95%86%E5%93%81%E5%88%86%E7%B1%BB'
                x-apifox-ignore-properties:
                  - code
                  - message
                  - data
                  - requestId
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Shop/Product category dimension data
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-372726115-run
components:
  schemas:
    商品分类:
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
              category_level:
                type: string
              category_name:
                type: string
              language:
                type: string
              parent_id:
                type: string
            x-apifox-orders:
              - category_id
              - category_level
              - category_name
              - language
              - parent_id
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
