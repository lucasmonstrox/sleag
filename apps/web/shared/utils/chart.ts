export function buildLinePath(
  data: number[],
  width = 100,
  height = 40,
  pad = 4,
): string {
  if (data.length === 0) return ""

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1 || 1)
  const points = data.map(
    (value, index) =>
      [
        index * stepX,
        height - pad - ((value - min) / range) * (height - pad * 2),
      ] as const,
  )

  let path = `M${points[0]![0].toFixed(2)},${points[0]![1].toFixed(2)}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]!
    const p1 = points[i]!
    const p2 = points[i + 1]!
    const p3 = points[Math.min(points.length - 1, i + 2)]!
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    path += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`
  }

  return path
}

export function buildAreaPath(
  data: number[],
  width = 100,
  height = 40,
  pad = 4,
): string {
  if (data.length === 0) return ""
  return `${buildLinePath(data, width, height, pad)} L${width},${height} L0,${height} Z`
}

export function getInitials(name: string): string {
  const clean = name.replace(/^@/, "")
  const words = clean.split(/[\s-]+/).filter(Boolean)
  if (words.length >= 2) {
    return `${words[0]![0]}${words[1]![0]}`.toUpperCase()
  }
  return clean.slice(0, 2).toUpperCase()
}
