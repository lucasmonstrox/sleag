# Influencer Follower List - Real-time Interface

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375100891e0) · **`GET /api/v3/realtime/influencer/follower/list`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz

Retorna a lista de seguidores de um criador **em tempo real** via `user_id`, com paginação por cursor (`offset` = `min_time`). É um endpoint ao vivo (não há equivalente offline). Por ser tempo-real, está sujeito a **risk control do TikTok**: se retornar `code=500`, faça **retry**. Não use QPS alto. Indicado para inspeção pontual da audiência de um perfil.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `user_id` | string | Sim | Identifica o criador pelo ID interno (ex.: `6804496986206749701`). Aqui usa `user_id`, não `unique_id`. |
| `offset` | string | Não | Cursor de paginação: usa `min_time` como offset para a próxima página (`0` na primeira). |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/influencer/follower/list?user_id=6804496986206749701&offset=0" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope real: `{ msg, code, data }` (não o `{ code, message, data, requestId }` dos offline). `code = 0` = sucesso; `code = 500` = risk control → **retry**.

### Campos de `data`
A página declara o schema apenas como `object`; pelo **Example**, `data` traz:

| Campo | Tipo | O que é |
|---|---|---|
| `data.extra` | object | Metadados: `fatal_item_ids[]`, `logid`, `now` (epoch ms). |
| `data.followers` | array[object] | Lista de seguidores — cada item é o **objeto user bruto do TikTok** (não normalizado). |
| `followers[]` (campos) | — | Objeto user do TikTok: avatares (`avatar_168x168`, `avatar_300x300`, `avatar_larger`, cada um `{ height, width, uri, url_list[], url_prefix }`), `account_region`, `authority_status`, e — segundo o objeto user — `uid`, `unique_id`, `nickname`, `signature`, contadores, etc. |

> O Example vem **truncado** (mostra só os avatares do primeiro seguidor). Os controles de cursor (`min_time`/`has_more`) referidos na descrição de `offset` não aparecem na porção visível — confirme num retorno real onde vêm. Cada seguidor é o objeto user completo do TikTok.

### Exemplo de resposta
```json
{
  "msg": "success",
  "code": 0,
  "data": {
    "extra": {
      "fatal_item_ids": [],
      "logid": "202511111026538A580F6B142AA40B2109",
      "now": 1762856813000
    },
    "followers": [
      {
        "account_region": "",
        "authority_status": 0,
        "avatar_168x168": {
          "height": 720,
          "uri": "musically-maliva-obj/1594805258216454",
          "url_list": ["https://p77-sign-va-lite.tiktokcdn.com/.../...heic?...&x-expires=1762941600&x-signature=..."],
          "url_prefix": null,
          "width": 720
        }
      }
    ]
  }
}
```
> (Resposta truncada — cada seguidor é o objeto user completo do TikTok.)

## Notas & gotchas
- Envelope `{ msg, code, data }` — **não** o `{ code, message, data, requestId }` dos offline. `data` aninha `followers` (objetos user **brutos** do TikTok).
- **Paginação por `min_time`:** use o `min_time` da resposta anterior como `offset` da próxima página.
- Identificação por `user_id` (numérico em string), não por handle. Avatares trazem `x-expires`/`x-signature` e **expiram**.
- **Risk control:** `code=500` esperado; retry com backoff, sem QPS alto.

## Relevância para o TIKSPY
- Permite explorar a **audiência/seguidores** de um criador na ficha de criador (ex.: amostra de quem o segue).
- Recurso secundário/avançado; provavelmente não compõe o dashboard principal de mercado.

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
  /api/v3/realtime/influencer/follower/list:
    get:
      summary: Influencer Follower List - Real-time Interface
      deprecated: false
      description: >-
        Retrieve the influencer's follower list by influencer's user_id, and use
        offset for pagination.


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
          required: true
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375100891-run
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
