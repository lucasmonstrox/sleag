# Listar Produtos

> **Fonte:** TikTok Shop Partner Center · **`GET /product/202309/products`** · **Auth:** `x-tts-access-token`

## O que faz

Lista os produtos da loja com filtros por status e paginação baseada em cursor. É o endpoint principal para vasculhar o catálogo. Retorna lista resumida de produtos com `product_id`, `product_name`, `status`, `skus`, `price` e `create_time`. Para detalhes completos (categoria, marca, atributos, estoque), use `GET /products/{product_id}`.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `x-tts-access-token` | Sim | Access token do vendedor |

### Query params

| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `app_key` | string | Sim | — | App Key do Partner Center |
| `sign` | string | Sim | — | Assinatura HMAC-SHA256 |
| `shop_cipher` | string | Sim | — | Cipher da loja |
| `page_size` | int | Sim | 1–100 | Itens por página. Recomendado: `20`–`50`. |
| `page_token` | string | Não | `""` na 1ª página | Cursor de paginação da página anterior. |
| `status` | string | Não | `ALL`, `ACTIVATE`, `REVIEWING`, `SELLER_DEACTIVATED`, `PLATFORM_SUSPENDED`, `AUDIT_REJECTED` | Filtra por status. Default: `ALL`. |
| `create_time_ge` | integer | Não | Timestamp Unix | Filtra produtos criados a partir desta data. |
| `create_time_lt` | integer | Não | Timestamp Unix | Filtra produtos criados antes desta data. |
| `update_time_ge` | integer | Não | Timestamp Unix | Filtra produtos atualizados a partir desta data. |
| `update_time_lt` | integer | Não | Timestamp Unix | Filtra produtos atualizados antes desta data. |
| `search_keyword` | string | Não | — | Busca textual por nome do produto. |

### Exemplo de chamada

```bash
# Primeira página — produtos ativos
curl -s "https://open-api.tiktokglobalshop.com/product/202309/products?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER&page_size=20&status=ACTIVATE" \
  -H "x-tts-access-token: $ACCESS_TOKEN"

# Próxima página usando cursor
curl -s "https://open-api.tiktokglobalshop.com/product/202309/products?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER&page_size=20&page_token=$NEXT_PAGE_TOKEN" \
  -H "x-tts-access-token: $ACCESS_TOKEN"
```

## Response

### Campos de `data`

| Campo | Tipo | O que é |
|---|---|---|
| `products` | array[object] | Lista de produtos (ver campos abaixo). |
| `total_count` | integer | Total de produtos que batem com o filtro. |
| `next_page_token` | string | Cursor para a próxima página. Vazio (`""`) = última página. |

### Campos de `products[]` (resumo)

| Campo | Tipo | O que é |
|---|---|---|
| `product_id` | string | ID único do produto. |
| `product_name` | string | Nome do produto. |
| `status` | string | Status: `ACTIVATE`, `REVIEWING`, `SELLER_DEACTIVATED`, `PLATFORM_SUSPENDED`, `AUDIT_REJECTED`. |
| `create_time` | integer | Timestamp Unix de criação. |
| `update_time` | integer | Timestamp Unix da última atualização. |
| `skus` | array[object] | Lista resumida de SKUs: `{ id, seller_sku, price: { amount, currency } }`. |
| `main_image` | object | Imagem principal: `{ url, height, width }`. |

### Exemplo de resposta

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "products": [
      {
        "product_id": "1731687611898499152",
        "product_name": "Camiseta Algodão Premium",
        "status": "ACTIVATE",
        "create_time": 1712345678,
        "update_time": 1712432100,
        "skus": [
          {
            "id": "1731687611898499153",
            "seller_sku": "CAM-ALG-P001",
            "price": { "amount": "89.90", "currency": "BRL" }
          }
        ],
        "main_image": {
          "url": "https://cdn.tiktokshop.com/...",
          "height": 800,
          "width": 800
        }
      }
    ],
    "total_count": 156,
    "next_page_token": "eyJwYWdlIjoyfQ=="
  }
}
```

## Notas & gotchas

- **Paginação por cursor:** sem número de página — guarde `next_page_token` para avançar. Quando `next_page_token` é `""`, acabou.
- **page_size máximo:** 100 (maior que os 10 do EchoTik, mas ainda limite a cota).
- **status=ALL** é o default e mais pesado — prefira filtrar por status se souber o que quer.
- **search_keyword** faz busca textual, mas sem fuzzy/typo tolerance avançada — seja exato.
- Produtos com `status=PLATFORM_SUSPENDED` ou `AUDIT_REJECTED` precisam de ação corretiva no Seller Center.

## Relevância para o SLEAG

- Base da página de catálogo do dashboard. "Meus produtos" com filtro de status.
- Para importação completa: iterar sobre todas as páginas com `next_page_token`.
- Combinar com `GET /products/{id}` para enriquecer cada card com categorias e atributos.
