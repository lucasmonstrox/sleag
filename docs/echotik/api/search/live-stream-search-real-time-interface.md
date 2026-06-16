# Busca de Lives (Transmissões) — Interface em Tempo-real

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375375102e0) · **`GET /api/v3/realtime/live/search`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz

Busca, ao vivo, a lista de transmissões (lives) do TikTok a partir de uma palavra-chave. Consulta o índice da EchoTik em tempo-real, sujeita a risk control (`code=500` → retry). Paginação por `offset` (cursor). Endpoint enxuto, sem filtros além de termo e região. Evite QPS alto.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `keyword` | string | Sim | Termo de busca das lives. Ex: `baby`. |
| `region` | string | Sim | Código do país/mercado. Ex: `US`. |
| `offset` | string | Não | Quando `has_more=1`, use o cursor para a próxima página. Ex: `0`. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/live/search?keyword=baby&region=US&offset=0" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope: `{ msg, code, data }` — `code = 0` (HTTP 200) = sucesso. `code=500` = risk control → retry.

### Campos de `data`
A resposta é o payload bruto da busca de lives do TikTok. Note o aninhamento `data.data` (lista).

| Campo | Tipo | O que é |
|---|---|---|
| `status_code` | inteiro | Código de status interno do TikTok (`0` = ok). |
| `data` | array | Lista de resultados de live. Cada item tem `type` + `lives`. |
| `data[].type` | inteiro | Tipo do resultado (ex: `1`). |
| `data[].lives` | objeto | Dados da transmissão: `aweme_id`, `author` (host) e demais campos da live. |
| `data[].lives.aweme_id` | string | ID da live / room (string). |
| `data[].lives.author` | objeto | Host da live: `uid`, `nickname`, `unique_id`, `sec_uid`, `room_id`/`room_id_str`, `room_title` (título da live), `room_cover` (capa da live), avatares (`avatar_thumb`/`avatar_medium`/`avatar_larger`), `custom_verify`, `enterprise_verify_reason`, `follow_status`, `search_user_name`, `search_user_desc`, e demais campos de perfil. |
| `data[].cha_list` | array/null | Hashtags relacionadas (normalmente `null`). |
| `data[].text_extra` | array/null | Marcações de texto da live (normalmente `null`). |

> O Example oficial vem truncado na página (após `text_extra`). Campos como espectadores atuais/status não aparecem no trecho renderizado; o que está confirmado é a estrutura `data[].lives.author` com `room_id`, `room_title`, `room_cover`.

### Exemplo de resposta
```json
{
  "msg": "success",
  "code": 0,
  "data": {
    "status_code": 0,
    "data": [
      {
        "type": 1,
        "lives": {
          "aweme_id": "7571634840607017741",
          "author": {
            "uid": "6856964356615734277",
            "short_id": "0",
            "nickname": "Carrie",
            "avatar_larger": { "url_list": null, "url_prefix": null },
            "avatar_thumb": {
              "uri": "100x100/tos-useast5-avt-0068-tx/f153cdbe9c5955921711157d7bcd16e3",
              "url_list": ["https://p16-common-sign.tiktokcdn-us.com/.../cropcenter:100:100.webp?..."],
              "url_prefix": null
            },
            "avatar_medium": { "url_list": null, "url_prefix": null },
            "follow_status": 0,
            "custom_verify": "",
            "unique_id": "carrietriner",
            "room_id": 7571634840607017741,
            "verify_info": "",
            "enterprise_verify_reason": "",
            "sec_uid": "MS4wLjABAAAAFQEri25puoeeSCIPVbTAd6NB2Mp6tJ3fSai_Cx7xz6lpApHnAJ4zI5vBYzcYv-mV",
            "name_field": "nickname",
            "search_user_name": "Carrie",
            "search_user_desc": "carrietriner",
            "room_cover": {
              "uri": "tos-alisg-i-6sfwe43m1g-sg/e7770c4dd0fd4f7f8ee8fbc224ea8468.jpeg",
              "url_list": ["https://p16-common-sign.tiktokcdn-us.com/.../live_cover...cropcenter:500:800.jpeg?..."],
              "url_prefix": null
            },
            "room_title": "Reborn Baby Assembly",
            "room_id_str": "7571634840607017741",
            "account_labels": null
          },
          "cha_list": null,
          "text_extra": null
        }
      }
    ]
  }
}
```

## Notas & gotchas
- Tempo-real: `code=500` → retry; sem QPS alto.
- Envelope é `{ msg, code, data }` (sem `requestId`).
- Atenção ao aninhamento: a lista de lives está em `data.data[]`, não em `data[]`.
- `offset` é cursor, **não** `page_num`.
- `room_id` vem como número grande (int64) — prefira `room_id_str`/`aweme_id` no front para não perder precisão.
- Por ser live (estado volátil), os resultados refletem o momento da chamada — sem histórico.
- URLs de avatar/capa são assinadas e expiram (`x-expires`).

## Relevância para o SLEAG
- Alimenta pesquisa de lives (descobrir transmissões ativas em torno de um termo/nicho).
- Secundário em relação a produto/criador; útil para monitoramento de lives de venda em tempo-real.

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
  /api/v3/realtime/live/search:
    get:
      summary: Live Stream Search - Real-time Interface
      deprecated: false
      description: >-
        Search the live stream list in real time using keywords, and use offset
        to paginate the next time.


        Note: Real-time APIs may encounter risk control checks at any time. If a
        code=500 is returned, please retry.
      tags:
        - Search
      parameters:
        - name: keyword
          in: query
          description: ''
          required: true
          example: baby
          schema:
            type: string
        - name: region
          in: query
          description: ''
          required: true
          example: US
          schema:
            type: string
        - name: offset
          in: query
          description: When has_more=1, use the cursor for the next pagination.
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
      x-apifox-folder: Search
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375375102-run
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
