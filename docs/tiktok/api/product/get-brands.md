# Marcas

> **Fonte:** TikTok Shop Partner Center · **`GET /product/202309/brands`** · **Auth:** `x-tts-access-token`

## O que faz

Retorna a lista de marcas aprovadas para uso no TikTok Shop, filtráveis por categoria. Use para preencher o campo `brand_id` na criação de produto. Marcas precisam ser aprovadas previamente pelo TikTok — não é possível usar marcas arbitrárias.

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
| `category_id` | string | Não | Filtra marcas disponíveis para esta categoria. |
| `brand_name` | string | Não | Busca textual por nome da marca. |
| `page_size` | int | Não | Tamanho da página (máx. 100). |
| `page_token` | string | Não | Cursor de paginação. |

### Exemplo de chamada

```bash
curl -s "https://open-api.tiktokglobalshop.com/product/202309/brands?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER&category_id=605248&page_size=50" \
  -H "x-tts-access-token: $ACCESS_TOKEN"
```

## Response

### Campos de `data.brands[]`

| Campo | Tipo | O que é |
|---|---|---|
| `id` | string | ID da marca (usar como `brand_id`). |
| `name` | string | Nome da marca. |
| `status` | string | `ACTIVATE` (disponível). |
| `category_ids` | array[string] | Categorias onde a marca pode ser usada. |

### Exemplo de resposta

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "brands": [
      { "id": "BR7001", "name": "Nike", "status": "ACTIVATE", "category_ids": ["605248", "605249"] },
      { "id": "BR7002", "name": "Adidas", "status": "ACTIVATE", "category_ids": ["605248"] }
    ],
    "total_count": 230,
    "next_page_token": ""
  }
}
```

## Notas & gotchas

- **Nem todo produto precisa de marca.** Se a categoria não exige, omita `brand_id`.
- Marcas são pré-aprovadas pelo TikTok. Para adicionar uma nova, é preciso solicitar via Seller Center.
- Marcas de luxo/grife podem exigir documentação extra de autenticidade.

## Relevância para o SLEAG

- Autocomplete de marca no form de criação de produto, filtrado por categoria selecionada.
