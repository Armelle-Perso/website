import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Armelle Boussidan — Artist & Consultant'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  const cormorantFont = fetch(
    'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3YmX5slCNuHLi8bLeY9MK7whWMhyjYrEtFmSu5.woff'
  ).then((res) => res.arrayBuffer())

  const plusJakartaFont = fetch(
    'https://fonts.gstatic.com/s/plusjakartasans/v8/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko70yygg_vb.woff'
  ).then((res) => res.arrayBuffer())

  const [cormorantData, plusJakartaData] = await Promise.all([cormorantFont, plusJakartaFont])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF9F6',
          padding: '60px',
        }}
      >
        <div
          style={{
            fontFamily: 'Cormorant Garamond',
            fontSize: 72,
            fontWeight: 300,
            color: '#1C1C1C',
            letterSpacing: '-1px',
            lineHeight: 0.9,
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          Armelle Boussidan
        </div>

        {/* Gold accent line */}
        <div
          style={{
            width: 60,
            height: 2,
            backgroundColor: '#C4A882',
            marginBottom: 24,
          }}
        />

        <div
          style={{
            fontFamily: 'Plus Jakarta Sans',
            fontSize: 20,
            fontWeight: 300,
            color: '#C4A882',
            letterSpacing: '4px',
            textTransform: 'uppercase' as const,
          }}
        >
          Artist & Consultant
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Cormorant Garamond',
          data: cormorantData,
          weight: 300,
          style: 'normal',
        },
        {
          name: 'Plus Jakarta Sans',
          data: plusJakartaData,
          weight: 300,
          style: 'normal',
        },
      ],
    }
  )
}
