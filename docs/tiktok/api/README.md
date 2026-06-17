# TikTok Shop API — Referência de Endpoints

> Documentação da API oficial do TikTok Shop (Seller API + Partner API) em 2026-06-17.
> Baseado na documentação oficial do [TikTok Shop Partner Center](https://partner.tiktokshop.com/docv2/page/tts-api-concepts-overview).
> Cada arquivo detalha um endpoint: método, path, headers, query params, payload, campos de response com tipos e exemplos reais.

## Como chamar

- **Base URL Produção:** `https://open-api.tiktokglobalshop.com`
- **Base URL Sandbox:** `https://open-api-sandbox.tiktokglobalshop.com`
- **Auth URL Produção:** `https://auth.tiktok-shops.com`
- **Auth URL Sandbox:** `https://auth-sandbox.tiktok-shops.com`
- **Autenticação:** OAuth 2.0. Header `x-tts-access-token: <access_token>`. Obtém-se via fluxo `auth_code → access_token + refresh_token`. Ver [guia de autenticação](auth/README.md).
- **Versão:** endpoints documentados em **`/202309`** (versão atual). A versão aparece como segundo segmento do path: `/product/202309/...`.
- **Shop Cipher:** Obtido via `GET /authorization/202309/shops`. Cada loja cross-border tem seu `shop_cipher` único — obrigatório em quase toda chamada.
- **Assinatura:** Toda chamada requer `sign` (HMAC-SHA256). Query params ordenados alfabeticamente, concatenados como `{key}{value}`, envelopados com `app_secret`. Ver [auth/README.md](auth/README.md).
- **Paginação:** `page_size` (máx. 100) + `page_token` (cursor). Sem número de página fixo — paginação baseada em cursor.
- **Envelope:** `{ code, message, data }` (varia por endpoint — alguns incluem `request_id` extra). `code = 0` = sucesso.
- **Rate Limit:** Implementar exponential backoff para HTTP `429`.

## Ambientes

| Ambiente | Auth | API |
|---|---|---|
| **Sandbox** | `https://auth-sandbox.tiktok-shops.com` | `https://open-api-sandbox.tiktokglobalshop.com` |
| **Produção** | `https://auth.tiktok-shops.com` | `https://open-api.tiktokglobalshop.com` |

## Fluxo de onboarding

1. Registrar-se no **TikTok Shop Partner Center** → obter `App Key` + `App Secret`
2. Implementar OAuth 2.0 → obter `access_token` + `refresh_token`
3. Obter `shop_cipher` via `GET /authorization/202309/shops`
4. Sandbox: testar CRUD de produtos, pedidos, fulfillment
5. Agendar teste E2E com o TikTok Shop (2 semanas de antecedência)
6. Validação completa → **Launch**

## Destaques para o SLEAG

| Feature do produto | Endpoint a usar |
|---|---|
| **Catálogo de produtos** | `GET /product/202309/products` — listar, filtrar por status |
| **Detalhe do produto** | `GET /product/202309/products/{product_id}` — SKUs, preços, estoque |
| **Upload de mídia** | `POST /product/202309/products/upload_files` — imagens, vídeos |
| **Pedidos (vendas)** | `GET /order/202309/orders` — filtrar por status, data |
| **Detalhe do pedido** | `GET /order/202309/orders/{order_id}` — itens, endereço, comprador |
| **Fulfillment** | `GET /logistics/202309/orders/{order_id}/shipping_documents` — etiquetas, packing slips |
| **Gestão de estoque** | `PUT /product/202309/products/{product_id}` — atualizar `stock_infos` |
| **Financeiro** | `GET /finance/202309/payments` — settlements, repasses |
| **Lojas autorizadas** | `GET /authorization/202309/shops` — lojas do seller |
| **Webhooks (eventos)** | Configurar em Partner Center — status de pedido, cancelamento, devolução |

---

## Autenticação

| Endpoint | Método · Path | O que faz |
|---|---|---|
| [Guia de Autenticação OAuth 2.0](auth/README.md) | — | Fluxo completo: authorize → token → refresh → shops |
| [Obter Access Token](auth/get-access-token.md) | `GET /api/v2/token/get` | Troca `auth_code` por `access_token` + `refresh_token` |
| [Refrescar Access Token](auth/refresh-access-token.md) | `GET /api/v2/token/refresh` | Renova o `access_token` (expira em 7 dias) |
| [Listar Lojas Autorizadas](auth/list-authorized-shops.md) | `GET /authorization/202309/shops` | Retorna `shop_cipher` de cada loja |

## Produtos

| Endpoint | Método · Path | O que faz |
|---|---|---|
| [Criar Produto](product/create-product.md) | `POST /product/202309/products` | Cria um novo produto com SKUs, preços, imagens |
| [Listar Produtos](product/list-products.md) | `GET /product/202309/products` | Lista produtos com filtros de status e paginação |
| [Obter Detalhe do Produto](product/get-product-detail.md) | `GET /product/202309/products/{product_id}` | Dados completos: nome, categoria, SKUs, estoque, preços |
| [Atualizar Produto](product/update-product.md) | `PUT /product/202309/products/{product_id}` | Edita produto: preço, estoque, atributos, status |
| [Deletar Produto](product/delete-product.md) | `DELETE /product/202309/products` | Remove produtos (máx. 20 IDs por chamada) |
| [Upload de Arquivos](product/upload-files.md) | `POST /product/202309/products/upload_files` | Upload de imagens (main_image, size_chart, brand_logo) e vídeos |
| [Categorias de Produto](product/get-categories.md) | `GET /product/202309/categories` | Árvore de categorias oficial do TikTok Shop |
| [Marcas](product/get-brands.md) | `GET /product/202309/brands` | Lista de marcas aprovadas por categoria |
| [Atributos de Categoria](product/get-category-attributes.md) | `GET /product/202309/categories/{category_id}/attributes` | Atributos obrigatórios/opcionais de uma categoria |
| [Estoque do Warehouse](product/get-warehouse-stock.md) | `GET /product/202309/products/{product_id}/stock` | Estoque disponível por warehouse |

## Pedidos

| Endpoint | Método · Path | O que faz |
|---|---|---|
| [Listar Pedidos](order/list-orders.md) | `GET /order/202309/orders` | Lista pedidos filtrando por status, data, paginação |
| [Obter Detalhe do Pedido](order/get-order-detail.md) | `GET /order/202309/orders/{order_id}` | Dados completos: itens, endereço, comprador, status |
| [Estados do Pedido](order/order-statuses.md) | — | Máquina de estados: UNPAID → AWAITING_SHIPMENT → ... → COMPLETED |
| [Cancelamento](order/cancel-order.md) | `POST /order/202309/orders/{order_id}/cancel` | Cancela um pedido (seller-side) |
| [Reembolso / Devolução](order/refund-return.md) | `GET/POST /return/202309/returns` | Gerencia pedidos de devolução e reembolso do comprador |

## Logística & Fulfillment

| Endpoint | Método · Path | O que faz |
|---|---|---|
| [Documentos de Envio](logistics/get-shipping-documents.md) | `GET /logistics/202309/orders/{order_id}/shipping_documents` | Etiquetas de envio (SHIPPING_LABEL) e packing slips |
| [Criar Pacote de Envio](logistics/create-package.md) | `POST /logistics/202309/orders/{order_id}/packages` | Cria um pacote de envio para o pedido |
| [Rastreamento](logistics/get-tracking.md) | `GET /logistics/202309/orders/{order_id}/tracking` | Tracking info do pacote em trânsito |
| [Transportadoras](logistics/get-shipping-providers.md) | `GET /logistics/202309/shipping_providers` | Lista de transportadoras disponíveis por warehouse |
| [FBT (Fulfillment by TikTok)](logistics/fbt.md) | `GET/POST /fulfillment/202309/...` | Gestão de estoque e fulfillment via TikTok |

## Financeiro

| Endpoint | Método · Path | O que faz |
|---|---|---|
| [Payments / Settlements](finance/get-payments.md) | `GET /finance/202309/payments` | Lista de pagamentos, settlements e repasses |
| [Extrato de Transações](finance/get-transactions.md) | `GET /finance/202309/transactions` | Transações individuais (vendas, taxas, estornos) |
| [Ordens de Pagamento](finance/get-settlements.md) | `GET /finance/202309/settlements` | Detalhe de liquidações por período |

## Loja

| Endpoint | Método · Path | O que faz |
|---|---|---|
| [Perfil da Loja](shop/get-shop-profile.md) | `GET /shop/202309/shops/{shop_cipher}` | Dados da loja: nome, região, status |
| [Performance da Loja](shop/get-shop-performance.md) | `GET /shop/202309/shops/{shop_cipher}/performance` | Métricas de desempenho (GMV, pedidos, avaliação) |

## Promoções & Campanhas

| Endpoint | Método · Path | O que faz |
|---|---|---|
| [Criar Promoção](promotion/create-promotion.md) | `POST /promotion/202309/promotions` | Cria campanha promocional na loja |
| [Listar Promoções](promotion/list-promotions.md) | `GET /promotion/202309/promotions` | Lista promoções ativas e encerradas |
| [Cupons](promotion/coupons.md) | `POST/GET /promotion/202309/coupons` | Cria e gerencia cupons de desconto |
| [Flash Deals](promotion/flash-deals.md) | `POST/GET /promotion/202309/flash_deals` | Ofertas relâmpago |

## Afiliados & Criadores

| Endpoint | Método · Path | O que faz |
|---|---|---|
| [Programa de Afiliados](affiliate/affiliate-program.md) | `GET/POST /affiliate/202309/...` | Configuração do programa de afiliados da loja |
| [Criadores Vinculados](affiliate/creator-list.md) | `GET /affiliate/202309/creators` | Lista de criadores afiliados à loja |
| [Comissões](affiliate/commissions.md) | `GET/PUT /affiliate/202309/commissions` | Configura taxa de comissão por produto/categoria |

## Webhooks & Eventos

| Endpoint | Método · Path | O que faz |
|---|---|---|
| [Guia de Webhooks](webhook/README.md) | — | Visão geral: eventos, configuração, payload, segurança |
| [Eventos de Pedido](webhook/order-events.md) | — | ORDER_STATUS_CHANGE, PACKAGE_UPDATE, CANCELLATION_STATUS_CHANGE |
| [Eventos de Produto](webhook/product-events.md) | — | PRODUCT_STATUS_CHANGE, PRODUCT_CREATION, PRODUCT_AUDIT_STATUS_CHANGE |
| [Eventos de Devolução](webhook/return-events.md) | — | RETURN_STATUS_CHANGE, REVERSE_STATUS_UPDATE |
| [Eventos de Autorização](webhook/auth-events.md) | — | SELLER_DEAUTHORIZATION, UPCOMING_AUTHORIZATION_EXPIRATION |

---

## Erros comuns

| Código | Significado | Ação |
|---|---|---|
| `0` | Sucesso | — |
| `429` | Rate limit excedido | Exponential backoff |
| `401` | Token expirado/inválido | Refrescar `access_token` |
| `403` | Sem permissão | Verificar escopos OAuth / shop_cipher |
| `400` | Parâmetros inválidos | Validar request conforme schema |
| `500` | Erro interno TikTok | Retry com backoff |
| `108001` | Produto não encontrado | Verificar `product_id` |
| `108002` | SKU inválido | Verificar `sku_id` |

## SDKs

| SDK | Linguagem | Notas |
|---|---|---|
| **Official TikTok Shop SDK** | Multi | Disponível no Partner Center Console. Atualiza diariamente. |
| [ecomphp/tiktokshop-php](https://github.com/EcomPHP/tiktokshop-php) | PHP | Community, suporta v202309+. `composer require ecomphp/tiktokshop-php` |
| [tiktok-shop-sdk](https://www.npmjs.com/package/tiktok-shop-sdk) | Node.js | Community npm package |

## Recursos oficiais

- [TikTok Shop Partner Center Docs](https://partner.tiktokshop.com/docv2/page/tts-api-concepts-overview) — documentação oficial
- [Seller API Developing Guide](https://bytedance.sg.larkoffice.com/docx/KRUEdLuScoY6FExMWoQcwGT5nzh) — guia de desenvolvimento
- [Partner Center](https://partner.tiktokshop.com/) — console para criar apps e obter credenciais
- [GitHub: api-evangelist/tiktok](https://github.com/api-evangelist/tiktok) — OpenAPI spec community-maintained
- [dev.to: TikTok Shop API Integration Guide 2026](https://dev.to/api2cartofficial/tiktok-shop-api-how-to-develop-a-seamless-ecommerce-integration-in-2026-3pp0)
