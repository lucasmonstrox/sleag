# Financeiro — Payments, Transações e Settlements

> **Fonte:** TikTok Shop Partner Center · **`/finance/202309/`** · **Auth:** `x-tts-access-token`

## Visão geral

A API financeira do TikTok Shop cobre 3 níveis de granularidade:

| Nível | Endpoint | Descrição |
|---|---|---|
| **Settlements** (liquidações) | `GET /finance/202309/settlements` | Ciclos de pagamento agregados por período |
| **Transactions** (transações) | `GET /finance/202309/transactions` | Cada transação individual (venda, taxa, estorno) |
| **Payments** (repasses) | `GET /finance/202309/payments` | Repasses efetivos do TikTok para a conta bancária |

---

## GET /finance/202309/settlements — Liquidações

Lista os ciclos de settlement (liquidação) da loja. Cada settlement agrega as transações de um período (tipicamente semanal).

### Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `app_key` | string | Sim | — |
| `sign` | string | Sim | — |
| `shop_cipher` | string | Sim | — |
| `page_size` | int | Sim | 1–100 |
| `page_token` | string | Não | Cursor |
| `settlement_date_ge` | string | Não | Data início: `yyyy-MM-dd` |
| `settlement_date_lt` | string | Não | Data fim: `yyyy-MM-dd` |

### Response `data.settlements[]`

| Campo | Tipo | O que é |
|---|---|---|
| `settlement_id` | string | ID da liquidação. |
| `settlement_date` | string | Data da liquidação. |
| `currency` | string | Moeda. |
| `total_amount` | object | Total bruto: `{ amount, currency }`. |
| `fee_amount` | object | Taxas totais: `{ amount, currency }`. |
| `net_amount` | object | Líquido: `{ amount, currency }`. |
| `status` | string | `PENDING`, `PROCESSING`, `SETTLED`. |
| `order_count` | integer | Número de pedidos. |

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "settlements": [
      {
        "settlement_id": "STL_2024_06_001",
        "settlement_date": "2024-06-17",
        "currency": "BRL",
        "total_amount": { "amount": "8975.50", "currency": "BRL" },
        "fee_amount": { "amount": "448.78", "currency": "BRL" },
        "net_amount": { "amount": "8526.72", "currency": "BRL" },
        "status": "SETTLED",
        "order_count": 42
      }
    ],
    "total_count": 24,
    "next_page_token": ""
  }
}
```

---

## GET /finance/202309/transactions — Transações

Lista transações individuais dentro de um settlement.

### Query params adicionais

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `settlement_id` | string | Não | Filtra por liquidação. |
| `transaction_type` | string | Não | `SALE`, `REFUND`, `FEE`, `SHIPPING`, `TAX`, `ADJUSTMENT`. |
| `order_id` | string | Não | Filtra transações de um pedido. |

### Response `data.transactions[]`

| Campo | Tipo | O que é |
|---|---|---|
| `transaction_id` | string | ID da transação. |
| `order_id` | string | Pedido relacionado. |
| `type` | string | `SALE`, `REFUND`, `FEE`, etc. |
| `amount` | object | Valor: `{ amount, currency }`. |
| `description` | string | Descrição legível. |
| `created_time` | integer | Timestamp. |

---

## GET /finance/202309/payments — Repasses

Lista os pagamentos/repasses do TikTok para a conta bancária do seller.

### Response `data.payments[]`

| Campo | Tipo | O que é |
|---|---|---|
| `payment_id` | string | ID do repasse. |
| `payment_date` | string | Data do repasse. |
| `amount` | object | Valor repassado. |
| `currency` | string | Moeda. |
| `bank_account` | string | Últimos 4 dígitos da conta. |
| `status` | string | `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`. |
| `settlement_ids` | array[string] | Liquidações incluídas. |

### Exemplo de chamada

```bash
curl -s "https://open-api.tiktokglobalshop.com/finance/202309/settlements?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER&page_size=20&settlement_date_ge=2024-06-01&settlement_date_lt=2024-06-30" \
  -H "x-tts-access-token: $ACCESS_TOKEN"
```

## Notas & gotchas

- **Settlements são semanais** (ciclo padrão). O ciclo pode variar por região.
- **Transações têm delay** de 24–72h para aparecer no settlement.
- **Fees:** taxa de comissão do TikTok Shop (tipicamente 2–8% dependendo da categoria) + taxa de pagamento.
- Para conciliação contábil, cruze `settlements` com `transactions` e `orders`.
- `net_amount` = `total_amount` - `fee_amount` (aproximado; pode haver ajustes).

## Relevância para o SLEAG

- Dashboard financeiro: receita, taxas, líquido por período.
- Conciliação: exportar settlements + transações para contabilidade.
- Comparar GMV reportado vs settlement efetivo (diferença = chargebacks, ajustes).
