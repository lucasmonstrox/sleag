# Lista de Categorias de Produto — Nível 3 (subcategoria)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/372726121e0) · **`GET /api/v3/echotik/category/l3`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz

Retorna as categorias de produto de **terceiro nível** (folhas da árvore, as subcategorias mais específicas, filhas de uma categoria de nível 2). Aceita `parent_id` para listar apenas os filhos de uma categoria l2. É uma **dimensão** (tabela de referência), usada para resolver `category_l3_id` ↔ nome.

> **Observação:** as três páginas "Product … Category List" desta pasta `shop/` (níveis 1, 2 e 3) são idênticas às que existem em `product/` — listas de categorias de produto. Servem para resolver nomes/ids de categoria e montar o filtro em cascata l1 → l2 → l3.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `language` | string | Sim | `th-TH`, `en-US`, `id-ID`, `zh-CN`, `ms-MY`, `vi-VN` | Idioma do `category_name`. Sem `pt-BR`: use `en-US` e mapeie internamente. |
| `parent_id` | string | Não | id de categoria nível 2 | Filtra para retornar só as subcategorias filhas dessa categoria l2. Se omitido, tende a retornar todas as categorias de nível 3. (comportamento sem `parent_id` não documentado pela EchoTik — provavelmente lista completa do nível 3.) |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/category/l3?language=en-US&parent_id=1086856" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]`
| Campo | Tipo | O que é |
|---|---|---|
| `category_id` | string | Id da subcategoria de terceiro nível. Casa com `category_l3_id` nos endpoints de loja/produto. |
| `category_level` | string | Nível da categoria (aqui `3`). (não documentado pela EchoTik — provavelmente o número do nível como string.) |
| `category_name` | string | Nome legível da subcategoria no idioma de `language`. |
| `language` | string | Eco do idioma usado na requisição. |
| `parent_id` | string | Id da categoria de nível 2 que é pai desta subcategoria. Permite reconstruir a árvore l2 → l3. |

## Notas & gotchas
- Ids sempre como **string** — não converter para `number`.
- Dado de dimensão estável: **cachear** localmente. A árvore completa = l1 + l2 (por `parent_id`) + l3 (por `parent_id`).
- Sem paginação explícita na spec.

## Relevância para o TIKSPY
- Compõe o terceiro/último nível do filtro de categoria em cascata (Produtos / Lojas / Concorrência).
- Resolve `category_l3_id` para nome exibível, completando o dicionário que elimina o `category: "—"` no mapper.

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
  /api/v3/echotik/category/l3:
    get:
      summary: Product Subcategory Category List
      deprecated: false
      description: |
        Get product subcategory data
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
        - name: parent_id
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-372726121-run
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
