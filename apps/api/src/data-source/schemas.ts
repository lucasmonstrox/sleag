import { z } from "zod"

export const marketProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  sales24h: z.number().nonnegative(),
  salesTrend: z.array(z.number()),
  salesDelta24h: z.number().nullable(),
  score: z.number().min(0).max(100),
})

export const marketCreativeSchema = z.object({
  id: z.string(),
  title: z.string(),
  creatorHandle: z.string(),
  views: z.number().nonnegative(),
  estimatedGmv: z.number().nonnegative(),
})

export const marketTrendPointSchema = z.object({
  date: z.iso.date(),
  estimatedGmv: z.number().nonnegative(),
  videosPublished: z.number().nonnegative(),
})

const countDeltaSchema = z.object({
  count: z.number().nonnegative(),
  delta: z.number().nullable(),
})

export const marketSummarySchema = z.object({
  bestsellers: countDeltaSchema,
  trendingCreatives: countDeltaSchema,
  /** GMV somado do top 100 do ranking diário — não é o GMV do mercado inteiro */
  topGmv24h: z.object({
    amount: z.number().nonnegative(),
    deltaPct: z.number().nullable(),
  }),
  emerging: countDeltaSchema,
})
