import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data } = await supabase
    .from('anuncios')
    .select(`
      titulo,
      descripcion,
      precio,
      fotos_anuncio (url_imagen),
      categorias (nombre)
    `)
    .eq('id', id)
    .single()

  if (!data) {
    return {
      title: 'Anuncio no encontrado | NÍTIDO',
      description: 'El anuncio que buscas no existe o fue eliminado.'
    }
  }

  const imageUrl = data.fotos_anuncio?.[0]?.url_imagen || ''
  const categoryData = data.categorias as unknown as { nombre: string } | undefined
  const isConectar = categoryData?.nombre?.toLowerCase() === 'conectar'
  const descPrefix = isConectar ? 'Conoce a esta persona en NÍTIDO. ' : `DOP ${data.precio.toLocaleString()} - `

  return {
    title: `${data.titulo} | NÍTIDO`,
    description: `${descPrefix}${data.descripcion.substring(0, 150)}...`,
    openGraph: {
      title: `${data.titulo} | NÍTIDO`,
      description: `${descPrefix}NÍTIDO.`,
      images: imageUrl ? [imageUrl] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.titulo,
      description: `${descPrefix}NÍTIDO.`,
      images: imageUrl ? [imageUrl] : [],
    }
  }
}

export default function AnuncioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
