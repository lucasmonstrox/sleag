# Detalhes da Live em Andamento (Live Stream Details)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375385162e0) · **`GET /api/v3/realtime/live/detail`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz
Retorna os **detalhes em tempo real de uma transmissão ao vivo (live)** do TikTok a partir do `room_id` da sala e do `user_id` do criador. **A live precisa estar RODANDO** no momento da chamada — se o criador encerrou a transmissão, **não há dados**. O `data` é o objeto **bruto/nativo da LiveRoom do TikTok** (muito extenso): info do anchor, permissões, estatísticas, restrições etc. É **Tempo-real**: sujeito a risk control — se vier `code=500`, faça retry. Evite QPS alto.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `room_id` | string | Sim | ID da sala da live (live room). Ex: `7571439020442405646`. |
| `user_id` | string | Sim | ID do criador dono da live. Ex: `7291543591306347562`. |

> A página da EchoTik lista os dois params sem texto de descrição (só o exemplo); ambos são obrigatórios.

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/live/detail?room_id=7571439020442405646&user_id=7291543591306347562" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope: `{ msg, code, data }` — `code = 0` (HTTP 200) = sucesso. `code=500` = risk control → retry.

### Campos de `data`
A resposta tem **aninhamento `data.data`**: o objeto bruto da LiveRoom do TikTok fica em `data.data`. É um payload muito grande; campos de topo confirmados pelo Example renderizado:

| Campo (`data.data.*`) | Tipo | O que é |
|---|---|---|
| `aggregation_data` | objeto | Agregado da sala. Contém `Audience` = info do anchor/criador: `author_stats` (`video_total_count`, `video_total_play_count`, `video_total_favorite_count`, `video_total_share_count`, `variety_show_play_count`, `video_total_series_count`), avatares (`avatar_large`/`avatar_medium`/`avatar_thumb` com `uri`/`url_list`/`width`/`height`/`avg_color`/`is_animated`) e flags de privacidade (`allow_*`). |
| `age_restricted` | objeto | Restrição etária: `AgeInterval`, `restricted` (bool), `source`. |
| `admin_user_ids` | array | IDs de administradores da sala. |
| `admin_ec_show_permission` | objeto | Permissões de exibição de e-commerce para admins. |
| `AnchorABMap` | objeto | Mapa de flags de A/B test do anchor. |
| `adjust_display_order` | inteiro | Flag de ajuste de ordem de exibição. |

> **Example truncado:** o visualizador de código do opendoc corta o exemplo em ~5000 caracteres, então não foi possível extrair **todos** os campos do objeto da LiveRoom (que normalmente inclui também `id`/`id_str` da sala, `title`, `status`, `user_count`/`stats` de espectadores, `stream_url`, `owner`, `cover` etc., padrão do TikTok). Os campos acima são os confirmados pelo trecho renderizado; para o objeto completo, inspecione uma resposta real em runtime.

### Exemplo de resposta
```json
{
  "msg": "success",
  "code": 0,
  "data": {
    "data": {
      "AnchorABMap": {},
      "adjust_display_order": 1,
      "admin_ec_show_permission": {},
      "admin_user_ids": [],
      "age_restricted": { "AgeInterval": 0, "restricted": false, "source": 0 },
      "aggregation_data": {
        "Audience": {
          "allow_find_by_contacts": false,
          "allow_others_download_video": false,
          "allow_strange_comment": false,
          "allow_unfollower_comment": false,
          "allow_use_linkmic": false,
          "author_stats": {
            "variety_show_play_count": 0,
            "video_total_count": 0,
            "video_total_favorite_count": 0,
            "video_total_play_count": 0,
            "video_total_series_count": 0,
            "video_total_share_count": 0
          },
          "avatar_large": {
            "avg_color": "",
            "height": 0,
            "image_type": 0,
            "is_animated": false,
            "open_web_url": "",
            "uri": "1080x1080/musically-maliva-obj/1594805258216454",
            "url_list": ["https://p16-sign-va.tiktokcdn.com/musically-maliva-obj/...cropcenter:1080:1080.webp?..."],
            "width": 0
          },
          "avatar_medium": { "uri": "720x720/musically-maliva-obj/1594805258216454", "url_list": ["https://p16-sign-va.tiktokcdn.com/...cropcenter:720:720.webp?..."] },
          "avatar_thumb": { "uri": "100x100/musically-maliva-obj/1594805258216454", "url_list": ["https://p16-sign-va.tiktokcdn.com/...cropcenter:100:100.webp?..."] }
        }
      }
    }
  }
}
```

## Notas & gotchas
- **Exige live no ar:** se a transmissão foi encerrada, não retorna dados — útil só durante a janela ao vivo.
- **Precisa do par `room_id` + `user_id`** (ambos obrigatórios).
- **Aninhamento `data.data`:** o objeto da LiveRoom está em `data.data`, não direto em `data`.
- Envelope é `{ msg, code, data }` (sem `requestId` neste endpoint).
- Payload bruto da LiveRoom do TikTok é **muito grande**; faça parsing seletivo dos campos que importam (status, espectadores, owner, cover) e ignore o resto.
- URLs de avatar são assinadas e expiram (`x-expires`).
- Tempo-real: `code=500` → retry; sem QPS alto.

## Relevância para o SLEAG
- **Monitor de lives ao vivo:** base para um painel que acompanha transmissões em andamento (espectadores, ritmo de engajamento).
- Por depender da live estar no ar e do par de IDs, é recurso pontual/avançado — provável segunda onda, após os fluxos de produtos/criativos do dashboard.

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
  /api/v3/realtime/live/detail:
    get:
      summary: Live Stream Details - Real-time Interface
      deprecated: false
      description: >-
        This API retrieves real-time live stream details using the live stream
        room_id and the influencer's user_id (this API requires the live stream
        to be running; data will not be available if the stream is turned off).


        Note: Real-time APIs may encounter risk control checks at any time. If a
        code=500 is returned, please retry.
      tags:
        - Live
      parameters:
        - name: room_id
          in: query
          description: ''
          required: true
          example: '7571439020442405646'
          schema:
            type: string
        - name: user_id
          in: query
          description: ''
          required: true
          example: '7291543591306347562'
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
      x-apifox-folder: Live
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375385162-run
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
