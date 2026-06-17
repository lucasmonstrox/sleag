# Upload de Arquivos (Imagens e Vídeos)

> **Fonte:** TikTok Shop Partner Center · **`POST /product/202309/products/upload_files`** · **Auth:** `x-tts-access-token`

## O que faz

Faz upload de imagens e vídeos para uso em produtos. As URLs retornadas são usadas nos campos `images`, `main_image`, `size_chart`, `brand_logo` e `videos` ao criar/atualizar um produto. **Sempre faça upload antes de criar o produto** — você precisa dos IDs e URLs retornados.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `x-tts-access-token` | Sim | Access token |
| `Content-Type` | Sim | `multipart/form-data` |

### Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `app_key` | string | Sim | — |
| `sign` | string | Sim | — |
| `shop_cipher` | string | Sim | — |

### Body (multipart/form-data)

| Campo | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `file` | binary | Sim | Arquivo de imagem ou vídeo. Formatos: JPG, PNG, JPEG, MP4. |
| `file_name` | string | Sim | Nome do arquivo com extensão (ex.: `product-main.jpg`). |
| `file_type` | string | Sim | **Categoria de uso.** Valores abaixo. |

### `file_type` — Categorias de uso

| Valor | Uso | Limite |
|---|---|---|
| `MAIN_IMAGE` | Imagem principal do produto | 1 por produto |
| `ATTRIBUTE_IMAGE` | Imagem de variação de atributo (cor, etc.) | 1 por valor de atributo |
| `SIZE_CHART` | Tabela de medidas | 1 por produto |
| `BRAND_LOGO` | Logo da marca | 1 por produto |
| `CERTIFICATION` | Certificado de compliance | Múltiplas |
| `PRODUCT_VIDEO` | Vídeo demonstrativo do produto | ~1–3 por produto |
| `DESCRIPTION_IMAGE` | Imagem inline na descrição | Múltiplas |

### Tamanhos e formatos recomendados

| Tipo | Formato | Tamanho máx. | Resolução recomendada |
|---|---|---|---|
| `MAIN_IMAGE` | JPG, PNG | 5 MB | 800×800 px (mín. 500×500) |
| `ATTRIBUTE_IMAGE` | JPG, PNG | 5 MB | 800×800 px |
| `SIZE_CHART` | JPG, PNG | 5 MB | 1000×1500 px |
| `PRODUCT_VIDEO` | MP4 | 1 GB | 720p+ (ratio 1:1, 3:4, 9:16, ou 16:9) |

### Exemplo de chamada

```bash
curl -X POST "https://open-api.tiktokglobalshop.com/product/202309/products/upload_files?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER" \
  -H "x-tts-access-token: $ACCESS_TOKEN" \
  -F "file=@/path/to/product-main.jpg" \
  -F "file_name=product-main.jpg" \
  -F "file_type=MAIN_IMAGE"
```

## Response

### Campos de `data`

| Campo | Tipo | O que é |
|---|---|---|
| `id` | string | ID do arquivo enviado. **Essencial:** usar este ID no campo `images[].id` ao criar o produto. |
| `url` | string | URL pública do arquivo. |
| `height` | integer | Altura em pixels (imagens). |
| `width` | integer | Largura em pixels (imagens). |
| `thumb_url` | string | URL do thumbnail (imagens). |
| `format` | string | Formato: `jpeg`, `png`, `mp4`. |
| `size` | integer | Tamanho em bytes. |

### Exemplo de resposta

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "img_001",
    "url": "https://cdn.tiktokshop.com/path/to/image.jpg",
    "height": 800,
    "width": 800,
    "thumb_url": "https://cdn.tiktokshop.com/path/to/image_thumb.jpg",
    "format": "jpeg",
    "size": 245760
  }
}
```

## Notas & gotchas

- **Ordem das operações:** upload primeiro, depois cria o produto com os IDs retornados. Não dá pra criar produto com URL externa.
- **URLs expiram?** URLs do CDN do TikTok Shop são estáveis, mas não há garantia contratual de permanência. Armazene o ID, não só a URL.
- **Reutilização:** imagens podem ser reutilizadas entre produtos.
- **Vídeos:** demoram mais para processar. O status do vídeo pode vir como `PROCESSING` inicialmente — aguarde o webhook `PRODUCT_STATUS_CHANGE` ou faça polling.

## Relevância para o SLEAG

- Pipeline de criação de produto: upload de mídia → criação do produto.
- UI de upload com preview, crop e validação de formato/tamanho antes de enviar.
