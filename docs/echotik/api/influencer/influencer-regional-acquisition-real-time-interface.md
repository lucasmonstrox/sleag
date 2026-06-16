# Influencer Regional Acquisition - Real-time Interface

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375107247e0) · **`GET /api/v3/realtime/influencer/region`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz

Resolve a **região/país** de um criador **em tempo real**, a partir do `unique_id` (handle TikTok). Endpoint pontual e leve: serve para descobrir/confirmar a região de um perfil quando ela não está disponível ou está desatualizada na base offline. Por ser tempo-real, está sujeito a **risk control do TikTok**: se retornar `code=500`, faça **retry**. Não use QPS alto.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `unique_id` | string | Sim | Identifica o criador pelo @handle público do TikTok (ex.: `aadaehoon`). |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/influencer/region?unique_id=aadaehoon" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope real: `{ code, message, data, requestId }` — `code = 0` = sucesso; `code = 500` = risk control → **retry**.

### Campos de `data`
Aqui `data` **não é objeto nem array**: é uma **string simples** com o código de região do criador (ex.: `"ID"` para Indonésia, `"BR"`, `"US"`).

| Campo | Tipo | O que é |
|---|---|---|
| `data` | string | Código de região/país do criador (ISO de país, ex.: `"ID"`). |

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": "ID",
  "requestId": "8a3adaa3-d397-417b-81c0-0e0d3e2ce08b"
}
```

## Notas & gotchas
- `data` é uma **string** (código de região), não um objeto — atenção ao desserializar (não tente acessar `data.region`).
- Endpoint **single-purpose**: só retorna a região; não traz métricas do criador.
- **Risk control:** `code=500` esperado; retry com backoff, sem QPS alto.

## Relevância para o SLEAG
- Utilidade de apoio: **enriquecer/corrigir a região** de um criador (importante porque vários endpoints offline exigem `region`, ex.: ranking e lista).
- Secundário; usado em pipelines de normalização de dados, não na UI direta.

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
  /api/v3/realtime/influencer/region:
    get:
      summary: Influencer Regional Acquisition - Real-time Interface
      deprecated: false
      description: >-
        Get the region of the influencer in real time by their unique_id.


        Note: Real-time APIs may encounter risk control checks at any time. If a
        code=500 is returned, please retry.
      tags:
        - Influencer
      parameters:
        - name: unique_id
          in: query
          description: ''
          required: true
          example: aadaehoon
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375107247-run
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
