/**
 * Parse artwork dimensions string (e.g. "27 × 100 cm") into height and width.
 * Art convention: first number is height, second is width.
 */
export function parseDimensions(dim: string | undefined | null): { h: number; w: number } | null {
  if (!dim) return null
  const match = dim.match(/(\d+(?:[.,]\d+)?)\s*[×xX]\s*(\d+(?:[.,]\d+)?)/)
  if (!match) return null
  return { h: parseFloat(match[1].replace(',', '.')), w: parseFloat(match[2].replace(',', '.')) }
}

/**
 * Compute the max diagonal across a list of dimension strings.
 * Used as the reference for relative scaling.
 */
export function getMaxDiagonal(dimensionsList: (string | undefined | null)[]): number {
  let max = 0
  for (const d of dimensionsList) {
    const dims = parseDimensions(d)
    if (dims) {
      const diag = Math.sqrt(dims.w ** 2 + dims.h ** 2)
      if (diag > max) max = diag
    }
  }
  return max
}

/**
 * Returns the scale factor (0.4–1.0) for an artwork based on its physical size.
 * Uses sqrt scaling so differences between small and mid-size paintings
 * are visible, not just between tiny and huge ones.
 * Penalizes extreme aspect ratios (>3:1) so very tall/narrow pieces
 * don't dominate the grid.
 */
export function getScale(
  dimensions: string | undefined | null,
  maxDiag: number
): number | null {
  const dims = parseDimensions(dimensions)
  if (!dims || maxDiag === 0) return null
  const diag = Math.sqrt(dims.w ** 2 + dims.h ** 2)
  const aspect = Math.max(dims.h / dims.w, dims.w / dims.h)
  const aspectPenalty = aspect > 3 ? 0.4 + 0.6 * (3 / aspect) : 1
  // sqrt mapping: 0.4 base + 0.6 * sqrt(ratio), then penalize extreme ratios
  return (0.4 + 0.6 * Math.sqrt(diag / maxDiag)) * aspectPenalty
}
