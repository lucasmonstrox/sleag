# Webhooks — TikTok Shop API

> **Fonte:** TikTok Shop Partner Center · Eventos em tempo real · **Configuração:** Partner Center ou API

## Visão geral

Webhooks são a forma mais eficiente de reagir a eventos da loja em **tempo real**, sem polling. O TikTok Shop envia uma requisição `POST` para sua URL de callback sempre que um evento acontece: mudança de status de pedido, cancelamento, devolução, alteração de produto, mensagem de comprador e alertas de autorização.

## Configuração

Webhooks são configurados no **Partner Center** (console do app) ou via API:

```
PUT /event/202309/shops/{shop_cipher}/webhook
```

### Parâmetros de configuração

| Campo | Descrição |
|---|---|
| `callback_url` | URL HTTPS do seu servidor que receberá os POSTs. |
| `events` | Lista de eventos a subscrever (ver abaixo). |
| `secret` | Chave secreta para validação do payload (HMAC-SHA256). |

## Categorias de eventos

### 1. Pedidos (Order Events)

| Evento | Descrição | [Doc](order-events.md) |
|---|---|---|
| `ORDER_STATUS_CHANGE` | Qualquer transição de status do pedido | ✓ |
| `PACKAGE_UPDATE` | Pacote dividido, combinado, endereço alterado | ✓ |
| `RECIPIENT_ADDRESS_UPDATE` | Endereço de entrega alterado | ✓ |
| `INVOICE_STATUS_CHANGE` | Status da fatura alterado | ✓ |

### 2. Cancelamento e Devolução

| Evento | Descrição | [Doc](return-events.md) |
|---|---|---|
| `CANCELLATION_STATUS_CHANGE` | Mudança no status de cancelamento | ✓ |
| `RETURN_STATUS_CHANGE` | Mudança no status de devolução | ✓ |
| `REVERSE_STATUS_UPDATE` | Solicitação de reverse (cancel/refund/return) do comprador | ✓ |

### 3. Produto (Product Events)

| Evento | Descrição | [Doc](product-events.md) |
|---|---|---|
| `PRODUCT_STATUS_CHANGE` | Status de auditoria do produto mudou | ✓ |
| `PRODUCT_CREATION` | Novo produto criado | ✓ |
| `PRODUCT_CATEGORY_CHANGE` | Categoria do produto alterada | ✓ |
| `PRODUCT_INFORMATION_CHANGE` | Título, descrição, imagens, atributos alterados | ✓ |
| `PRODUCT_AUDIT_STATUS_CHANGE` | Resultado de auditoria (aprovado/rejeitado) | ✓ |

### 4. Mensagens (Customer Service)

| Evento | Descrição |
|---|---|
| `NEW_CONVERSATION` | Nova conversa iniciada por comprador |
| `NEW_MESSAGE` | Nova mensagem em conversa existente |

### 5. Autorização (Auth Events)

| Evento | Descrição | [Doc](auth-events.md) |
|---|---|---|
| `SELLER_DEAUTHORIZATION` | Loja desautorizou o app | ✓ |
| `UPCOMING_AUTHORIZATION_EXPIRATION` | Alerta de expiração (30 dias antes + diário) | ✓ |

## Formato do Payload

Todo webhook envia um JSON com esta estrutura:

```json
{
  "event_type": "ORDER_STATUS_CHANGE",
  "event_id": "evt_abc123",
  "shop_cipher": "ROW_...",
  "timestamp": 1712345678,
  "data": {
    "order_id": "5771234567890123456",
    "old_status": "AWAITING_SHIPMENT",
    "new_status": "IN_TRANSIT",
    "update_time": 1712400000
  },
  "signature": "hmac_sha256_hex..."
}
```

### Campos do envelope

| Campo | Tipo | O que é |
|---|---|---|
| `event_type` | string | Nome do evento. |
| `event_id` | string | ID único do evento (para idempotência). |
| `shop_cipher` | string | Loja onde o evento ocorreu. |
| `timestamp` | integer | Timestamp Unix do evento. |
| `data` | object | Payload específico do evento (varia por `event_type`). |
| `signature` | string | Assinatura HMAC-SHA256 do payload para verificação. |

## Verificação de Assinatura

Todo webhook vem com uma assinatura no campo `signature`. Para verificar que o payload é autêntico:

```python
import hmac, hashlib, json

def verify_webhook(payload: dict, secret: str) -> bool:
    signature = payload.pop("signature", None)
    data_str = json.dumps(payload, separators=(',', ':'), ensure_ascii=False)
    computed = hmac.new(secret.encode(), data_str.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(computed, signature or "")
```

> ⚠️ **Sempre verifique a assinatura** antes de processar o evento. Isso prevê spoofing.

## Idempotência

Use o `event_id` para garantir que cada evento é processado **exatamente uma vez**. O TikTok pode reenviar um webhook em caso de timeout (sua resposta demorou >5s ou retornou HTTP não-2xx).

```sql
-- Exemplo: tabela de deduplicação
INSERT INTO webhook_processed (event_id, processed_at)
VALUES ('evt_abc123', NOW())
ON CONFLICT (event_id) DO NOTHING;
```

## Boas práticas

1. **Responda rápido** — retorne HTTP `200` assim que receber o evento. Processamento pesado deve ser assíncrono (fila/worker).
2. **Deduplique por `event_id`** — salve os IDs processados para evitar duplo processamento.
3. **Verifique a assinatura** — toda vez, sem exceção.
4. **Ordem dos eventos:** webhooks podem chegar fora de ordem. Sempre consulte o timestamp e, se necessário, puxe o estado atual via API (`GET /orders/{id}`).
5. **Retry:** se seu endpoint retornar erro ou demorar >5s, o TikTok retenta com backoff (até ~24h).

## Relevância para o SLEAG

- **Motor de eventos em tempo real:** webhooks alimentam o dashboard sem polling.
- **Automação de fulfillment:** `ORDER_STATUS_CHANGE` → `AWAITING_SHIPMENT` → criar pacote + etiqueta.
- **Notificações:** push notification para o seller em eventos críticos (pedido cancelado, produto rejeitado).
- **Sincronização de estoque:** `PRODUCT_STATUS_CHANGE` → atualizar catálogo local.
