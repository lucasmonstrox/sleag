# Webhooks: Eventos de Produto

> **Fonte:** TikTok Shop Partner Center · Eventos: `PRODUCT_STATUS_CHANGE`, `PRODUCT_CREATION`, `PRODUCT_AUDIT_STATUS_CHANGE`, etc.

## PRODUCT_STATUS_CHANGE

Disparado quando o status de um produto muda (ativação, desativação, suspensão).

### Payload `data`

| Campo | Tipo | O que é |
|---|---|---|
| `product_id` | string | ID do produto. |
| `old_status` | string | Status anterior. |
| `new_status` | string | Novo status. |
| `reason` | string | Motivo da mudança (ex.: `AUDIT_APPROVED`, `SELLER_DEACTIVATED`, `POLICY_VIOLATION`). |
| `update_time` | integer | Timestamp. |

### Exemplo

```json
{
  "event_type": "PRODUCT_STATUS_CHANGE",
  "event_id": "evt_prod_001",
  "shop_cipher": "ROW_abc123...",
  "timestamp": 1712500000,
  "data": {
    "product_id": "1731687611898499152",
    "old_status": "REVIEWING",
    "new_status": "ACTIVATE",
    "reason": "AUDIT_APPROVED",
    "update_time": 1712500000
  },
  "signature": "..."
}
```

### Ações recomendadas

| Transição | Ação |
|---|---|
| `REVIEWING → ACTIVATE` | Produto aprovado! Atualizar catálogo local, notificar seller. |
| `* → PLATFORM_SUSPENDED` | ⚠️ Violação de política — revisar motivo e corrigir. |
| `ACTIVATE → SELLER_DEACTIVATED` | Seller desativou — sincronizar catálogo. |

---

## PRODUCT_AUDIT_STATUS_CHANGE

Disparado especificamente quando a **auditoria** é concluída (mais granular que `PRODUCT_STATUS_CHANGE`).

### Payload `data`

| Campo | Tipo | O que é |
|---|---|---|
| `product_id` | string | ID do produto. |
| `audit_status` | string | `APPROVED` ou `REJECTED`. |
| `reject_reasons` | array[string] | Motivos da rejeição (se `REJECTED`). Ex.: `IMAGE_QUALITY_LOW`, `TITLE_MISMATCH`, `CATEGORY_WRONG`. |
| `audit_time` | integer | Timestamp da conclusão. |

---

## PRODUCT_CREATION

Disparado quando um novo produto é criado (via API ou Seller Center).

### Payload `data`

| Campo | Tipo | O que é |
|---|---|---|
| `product_id` | string | ID do novo produto. |
| `product_name` | string | Nome. |
| `sku_count` | integer | Número de SKUs. |
| `create_time` | integer | Timestamp. |

---

## PRODUCT_INFORMATION_CHANGE

Disparado quando informações do produto são alteradas (título, descrição, imagens, atributos).

### Payload `data`

| Campo | Tipo | O que é |
|---|---|---|
| `product_id` | string | ID do produto. |
| `changed_fields` | array[string] | Campos alterados: `["product_name", "description", "images"]`. |
| `update_time` | integer | Timestamp. |

## Relevância para o SLEAG

- **`PRODUCT_AUDIT_STATUS_CHANGE` → `REJECTED`:** alerta imediato ao seller com o motivo da rejeição para correção rápida.
- **`PRODUCT_STATUS_CHANGE` → `PLATFORM_SUSPENDED`:** crítico — pode significar violação de política que afeta a saúde da loja.
- Sincronização de catálogo: qualquer alteração de produto dispara refresh do cache local.
