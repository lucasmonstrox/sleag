# Lista de Categorias de Primeiro Nível (Product First-Level Category List)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/369264230e0) · **`GET /api/v3/echotik/category/l1`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz
Retorna a árvore de categorias de **primeiro nível** (L1) do catálogo TikTok Shop indexado pela EchoTik — as categorias "raiz" tipo "Beauty & Personal Care", "Womenswear", "Home Supplies" etc. É uma tabela de referência (biblioteca offline, atualização diária T+1) que você consulta uma vez e cacheia. Os `category_id` retornados aqui alimentam o parâmetro `category_id` dos endpoints de produto (lista, ranking) e o `parent_id` da chamada de categorias de segundo nível (L2). Use no setup/bootstrap de filtros de categoria do produto.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `language` | string | Sim | `th-TH`, `en-US`, `id-ID`, `zh-CN`, `ms-MY`, `vi-VN` | Idioma em que os nomes de categoria (`category_name`) serão retornados. Não filtra dados, só localiza os rótulos. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/category/l1?language=en-US" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` (e HTTP 200) significa sucesso; `code != 0` ou HTTP 500 com "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]`
| Campo | Tipo | O que é |
|---|---|---|
| `category_id` | string | ID único da categoria L1. É o valor que você passa em `category_id` nos endpoints de produto e como `parent_id` ao buscar L2. |
| `category_level` | string | Nível da categoria na hierarquia. Aqui sempre `1` (primeiro nível). Vem como string. |
| `category_name` | string | Nome legível da categoria, no idioma pedido em `language` (ex.: "Beauty & Personal Care"). |
| `language` | string | Idioma em que `category_name` foi retornado (ecoa o parâmetro `language`). |
| `parent_id` | string | ID da categoria pai. Em L1 normalmente é vazio/`0` (não documentado pela EchoTik — provavelmente nulo ou `0`, já que L1 é a raiz). |

## Notas & gotchas
- Todos os campos vêm como **string**, inclusive `category_level` (que é conceitualmente um número).
- É dado de referência estático na prática — cacheie agressivamente; não precisa rebater a cada request de produto.
- `parent_id` em L1 não tem uso prático (a raiz não tem pai); ele existe pra manter o mesmo schema de L2/L3.

## Relevância para o SLEAG
- Alimenta os **filtros de categoria** de qualquer tela que liste/ranqueie produtos (descoberta, produtos em alta, concorrência).
- Bootstrap: carregar L1 → L2 → L3 uma vez e montar o seletor de categoria em cascata da UI.

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
        - Product/Product category dimension data
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
      x-apifox-folder: Product/Product category dimension data
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-369264230-run
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
