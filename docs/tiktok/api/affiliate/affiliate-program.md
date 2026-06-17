# Programa de Afiliados e Criadores

> **Fonte:** TikTok Shop Partner Center · **`/affiliate/202309/`** · **Auth:** `x-tts-access-token`

## Visão geral

A API de afiliados permite gerenciar o **programa de afiliados** da loja: configurar comissões, listar criadores vinculados, gerenciar colaborações e enviar amostras de produtos. Afiliados promovem seus produtos em vídeos e lives no TikTok, ganhando comissão sobre vendas.

---

## GET /affiliate/202309/creators — Criadores Afiliados

Lista os criadores que estão vinculados ao programa de afiliados da loja.

### Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `app_key` | string | Sim | — |
| `sign` | string | Sim | — |
| `shop_cipher` | string | Sim | — |
| `page_size` | int | Sim | 1–100 |
| `page_token` | string | Não | Cursor |
| `status` | string | Não | `ACTIVE`, `PENDING`, `DECLINED`, `TERMINATED` |
| `creator_name` | string | Não | Busca por nome |

### Response `data.creators[]`

| Campo | Tipo | O que é |
|---|---|---|
| `creator_id` | string | ID do criador no TikTok Shop. |
| `creator_name` | string | Nome do criador. |
| `creator_handle` | string | @handle do TikTok. |
| `status` | string | `ACTIVE`, `PENDING`, etc. |
| `total_gmv` | object | GMV gerado pelo criador: `{ amount, currency }`. |
| `total_orders` | integer | Pedidos gerados. |
| `commission_rate` | number | Taxa de comissão atual (ex.: `0.10` = 10%). |
| `joined_time` | integer | Timestamp de quando entrou no programa. |
| `categories` | array[string] | Categorias que o criador promove. |

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "creators": [
      {
        "creator_id": "CR_001",
        "creator_name": "Maria Influencer",
        "creator_handle": "mariafitness",
        "status": "ACTIVE",
        "total_gmv": { "amount": "3450.00", "currency": "BRL" },
        "total_orders": 67,
        "commission_rate": 0.10,
        "joined_time": 1710000000,
        "categories": ["605248", "605249"]
      }
    ],
    "total_count": 12,
    "next_page_token": ""
  }
}
```

---

## GET/PUT /affiliate/202309/commissions — Comissões

### GET — Listar comissões configuradas

Retorna as taxas de comissão por produto ou categoria.

### PUT — Configurar comissão

Define a taxa de comissão para produtos ou categorias.

### Body (PUT)

| Campo | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `commissions` | array[object] | Sim | Lista de configurações. |

Cada item de `commissions`:

| Campo | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `product_id` | string | * | ID do produto (se for por produto). |
| `category_id` | string | * | ID da categoria (se for por categoria). |
| `commission_rate` | number | Sim | Taxa (ex.: `0.15` = 15%). |
| `min_commission_rate` | number | Não | Mínima (se variável). |
| `max_commission_rate` | number | Não | Máxima (se variável). |

> *Exclusivo: informe `product_id` OU `category_id`.

### Exemplo

```bash
curl -X PUT "https://open-api.tiktokglobalshop.com/affiliate/202309/commissions?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER" \
  -H "x-tts-access-token: $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "commissions": [
      { "product_id": "1731687611898499152", "commission_rate": 0.15 },
      { "category_id": "605248", "commission_rate": 0.10 }
    ]
  }'
```

---

## POST /affiliate/202309/sample_requests — Solicitações de Amostra

Criadores podem solicitar amostras grátis de produtos para testar antes de promover. Este endpoint lista as solicitações e permite aprovar/rejeitar.

### GET — Listar solicitações

| Query param | O que faz |
|---|---|
| `status` | `PENDING`, `APPROVED`, `REJECTED`, `SHIPPED`, `DELIVERED` |
| `creator_id` | Filtra por criador |

### POST /{request_id}/decide — Aprovar/Rejeitar

```json
{
  "decision": "APPROVE",
  "warehouse_id": "WH_US_001",
  "note": "Enviando amostra tamanho M"
}
```

## Notas & gotchas

- **Comissão típica:** 5–25% dependendo da categoria e margem do produto.
- **Comissão por categoria** serve como fallback quando o produto não tem taxa específica.
- **Amostras** são custeadas pelo seller (produto + frete). Considere o orçamento de marketing.
- Afiliados não são exclusivos — o mesmo criador pode promover produtos de várias lojas.

## Relevância para o SLEAG

- Dashboard de afiliados: GMV por criador, top performers.
- Configuração de comissões em massa por categoria.
- Integração com fluxo de fulfillment para envio de amostras.
