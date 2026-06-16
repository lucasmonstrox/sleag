# Influencer Following List - Real-time Interface

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375101494e0) · **`GET /api/v3/realtime/influencer/following/list`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz

Retorna a lista de contas que um criador **segue** (following), **em tempo real**, via `user_id`, com paginação por cursor (`offset` = `min_time`). É o espelho do endpoint de seguidores (follower/list), mas para quem o criador segue. Por ser tempo-real, está sujeito a **risk control do TikTok**: se retornar `code=500`, faça **retry**. Não use QPS alto. Aqui `offset` é opcional (default = início da lista).

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `user_id` | string | Sim | Identifica o criador pelo ID interno (ex.: `6804496986206749701`). |
| `offset` | string | Não | Cursor de paginação: usa `min_time` da resposta anterior (`0` na primeira). |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/influencer/following/list?user_id=6804496986206749701&offset=0" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope real: `{ msg, code, data }` (não o `{ code, message, data, requestId }` dos offline). `code = 0` = sucesso; `code = 500` = risk control → **retry**. Espelha o follower/list, mas a lista é `followings`.

### Campos de `data`
A página declara o schema apenas como `object`; pelo **Example**, `data` traz:

| Campo | Tipo | O que é |
|---|---|---|
| `data.extra` | object | Metadados: `fatal_item_ids[]`, `logid`, `now` (epoch ms). |
| `data.followings` | array[object] | Lista de contas que o criador segue — cada item é o **objeto user bruto do TikTok** (não normalizado). |
| `followings[]` (campos) | — | Objeto user do TikTok: avatares (`avatar_168x168`, `avatar_300x300`, `avatar_larger`, cada um `{ height, width, uri, url_list[], url_prefix }`), `account_region`, `authority_status`, e — segundo o objeto user — `uid`, `unique_id`, `nickname`, `signature`, etc. |

> O Example vem **truncado** (mostra só os avatares do primeiro item). Os controles de cursor (`min_time`/`has_more`) referidos na descrição de `offset` não aparecem na porção visível — confirme num retorno real onde vêm.

### Exemplo de resposta
```json
{
  "msg": "success",
  "code": 0,
  "data": {
    "extra": {
      "fatal_item_ids": [],
      "logid": "20251111103000608ECDE6C551DC0A989A",
      "now": 1762857000000
    },
    "followings": [
      {
        "account_region": "",
        "authority_status": 0,
        "avatar_168x168": {
          "height": 720,
          "uri": "tos-maliva-avt-0068/18564e8f639884cba8bfe8fafffc11b0",
          "url_list": ["https://p77-sign-va.tiktokcdn.com/.../...heic?...&x-expires=1762941600&x-signature=..."],
          "url_prefix": null,
          "width": 720
        }
      }
    ]
  }
}
```
> (Resposta truncada — cada item é o objeto user completo do TikTok.)

## Notas & gotchas
- Envelope `{ msg, code, data }` — **não** o `{ code, message, data, requestId }` dos offline. `data` aninha `followings` (objetos user **brutos** do TikTok). É o espelho do follower/list.
- **Paginação por `min_time`** (cursor), não por número de página.
- Identificação por `user_id`. Avatares trazem `x-expires`/`x-signature` e **expiram**.
- **Risk control:** `code=500` esperado; retry com backoff, sem QPS alto.

## Relevância para o SLEAG
- Mostra **quem um criador segue** na ficha de criador — útil para mapear rede/relacionamentos entre criadores.
- Recurso secundário/avançado; não compõe o dashboard principal.

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
  /api/v3/realtime/influencer/following/list:
    get:
      summary: Influencer Following List - Real-time Interface
      deprecated: false
      description: >-
        Retrieve the influencer's following list using their user_id; pagination
        can be performed using offset.


        Note: Real-time APIs may encounter risk control checks at any time. If a
        code=500 is returned, please retry.
      tags:
        - Influencer
      parameters:
        - name: user_id
          in: query
          description: ''
          required: true
          example: '6804496986206749701'
          schema:
            type: string
        - name: offset
          in: query
          description: min_time is used as the offset for pagination.
          required: false
          example: '0'
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375101494-run
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
