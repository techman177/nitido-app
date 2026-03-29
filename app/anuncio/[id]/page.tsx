import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'
import AnuncioDetails from './AnuncioDetails'

interface FotoAnuncio {
  url_imagen: string
}

interface Perfil {
  nombre_completo: string
  telefono?: string
  created_at?: string
}

interface Anuncio {
  id: number
  usuario_id: string
  titulo: string
  descripcion: string
  precio: number
  ubicacion: string
  marca?: string
  modelo?: string
  anio?: number
  transmision?: string
  combustible?: string
  fecha_publicacion: string
  fotos_anuncio: FotoAnuncio[]
  perfiles: Perfil
  categorias: { nombre: string }
}

type Props = {
  params: Promise<{ id: string }>
}

// GENERATE DYNAMIC METADATA FOR SEO & SOCIAL SHARING (WhatsApp, FB, etc.)
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id
  const supabase = await createClient()

  const { data: ad } = await supabase
    .from('anuncios')
    .select(`
      *,
      fotos_anuncio (url_imagen),
      perfiles (nombre_completo),
      categorias (nombre)
    `)
    .eq('id', parseInt(id))
    .single()

  if (!ad) return { title: 'Anuncio no encontrado | NÍTIDO' }

  const previousImages = (await parent).openGraph?.images || []
  const mainImage = ad.fotos_anuncio?.[0]?.url_imagen || '/og-image.jpg'
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nitidord.com'
  const adUrl = `${siteUrl}/anuncio/${id}`
  const priceFormatted = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(ad.precio)

  return {
    title: `${ad.titulo} | ${priceFormatted} | NÍTIDO`,
    description: `${ad.descripcion.substring(0, 160)}... Ubicado en ${ad.ubicacion}. ¡Vende y compra en NÍTIDO!`,
    openGraph: {
      title: `${ad.titulo} - ${priceFormatted}`,
      description: ad.descripcion.substring(0, 200),
      url: adUrl,
      siteName: 'NÍTIDO',
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 630,
          alt: ad.titulo,
        },
        ...previousImages,
      ],
      locale: 'es_DO',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ad.titulo,
      description: ad.descripcion.substring(0, 160),
      images: [mainImage],
    },
    alternates: {
      canonical: adUrl,
    },
  }
}

export default async function Page({ params }: Props) {
  const id = (await params).id
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('anuncios')
    .select(`
      *,
      fotos_anuncio (url_imagen),
      perfiles (nombre_completo, telefono, created_at),
      categorias (nombre)
    `)
    .eq('id', parseInt(id))
    .single()

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl max-w-lg w-full">
          <span className="text-5xl mb-4 block">🚨</span>
          <h1 className="text-2xl font-black text-white mb-2">Anuncio inaccesible</h1>
          <p className="text-white/60 mb-4 text-sm">El anuncio fue creado, pero la base de datos bloquea su lectura. Detalle técnico:</p>
          <code className="block bg-black/50 p-4 rounded-xl text-red-400 text-xs text-left overflow-auto">
            {error ? JSON.stringify(error, null, 2) : "data is null"}
          </code>
        </div>
      </div>
    )
  }

  const ad = data as unknown as Anuncio
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nitidord.com'

  // STRUCTURED DATA (JSON-LD) FOR GOOGLE PRODUCT SEARCH
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ad.marca ? 'Car' : 'Product', // Detect if it's a car or generic product
    name: ad.titulo,
    image: ad.fotos_anuncio?.map(f => f.url_imagen),
    description: ad.descripcion,
    sku: `AD-${ad.id}`,
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/anuncio/${ad.id}`,
      priceCurrency: 'DOP',
      price: ad.precio,
      itemCondition: 'https://schema.org/UsedCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Person',
        name: ad.perfiles?.nombre_completo
      }
    },
    brand: ad.marca ? { '@type': 'Brand', name: ad.marca } : undefined,
    model: ad.modelo,
    productionDate: ad.anio?.toString(),
  }

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnuncioDetails ad={ad} currentUser={user} />
    </>
  )
}
