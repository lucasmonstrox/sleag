import { Suspense } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import { SkeletonChart, TrendChart } from "@/shared"

import { MARKET_TREND_DAYS } from "../../consts"
import { getMarketTrend } from "../../services/dashboard"
import { buildChartLabels } from "../../utils/format"

export function MarketTrendCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendência de conteúdo × venda</CardTitle>
        <CardDescription>
          GMV estimado do mercado e volume de vídeos nos últimos 30 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<SkeletonChart variant="area" size="hero" />}>
          <MarketTrendChart />
        </Suspense>
      </CardContent>
    </Card>
  )
}

async function MarketTrendChart() {
  const trend = await getMarketTrend(MARKET_TREND_DAYS)

  return (
    <TrendChart
      size="hero"
      xLabels={buildChartLabels(
        trend.map((point) => point.date),
        7,
      )}
      series={[
        {
          label: "GMV estimado",
          data: trend.map((point) => point.estimatedGmv),
          strokeClassName: "stroke-[#25F4EE]",
          fillClassName: "fill-[#25F4EE]/10",
          dotClassName: "bg-[#25F4EE]",
        },
        {
          label: "Vídeos publicados",
          data: trend.map((point) => point.videosPublished),
          strokeClassName: "stroke-[#FE2C55]",
          dotClassName: "bg-[#FE2C55]",
        },
      ]}
    />
  )
}
