import { NextResponse } from 'next/server'

const INSTAGRAM_API = 'https://graph.instagram.com/me/media'
const FIELDS = 'id,caption,media_url,thumbnail_url,permalink,media_type,timestamp'

export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'Instagram token not configured' }, { status: 503 })
  }

  try {
    const url = `${INSTAGRAM_API}?fields=${FIELDS}&limit=12&access_token=${token}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`Instagram API error: ${res.status}`)
    const data = await res.json()
    return NextResponse.json({ posts: data.data || [] })
  } catch (err) {
    console.error('Instagram fetch error:', err)
    return NextResponse.json({ posts: [] }, { status: 200 })
  }
}
