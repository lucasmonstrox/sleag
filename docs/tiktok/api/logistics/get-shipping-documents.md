# Documentos de Envio (Shipping Labels e Packing Slips)

> **Fonte:** TikTok Shop Partner Center · **`GET /logistics/202309/orders/{order_id}/shipping_documents`** · **Auth:** `x-tts-access-token`

## O que faz

Obtém documentos de envio para um pedido: etiqueta de transporte (shipping label), packing slip, ou pick list. Essencial para o fluxo de fulfillment — depois de receber um pedido `AWAITING_SHIPMENT`, você gera a etiqueta e despacha.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `x-tts-access-token` | Sim | Access token |

### Path & Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `order_id` | string | Sim (path) | ID do pedido |
| `app_key` | string | Sim (query) | — |
| `sign` | string | Sim (query) | — |
| `shop_cipher` | string | Sim (query) | — |
| `document_type` | string | Sim (query) | `SHIPPING_LABEL`, `PACKING_SLIP`, ou `PICK_LIST` |
| `package_id` | string | Não (query) | ID do pacote (se múltiplos pacotes). Se omitido, retorna todos. |
| `document_format` | string | Não (query) | `PDF` (default) ou `PNG`. |

### Exemplo de chamada

```bash
# Gerar etiqueta de envio em PDF
curl -s "https://open-api.tiktokglobalshop.com/logistics/202309/orders/5771234567890123456/shipping_documents?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER&document_type=SHIPPING_LABEL&document_format=PDF" \
  -H "x-tts-access-token: $ACCESS_TOKEN"
```

## Response

### Campos de `data`

| Campo | Tipo | O que é |
|---|---|---|
| `doc_url` | string | URL do documento gerado. **Baixe imediatamente** — pode expirar. |
| `doc_type` | string | Tipo confirmado. |
| `order_id` | string | ID do pedido. |
| `package_id` | string | ID do pacote associado. |
| `tracking_number` | string | Código de rastreio (apenas `SHIPPING_LABEL`). |
| `carrier` | string | Transportadora (ex.: `Correios`, `FedEx`). |

### Exemplo de resposta

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "doc_url": "https://logistics.tiktokshop.com/docs/label_5771234567890123456.pdf?token=...",
    "doc_type": "SHIPPING_LABEL",
    "order_id": "5771234567890123456",
    "package_id": "PKG_001",
    "tracking_number": "BR1234567890",
    "carrier": "Correios"
  }
}
```

## Notas & gotchas

- **URL temporária:** o `doc_url` pode expirar em horas. Faça download e armazene localmente.
- **Packing slip:** vai dentro do pacote. Contém itens do pedido e endereço.
- **Pick list:** usada pelo warehouse para separar os itens antes de empacotar.
- **Tracking number** só aparece quando a etiqueta é gerada. Se ainda não foi gerada, use `POST .../packages` primeiro.
- O documento é gerado sob demanda — a primeira chamada pode demorar alguns segundos.

## Relevância para o SLEAG

- Botão "Gerar Etiqueta" no detalhe do pedido.
- Automação: webhook `AWAITING_SHIPMENT` → criar pacote → gerar etiqueta → notificar warehouse.
- Download e arquivamento dos PDFs para registro.
