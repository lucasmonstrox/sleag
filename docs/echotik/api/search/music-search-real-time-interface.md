# Busca de Músicas — Interface em Tempo-real

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375363030e0) · **`GET /api/v3/realtime/music/search`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz

Busca, ao vivo, as músicas/áudios usados em vídeos do TikTok a partir de uma palavra-chave. Consulta o índice da EchoTik em tempo-real, sujeita a risk control (`code=500` → retry). Permite filtrar o termo por título da música ou nome do criador e ordenar por popularidade/recência/duração. Paginação por `offset` (cursor). Evite QPS alto.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `keyword` | string | Sim | Termo de busca (texto a procurar entre músicas/criadores). Ex: `baby`. |
| `region` | string | Sim | Código do país/mercado. Ex: `US`. |
| `filter_by` | string | Não | Tipo de filtro do termo de busca: `0`=sem filtro, `1`=filtrar títulos de músicas, `2`=filtrar nomes de criadores. |
| `sort_type` | string | Não | Ordenação: `0`=relevância, `1`=mais usadas, `2`=usadas recentemente, `3`=menor duração, `4`=maior duração. |
| `offset` | string | Não | Campo de paginação. Use o cursor para a próxima página quando `has_more=1`. Ex: `0`. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/music/search?keyword=baby&region=US&filter_by=0&sort_type=1&offset=0" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope: `{ msg, code, data }` — `code = 0` (HTTP 200) = sucesso. `code=500` = risk control → retry.

### Campos de `data`
A resposta é o payload bruto da busca de músicas do TikTok. Campos:

| Campo | Tipo | O que é |
|---|---|---|
| `status_code` | inteiro | Código de status interno do TikTok (`0` = ok). |
| `music` | array | Lista de músicas/áudios encontrados. |
| `music[].id` | inteiro | ID numérico da música. |
| `music[].id_str` | string | ID da música como string (use esta para evitar perda de precisão em JS). |
| `music[].title` | string | Título do áudio (ex: `original sound - missy_shanela_prtty`). |
| `music[].author` | string | Autor/criador do áudio. |
| `music[].album` | string | Nome do álbum (pode vir vazio). |
| `music[].cover_large` | objeto | Capa grande: `{ uri, url_list, width, height, url_prefix }`. |
| `music[].cover_medium` | objeto | Capa média (mesmo formato). |
| `music[].cover_thumb` | objeto | Capa miniatura (mesmo formato). |
| `music[].play_url` | objeto | URL de reprodução do áudio: `{ uri, url_list (mp3), width, height, url_prefix }`. |
| `music[].source_platform` | inteiro | Plataforma de origem do áudio (ex: `24`). |
| `music[].duration` | inteiro | Duração do áudio em segundos. |
| `music[].extra` | string | Metadados adicionais serializados em JSON (string). |

> O Example oficial vem truncado na página (campo `extra` em diante). Demais campos por música seguem o schema padrão de música do TikTok; os listados acima são os confirmados pelo Example renderizado.

### Exemplo de resposta
```json
{
  "msg": "success",
  "code": 0,
  "data": {
    "status_code": 0,
    "music": [
      {
        "id": 7177934303425579803,
        "id_str": "7177934303425579803",
        "title": "original sound - missy_shanela_prtty",
        "author": "cute _girl",
        "album": "",
        "cover_large": {
          "uri": "tos-useast2a-avt-0068-giso/ee652e1204d0534df89957f50e280559",
          "url_list": ["https://p19-common-sign-useastred.tiktokcdn-eu.com/.../cropcenter:1080:1080.webp?..."],
          "width": 720,
          "height": 720,
          "url_prefix": null
        },
        "cover_medium": {
          "uri": "tos-useast2a-avt-0068-giso/ee652e1204d0534df89957f50e280559",
          "url_list": ["https://p19-common-sign-useastred.tiktokcdn-eu.com/.../cropcenter:100:100.webp?..."],
          "width": 720,
          "height": 720,
          "url_prefix": null
        },
        "cover_thumb": {
          "uri": "tos-useast2a-avt-0068-giso/ee652e1204d0534df89957f50e280559",
          "url_list": ["https://p19-common-sign-useastred.tiktokcdn-eu.com/.../cropcenter:100:100.webp?..."],
          "width": 720,
          "height": 720,
          "url_prefix": null
        },
        "play_url": {
          "uri": "https://sf16-ies-music.tiktokcdn.com/obj/ies-music-aiso/7177934323432098587.mp3",
          "url_list": ["https://sf16-ies-music.tiktokcdn.com/obj/ies-music-aiso/7177934323432098587.mp3"],
          "width": 720,
          "height": 720,
          "url_prefix": null
        },
        "source_platform": 24,
        "duration": 20,
        "extra": "{\"aed...\"}"
      }
    ]
  }
}
```

## Notas & gotchas
- Tempo-real: `code=500` → retry; sem QPS alto.
- Envelope é `{ msg, code, data }` (sem `requestId`).
- `offset` é cursor, **não** `page_num`.
- `id` vem como número grande (int64) — use `id_str` no front para não perder precisão em JavaScript.
- `filter_by` e `sort_type` mudam significativamente o resultado: para descobrir música em alta use `sort_type=1` (mais usadas).
- URLs de capa/áudio são assinadas e expiram (`x-expires`); não cacheie a URL crua.
- `extra` é uma string JSON (precisa de segundo parse).

## Relevância para o TIKSPY
- Alimenta pesquisa de músicas/áudios (descobrir trilhas em alta para criativos).
- Secundário em relação a produto/criador: útil para análise de tendências sonoras, não é métrica nº 1 do dashboard.

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
  /api/v3/realtime/music/search:
    get:
      summary: Music Search - Real-time Interface
      deprecated: false
      description: >-
        Search video music in real-time using keywords, use offset for the next
        pagination


        Note: Real-time interfaces may encounter risk control detection at any
        time. If code=500 is returned, please retry.
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
        - name: filter_by
          in: query
          description: >-
            Search term filter type, 0=No filtering 1=Filter music titles
            2=Filter creator names
          required: false
          example: '0'
          schema:
            type: string
        - name: sort_type
          in: query
          description: >-
            Sort type, 0=Relevance 1=Most used 2=Recently used 3=Shortest
            duration 4=Longest duration
          required: false
          example: '0'
          schema:
            type: string
        - name: offset
          in: query
          description: Pagination field, use cursor for the next page when has_more=1
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375363030-run
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
