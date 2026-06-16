# Download em Lote de Imagens de Capa (Batch Download Cover Images)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/369397344e0) · **`GET /api/v3/echotik/batch/cover/download`** · **Auth:** Basic · **Tipo:** Utilitário (sem consumo de cota)

## O que faz
Converte URLs de **imagens de capa (thumbnails) já coletadas pela EchoTik** em **URLs temporários acessíveis** (válidos por **24 horas**). As imagens do TikTok **expiram** e os URLs devolvidos pelos demais endpoints da EchoTik **não podem ser acessados diretamente** — este endpoint resolve isso, mas **só funciona para capas cujo host seja `echosell-images.tos-ap-southeast-1.volces.com`** (ou seja, imagens que a EchoTik já baixou para o storage dela, na Volcengine/TOS). Aceita **até 10 URLs por chamada**, separados por vírgula. **Não consome cota de chamadas.** Se você passar um URL com domínio diferente, significa que a EchoTik ainda não baixou aquela imagem: a chamada não terá efeito e a imagem será baixada de forma assíncrona nos próximos **1 a 3 dias**.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `cover_urls` | string | Sim | Até **10** URLs separados por vírgula. Cada um deve ter host `echosell-images.tos-ap-southeast-1.volces.com`. | Lista de URLs de capa a converter em links temporários acessíveis (válidos 24h). URLs de outros domínios são ignorados (imagem ainda não baixada → download assíncrono em 1–3 dias). |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/batch/cover/download?cover_urls=https://echosell-images.tos-ap-southeast-1.volces.com/user-avatar/459/MS4wLjABAAAAQ5_vlo4B-TluK2ztaAK9avrqmfULn4rfXS0D4ImQ01mo3FLDvlwUxINywY0CGIVS.webp,https://echosell-images.tos-ap-southeast-1.volces.com/user-avatar/459/OUTRA.webp" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope **`{ code, message, data }`** — atenção: este endpoint **não traz `requestId`** (o schema só declara `code`, `message`, `data`, ao contrário da maioria dos endpoints offline). `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro. Este endpoint **não consome cota**.

### Campos de `data`
`data` é um **objeto/dicionário** (não array): para cada capa de origem enviada em `cover_urls`, retorna o endereço temporário acessível.

| Campo | Tipo | O que é |
|---|---|---|
| `data` | object | Mapa cuja **chave é o URL de capa de origem** e cujo **valor é o URL temporário acessível** (válido 24h). |
| `data["<source_cover_url>"]` | string | Valor do par origem→destino. O schema rotula esse campo como `source_cover_url:dest_cover_url` com a descrição "Source video cover address: The address of the video cover that can be accessed after downloading" — ou seja, a notação `source_cover_url:dest_cover_url` representa o par chave→valor (`{ "<source_cover_url>": "<dest_cover_url>" }`), não um nome literal de campo. |

## Notas & gotchas
- **Validade de 24h:** os URLs temporários expiram; gere-os sob demanda ou re-chame antes de exibir.
- **Só host `echosell-images.tos-ap-southeast-1.volces.com`:** outros domínios são ignorados (imagem ainda não baixada pela EchoTik → download assíncrono em 1–3 dias).
- **Máx. 10 URLs por chamada**, separados por vírgula.
- **Não consome cota** — pode ser usado livremente para hidratar thumbnails.
- O formato exato do `data` (mapa origem→destino) não tem schema formal limpo na spec — confirme inspecionando a resposta real.

## Relevância para o SLEAG
- **Pipeline de thumbnails:** essencial para exibir capas de vídeos/criativos e avatares no produto sem links quebrados — todo URL de imagem vindo da EchoTik precisa passar por aqui (ou por cache próprio) antes de ir pra UI.
- Como os links valem 24h, vale considerar **cache/proxy próprio de imagens** no backend do SLEAG (rebaixar e servir do nosso storage) para estabilidade e performance.

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
  /api/v3/echotik/batch/cover/download:
    get:
      summary: Batch download cover images
      deprecated: false
      description: >-
        Since TikTok image resources have an expiration time, we will download
        the images that have been collected.

        Currently, all image URLs returned by EchoTik-related interfaces cannot
        be accessed directly. You can use this interface to obtain temporary
        access URLs (valid for 24 hours).

        Please note that this interface does not consume call counts. The URL in
        the cover_url field passed to the interface must be a cover with a Host
        of “echosell-images.tos-ap-southeast-1.volces.com” to obtain a temporary
        access URL!

        If there are image URLs with domains other than
        “echosell-images.tos-ap-southeast-1.volces.com”, this proves that we
        have not yet downloaded that image. In such cases, calling this
        interface will be ineffective, and the image will be asynchronously
        downloaded within the next 1-3 days.
      tags: []
      parameters:
        - name: cover_urls
          in: query
          description: >-
            A maximum of 10 cover addresses can be entered at once, multiple
            addresses should be separated by commas, for
            example：https://echosell-images.tos-ap-southeast-1.volces.com/user-avatar/459/MS4wLjABAAAAQ5_vlo4B-TluK2ztaAK9avrqmfULn4rfXS0D4ImQ01mo3FLDvlwUxINywY0CGIVS.webp,https://echosell-images.tos-ap-southeast-1.volces.com/user-avatar/459/MS4wLjABAAAAQ5_vlo4B-TluK2ztaAK9avrqmfULn4rfXS0D4ImQ01mo3FLDvlwUxINywY0CGIVS.webp,https://echosell-images.tos-ap-southeast-1.volces.com/user-avatar/459/MS4wLjABAAAAQ5_vlo4B-TluK2ztaAK9avrqmfULn4rfXS0D4ImQ01mo3FLDvlwUxINywY0CGIVS.webp
          required: true
          schema:
            type: string
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: integer
                  message:
                    type: string
                  data:
                    type: object
                    properties:
                      source_cover_url:dest_cover_url:
                        type: string
                        title: >-
                          Source video cover address: The address of the video
                          cover that can be accessed after downloading
                    x-apifox-orders:
                      - source_cover_url:dest_cover_url
                    required:
                      - source_cover_url:dest_cover_url
                x-apifox-orders:
                  - code
                  - message
                  - data
                required:
                  - code
                  - message
                  - data
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: ''
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-369397344-run
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
