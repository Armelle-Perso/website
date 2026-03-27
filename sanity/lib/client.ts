import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})

/** Safely fetch from Sanity — returns null if not configured */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function safeFetch<T>(query: string, params?: any): Promise<T | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (client.fetch as any)(query, params)
  } catch {
    return null
  }
}
