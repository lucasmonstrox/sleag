# Webhooks: Eventos de Pedido

> **Fonte:** TikTok Shop Partner Center · Eventos: `ORDER_STATUS_CHANGE`, `PACKAGE_UPDATE`, `RECIPIENT_ADDRESS_UPDATE`, `INVOICE_STATUS_CHANGE`

## ORDER_STATUS_CHANGE

Disparado em **toda transição de status** do pedido.

### Payload `data`

| Campo | Tipo | O que é |
|---|---|---|
| `order_id` | string | ID do pedido. |
| `old_status` | string | Status anterior. |
| `new_status` | string | Novo status. |
| `update_time` | integer | Timestamp da transição. |
| `reason` | string | Motivo (se aplicável; ex.: `BUYER_CANCEL`, `TIMEOUT`, `SYSTEM`). |

### Exemplo

```json
{
  "event_type": "ORDER_STATUS_CHANGE",
  "event_id": "evt_789abc",
  "shop_cipher": "ROW_abc123...",
  "timestamp": 1712400000,
  "data": {
    "order_id": "5771234567890123456",
    "old_status": "AWAITING_SHIPMENT",
    "new_status": "IN_TRANSIT",
    "update_time": 1712400000,
    "reason": null
  },
  "signature": "..."
}
```

### Ações recomendadas

| Transição | Ação |
|---|---|
| `→ AWAITING_SHIPMENT` | Disparar fluxo de fulfillment: criar pacote, gerar etiqueta, notificar warehouse. |
| `→ IN_TRANSIT` | Atualizar dashboard, enviar notificação de tracking ao comprador. |
| `→ DELIVERED` | Atualizar dashboard, disparar pesquisa de satisfação. |
| `→ CANCELLED` | Liberar estoque, atualizar dashboard, notificar seller. |
| `→ COMPLETED` | Marcar como concluído, disparar conciliação financeira. |

---

## PACKAGE_UPDATE

Disparado quando um pacote é criado, dividido, combinado ou tem o endereço alterado.

### Payload `data`

| Campo | Tipo | O que é |
|---|---|---|
| `order_id` | string | ID do pedido. |
| `package_id` | string | ID do pacote afetado. |
| `update_type` | string | `CREATED`, `SPLIT`, `COMBINED`, `ADDRESS_UPDATE`, `CANCELLED`. |
| `tracking_number` | string | Código de rastreio (se disponível). |
| `carrier` | string | Transportadora. |
| `update_time` | integer | Timestamp. |

---

## RECIPIENT_ADDRESS_UPDATE

Disparado quando o comprador altera o endereço de entrega (antes do envio).

### Payload `data`

| Campo | Tipo | O que é |
|---|---|---|
| `order_id` | string | ID do pedido. |
| `old_address` | object | Endereço anterior. |
| `new_address` | object | Novo endereço. |

---

## INVOICE_STATUS_CHANGE

Disparado quando o status da fatura (invoice) é alterado.

## Relevância para o SLEAG

- **Webhook mais importante:** `ORDER_STATUS_CHANGE` é o coração do pipeline de fulfillment.
- Ao receber, faça `GET /orders/{order_id}` para enriquecer com dados completos.
- Idempotência por `event_id` é essencial — transições podem ter eventos duplicados.
