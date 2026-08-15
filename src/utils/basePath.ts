/**
 * Prepends the Next.js basePath to an asset path.
 * Required because next/image with unoptimized:true in static export
 * does not automatically prepend basePath to src attributes.
 */
export function assetPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
  return `${base}${path}`
}

// Newer portfolio uploads currently live directly in /public/photos,
// while the original portfolio library lives in /public/photos/portfolio.
const rootPhotoFilenames = new Set([
  '278be70b-84b1-4307-a134-b0346450db53.jpg',
  'IMG_3527 3.jpg',
  'IMG_3811.jpg',
  'P1000206.JPG',
  'P1000209.JPG',
  'P1000251.JPG',
])

export function portfolioImagePath(filename: string): string {
  const folder = rootPhotoFilenames.has(filename) ? '/photos' : '/photos/portfolio'
  return assetPath(`${folder}/${filename}`)
}
