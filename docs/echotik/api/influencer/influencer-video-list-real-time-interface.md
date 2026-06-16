# Influencer Video List - Real-time Interface

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375098643e0) · **`GET /api/v3/realtime/influencer/video/list`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz

Retorna a lista de vídeos de um criador **em tempo real** via `unique_id` (handle TikTok), com paginação por cursor (`offset`/`max_cursor`). É a versão ao vivo do `/api/v3/echotik/influencer/video/list` offline. Por ser tempo-real, está sujeito a **risk control do TikTok**: se retornar `code=500`, faça **retry**. Não use QPS alto. Indicado para checar os vídeos mais recentes de um perfil sem esperar o T+1.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `unique_id` | string | Sim | Identifica o criador pelo @handle público do TikTok (ex.: `karladelatorre97`). |
| `offset` | string | Não | Cursor de paginação: a próxima página usa o `max_cursor` retornado pela resposta anterior (`0` na primeira). |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/influencer/video/list?unique_id=karladelatorre97&offset=0" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope real: `{ msg, code, data }` (não o `{ code, message, data, requestId }` dos offline). `code = 0` = sucesso; `code = 500` = risk control → **retry**.

### Campos de `data`
A página declara o schema apenas como `object`; pelo **Example**, `data` traz:

| Campo | Tipo | O que é |
|---|---|---|
| `data.status_code` | integer | Código de status interno do TikTok (`0` = ok). |
| `data.min_cursor` | integer | Cursor mínimo da janela retornada (epoch ms). |
| `data.max_cursor` | integer | Cursor máximo — **reenviar em `offset`** para a próxima página. |
| `data.has_more` | integer | `1` = há mais páginas, `0` = fim. |
| `data.aweme_list` | array[object] | Lista de vídeos (objetos `aweme` **brutos** do TikTok). |
| `aweme_list[].aweme_id` | string | ID do vídeo. |
| `aweme_list[].desc` | string | Legenda/descrição do vídeo. |
| `aweme_list[].create_time` | integer | Timestamp Unix (segundos) da publicação. |
| `aweme_list[].author` | object | Objeto bruto do autor (TikTok): `uid`, `nickname`, `signature`, avatares (`avatar_larger`, `avatar_thumb`, `avatar_medium`), etc. |

> O Example vem **truncado**; cada item de `aweme_list` é o objeto aweme completo do TikTok (vídeo, música, estatísticas, produtos). Inspecione um retorno real para os contadores exatos.

### Exemplo de resposta
```json
{
  "msg": "success",
  "code": 0,
  "data": {
    "status_code": 0,
    "min_cursor": 1762556950000,
    "max_cursor": 1760464682000,
    "has_more": 1,
    "aweme_list": [
      {
        "aweme_id": "7519913633019694391",
        "desc": "Aquí mi reacción al saber que estaba embarazada ❤️🫶🏻 @Mireya de la Torre ",
        "create_time": 1750866348,
        "author": {
          "uid": "6804496986206749701",
          "nickname": "Karleshion",
          "signature": "De Jalisco🇲🇽/A Kansas🇺🇸\nkdelatorre@compastudios.com",
          "avatar_larger": {
            "uri": "tos-maliva-avt-0068/1d409aefb87cd6ba80e3b4d463b5e668",
            "url_list": ["https://p16-sign-va.tiktokcdn.com/.../...heic?...&x-expires=1762941600&x-signature=..."],
            "width": 720,
            "height": 720,
            "url_prefix": null
          }
        }
      }
    ]
  }
}
```
> (Resposta truncada — cada item de `aweme_list` continua com o objeto aweme completo.)

## Notas & gotchas
- Envelope `{ msg, code, data }` — **não** o `{ code, message, data, requestId }` dos offline. `data` aninha `aweme_list` (objetos aweme **brutos** do TikTok).
- **Paginação por cursor:** reenvie o `max_cursor` da resposta anterior como `offset` da próxima; leia `has_more`.
- `create_time` é **integer** (segundos). URLs de mídia trazem `x-expires`/`x-signature` e **expiram**.
- **Risk control:** `code=500` é esperado; faça retry com backoff. Sem QPS alto.

## Relevância para o SLEAG
- Permite mostrar os **vídeos mais recentes ao vivo** de um criador na ficha de criador, sem o atraso T+1.
- Secundário ao fluxo offline (que tem métricas estruturadas); usar para "últimos posts" em tempo-real.

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
  /api/v3/realtime/influencer/video/list:
    get:
      summary: Influencer Video List - Real-time Interface
      deprecated: false
      description: >-
        Retrieve the influencer video list via the influencer's unique_id, and
        pagination queries can be performed using offset.


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
        - name: offset
          in: query
          description: The next pagination will use max_cursor
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375098643-run
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
