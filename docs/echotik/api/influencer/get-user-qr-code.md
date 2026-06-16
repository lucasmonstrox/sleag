# Get user QR code

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/416700818e0) · **`GET /api/v3/realtime/influencer/generate/qr-code`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz

Gera o **QR code da página inicial** (perfil) de um criador a partir do `user_id`. Retorna os links de imagem do QR code hospedados no CDN do TikTok (formatos `.webp` e `.jpeg`). Útil para exibir/baixar um QR que leva ao perfil do criador. É um endpoint em tempo-real (rota `/realtime/`) que delega ao TikTok; embora a descrição não cite risk control explicitamente, trate como os demais tempo-real (retry em `code=500`, sem QPS alto).

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `user_id` | string | Sim | Define de qual criador gerar o QR code do perfil (ID interno, ex.: `6865486669187171334`). |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/influencer/generate/qr-code?user_id=6865486669187171334" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope real: `{ code, message, data, requestId }` — `code = 0` = sucesso (no exemplo, `message` vem como `"ok"`). `code = 500` = risk control → **retry**.

### Campos de `data`
| Campo | Tipo | O que é |
|---|---|---|
| `extra` | object | Metadados da resposta do TikTok. |
| `extra.fatal_item_ids` | array | IDs com falha fatal (vazio em sucesso). |
| `extra.logid` | string | ID de log da requisição no TikTok (debug). |
| `extra.now` | integer | Timestamp Unix em ms do processamento no servidor. |
| `log_pb` | object | Metadados de logging do TikTok. |
| `log_pb.impr_id` | string | ID de impressão (rastreamento interno do TikTok). |
| `qrcode_url` | object | Objeto com os dados do QR code gerado. |
| `qrcode_url.uri` | string | URI relativa do recurso QR no TikTok (ex.: `tikcode-tx/7603966499316826125`). |
| `qrcode_url.url_list` | array(string) | Lista de URLs completas da imagem do QR code (CDN TikTok; variações `.webp`/`.jpeg`). **As URLs expiram** (`x-expires`/`x-signature`). |
| `status_code` | integer | Código de status do TikTok (`0` = ok). |
| `status_msg` | string | Mensagem de status do TikTok (vazia em sucesso). |

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "extra": {
      "fatal_item_ids": [],
      "logid": "20260207035334D261DF9724360636BB19",
      "now": 1770436414000
    },
    "log_pb": { "impr_id": "20260207035334D261DF9724360636BB19" },
    "qrcode_url": {
      "uri": "tikcode-tx/7603966499316826125",
      "url_list": [
        "https://p19-common-sign.tiktokcdn-us.com/tikcode-tx/7603966499316826125~tplv-tiktokx-cropcenter:720:720.webp?dr=9640&x-expires=1770454800&x-signature=...&idc=useast5",
        "https://p19-common-sign.tiktokcdn-us.com/tikcode-tx/7603966499316826125~tplv-tiktokx-cropcenter:720:720.jpeg?dr=9640&x-expires=1770454800&x-signature=...&idc=useast5"
      ]
    },
    "status_code": 0,
    "status_msg": ""
  },
  "requestId": "6a133703-df58-40fe-852c-8001f339ac70"
}
```
> Capturado via WebFetch do opendoc (a sessão MCP do navegador ficou travada neste arquivo); o payload bate com o `example` do spec abaixo, que traz 3 URLs (`.webp` x2 + `.jpeg`).

## Notas & gotchas
- As URLs em `qrcode_url.url_list` são **assinadas e expiram** (`x-expires`, `x-signature`); baixe/cacheie a imagem em vez de persistir a URL.
- Há **dois níveis de status**: o `code` do envelope EchoTik e o `status_code`/`status_msg` interno do TikTok dentro de `data`. Cheque ambos.
- `extra.now` está em **milissegundos**; demais timestamps do conjunto influencer costumam ser em segundos.
- Identificação por `user_id` (não por handle).

## Relevância para o SLEAG
- Recurso utilitário/de UI: gerar QR para compartilhar/abrir o perfil de um criador.
- Periférico em relação ao core de dados (ranking/criativos/produtos); baixa prioridade.

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
  /api/v3/realtime/influencer/generate/qr-code:
    get:
      summary: Get user QR code
      deprecated: false
      description: Generate the homepage QR code via the influencer's user_id
      tags:
        - Influencer
      parameters:
        - name: user_id
          in: query
          description: ''
          required: true
          example: '6865486669187171334'
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
                  extra:
                    fatal_item_ids: []
                    logid: 20260207035334D261DF9724360636BB19
                    now: 1770436414000
                  log_pb:
                    impr_id: 20260207035334D261DF9724360636BB19
                  qrcode_url:
                    uri: tikcode-tx/7603966499316826125
                    url_list:
                      - >-
                        https://p19-common-sign.tiktokcdn-us.com/tikcode-tx/7603966499316826125~tplv-tiktokx-cropcenter:720:720.webp?dr=9640&x-expires=1770454800&x-signature=zToxlo%2BNodtBxBtCBTkT2WxkhRA%3D&idc=useast5&ps=13740610&shcp=9b759fb9&shp=45744a80&t=4d5b0474
                      - >-
                        https://p16-common-sign.tiktokcdn-us.com/tikcode-tx/7603966499316826125~tplv-tiktokx-cropcenter:720:720.webp?dr=9640&x-expires=1770454800&x-signature=ZLt%2BqKlaNydEqF0JvRj%2Bqkfqj0c%3D&idc=useast5&ps=13740610&shcp=9b759fb9&shp=45744a80&t=4d5b0474
                      - >-
                        https://p19-common-sign.tiktokcdn-us.com/tikcode-tx/7603966499316826125~tplv-tiktokx-cropcenter:720:720.jpeg?dr=9640&x-expires=1770454800&x-signature=iL2%2B7OQI3U%2Byls61eGDq1LIkPoU%3D&idc=useast5&ps=13740610&shcp=9b759fb9&shp=45744a80&t=4d5b0474
                  status_code: 0
                  status_msg: ''
                requestId: 6a133703-df58-40fe-852c-8001f339ac70
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Influencer
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-416700818-run
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
