# Perfil e Performance da Loja

> **Fonte:** TikTok Shop Partner Center · **`/shop/202309/`** · **Auth:** `x-tts-access-token`

## GET /shop/202309/shops/{shop_cipher} — Perfil da Loja

Retorna os dados cadastrais da loja: nome, região, status de verificação, categorias habilitadas e configurações.

### Query params padrão: `app_key`, `sign`, `shop_cipher`

### Response

| Campo | Tipo | O que é |
|---|---|---|
| `cipher` | string | Shop cipher. |
| `code` | string | Código da loja. |
| `name` | string | Nome da loja. |
| `region` | string | Região (ex.: `BR`). |
| `type` | string | `Local` ou `Cross-border`. |
| `status` | string | `ACTIVATE`, `SUSPENDED`, `DEACTIVATED`. |
| `seller_name` | string | Nome do seller. |
| `seller_email` | string | Email do seller. |
| `warehouses` | array[object] | Warehouses configurados: `[{ warehouse_id, name, address }]`. |
| `categories_enabled` | array[string] | IDs de categorias habilitadas. |
| `create_time` | integer | Timestamp. |

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "cipher": "ROW_abc123...",
    "code": "BR123456",
    "name": "Minha Loja BR",
    "region": "BR",
    "type": "Local",
    "status": "ACTIVATE",
    "seller_name": "João Silva ME",
    "seller_email": "joao@sleag.com.br",
    "warehouses": [
      { "warehouse_id": "WH_BR_001", "name": "Estoque Principal", "address": { "city": "São Paulo", "region_code": "BR" } }
    ],
    "categories_enabled": ["600001", "610000"],
    "create_time": 1700000000
  }
}
```

---

## GET /shop/202309/shops/{shop_cipher}/performance — Performance

Retorna métricas de desempenho da loja: GMV, pedidos, taxa de cancelamento, avaliação e penalidades.

### Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `app_key` | string | Sim | — |
| `sign` | string | Sim | — |
| `shop_cipher` | string | Sim | — |
| `period` | string | Não | `LAST_7_DAYS`, `LAST_30_DAYS`, `LAST_90_DAYS`. Default: `LAST_30_DAYS`. |

### Response

| Campo | Tipo | O que é |
|---|---|---|
| `gmv` | object | GMV do período: `{ amount, currency }`. |
| `order_count` | integer | Número de pedidos. |
| `cancellation_rate` | number | Taxa de cancelamento (0.0–1.0). ⚠️ Meta < 2%. |
| `return_rate` | number | Taxa de devolução (0.0–1.0). |
| `shop_rating` | number | Nota da loja (1.0–5.0). |
| `response_rate` | number | Taxa de resposta a mensagens (0.0–1.0). |
| `on_time_delivery_rate` | number | Entregas no prazo (0.0–1.0). |
| `violations` | array[object] | Penalidades ativas: `[{ type, description, severity, effective_date }]`. |
| `performance_tier` | string | `EXCELLENT`, `GOOD`, `FAIR`, `POOR`, `AT_RISK`. |

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "gmv": { "amount": "52340.75", "currency": "BRL" },
    "order_count": 256,
    "cancellation_rate": 0.015,
    "return_rate": 0.03,
    "shop_rating": 4.7,
    "response_rate": 0.92,
    "on_time_delivery_rate": 0.88,
    "violations": [],
    "performance_tier": "GOOD"
  }
}
```

---

## Notas & gotchas

- **Métricas são janeladas** — `performance` reflete o `period` solicitado. Não são acumuladas vitalícias.
- **Shop rating** abaixo de 4.0 e **cancellation rate** acima de 2% podem gerar penalidades.
- **Violations** incluem infrações de política, produtos rejeitados, atrasos. Acumulam pontos que podem suspender a loja.
- O `performance_tier` afeta visibilidade na plataforma e acesso a features (ex.: Flash Deals).

## Relevância para o SLEAG

- Cards KPIs (GMV, pedidos, avaliação) na home do dashboard da loja.
- Alertas quando métricas cruzam thresholds de risco (ex.: `cancellation_rate > 0.02`).
- Acompanhamento de `violations` para ação corretiva.
