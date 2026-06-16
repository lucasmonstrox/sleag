# Lista de Categorias de Segundo Nível (Product Secondary Category List)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/369270353e0) · **`GET /api/v3/echotik/category/l2`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz
Retorna as categorias de **segundo nível** (L2) do catálogo TikTok Shop indexado pela EchoTik — as subcategorias de uma categoria raiz (ex.: dentro de "Beauty & Personal Care" → "Makeup", "Skincare"). Biblioteca de referência offline (atualização diária T+1). Passe `parent_id` com o `category_id` de uma categoria L1 para listar só as filhas dela; sem `parent_id`, tende a retornar todas as L2 do idioma. Os IDs retornados alimentam o parâmetro `category_l2_id` dos endpoints de produto e o `parent_id` da chamada de L3.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `language` | string | Sim | `th-TH`, `en-US`, `id-ID`, `zh-CN`, `ms-MY`, `vi-VN` | Idioma dos nomes de categoria retornados. |
| `parent_id` | string | Não | `category_id` de uma L1 | Filtra para retornar só as L2 filhas dessa categoria de primeiro nível. Sem ele, retorna o conjunto completo de L2 (não documentado explicitamente pela EchoTik — provavelmente todas as L2). |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/category/l2?language=en-US&parent_id=601450" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` (e HTTP 200) significa sucesso; `code != 0` ou HTTP 500 com "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]`
| Campo | Tipo | O que é |
|---|---|---|
| `category_id` | string | ID único da categoria L2. É o valor passado em `category_l2_id` nos endpoints de produto e como `parent_id` ao buscar L3. |
| `category_level` | string | Nível na hierarquia. Aqui sempre `2`. Vem como string. |
| `category_name` | string | Nome legível da subcategoria, no idioma de `language`. |
| `language` | string | Idioma em que `category_name` foi retornado (ecoa o parâmetro). |
| `parent_id` | string | ID da categoria L1 pai desta L2 — permite reconstruir a hierarquia. |

## Notas & gotchas
- Todos os campos vêm como **string**, inclusive `category_level`.
- Dado de referência quase estático — cacheie.
- Sem `parent_id` o volume pode ser grande; prefira sempre filtrar por L1.

## Relevância para o SLEAG
- Segundo nível do seletor de categoria em cascata (L1 → L2 → L3) usado nos filtros de produto/ranking/descoberta.
- Permite drill-down de mercado por nicho (ex.: "Skincare" dentro de "Beauty").

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
  /api/v3/echotik/category/l2:
    get:
      summary: Product Secondary Category List
      deprecated: false
      description: Get secondary category data for products
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
      x-apifox-folder: Product/Product category dimension data
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-369270353-run
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
