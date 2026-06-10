# Lista de Subcategorias / Terceiro Nível (Product Subcategory Category List)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/369301369e0) · **`GET /api/v3/echotik/category/l3`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz
Retorna as **subcategorias de terceiro nível** (L3) do catálogo TikTok Shop indexado pela EchoTik — o nível mais granular da hierarquia (ex.: dentro de "Skincare" → "Face Serum"). Biblioteca de referência offline (T+1). Passe `parent_id` com o `category_id` de uma L2 para listar só as filhas dela. Os IDs retornados alimentam o parâmetro `category_l3_id` dos endpoints de produto e ranking.

> **Nota sobre o spec:** no schema inline do response esta operação está com `properties: {}` (vazio por bug do export Apifox), mas referencia o mesmo schema compartilhado `商品分类` ("Categoria de Produto") usado por L1 e L2. Portanto os campos retornados são os mesmos das categorias L1/L2.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `language` | string | Sim | `th-TH`, `en-US`, `id-ID`, `zh-CN`, `ms-MY`, `vi-VN` | Idioma dos nomes de categoria retornados. |
| `parent_id` | string | Não | `category_id` de uma L2 | Filtra para retornar só as L3 filhas dessa categoria de segundo nível. Sem ele, retorna o conjunto completo de L3 (não documentado pela EchoTik — provavelmente todas as L3). |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/category/l3?language=en-US&parent_id=905224" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` (e HTTP 200) significa sucesso; `code != 0` ou HTTP 500 com "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]` (schema compartilhado `商品分类`)
| Campo | Tipo | O que é |
|---|---|---|
| `category_id` | string | ID único da categoria L3. É o valor passado em `category_l3_id` nos endpoints de produto/ranking. |
| `category_level` | string | Nível na hierarquia. Aqui sempre `3`. Vem como string. |
| `category_name` | string | Nome legível da subcategoria de 3º nível, no idioma de `language`. |
| `language` | string | Idioma em que `category_name` foi retornado (ecoa o parâmetro). |
| `parent_id` | string | ID da categoria L2 pai desta L3 — permite reconstruir a hierarquia. |

## Notas & gotchas
- Todos os campos vêm como **string**, inclusive `category_level`.
- O `properties: {}` vazio no spec é um defeito do export; confie no `$ref` para `商品分类`. Os campos reais são os cinco da tabela acima.
- Nem toda L2 tem L3 — algumas árvores param no segundo nível.
- Dado de referência quase estático — cacheie.

## Relevância para o TIKSPY
- Nível mais granular do seletor de categoria em cascata (L1 → L2 → L3) dos filtros de produto/ranking/descoberta.
- Habilita análise de mercado em nichos muito específicos.

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
      description: Get product subcategory data
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
                properties: {}
                x-apifox-orders:
                  - 01K8T5WCX04FYGDWFAKMFXN8SD
                x-apifox-refs:
                  01K8T5WCX04FYGDWFAKMFXN8SD:
                    $ref: '#/components/schemas/%E5%95%86%E5%93%81%E5%88%86%E7%B1%BB'
                x--orders: []
                x--ignore-properties: []
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Product/Product category dimension data
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-369301369-run
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
            x--orders:
              - category_id
              - category_level
              - category_name
              - language
              - parent_id
            x--ignore-properties: []
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
      x--orders:
        - code
        - message
        - data
        - requestId
      x--ignore-properties: []
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
