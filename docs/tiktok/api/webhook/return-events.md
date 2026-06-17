# Webhooks: Eventos de Cancelamento e Devolução

> **Fonte:** TikTok Shop Partner Center · Eventos: `CANCELLATION_STATUS_CHANGE`, `RETURN_STATUS_CHANGE`, `REVERSE_STATUS_UPDATE`

## CANCELLATION_STATUS_CHANGE

Disparado quando um cancelamento inicia ou muda de status.

### Payload `data`

| Campo | Tipo | O que é |
|---|---|---|
| `order_id` | string | ID do pedido. |
| `cancel_id` | string | ID do cancelamento. |
| `cancel_type` | string | `BUYER_REQUESTED`, `SELLER_REQUESTED`, `SYSTEM`. |
| `old_status` | string | Status anterior. |
| `new_status` | string | Novo status. |
| `cancel_reason` | string | Motivo. |
| `cancel_amount` | object | Valor cancelado: `{ amount, currency }`. |
| `update_time` | integer | Timestamp. |

### Status de cancelamento

| Status | Significado |
|---|---|
| `PENDING` | Solicitação criada, aguardando processamento |
| `APPROVED` | Cancelamento aprovado |
| `REJECTED` | Cancelamento rejeitado (ex.: pedido já enviado) |
| `COMPLETED` | Reembolso processado |

### Exemplo

```json
{
  "event_type": "CANCELLATION_STATUS_CHANGE",
  "event_id": "evt_cancel_001",
  "shop_cipher": "ROW_abc123...",
  "timestamp": 1712500000,
  "data": {
    "order_id": "5771234567890123456",
    "cancel_id": "CAN_001",
    "cancel_type": "BUYER_REQUESTED",
    "old_status": "PENDING",
    "new_status": "APPROVED",
    "cancel_reason": "CHANGED_MIND",
    "cancel_amount": { "amount": "194.78", "currency": "BRL" },
    "update_time": 1712500000
  },
  "signature": "..."
}
```

### Ações recomendadas

| Transição | Ação |
|---|---|
| `→ PENDING` (BUYER_REQUESTED) | Notificar seller para revisão (se pedido ainda não enviado). |
| `→ APPROVED` | Liberar estoque, atualizar financeiro. |
| `→ COMPLETED` | Reembolso efetuado — registrar na conciliação. |

---

## RETURN_STATUS_CHANGE

Disparado em mudanças no fluxo de devolução/reembolso.

### Payload `data`

| Campo | Tipo | O que é |
|---|---|---|
| `return_id` | string | ID da devolução. |
| `order_id` | string | ID do pedido. |
| `old_status` | string | Status anterior. |
| `new_status` | string | Novo status. |
| `return_reason` | string | Motivo da devolução (ex.: `SIZE_TOO_SMALL`, `DEFECTIVE`, `NOT_AS_DESCRIBED`). |
| `return_items` | array[object] | Itens devolvidos: `[{ item_id, quantity, return_amount }]`. |
| `update_time` | integer | Timestamp. |

### Status de devolução

| Status | Ação |
|---|---|
| `PENDING` | Comprador solicitou — seller tem ~48–72h para aprovar/rejeitar. ⚡ |
| `APPROVED` | Comprador deve enviar o produto de volta. |
| `IN_TRANSIT` | Produto a caminho do seller. |
| `RECEIVED` | Seller recebeu — inspecionar e liberar reembolso. |
| `REFUNDED` | Reembolso processado. |
| `REJECTED` | Seller rejeitou — comprador pode recorrer ao TikTok. |
| `CLOSED` | Caso encerrado. |

---

## REVERSE_STATUS_UPDATE

Disparado quando o comprador inicia uma solicitação de reverse (cancelamento, devolução ou reembolso). É o evento "guarda-chuva" que pode preceder `CANCELLATION_STATUS_CHANGE` ou `RETURN_STATUS_CHANGE`.

### Payload `data`

| Campo | Tipo | O que é |
|---|---|---|
| `reverse_id` | string | ID da solicitação. |
| `order_id` | string | ID do pedido. |
| `reverse_type` | string | `CANCEL`, `RETURN`, `REFUND`. |
| `status` | string | `PENDING`. |
| `reason` | string | Motivo. |
| `create_time` | integer | Timestamp. |

## Relevância para o SLEAG

- **Cancelamentos:** automação de cancelamento para pedidos `UNPAID`/`AWAITING_SHIPMENT` (aprovado automaticamente se ainda não enviado).
- **Devoluções:** `RETURN_STATUS_CHANGE → PENDING` — notificar seller com contagem regressiva (SLA de ~48h para responder).
- **Reembolsos:** `REFUNDED` — atualizar conciliação financeira e liberar estoque.
- **Métricas de loja:** cancelamentos e devoluções impactam `cancellation_rate` e `return_rate` no performance da loja.
