# Categorias de Produto

> **Fonte:** TikTok Shop Partner Center · **`GET /product/202309/categories`** · **Auth:** `x-tts-access-token`

## O que faz

Retorna a árvore de categorias oficial do TikTok Shop. Cada categoria tem `id`, `name` e subcategorias aninhadas (L1 → L2 → L3). Use para preencher o seletor de categoria no formulário de criação de produto. Para os **atributos obrigatórios** de uma categoria específica, use `GET /categories/{id}/attributes`.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `x-tts-access-token` | Sim | Access token |

### Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `app_key` | string | Sim | — |
| `sign` | string | Sim | — |
| `shop_cipher` | string | Sim | — |
| `locale` | string | Não | Idioma: `en-US`, `pt-BR`, etc. Default varia por região. |

### Exemplo de chamada

```bash
curl -s "https://open-api.tiktokglobalshop.com/product/202309/categories?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER&locale=en-US" \
  -H "x-tts-access-token: $ACCESS_TOKEN"
```

## Response

### Campos de `data[]`

| Campo | Tipo | O que é |
|---|---|---|
| `id` | string | ID da categoria (L1). |
| `name` | string | Nome da categoria. |
| `parent_id` | string | `"0"` para L1 (raiz). |
| `is_leaf` | boolean | `false` para L1 (tem filhos). |
| `children` | array[object] | Subcategorias L2 (mesma estrutura recursiva). |

Cada `children[]` tem a mesma estrutura — L2 contém L3. Nível L3 tem `is_leaf: true`.

### Exemplo de resposta

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "600001",
      "name": "Fashion",
      "parent_id": "0",
      "is_leaf": false,
      "children": [
        {
          "id": "605000",
          "name": "Men's Clothing",
          "parent_id": "600001",
          "is_leaf": false,
          "children": [
            { "id": "605248", "name": "T-Shirts", "parent_id": "605000", "is_leaf": true },
            { "id": "605249", "name": "Polo Shirts", "parent_id": "605000", "is_leaf": true },
            { "id": "605250", "name": "Hoodies", "parent_id": "605000", "is_leaf": true }
          ]
        }
      ]
    }
  ]
}
```

## Notas & gotchas

- Apenas categorias **L3** (folha) podem ser usadas como `category_id` ao criar um produto.
- A árvore muda ocasionalmente — faça cache com TTL de ~24h.
- Categorias disponíveis variam por região (US, BR, etc.). Passe o `shop_cipher` correto.
- Cross-border: algumas categorias são restritas (exigem certificações especiais).

## Relevância para o SLEAG

- Preencher cascata de categorias (L1 → L2 → L3) no form de criação de produto.
- Cache no backend com TTL de 24h.
