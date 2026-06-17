# Listar Lojas Autorizadas

> **Fonte:** TikTok Shop Partner Center · **`GET /authorization/202309/shops`** · **Auth:** `x-tts-access-token`

## O que faz

Retorna todas as lojas que o seller autorizou para o seu app. Cada loja vem com seu `shop_cipher` — identificador obrigatório em toda chamada de negócio subsequente (produtos, pedidos, logística, etc.). Um seller pode ter múltiplas lojas em regiões diferentes.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `x-tts-access-token` | Sim | Access token obtido via OAuth |

### Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `app_key` | string | Sim | App Key do Partner Center |
| `sign` | string | Sim | Assinatura HMAC-SHA256 do request |

### Exemplo de chamada

```bash
curl -s "https://open-api.tiktokglobalshop.com/authorization/202309/shops?app_key=$APP_KEY&sign=$SIGN" \
  -H "x-tts-access-token: $ACCESS_TOKEN"
```

## Response

### Campos de `data[]` (array de shops)

| Campo | Tipo | O que é |
|---|---|---|
| `cipher` | string | **Shop cipher** — identificador da loja para todas as chamadas de negócio. |
| `code` | string | Código da loja (ex.: `US123456`). |
| `name` | string | Nome da loja no TikTok Shop. |
| `region` | string | Código da região (ex.: `US`, `GB`, `BR`, `ID`, `TH`). |
| `type` | string | Tipo de loja: `Local` (loja local) ou `Cross-border` (cross-border). |

### Exemplo de resposta

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "cipher": "ROW_abc123...",
      "code": "US987654",
      "name": "My US Store",
      "region": "US",
      "type": "Cross-border"
    },
    {
      "cipher": "ROW_def456...",
      "code": "BR123456",
      "name": "Minha Loja BR",
      "region": "BR",
      "type": "Local"
    }
  ]
}
```

## Notas & gotchas

- Guarde o `cipher` por loja no banco — é a chave estrangeira para todas as operações de negócio.
- Um seller pode autorizar e depois desautorizar lojas. O webhook `SELLER_DEAUTHORIZATION` avisa quando uma loja é removida.
- Lojas cross-border vs locais podem ter capacidades diferentes de API (ex.: algumas regiões não suportam FBT).
- Em sandbox, crie lojas de teste no Partner Center para obter ciphers de sandbox.

## Relevância para o SLEAG

- Primeiro endpoint chamado após conclusão do OAuth. Popula a tabela de lojas do seller.
- O `cipher` é usado como `shop_cipher` em todos os endpoints de produto, pedido, logística e financeiro.
