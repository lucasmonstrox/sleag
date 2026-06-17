# Obter Detalhe do Produto

> **Fonte:** TikTok Shop Partner Center · **`GET /product/202309/products/{product_id}`** · **Auth:** `x-tts-access-token`

## O que faz

Retorna os **dados completos** de um produto: nome, descrição, categoria, marca, atributos, todas as imagens, SKUs com preços individuais, estoque por warehouse e status de auditoria. Complementar ao `GET /products` (que traz resumo) — use este para a ficha de produto completa.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `x-tts-access-token` | Sim | Access token do vendedor |

### Path & Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `product_id` | string | Sim (path) | ID do produto (ex.: `1731687611898499152`) |
| `app_key` | string | Sim (query) | App Key |
| `sign` | string | Sim (query) | Assinatura HMAC-SHA256 |
| `shop_cipher` | string | Sim (query) | Cipher da loja |

### Exemplo de chamada

```bash
curl -s "https://open-api.tiktokglobalshop.com/product/202309/products/1731687611898499152?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER" \
  -H "x-tts-access-token: $ACCESS_TOKEN"
```

## Response

### Campos de `data`

#### Identificação

| Campo | Tipo | O que é |
|---|---|---|
| `product_id` | string | ID único do produto. |
| `product_name` | string | Nome do produto. |
| `description` | string | Descrição completa. |
| `status` | string | Status: `ACTIVATE`, `REVIEWING`, `SELLER_DEACTIVATED`, etc. |
| `create_time` | integer | Timestamp Unix de criação. |
| `update_time` | integer | Timestamp Unix da última atualização. |

#### Categoria & Marca

| Campo | Tipo | O que é |
|---|---|---|
| `category_id` | string | ID da categoria (1º nível). |
| `category_name` | string | Nome da categoria. |
| `category_chain` | array | Cadeia completa: `[{ id, name }, { id, name }, { id, name }]`. |
| `brand_id` | string | ID da marca (se aplicável). |
| `brand_name` | string | Nome da marca. |

#### Mídia

| Campo | Tipo | O que é |
|---|---|---|
| `main_image` | object | Imagem principal: `{ id, url, height, width, thumb_url }`. |
| `images` | array[object] | Todas as imagens (mesma estrutura de `main_image`). |
| `videos` | array[object] | Vídeos do produto: `{ id, url, cover_url, duration }`. |
| `size_chart` | object | Tabela de medidas: `{ id, url }`. |
| `certifications` | array[object] | Imagens de certificação: `[{ id, url, type }]`. |

#### SKUs & Preços

| Campo | Tipo | O que é |
|---|---|---|
| `skus` | array[object] | Lista completa de SKUs (ver abaixo). |
| `price_range` | object | Faixa de preço: `{ min_price: { amount, currency }, max_price: { amount, currency } }`. |

#### `skus[]` — Cada SKU

| Campo | Tipo | O que é |
|---|---|---|
| `id` | string | ID do SKU no TikTok Shop. |
| `seller_sku` | string | SKU interno do seller. |
| `status` | string | Status do SKU: `ACTIVATE`, `SELLER_DEACTIVATED`. |
| `price` | object | Preço: `{ amount: "89.90", currency: "BRL" }`. |
| `original_price` | object | Preço original (se houver desconto): `{ amount, currency }`. |
| `stock_infos` | array[object] | Estoque por warehouse: `[{ warehouse_id, available_stock, reserved_stock }]`. |
| `sales_attributes` | array[object] | Atributos de venda: `[{ attribute_id, attribute_name, attribute_value_id, attribute_value_name, sku_img }]`. |
| `identifier_code` | object | Código UPC/EAN/ISBN: `{ type, code }`. |
| `package_weight` | string | Peso. |
| `package_dimensions` | object | `{ length, width, height, unit }`. |

#### Atributos de categoria

| Campo | Tipo | O que é |
|---|---|---|
| `product_attributes` | array[object] | Atributos obrigatórios/opcionais: `[{ attribute_id, attribute_name, attribute_values: [{ id, name }] }]`. |

#### Logística & Compliance

| Campo | Tipo | O que é |
|---|---|---|
| `warehouse_id` | string | Warehouse padrão do produto. |
| `delivery_options` | array[object] | Opções de entrega. |
| `warranty` | object | `{ policy, period }`. |
| `compliance_info` | object | Informações de compliance (cross-border): `{ hs_code, origin_country, ... }`. |

### Exemplo de resposta

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "product_id": "1731687611898499152",
    "product_name": "Camiseta Algodão Premium",
    "description": "Camiseta 100% algodão, confortável e durável. Lavável em máquina.",
    "status": "ACTIVATE",
    "create_time": 1712345678,
    "update_time": 1712432100,
    "category_id": "605248",
    "category_name": "Clothing",
    "category_chain": [
      { "id": "600001", "name": "Fashion" },
      { "id": "605000", "name": "Men's Clothing" },
      { "id": "605248", "name": "T-Shirts" }
    ],
    "brand_id": "BR7001",
    "brand_name": "MinhaMarca",
    "main_image": {
      "id": "img_001",
      "url": "https://cdn.tiktokshop.com/...",
      "height": 800,
      "width": 800,
      "thumb_url": "https://cdn.tiktokshop.com/..._thumb"
    },
    "images": [
      { "id": "img_001", "url": "https://cdn.tiktokshop.com/...", "height": 800, "width": 800 },
      { "id": "img_002", "url": "https://cdn.tiktokshop.com/...", "height": 800, "width": 800 }
    ],
    "videos": [],
    "price_range": {
      "min_price": { "amount": "89.90", "currency": "BRL" },
      "max_price": { "amount": "109.90", "currency": "BRL" }
    },
    "skus": [
      {
        "id": "1731687611898499153",
        "seller_sku": "CAM-ALG-P001",
        "status": "ACTIVATE",
        "price": { "amount": "89.90", "currency": "BRL" },
        "original_price": { "amount": "119.90", "currency": "BRL" },
        "stock_infos": [
          { "warehouse_id": "WH_US_001", "available_stock": 95, "reserved_stock": 5 }
        ],
        "sales_attributes": [
          { "attribute_id": "100000", "attribute_name": "Color", "attribute_value_id": "200001", "attribute_value_name": "Black" },
          { "attribute_id": "100001", "attribute_name": "Size", "attribute_value_id": "300001", "attribute_value_name": "M" }
        ],
        "identifier_code": { "type": "UPC", "code": "012345678905" }
      }
    ],
    "product_attributes": [
      { "attribute_id": "50001", "attribute_name": "Material", "attribute_values": [{ "id": "60001", "name": "Cotton" }] },
      { "attribute_id": "50002", "attribute_name": "Fit", "attribute_values": [{ "id": "60010", "name": "Regular" }] }
    ]
  }
}
```

## Notas & gotchas

- O response pode ser grande (dezenas de SKUs, cada um com `sales_attributes`). Parseie com streaming se necessário.
- `stock_infos[].reserved_stock` = estoque reservado para pedidos pendentes. O estoque "real disponível para venda" é `available_stock - reserved_stock`.
- Se o produto está `REVIEWING`, vários campos podem vir vazios — o TikTok popula após aprovação.
- `category_chain` é a hierarquia completa (L1 → L2 → L3). O `category_id` no topo é o L3 (mais específico).

## Relevância para o SLEAG

- Ficha completa de produto no dashboard.
- Base para análise de inventário: cruzar `stock_infos` com pedidos pendentes.
- Sincronização bidirecional: comparar estado local vs estado no TikTok para detectar divergências.
