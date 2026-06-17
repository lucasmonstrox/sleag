# Criar Produto

> **Fonte:** TikTok Shop Partner Center · **`POST /product/202309/products`** · **Auth:** `x-tts-access-token`

## O que faz

Cria um novo produto na loja do TikTok Shop. O produto passa por moderação (auditoria) antes de ficar ativo. É o endpoint mais complexo da API de produtos — requer SKUs, preços, imagens, categoria, atributos e informações de estoque por warehouse. Produtos cross-border têm exigências adicionais de compliance.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `x-tts-access-token` | Sim | Access token do vendedor |
| `Content-Type` | Sim | `application/json` |

### Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `app_key` | string | Sim | App Key do Partner Center |
| `sign` | string | Sim | Assinatura HMAC-SHA256 |
| `shop_cipher` | string | Sim | Cipher da loja (obtido em `/authorization/202309/shops`) |

### Body (JSON)

#### Campos principais do produto

| Campo | Tipo | Obrigatório | O que é |
|---|---|---|---|
| `product_name` | string | Sim | Nome do produto (até 255 chars). Deve seguir guidelines de conteúdo do TikTok. |
| `description` | string | Sim | Descrição do produto. Suporta texto rico limitado. |
| `category_id` | string | Sim | ID da categoria (obtido via `GET /product/202309/categories`). |
| `brand_id` | string | Não | ID da marca (se aplicável; obtido via `GET /product/202309/brands`). |
| `images` | array[object] | Sim | Lista de imagens do produto. |
| `skus` | array[object] | Sim | Lista de SKUs (mín. 1). |
| `package_weight` | string | Não | Peso da embalagem (ex.: `"0.5"` kg). |
| `package_dimensions` | object | Não | Dimensões: `{ length, width, height, unit: "cm" }`. |
| `warranty` | object | Não | Garantia: `{ policy, period }`. |

#### `images[]` — Imagens do produto

| Campo | Tipo | Obrigatório | O que é |
|---|---|---|---|
| `id` | string | Sim | ID da imagem (obtido via upload). Primeiro item = imagem principal. |
| `height` | integer | Não | Altura em pixels. |
| `width` | integer | Não | Largura em pixels. |
| `thumb_url` | string | Não | URL do thumbnail. |
| `url` | string | Sim | URL da imagem (retornada pelo upload). |

#### `skus[]` — SKUs do produto

| Campo | Tipo | Obrigatório | O que é |
|---|---|---|---|
| `seller_sku` | string | Sim | SKU interno do seller (alfanumérico). Deve ser único dentro da loja. |
| `price` | object | Sim | Preço: `{ amount: "29.99", currency: "USD" }`. |
| `stock_infos` | array[object] | Sim | Estoque por warehouse: `[{ warehouse_id, available_stock }]`. |
| `identifier_code` | object | Não | Códigos de identificação: `{ type: "UPC" | "EAN" | "ISBN", code }`. |
| `sales_attributes` | array | Não | Atributos de venda (cor, tamanho...). |

#### `sales_attributes[]` — Atributos de venda por SKU

| Campo | Tipo | Obrigatório | O que é |
|---|---|---|---|
| `attribute_id` | string | Sim | ID do atributo. |
| `attribute_name` | string | Sim | Nome (ex.: `"Color"`, `"Size"`). |
| `attribute_value_id` | string | Sim | ID do valor. |
| `attribute_value_name` | string | Sim | Valor (ex.: `"Red"`, `"XL"`). |
| `custom_value` | string | Não | Valor customizado (se permitido pela categoria). |
| `sku_img` | object | Não | Imagem específica da variação: `{ id, url, thumb_url }`. |

### Exemplo de chamada

```bash
curl -X POST "https://open-api.tiktokglobalshop.com/product/202309/products?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER" \
  -H "x-tts-access-token: $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Camiseta Algodão Premium",
    "description": "Camiseta 100% algodão, confortável e durável.",
    "category_id": "605248",
    "images": [{
      "id": "img_001",
      "url": "https://cdn.tiktokshop.com/..."
    }],
    "skus": [{
      "seller_sku": "CAM-ALG-P001",
      "price": { "amount": "89.90", "currency": "BRL" },
      "stock_infos": [{
        "warehouse_id": "WH_US_001",
        "available_stock": 100
      }],
      "sales_attributes": [{
        "attribute_id": "100000",
        "attribute_name": "Color",
        "attribute_value_id": "200001",
        "attribute_value_name": "Black"
      }, {
        "attribute_id": "100001",
        "attribute_name": "Size",
        "attribute_value_id": "300001",
        "attribute_value_name": "M"
      }]
    }]
  }'
```

## Response

### Campos de `data`

| Campo | Tipo | O que é |
|---|---|---|
| `product_id` | string | ID único do produto criado no TikTok Shop. |
| `status` | string | Status inicial: `REVIEWING` (entrou em moderação). |
| `create_time` | integer | Timestamp Unix de criação. |

### Exemplo de resposta

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "product_id": "1731687611898499152",
    "status": "REVIEWING",
    "create_time": 1712345678,
    "skus": [
      {
        "id": "1731687611898499153",
        "seller_sku": "CAM-ALG-P001"
      }
    ]
  }
}
```

## Estados do produto

| Status | Descrição |
|---|---|
| `REVIEWING` | Em moderação pelo TikTok |
| `ACTIVATE` | Ativo e visível na loja |
| `SELLER_DEACTIVATED` | Desativado pelo seller |
| `PLATFORM_SUSPENDED` | Suspenso pela plataforma (violação) |
| `AUDIT_REJECTED` | Rejeitado na auditoria |

## Notas & gotchas

- **Moderação:** o produto não fica visível imediatamente — aguarde o webhook `PRODUCT_AUDIT_STATUS_CHANGE`.
- **Atributos obrigatórios:** cada categoria tem atributos obrigatórios — consulte `GET /categories/{id}/attributes` antes de criar.
- **Imagens:** faça upload das imagens primeiro via `/products/upload_files`, depois use os IDs retornados no campo `images`.
- **Cross-border:** requer informações adicionais de compliance (certificações, peso, dimensões).
- **seller_sku:** deve ser único dentro da loja. Se duplicado, retorna erro `108003`.
- **Preços:** o campo `amount` é string (não number) para preservar precisão decimal. Sempre use 2 casas decimais.

## Relevância para o SLEAG

- Criação programática de catálogo. Integrar com sistema de PIM/ERP do seller.
- Upload de imagens primeiro, depois submit do produto com image IDs.
