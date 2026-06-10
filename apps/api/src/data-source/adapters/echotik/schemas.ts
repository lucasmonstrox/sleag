import { z } from "zod"

// Shapes crus da EchoTik v3 (apenas os campos que consumimos).
// Spec completa em docs/echotik/api/. Zod ignora campos extras do payload.

/** Item do GET /api/v3/echotik/product/ranklist (ranking por região/período) */
export const rankItemSchema = z.object({
  product_id: z.string(),
  product_name: z.string(),
  category_id: z.string().nullable(),
  total_sale_cnt: z.coerce.number().default(0),
  total_sale_gmv_amt: z.coerce.number().default(0),
  total_video_cnt: z.coerce.number().default(0),
})

export type RankItem = z.infer<typeof rankItemSchema>

/**
 * Item do GET /api/v3/echotik/video/ranklist — ranking de vídeos já ordenado
 * pelo servidor (video_rank_field=1 trending). Traz título (video_desc), GMV
 * e thumbnail reais, ao contrário do /api/v2/video/list antigo.
 */
export const videoItemSchema = z.object({
  video_id: z.coerce.string(),
  user_id: z.coerce.string(),
  unique_id: z.string().nullable(),
  nick_name: z.string().nullish(),
  video_desc: z.string().nullish(),
  reflow_cover: z.string().nullish(),
  total_views_cnt: z.coerce.number().default(0),
  total_video_sale_cnt: z.coerce.number().default(0),
  total_video_sale_gmv_amt: z.coerce.number().default(0),
})

export type VideoItem = z.infer<typeof videoItemSchema>
