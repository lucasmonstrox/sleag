# Atributos de Categoria

> **Fonte:** TikTok Shop Partner Center · **`GET /product/202309/categories/{category_id}/attributes`** · **Auth:** `x-tts-access-token`

## O que faz

Retorna os atributos obrigatórios e opcionais para uma categoria específica (L3). Essencial antes de criar um produto: cada categoria exige atributos diferentes (ex.: "Material" e "Fit" para roupas; "Capacity" e "Weight" para eletrônicos; "Shelf Life" para alimentos). Sem preencher os atributos obrigatórios, o produto será rejeitado na auditoria.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `x-tts-access-token` | Sim | Access token |

### Path & Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `category_id` | string | Sim (path) | ID da categoria L3 |
| `app_key` | string | Sim (query) | — |
| `sign` | string | Sim (query) | — |
| `shop_cipher` | string | Sim (query) | — |
| `locale` | string | Não | Idioma. |

### Exemplo de chamada

```bash
curl -s "https://open-api.tiktokglobalshop.com/product/202309/categories/605248/attributes?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER&locale=en-US" \
  -H "x-tts-access-token: $ACCESS_TOKEN"
```

## Response

### Campos de `data[]`

| Campo | Tipo | O que é |
|---|---|---|
| `attribute_id` | string | ID do atributo. |
| `attribute_name` | string | Nome (ex.: `"Material"`). |
| `is_required` | boolean | `true` = obrigatório para criar produto. |
| `is_multiple` | boolean | `true` = aceita múltiplos valores. |
| `is_custom` | boolean | `true` = aceita valor customizado além dos pré-definidos. |
| `type` | string | Tipo: `SELECT`, `TEXT`, `NUMBER`, `IMAGE`. |
| `values` | array[object] | Valores pré-definidos: `[{ id, name }]`. |

### Exemplo de resposta

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "attribute_id": "50001",
      "attribute_name": "Material",
      "is_required": true,
      "is_multiple": false,
      "is_custom": false,
      "type": "SELECT",
      "values": [
        { "id": "60001", "name": "Cotton" },
        { "id": "60002", "name": "Polyester" },
        { "id": "60003", "name": "Wool" },
        { "id": "60004", "name": "Linen" }
      ]
    },
    {
      "attribute_id": "50002",
      "attribute_name": "Fit",
      "is_required": true,
      "is_multiple": false,
      "is_custom": false,
      "type": "SELECT",
      "values": [
        { "id": "60010", "name": "Regular" },
        { "id": "60011", "name": "Slim" },
        { "id": "60012", "name": "Oversized" }
      ]
    },
    {
      "attribute_id": "50003",
      "attribute_name": "Care Instructions",
      "is_required": false,
      "is_multiple": true,
      "is_custom": true,
      "type": "TEXT",
      "values": [
        { "id": "60020", "name": "Machine Wash" },
        { "id": "60021", "name": "Hand Wash" },
        { "id": "60022", "name": "Dry Clean Only" }
      ]
    }
  ]
}
```

## Notas & gotchas

- **Atributos mudam por categoria e região.** Sempre consulte este endpoint antes de criar produto em uma nova categoria.
- `is_required: true` → produto será rejeitado se faltar.
- `is_multiple: true` → array no payload (`product_attributes: [{..., attribute_values: [{id, name}, {id, name}]}]`).
- `is_custom: true` → o seller pode digitar valor livre, além das opções pré-definidas.
- Cache com TTL de 24h.

## Relevância para o SLEAG

- Formulário dinâmico de criação de produto: renderiza campos baseados nos atributos da categoria.
- Validação no frontend antes do submit (campos `is_required`).
