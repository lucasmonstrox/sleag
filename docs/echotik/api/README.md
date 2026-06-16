# EchoTik API — Referência de Endpoints

> Espelho da opendoc oficial (https://opendocs.echotik.live/en) em 2026-06-10.
> Cada arquivo tem a **OpenAPI 3.0.1 completa** do endpoint: método, path, headers, query params, payload e todos os campos de response com tipos.

## Como chamar

- **Base URL:** `https://open.echotik.live` (env `ECHOTIK_BASE_URL` no `apps/api`).
- **Autenticação:** Basic Auth. Username/password gerados em https://echotik.live/platform/api-keys. Header `Authorization: Basic base64(user:pass)`.
- **Versão:** os endpoints documentados são **`/api/v3/echotik/...`**. O nosso adapter ainda usa `/api/v2/...` (versão antiga e capada) — migrar para v3 destrava sort, título de vídeo, GMV e janelas 1d/7d/30d.
- **Paginação:** `page_num` (1..100000) + `page_size` (**máx. 10**). Profundidade vem de mais páginas.
- **Envelope:** `{ code, message, data, requestId }`. `code !== 0` (ou HTTP 500 com "Usage Limit Exceeded") = erro.

## Offline (T+1) vs Tempo-real

- Endpoints **"- EchoTik"** = biblioteca **offline T+1** (atualização diária). Estáveis, ideais para listas/rankings.
- Endpoints **"Real-time Interface"** = puxam direto do TikTok. ⚠️ Sujeitos a **risk control**; se vier `code=500`, **retry**. Não suportam QPS alto.

## Destaques para o SLEAG

| Feature do produto | Endpoint a usar |
|---|---|
| **Criativos em alta** | `video/ranklist` (`video_rank_field=1` trending / `2` vendas) — traz título, GMV, thumbnail |
| **Produtos mais vendidos** | `product/ranklist` |
| **Aceleração de views** | `video/list` (janelas `total_views_1d/7d/30d_cnt`) ou `video/trends` (snapshot 180d) |
| **Nome de categoria** (mata o `category: "—"`) | `product/category` (first/secondary/subcategory) |
| **Lojas / concorrentes** | `shop/list`, `shop/ranklist`, `shop/trends` |
| **Criadores** | `influencer/list`, `influencer/ranklist`, `influencer/trends` |
| **Série temporal de mercado** | ❌ não existe endpoint dedicado — só snapshots por entidade (produto/vídeo/loja/criador) |

---

## Produtos

| Endpoint | Método · Path | O que faz |
|---|---|---|
| [Product First-Level Category List](product/product-first-level-category-list.md) | `GET /api/v3/echotik/category/l1` | Get first-level category data of products |
| [Product Secondary Category List](product/product-secondary-category-list.md) | `GET /api/v3/echotik/category/l2` | Get secondary category data for products |
| [Product Subcategory Category List](product/product-subcategory-category-list.md) | `GET /api/v3/echotik/category/l3` | Get product subcategory data |
| [Product List - EchoTik](product/product-list-echotik.md) | `GET /api/v3/echotik/product/list` | Provides product data from EchoTik's offline (T+1 update) library, suitable for scenarios requiring large-scale acquisition of product data. |
| [Product Trends (Snapshot) - EchoTik](product/product-trends-snapshot-echotik.md) | `GET /api/v3/echotik/product/trend` | Retrieve a historical trend snapshot of the product using the product_id, supporting up to the past 180 days. |
| [Batch fetch product details - EchoTik](product/batch-fetch-product-details-echotik.md) | `GET /api/v3/echotik/product/detail` | Retrieve product detail data in bulk via product_id, with a maximum of 10 items per request. Multiple items can be separated by an English comma. |
| [Product Review List - EchoTik](product/product-review-list-echotik.md) | `GET /api/v3/echotik/product/comment` | Retrieve the list of comments collected by EchoTik using the product_id. |
| [Product Association Sales Creator List - EchoTik](product/product-association-sales-creator-list-echotik.md) | `GET /api/v3/echotik/product/influencer/list` | Retrieve the list of influencer data associated with the product using the product_id. This interface will not return specific details of the influencers; for more influencer detail data, it can be obtained in the influencer details section. |
| [Product Associated Video List - EchoTik](product/product-associated-video-list-echotik.md) | `GET /api/v3/echotik/product/video/list` | Retrieve the list data of promotional videos associated with the product by using the product's product_id. |
| [Product Association Live Stream List - EchoTik](product/product-association-live-stream-list-echotik.md) | `GET /api/v3/echotik/product/live/list` | Retrieve the list data of live streaming sessions associated with the product via the product's product_id. |
| [Product Ranking List - EchoTik](product/product-ranking-list-echotik.md) | `GET /api/v3/echotik/product/ranklist` | 1. The values returned in the ranking are the incremental data of the current period |
| [Get Product ID via Product Share Link - Real-time Interface](product/get-product-id-via-product-share-link-real-time-interface.md) | `GET /api/v3/realtime/extract_product_id` | Get the product ID through the product sharing link and return the current product's location |
| [Get product details - Real-time interface](product/get-product-details-real-time-interface.md) | `GET /api/v3/realtime/product/detail` | Real-time product detail data can be obtained by using the product_id and region. |
| [Product Review List - Real-time interface](product/product-review-list-real-time-interface.md) | `GET /api/v3/realtime/product/comment` | Provide a real-time product review interface. Note: This interface does not support high QPS. The real-time interface often encounters risk control. If a code=500 error occurs, please retry. |

## Vídeos

| Endpoint | Método · Path | O que faz |
|---|---|---|
| [Video List - EchoTik](video/video-list-echotik.md) | `GET /api/v3/echotik/video/list` | Provide video data from the EchoTik offline (T+1 update) library, suitable for scenarios requiring large-scale acquisition of video data. |
| [Video Trends (Snapshot) - EchoTik](video/video-trends-snapshot-echotik.md) | `GET /api/v3/echotik/video/trend` | Get historical trend snapshots of videos by video_id, supporting up to the past 180 days. |
| [Batch fetch video details - EchoTik](video/batch-fetch-video-details-echotik.md) | `GET /api/v3/echotik/video/detail` | Retrieve video detail data in bulk via video_id, with a maximum of 10 videos per request. Multiple videos can be separated using an English comma. |
| [Video-related product list - EchoTik](video/video-related-product-list-echotik.md) | `GET /api/v3/echotik/video/product/list` | Retrieve the list of products associated with a video through the video ID. video_ids can be passed in bulk, with multiple values separated by English commas |
| [Video Ranking List - EchoTik](video/video-ranking-list-echotik.md) | `GET /api/v3/echotik/video/ranklist` | 1. The values ​​returned in the rankings are incremental data for the current period. |
| [Video Details - Real-time Interface](video/video-details-real-time-interface.md) | `GET /api/v3/realtime/video/detail` | Retrieve video detail data in real-time via video_id through video |
| [Video Text and Subtitle Extraction - Real-time Interface](video/video-text-and-subtitle-extraction-real-time-interface.md) | `GET /api/v3/realtime/video/captions` | The API retrieves video text data in real time via video ID and may return multilingual scripts. |
| [Video Tag Hashtag Associated Video List - Real-Time Interface](video/video-tag-hashtag-associated-video-list-real-time-interface.md) | `GET /api/v3/realtime/hashtag/video/list` | Retrieve related video list through video tag hashtag_id |
| [Video-related comment list - Real-time interface](video/video-related-comment-list-real-time-interface.md) | `GET /api/v3/realtime/video/comments` | Get the comment list information of this video through video_id |
| [Video comment reply list - Real-time interface](video/video-comment-reply-list-real-time-interface.md) | `GET /api/v3/realtime/video/comments/replies` | Retrieve the list of specific replies under a video comment using video_id + comment_id |
| [Get video download url](video/get-video-download-url.md) | `GET /api/v3/realtime/video/download-url` | Obtain the cover, playback, download addresses of the video through the URL address on the web side or the video sharing address on the app side. |

## Criadores (Influencers)

| Endpoint | Método · Path | O que faz |
|---|---|---|
| [Influencer List - EchoTik](influencer/influencer-list-echotik.md) | `GET /api/v3/echotik/influencer/list` | It provides influencer data from an offline (T+1 update) EchoTik library, suitable for scenarios that require acquiring large amounts of influencer data. |
| [Influencer Trends (Snapshot) - EchoTik](influencer/influencer-trends-snapshot-echotik.md) | `GET /api/v3/echotik/influencer/trend` | Get a snapshot of an influencer's historical trends using their user_id, supporting up to the past 180 days. |
| [Batch fetch influencer details - EchoTik](influencer/batch-fetch-influencer-details-echotik.md) | `GET /api/v3/echotik/influencer/detail` | Retrieve Influencer detail data in bulk through user_id or unique_id, up to 10 at a time can be sent, multiple can be separated by English commas. |
| [Influencer Video List - EchoTik](influencer/influencer-video-list-echotik.md) | `GET /api/v3/echotik/influencer/video/list` | Retrieve the list of videos from the influencer using either user_id or unique_id. One of user_id or unique_id is required. |
| [Influencer Livestream List - EchoTik](influencer/influencer-livestream-list-echotik.md) | `GET /api/v3/echotik/influencer/live/list` | Retrieve the live stream list information of the influencer using user_id. |
| [Influencer Product List - EchoTik](influencer/influencer-product-list-echotik.md) | `GET /api/v3/echotik/influencer/product/list` | Retrieve product information promoted by influencers using user_id. Data source: live streaming e-commerce, video e-commerce, or product showcase e-commerce. |
| [Influencer Ranking List - EchoTik](influencer/influencer-ranking-list-echotik.md) | `GET /api/v3/echotik/influencer/ranklist` | 1. The values returned in the ranking are the incremental data of the current period |
| [Influencer Details - Real-time interface](influencer/influencer-details-real-time-interface.md) | `GET /api/v3/realtime/influencer/detail` | Retrieve influencer detailed data in real-time via influencer unique_id (TikTok ID) |
| [Influencer Video List - Real-time Interface](influencer/influencer-video-list-real-time-interface.md) | `GET /api/v3/realtime/influencer/video/list` | Retrieve the influencer video list via the influencer's unique_id, and pagination queries can be performed using offset. |
| [Influencer Follower List - Real-time Interface](influencer/influencer-follower-list-real-time-interface.md) | `GET /api/v3/realtime/influencer/follower/list` | Retrieve the influencer's follower list by influencer's user_id, and use offset for pagination. |
| [Influencer Following List - Real-time Interface](influencer/influencer-following-list-real-time-interface.md) | `GET /api/v3/realtime/influencer/following/list` | Retrieve the influencer's following list using their user_id; pagination can be performed using offset. |
| [Influencer Regional Acquisition - Real-time Interface](influencer/influencer-regional-acquisition-real-time-interface.md) | `GET /api/v3/realtime/influencer/region` | Get the region of the influencer in real time by their unique_id. |
| [Get user QR code](influencer/get-user-qr-code.md) | `GET /api/v3/realtime/influencer/generate/qr-code` | Generate the homepage QR code via the influencer's user_id |

## Lojas (Shops)

| Endpoint | Método · Path | O que faz |
|---|---|---|
| [Product First-Level Category List](shop/product-first-level-category-list.md) | `GET /api/v3/echotik/category/l1` | Get first-level category data of products |
| [Product Secondary Category List](shop/product-secondary-category-list.md) | `GET /api/v3/echotik/category/l2` | Get secondary category data for products |
| [Product Subcategory Category List](shop/product-subcategory-category-list.md) | `GET /api/v3/echotik/category/l3` | Get product subcategory data |
| [Shop List - EchoTik](shop/shop-list-echotik.md) | `GET /api/v3/echotik/seller/list` | A small shop data providing EchoTik offline (T+1 update) library, suitable for scenarios requiring large-scale acquisition of shop data. |
| [Shop Trends (Snapshot) - EchoTik](shop/shop-trends-snapshot-echotik.md) | `GET /api/v3/echotik/seller/trend` | Retrieve a historical trend snapshot of the store via seller_id, supporting up to the past 180 days. |
| [Shop Detail - EchoTik](shop/shop-detail-echotik.md) | `GET /api/v3/echotik/seller/detail` | Retrieve store detailed data based on seller_id |
| [Shop's product list - EchoTik](shop/shop-s-product-list-echotik.md) | `GET /api/v3/echotik/seller/product/list` | Retrieve the list of all products EchoTik has collected for a store using the store's seller_id. |
| [Shop Related Creators List - EchoTik](shop/shop-related-creators-list-echotik.md) | `GET /api/v3/echotik/seller/influencer/list` | Retrieve the list of sales creators associated with the store through seller_id. This interface will not return specific details of the creators. For more detailed creator data, it can be obtained in the creator details section. |
| [Shop Related Video List - EchoTik](shop/shop-related-video-list-echotik.md) | `GET /api/v3/echotik/seller/video/list` | Retrieve the list data of promotional videos associated with the store using the store's seller_id. |
| [Shop Related Live Stream List - EchoTik](shop/shop-related-live-stream-list-echotik.md) | `GET /api/v3/echotik/seller/live/list` | Retrieve the live stream list data associated with the store using the store's seller_id. |
| [Shop Ranking List - EchoTik](shop/shop-ranking-list-echotik.md) | `GET /api/v3/echotik/seller/ranklist` | 1. The values returned in the list are the incremental data of the current period |
| [Shop's product list - Real-time interface](shop/shop-s-product-list-real-time-interface.md) | `GET /api/v3/realtime/seller/product/list` | Provide a real-time store product list interface. Note: This interface does not support high QPS. Real-time interfaces often encounter risk control. If a code=500 error is encountered, please retry. |

## Lives

| Endpoint | Método · Path | O que faz |
|---|---|---|
| [Live Stream Details - Real-time Interface](live/live-stream-details-real-time-interface.md) | `GET /api/v3/realtime/live/detail` | This API retrieves real-time live stream details using the live stream room_id and the influencer's user_id (this API requires the live stream to be running; data will not be available if the stream is turned off). |

## Busca

| Endpoint | Método · Path | O que faz |
|---|---|---|
| [General Search Interface - EchoTik](search/general-search-interface-echotik.md) | `GET /api/v3/echotik/search/items` | It provides search functionality for the EchoTik search box, including searches for influencers, products, shops, videos, and live streams. The interface supports features such as word segmentation, fuzzy search, and precise search. |
| [Video tag hashtag search - Real-time interface](search/video-tag-hashtag-search-real-time-interface.md) | `GET /api/v3/realtime/hashtag/search` | Search for hashtag tags related to the area using keyword keywords |
| [Creator search - Real-time interface](search/creator-search-real-time-interface.md) | `GET /api/v3/realtime/influencer/search` | Search creators in real-time using keywords, and use offset for the next pagination |
| [Music Search - Real-time Interface](search/music-search-real-time-interface.md) | `GET /api/v3/realtime/music/search` | Search video music in real-time using keywords, use offset for the next pagination |
| [Video Search - Real-time Interface](search/video-search-real-time-interface.md) | `GET /api/v3/realtime/video/search` | Search video lists in real-time using keywords, and use offset for the next pagination |
| [Live Stream Search - Real-time Interface](search/live-stream-search-real-time-interface.md) | `GET /api/v3/realtime/live/search` | Search the live stream list in real time using keywords, and use offset to paginate the next time. |
| [Product Search - Real-time Interface](search/product-search-real-time-interface.md) | `GET /api/v3/realtime/product/search` | Search for product lists in real time via keywords and use offset for subsequent page turning. |
| [Image Search for Products - Real-time Interface](search/image-search-for-products-real-time-interface.md) | `POST /api/v3/realtime/product/photo-search` | This interface is used together with the "Image Search Paged Product Data - Real-Time Interface". The current interface does not support pagination parameters, and six distinct commodities are randomly returned each time in e_com_items. To retrieve more commodity data, record the image_uri and box_detection returned by photo_search of this interface for subsequent data acquisition. |
| [Image Search Paged Product Data - Real-Time Interface](search/image-search-paged-product-data-real-time-interface.md) | `GET /api/v3/realtime/product/photo-search/page` | This interface is used in conjunction with the "Image Search for Products - Real-time Interface". The image_uri and box_detection returned by the photo_search method of the "Image Search for Products - Real-time Interface" are passed into this interface to obtain more data by pagination. |

## Análise social

| Endpoint | Método · Path | O que faz |
|---|---|---|
| [Video comment word analysis - Real-time interface](social-analysis/video-comment-word-analysis-real-time-interface.md) | `GET /api/v3/realtime/video/comment_keywords_insight` | Retrieve the header comment keywords for the video through video_id and provide specific comment detail data. |
| [Video interaction trend in the past 14 days - Real-time interface](social-analysis/video-interaction-trend-in-the-past-14-days-real-time-interface.md) | `GET /api/v3/realtime/video/trend_insight` | Retrieve the collection, comment, like, and play data for this video and the recent 14 days via video_id. |
| [Creator Milestone - Real-time Interface](social-analysis/creator-milestone-real-time-interface.md) | `GET /api/v3/realtime/influencer/milestones_insight` | Retrieve the creator's creative milestone data using the user_id. |

## Utilitários

| Endpoint | Método · Path | O que faz |
|---|---|---|
| [Batch download cover images](other/batch-download-cover-images.md) | `GET /api/v3/echotik/batch/cover/download` | Since TikTok image resources have an expiration time, we will download the images that have been collected. |

