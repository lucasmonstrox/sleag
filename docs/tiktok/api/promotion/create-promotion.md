# Promoções e Campanhas

> **Fonte:** TikTok Shop Partner Center · **`/promotion/202309/`** · **Auth:** `x-tts-access-token`

## Visão geral

A API de promoções permite criar e gerenciar descontos, cupons e ofertas relâmpago (flash deals) na loja. Promoções podem ser aplicadas a produtos específicos, categorias inteiras, ou à loja toda.

---

## POST /promotion/202309/promotions — Criar Promoção

Cria uma campanha promocional (ex.: "Queima de Estoque", "Black Friday").

### Body

| Campo | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `title` | string | Sim | Nome interno da promoção. |
| `description` | string | Não | Descrição visível ao comprador. |
| `start_time` | integer | Sim | Timestamp Unix de início. |
| `end_time` | integer | Sim | Timestamp Unix de fim. |
| `type` | string | Sim | `PRODUCT_DISCOUNT`, `ORDER_DISCOUNT`, `BUY_X_GET_Y`. |
| `discount` | object | Sim | Configuração do desconto (ver abaixo). |
| `product_ids` | array[string] | Não | Lista de produtos participantes. Vazio = loja toda. |
| `category_ids` | array[string] | Não | Categorias participantes (alternativa a product_ids). |
| `budget` | object | Não | Orçamento máximo: `{ amount, currency }`. |
| `usage_limit` | integer | Não | Limite de usos totais. |
| `per_buyer_limit` | integer | Não | Limite por comprador. |

### `discount` — Tipos de desconto

**Product Discount — desconto por produto:**

```json
{
  "type": "PERCENTAGE",
  "value": "20",
  "min_quantity": 2
}
```

| Campo | Tipo | O que faz |
|---|---|---|
| `type` | string | `PERCENTAGE` (% de desconto) ou `FIXED_AMOUNT` (valor fixo). |
| `value` | string | Valor do desconto (ex.: `"20"` para 20%). |
| `min_quantity` | int | Quantidade mínima (opcional). |

**Order Discount — desconto no pedido:**

```json
{
  "type": "PERCENTAGE",
  "value": "10",
  "min_order_amount": { "amount": "100.00", "currency": "BRL" }
}
```

### Exemplo de chamada

```bash
curl -X POST "https://open-api.tiktokglobalshop.com/promotion/202309/promotions?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER" \
  -H "x-tts-access-token: $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Queima de Estoque Junho",
    "start_time": 1712300000,
    "end_time": 1712800000,
    "type": "PRODUCT_DISCOUNT",
    "discount": { "type": "PERCENTAGE", "value": "20" },
    "product_ids": ["1731687611898499152"],
    "budget": { "amount": "5000.00", "currency": "BRL" },
    "usage_limit": 200,
    "per_buyer_limit": 3
  }'
```

### Response

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "promotion_id": "PROMO_001",
    "title": "Queima de Estoque Junho",
    "status": "SCHEDULED",
    "start_time": 1712300000,
    "end_time": 1712800000
  }
}
```

---

## GET /promotion/202309/promotions — Listar Promoções

### Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `app_key` | string | Sim | — |
| `sign` | string | Sim | — |
| `shop_cipher` | string | Sim | — |
| `page_size` | int | Sim | 1–100 |
| `page_token` | string | Não | Cursor |
| `status` | string | Não | `SCHEDULED`, `ACTIVE`, `ENDED`, `PAUSED` |

---

## POST /promotion/202309/coupons — Criar Cupom

Cria um cupom de desconto que o comprador aplica no checkout.

### Body (principais campos)

| Campo | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `coupon_code` | string | Sim | Código do cupom (ex.: `BOASVINDAS20`). |
| `title` | string | Sim | Nome promocional. |
| `discount` | object | Sim | Mesma estrutura de `discount` de promoção. |
| `start_time` | integer | Sim | Início. |
| `end_time` | integer | Sim | Fim. |
| `usage_limit` | integer | Não | Limite global. |
| `per_buyer_limit` | integer | Não | Limite por comprador. |
| `product_ids` | array[string] | Não | Restrito a produtos. |
| `min_order_amount` | object | Não | Pedido mínimo: `{ amount, currency }`. |

---

## Flash Deals — `POST/GET /promotion/202309/flash_deals`

Ofertas relâmpago de curta duração (horas). Requerem aprovação prévia do TikTok e loja com `performance_tier` mínimo (`GOOD`+).

### Status de flash deal

| Status | Significado |
|---|---|
| `PENDING_APPROVAL` | Aguardando aprovação do TikTok |
| `APPROVED` | Aprovada, aguardando início |
| `ACTIVE` | Ao vivo |
| `ENDED` | Encerrada |
| `REJECTED` | Rejeitada pela plataforma |

## Notas & gotchas

- **Budget:** se definido, a promoção desativa automaticamente ao atingir o orçamento.
- **Conflito:** um produto pode ter múltiplas promoções ativas — o TikTok aplica a melhor para o comprador.
- **Flash deals** exigem performance tier mínimo e estoque mínimo — não disponível para todas as lojas.

## Relevância para o SLEAG

- Criação de promoções programáticas (ex.: desconto automático em produtos encalhados).
- Dashboard de marketing: listar promoções ativas com métricas de uso.
