'use client'

import Image from 'next/image'
import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/plugins/captions.css'

export interface GalleryImage {
  src: string
  title?: string
  description?: string
  width?: number
  height?: number
}

interface GalleryProps {
  images: GalleryImage[]
  columns?: number
}

export default function Gallery({ images, columns = 3 }: GalleryProps) {
  const [index, setIndex] = useState(-1)

  const slides = images.map((img) => ({
    src: img.src,
    title: img.title,
    description: img.description,
  }))

  return (
    <>
      <div
        className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
        style={{ columnCount: columns }}
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="block w-full break-inside-avoid group cursor-zoom-in"
            aria-label={img.title || `View image ${i + 1}`}
          >
            <div className="relative overflow-hidden bg-[--color-gold-light]">
              <Image
                src={img.src}
                alt={img.title || ''}
                width={img.width || 800}
                height={img.height || 600}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {img.title && (
                <div className="absolute inset-0 bg-[--color-charcoal]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-white text-left">
                    <p className="font-serif text-lg">{img.title}</p>
                    {img.description && (
                      <p className="text-sm text-white/70 mt-1">{img.description}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        plugins={[Captions]}
        styles={{
          container: { backgroundColor: 'rgba(28, 28, 28, 0.97)' },
        }}
      />
    </>
  )
}
