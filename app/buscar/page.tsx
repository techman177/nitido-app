'use client'
import { Suspense, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import AdCard from '@/components/AdCard'

interface FotoAnuncio {
  url_imagen: string
}

interface Anuncio {
  id: number
  titulo: string
  descripcion: string
  precio: number
  ubicacion: string
  es_premium?: boolean
  anio?: number
  marca?: string
  fotos_anuncio: FotoAnuncio[]
  categorias: { nombre: string }
}

export default function BuscarPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    }>
      <BuscarPage />
    </Suspense>
  )
}

function BuscarPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [ads, setAds] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function searchData() {
      setLoading(true)
      
      if (!query.trim()) {
        setAds([])
        setLoading(false)
        return
      }

      // Buscar por título o descripción
      const { data, error } = await supabase
        .from('anuncios')
        .select(`
          *,
          fotos_anuncio (url_imagen),
          categorias (nombre)
        `)
        .or(`titulo.ilike.%${query}%,descripcion.ilike.%${query}%`)
        .order('es_premium', { ascending: false })
        .order('fecha_publicacion', { ascending: false })

      if (error) {
        console.error('Search error:', error)
      } else {
        setAds((data as unknown as Anuncio[]) || [])
      }
      setLoading(false)
    }

    searchData()
  }, [query])

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <Link href="/" className="text-sm font-bold text-blue-600 mb-2 block">← Volver al inicio</Link>
            <h1 className="text-3xl font-extrabold text-gray-900">
               Resultados para <span className="text-blue-600">&quot;{query}&quot;</span>
            </h1>
            <p className="text-gray-500 mt-1">{ads.length} anuncios encontrados</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : ads.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-gray-200">
             <div className="text-6xl mb-4">🕵️‍♂️</div>
             <p className="text-xl font-medium text-gray-500">No encontramos ningún anuncio que coincida.</p>
             <p className="text-sm text-gray-400 mt-2">Prueba usando palabras más generales o revisa la ortografía.</p>
             <Link href="/" className="inline-block mt-6 bg-blue-50 text-blue-600 font-bold px-6 py-2 rounded-lg hover:bg-blue-100 transition-colors">Volver a intentar</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad as unknown as Parameters<typeof AdCard>[0]['ad']} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
