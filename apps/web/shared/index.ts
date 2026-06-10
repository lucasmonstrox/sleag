export { PageShell } from "./components/page-shell"
export { PageHeader } from "./components/page-header"

// Utils
export { getInitials } from "./utils/chart"
export {
  formatBrl,
  formatBrlCompact,
  formatCompact,
  formatDeltaPct,
  formatInteger,
  formatSignedInteger,
} from "./utils/format"
export { THUMB_TONES } from "./consts"

// Dados mockados
export { KpiRow, type Kpi } from "./components/data/kpi-row"
export { DataTable, type DataColumn } from "./components/data/data-table"
export { Delta } from "./components/data/delta"
export { MediaCell } from "./components/data/media-cell"
export { ScorePill } from "./components/data/score-pill"
export { Sparkline } from "./components/data/sparkline"
export { TrendChart, type TrendSeries } from "./components/data/trend-chart"
export { MiniBars } from "./components/data/mini-bars"
export { Gauge } from "./components/data/gauge"
export { SubscoreBars, type Subscore } from "./components/data/subscore-bars"
export {
  QuadrantScatter,
  type QuadrantDot,
} from "./components/data/quadrant-scatter"
export { VideoGrid, type VideoItem } from "./components/data/video-grid"
export { EventList, type EventItem } from "./components/data/event-list"
export { FilterBar } from "./components/data/filter-bar"

// Skeletons (loading states futuros)
export { SkeletonKpiRow } from "./components/skeletons/skeleton-kpi-row"
export { SkeletonChart } from "./components/skeletons/skeleton-chart"
export { SkeletonSparkline } from "./components/skeletons/skeleton-sparkline"
export { SkeletonTable, type SkeletonColumn } from "./components/skeletons/skeleton-table"
export { SkeletonFilterBar } from "./components/skeletons/skeleton-filter-bar"
export { SkeletonList } from "./components/skeletons/skeleton-list"
export { SkeletonQuadrant } from "./components/skeletons/skeleton-quadrant"
export { SkeletonGauge } from "./components/skeletons/skeleton-gauge"
export { SkeletonSubscores } from "./components/skeletons/skeleton-subscores"
export { SkeletonVideoGrid } from "./components/skeletons/skeleton-video-grid"
