# Video Text and Subtitle Extraction - Real-time Interface

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375107003e0) · **`GET /api/v3/realtime/video/captions`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz
Extrai **ao vivo** o texto/legendas (transcrição) de um vídeo do TikTok a partir do `video_id`, podendo devolver scripts em vários idiomas. Use para obter o roteiro falado de um criativo (útil para análise de copy, hooks e tradução). Por ser real-time, vai ao TikTok no momento e está sujeita a **risk control**: se vier `code=500`, **repita (retry)**. Não dispare com QPS alto.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `video_id` | string | Sim | ID do vídeo no TikTok cujas legendas/texto se quer extrair (ex.: `7563511121240395022`). |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/video/captions?video_id=7563511121240395022" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope real: `{ msg, code, data }` (não o `{ code, message, data, requestId }` dos offline). `code = 0` = sucesso; `code = 500` = risk control → **retry**. `data` é um **array**, um item por idioma.

### Campos de `data`
A página declara o schema apenas como `object`; pelo **Example**, `data` é uma lista de objetos:

| Campo | Tipo | O que é |
|---|---|---|
| `data[].data` | string | Transcrição completa no formato **WebVTT** (cabeçalho `WEBVTT` + blocos `start --> end` com o texto). Aninhamento `data.data`. |
| `data[].lang` | string | Idioma do script (ex.: `eng-US`). Multilíngue: vários itens, um por idioma. |

### Exemplo de resposta
```json
{
  "msg": "success",
  "code": 0,
  "data": [
    {
      "data": "WEBVTT\n\n\n00:00:00.060 --> 00:00:03.500\nIt's Thursday, which means it's time to take care of the bathrooms.\n\n00:00:03.501 --> 00:00:05.781\nWipe those mirrors down, clean your toilet,\n\n00:00:05.782 --> 00:00:08.341\nbath sink, vacuum and mop the floor.\n",
      "lang": "eng-US"
    }
  ]
}
```

## Notas & gotchas
- Envelope `{ msg, code, data }` e **aninhamento `data.data`**: o campo de texto vem dentro de `data[i].data`.
- O texto é **WebVTT** (com timestamps `start --> end`), não texto puro — parseie para extrair só as linhas faladas.
- Multilíngue: a mesma chamada pode trazer vários itens (`lang`) com scripts em idiomas diferentes. Pode vir vazio para vídeos sem fala/legenda detectável.
- `code=500` = risk control → retry com backoff. Sem QPS alto.

## Relevância para o TIKSPY
- Alimenta análise de copy dos criativos: extrair hooks, CTAs e estrutura de roteiro dos vídeos em alta para inspirar/replicar.
- Base para features de tradução e busca por texto falado dentro de vídeos.

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
  /api/v3/realtime/video/captions:
    get:
      summary: Video Text and Subtitle Extraction - Real-time Interface
      deprecated: false
      description: >-
        The API retrieves video text data in real time via video ID and may
        return multilingual scripts.


        Note: Real-time APIs may encounter risk control checks at any time. If a
        code=500 is returned, please retry.
      tags:
        - Video
      parameters:
        - name: video_id
          in: query
          description: ''
          required: true
          example: '7563511121240395022'
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
      x-apifox-folder: Video
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375107003-run
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
