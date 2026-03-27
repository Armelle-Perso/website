'use client'

import { ReactNode, useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface Slide {
  src: string
  alt?: string
}

interface FullscreenImageProps {
  slides: Slide[]
  index: number
  children: ReactNode
  /** Full href for each slide, e.g. "/art/paintings/lightcodes-2021/some-artwork" */
  hrefs?: string[]
}

export default function FullscreenImage({ slides, index, children, hrefs }: FullscreenImageProps) {
  const [open, setOpen] = useState(false)
  const currentIndex = useRef(index)
  const router = useRouter()

  const handleClose = useCallback(() => {
    setOpen(false)
    // If user navigated to a different slide, go to that artwork's page
    if (hrefs && currentIndex.current !== index) {
      const target = hrefs[currentIndex.current]
      if (target) {
        router.push(target)
      }
    }
  }, [hrefs, index, router])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in"
        aria-label="View fullscreen"
      >
        {children}
      </button>

      <Lightbox
        open={open}
        close={handleClose}
        index={index}
        slides={slides}
        on={{ view: ({ index: i }) => { currentIndex.current = i } }}
        styles={{
          container: { backgroundColor: 'rgba(28, 28, 28, 0.97)' },
        }}
      />
    </>
  )
}
