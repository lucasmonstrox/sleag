# Influencer Details - Real-time Interface

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375097500e0) · **`GET /api/v3/realtime/influencer/detail`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz

Busca os dados detalhados de um criador **em tempo real**, indo direto à fonte (TikTok) via `unique_id` (handle TikTok). Diferente do endpoint offline (`/api/v3/echotik/influencer/detail`), traz o estado atual, sem o atraso T+1 — útil para confirmar números no momento exato. Por ser tempo-real, está sujeito a **risk control do TikTok a qualquer momento**: se retornar `code=500`, faça **retry**. Evite QPS alto/rajadas para reduzir bloqueios. Use pontualmente, não para varredura em massa.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `unique_id` | string | Sim | Identifica o criador pelo @handle público do TikTok (ex.: `karladelatorre97`). |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/influencer/detail?unique_id=karladelatorre97" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope real: `{ msg, code, data }` (não o `{ code, message, data, requestId }` dos offline). `code = 0` = sucesso; `code = 500` = risk control → **retry**.

### Campos de `data`
A página declara o schema apenas como `object`; pelo **Example**, `data` traz:

| Campo | Tipo | O que é |
|---|---|---|
| `data.extra` | object | Metadados da resposta: `fatal_item_ids[]`, `logid`, `now` (epoch ms). |
| `data.log_pb` | object | `{ impr_id }` — id de impressão/log do TikTok. |
| `data.status_code` | integer | Código de status interno do TikTok (`0` = ok). |
| `data.status_msg` | string | Mensagem de status. |
| `data.user` | object | **Objeto bruto do usuário do TikTok** (não normalizado pela EchoTik): avatares em vários tamanhos (`avatar_168x168`, `avatar_300x300`, `avatar_larger`, `avatar_medium`, `avatar_thumb`, cada um `{ uri, url_list[], url_prefix }`), `account_type`, `ad_virtual`, e — segundo o objeto user do TikTok — `unique_id`, `nickname`, `signature`, `follower_count`, `following_count`, `aweme_count`, `total_favorited`, etc. |

> O Example vem **truncado**; `data.user` é o objeto user completo do TikTok (dezenas de campos). Inspecione um retorno real para mapear os contadores exatos que o TIKSPY precisa.

### Exemplo de resposta
```json
{
  "msg": "success",
  "code": 0,
  "data": {
    "extra": {
      "fatal_item_ids": [],
      "logid": "2025111110180242E8FC16788589091C58",
      "now": 1762856282000
    },
    "log_pb": { "impr_id": "2025111110180242E8FC16788589091C58" },
    "status_code": 0,
    "status_msg": "",
    "user": {
      "account_type": 0,
      "ad_virtual": false,
      "avatar_168x168": {
        "uri": "tos-useast5-avt-0068-tx/1d409aefb87cd6ba80e3b4d463b5e668",
        "url_list": ["https://p16-sign-va.tiktokcdn.com/.../...webp?...&x-expires=1763028000&x-signature=..."],
        "url_prefix": null
      },
      "avatar_300x300": { "uri": "...", "url_list": ["..."], "url_prefix": null },
      "avatar_larger": { "uri": "...", "url_list": ["..."], "url_prefix": null }
    }
  }
}
```
> (Resposta truncada — `data.user` continua com `avatar_medium`, `avatar_thumb` e o objeto user completo do TikTok.)

## Notas & gotchas
- Envelope `{ msg, code, data }` — **não** o `{ code, message, data, requestId }` dos endpoints offline. `data` aninha `user`.
- `data.user` é o **payload bruto do TikTok**, não normalizado; URLs de avatar trazem `x-expires`/`x-signature` e **expiram**.
- **Risk control:** `code=500` é esperado de tempos em tempos — implemente retry com backoff. Não fazer QPS alto.
- `unique_id` é o handle; aqui não há fallback por `user_id`.

## Relevância para o TIKSPY
- Complementa a ficha de criador com o **número ao vivo** (quando o T+1 não basta, ex.: validar um pico recente).
- Secundário ao fluxo offline; usar sob demanda no detalhe de um criador específico.

---

<details>
<summary>Spec original (OpenAPI 3.0.1)</summary>

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /api/v3/realtime/influencer/detail:
    get:
      summary: Influencer Details - Real-time interface
      deprecated: false
      description: >-
        Retrieve influencer detailed data in real-time via influencer unique_id
        (TikTok ID)


        Note: Real-time interfaces may encounter risk control detection at any
        time. If code=500 is returned, please retry.
      tags:
        - Influencer
      parameters:
        - name: unique_id
          in: query
          description: ''
          required: true
          example: karladelatorre97
          schema:
            type: string
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties: {}
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Influencer
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375097500-run
components:
  schemas: {}
  securitySchemes:
    basic:
      type: http
      scheme: basic
servers:
  - url: ''
    description: 正式环境
security: []
```

</details>
