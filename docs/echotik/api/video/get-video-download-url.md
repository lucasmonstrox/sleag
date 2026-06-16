# Get video download url

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/416699376e0) · **`GET /api/v3/realtime/video/download-url`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz
A partir da URL do vídeo (link do site `tiktok.com/...` ou link curto de compartilhamento `vt.tiktok.com/...`), resolve **ao vivo** os endereços de mídia do vídeo: capa, capa dinâmica (animada), URL de reprodução, URL de download e URL de download sem marca d'água. É o endpoint para obter mídia estável (em vez de usar os `reflow_cover`/`play_addr` dos outros endpoints, que expiram). Por ser real-time, vai ao TikTok no momento.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `url` | string | Sim | URL do vídeo a resolver. Aceita os dois formatos: link curto `https://vt.tiktok.com/ZShA8F5de/` ou link completo `https://www.tiktok.com/@user/video/7377855725290179873`. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/video/download-url?url=https://vt.tiktok.com/ZShA8F5de/" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope real: `{ code, message, data, requestId }` — `code = 0` = sucesso (aqui o `message` de sucesso vem como `"ok"`). `data` é um objeto único.

### Campos de `data`
| Campo | Tipo | Obrig. | O que é |
|---|---|---|---|
| `cover_url` | string | — | URL da capa estática (thumbnail) do vídeo. |
| `play_url` | string | — | URL de streaming/reprodução do vídeo. |
| `download_url` | string | — | URL de download do arquivo de vídeo (variante com marca d'água). |
| `no_watermark_download_url` | string | — | URL de download do vídeo **sem marca d'água**. |
| `dynamic_cover_url` | string | — | URL da capa dinâmica/animada (preview em movimento). |
| `video_id` | string | — | ID do vídeo resolvido a partir da URL. |

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "cover_url": "https://p19-common-sign-useastred.tiktokcdn-eu.com/.../...heic?...&x-expires=1770519600&x-signature=...&item=7377855725290179873",
    "play_url": "https://v19-perf.tiktokcdn-eu.com/.../?...&mime_type=video_mp4...",
    "download_url": "https://v19-perf.tiktokcdn-eu.com/.../?...&mime_type=video_mp4...",
    "no_watermark_download_url": "https://v19-perf.tiktokcdn-eu.com/.../?...&mime_type=video_mp4...",
    "dynamic_cover_url": "https://p19-common-sign-useastred.tiktokcdn-eu.com/...~tplv-tiktokx-origin.image?...&x-expires=1770519600&x-signature=...",
    "video_id": "7377855725290179873"
  },
  "requestId": "c728bf41-118f-4136-92db-d9ee616e9968"
}
```

## Notas & gotchas
- Todas as URLs retornadas são **assinadas e expiram** (parâmetros `x-expires`/`x-signature` no link do CDN do TikTok) — baixe/persista logo após resolver.
- `data` aqui é um **objeto único**, não array (diferente dos endpoints de lista).
- Aceita tanto link curto (`vt.tiktok.com`) quanto completo (`www.tiktok.com/@user/video/ID`).
- Real-time: sujeito a risk control; em erro, retry.

## Relevância para o SLEAG
- Resolve as capas/vídeos que os outros endpoints entregam como links expiráveis (`reflow_cover`, `avatar`, `play_addr`) — é o caminho oficial para exibir/armazenar a mídia dos criativos com estabilidade.
- `no_watermark_download_url` e `dynamic_cover_url` permitem previews ricos (capa animada) nos cards de "Criativos em alta" e na página de detalhe do vídeo.

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
  /api/v3/realtime/video/download-url:
    get:
      summary: Get video download url
      deprecated: false
      description: >-
        Obtain the cover, playback, download addresses of the video through the
        URL address on the web side or the video sharing address on the app
        side.
      tags:
        - Video
      parameters:
        - name: url
          in: query
          description: >-
            Can support the two formats: https://vt.tiktok.com/ZShA8F5de/ or
            https://www.tiktok.com/@soraryx_/video/7377855725290179873
          required: true
          example: https://vt.tiktok.com/ZShA8F5de/
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
              example:
                code: 0
                message: ok
                data:
                  cover_url: >-
                    https://p19-common-sign-useastred.tiktokcdn-eu.com/tos-useast2a-p-0037-euttp/b0ba71f6b8074b37aee9b7f6db92cae9_1717790908~tplv-tiktokx-cropcenter-q:300:400:q72.heic?dr=9232&refresh_token=abe0094d&x-expires=1770519600&x-signature=d8%2F%2FVZMQcu4DTo6TlrrxCIBhPto%3D&t=bacd0480&ps=933b5bde&shp=d05b14bd&shcp=1d1a97fc&idc=no1a&biz_tag=tt_video&s=AWEME_DETAIL&sc=cover&item=7377855725290179873
                  play_url: >-
                    https://v19-perf.tiktokcdn-eu.com/b7d29c3456e5ed37f4560278aabb6661/69880955/video/tos/no1a/tos-no1a-ve-68c710-no/oIjGCEpEREfAMPhfh9IQq7DmuJVFEDg2BQYiaY/?a=1233&bti=OTg7QGo5QHM6OjZALTAzYCMvcCMxNDNg&ch=0&cr=13&dr=0&er=0&lr=all&net=0&cd=0%7C0%7C0%7C&cv=1&br=2658&bt=1329&cs=0&ds=6&ft=e_YlkGmrdPWsuNvjVXpla~zfuC01HowkaYlc&mime_type=video_mp4&qs=0&rc=OzwzNGkzOTY6NjZnZTo1M0BpajVmdGo5cjtwczMzZjczM0BiMzY2M2JiX18xL141YTItYSNeYGtzMmQ0ZWVgLS1kMWNzcw%3D%3D&vvpl=1&l=202602070355362289277E9383C31E1303&btag=e000b8000
                  download_url: >-
                    https://v19-perf.tiktokcdn-eu.com/b3470f0456b9b79ed35e7a3fd605ffef/69880955/video/tos/no1a/tos-no1a-ve-68c710-no/oACjgfiExqR7QEYICBFmAaVDQVPoED5Mf2YEGh/?a=1233&bti=OTg7QGo5QHM6OjZALTAzYCMvcCMxNDNg&ch=0&cr=13&dr=0&er=0&lr=all&net=0&cd=0%7C0%7C0%7C&cv=1&br=2680&bt=1340&cs=0&ds=3&ft=e_YlkGmrdPWsuNvjVXpla~zfuC01HowkaYlc&mime_type=video_mp4&qs=0&rc=PGlpODk1ZWdlNGc0NmRlO0BpajVmdGo5cjtwczMzZjczM0AtLTQ1L2I1NmExMmIvY2MyYSNeYGtzMmQ0ZWVgLS1kMWNzcw%3D%3D&vvpl=1&l=202602070355362289277E9383C31E1303&btag=e000b8000
                  no_watermark_download_url: >-
                    https://v19-perf.tiktokcdn-eu.com/b7d29c3456e5ed37f4560278aabb6661/69880955/video/tos/no1a/tos-no1a-ve-68c710-no/oIjGCEpEREfAMPhfh9IQq7DmuJVFEDg2BQYiaY/?a=1233&bti=OTg7QGo5QHM6OjZALTAzYCMvcCMxNDNg&ch=0&cr=13&dr=0&er=0&lr=all&net=0&cd=0%7C0%7C0%7C&cv=1&br=2658&bt=1329&cs=0&ds=6&ft=e_YlkGmrdPWsuNvjVXpla~zfuC01HowkaYlc&mime_type=video_mp4&qs=0&rc=OzwzNGkzOTY6NjZnZTo1M0BpajVmdGo5cjtwczMzZjczM0BiMzY2M2JiX18xL141YTItYSNeYGtzMmQ0ZWVgLS1kMWNzcw%3D%3D&vvpl=1&l=202602070355362289277E9383C31E1303&btag=e000b8000
                  dynamic_cover_url: >-
                    https://p19-common-sign-useastred.tiktokcdn-eu.com/tos-useast2a-p-0037-euttp/d96e01b11c794dabb39979d23fe07b3e_1717790908~tplv-tiktokx-origin.image?dr=9229&refresh_token=e4837cb9&x-expires=1770519600&x-signature=VLRVj%2Bn%2F72A7T3jvqaggN21C9Fc%3D&t=bacd0480&ps=4f5296ae&shp=d05b14bd&shcp=1d1a97fc&idc=no1a&biz_tag=tt_video&s=AWEME_DETAIL&sc=dynamic_cover&item=7377855725290179873
                  video_id: '7377855725290179873'
                requestId: c728bf41-118f-4136-92db-d9ee616e9968
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Video
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-416699376-run
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
