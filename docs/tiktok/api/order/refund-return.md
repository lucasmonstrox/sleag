# Devoluções e Reembolsos

> **Fonte:** TikTok Shop Partner Center · **`/return/202309/returns`** · **Auth:** `x-tts-access-token`

## O que faz

Gerencia pedidos de devolução e reembolso (returns/refunds). Compradores podem solicitar devolução após `DELIVERED`. O seller pode aprovar, rejeitar ou solicitar mais informações. Devoluções afetam o settlement financeiro.

## Endpoints

### Listar devoluções — `GET /return/202309/returns`

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `app_key` | string | Sim | — |
| `sign` | string | Sim | — |
| `shop_cipher` | string | Sim | — |
| `page_size` | int | Sim | 1–100 |
| `page_token` | string | Não | Cursor |
| `return_status` | string | Não | `PENDING`, `APPROVED`, `REJECTED`, `REFUNDED`, `CLOSED` |
| `create_time_ge` | integer | Não | Timestamp Unix |
| `create_time_lt` | integer | Não | Timestamp Unix |

### Obter detalhe da devolução — `GET /return/202309/returns/{return_id}`

Mesmo padrão de query params. Retorna o estado completo da devolução.

### Aprovar/Rejeitar devolução — `POST /return/202309/returns/{return_id}/decide`

| Campo (body) | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `decision` | string | Sim | `APPROVE` ou `REJECT` |
| `reject_reason` | string | Se `REJECT` | Motivo da rejeição |
| `return_address` | object | Se `APPROVE` | Endereço para devolução |
| `comment` | string | Não | Comentário |

## Status de devolução

| Status | Significado |
|---|---|
| `PENDING` | Comprador solicitou, aguardando decisão do seller |
| `APPROVED` | Seller aprovou — comprador deve enviar o produto |
| `IN_TRANSIT` | Produto em devolução a caminho |
| `RECEIVED` | Seller recebeu o produto devolvido |
| `REFUNDED` | Reembolso processado |
| `REJECTED` | Seller rejeitou a devolução |
| `CLOSED` | Caso encerrado |

### Exemplo de chamada — Aprovar devolução

```bash
curl -X POST "https://open-api.tiktokglobalshop.com/return/202309/returns/RET123/decide?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER" \
  -H "x-tts-access-token: $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "decision": "APPROVE",
    "return_address": {
      "name": "Meu Ecommerce Ltda",
      "address_line1": "Rua do Devolução, 100",
      "city": "São Paulo",
      "province_code": "SP",
      "postal_code": "01000-000",
      "region_code": "BR",
      "phone_number": "+5511999998888"
    }
  }'
```

## Response (listagem)

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "returns": [
      {
        "return_id": "RET123",
        "order_id": "5771234567890123456",
        "return_status": "PENDING",
        "return_reason": "SIZE_TOO_SMALL",
        "return_items": [
          { "item_id": "LI_001", "quantity": 1, "return_amount": { "amount": "89.90", "currency": "BRL" } }
        ],
        "create_time": 1712500000
      }
    ],
    "total_count": 1,
    "next_page_token": ""
  }
}
```

## Notas & gotchas

- **Prazo de resposta:** sellers têm ~48–72h para aprovar/rejeitar. Após isso, o TikTok pode aprovar automaticamente.
- **Rejeição:** requer motivo válido. Rejeições abusivas podem gerar penalidades na loja.
- **Endereço de devolução:** deve ser configurado previamente no Seller Center ou enviado no momento da aprovação.
- **Reembolso parcial:** possível aprovar devolução de parte dos itens e rejeitar o resto.

## Relevância para o SLEAG

- Aba de "Devoluções" no dashboard com ações de aprovar/rejeitar.
- Automação de reembolso: aprovar automaticamente devoluções de baixo valor.
- Integração com ERP: sincronizar status de devolução com sistema de logística reversa.
