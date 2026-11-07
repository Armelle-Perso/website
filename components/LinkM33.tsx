import { Fragment } from 'react'

export const M33_URL = 'https://atelierm33.com'

// Every mention of the M33 studio becomes a link to its site, in a new tab.
// "M33-1" (a painting title) is left alone.
export default function LinkM33({ text }: { text: string }) {
  const parts = text.split(/(\bM33\b(?!-))/g)
  if (parts.length === 1) return <>{text}</>
  return (
    <>
      {parts.map((part, i) =>
        part === 'M33' ? (
          <a key={i} href={M33_URL} target="_blank" rel="noopener noreferrer" className="border-b border-[--color-gold] hover:text-[--color-gold] transition-colors duration-300">
            M33
          </a>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  )
}
