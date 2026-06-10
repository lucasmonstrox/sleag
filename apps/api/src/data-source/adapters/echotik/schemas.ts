import { z } from "zod"

// Shapes crus da EchoTik (apenas os campos que consumimos)

/** Item do GET /api/v2/product/ranklist (ranking diário por região) */
export const rankItemSchema = z.object({
  product_id: z.string(),
  product_name: z.string(),
  category_id: z.string().nullable(),
  total_sale_cnt: z.coerce.number().default(0),
  total_sale_gmv_amt: z.coerce.number().default(0),
  total_video_cnt: z.coerce.number().default(0),
})

export type RankItem = z.infer<typeof rankItemSchema>

/** Item do GET /api/v2/video/list */
export const videoItemSchema = z.object({
  user_id: z.coerce.string(),
  unique_id: z.string().nullable(),
  total_views_1d_cnt: z.coerce.number().default(0),
  total_views_cnt: z.coerce.number().default(0),
  total_video_sale_gmv_amt: z.coerce.number().default(0),
})

export type VideoItem = z.infer<typeof videoItemSchema>
