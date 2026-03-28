'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'

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
  fotos_anuncio: FotoAnuncio[]
  categorias: { nombre: string }
}

export default function FavoritosPage() {
  const [ads, setAds] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFavorites() {
      const savedIds = JSON.parse(localStorage.getItem('favoritos_nitido') || '[]')
      
      if (savedIds.length === 0) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('anuncios')
        .select(`
          *,
          fotos_anuncio (url_imagen),
          categorias (nombre)
        `)
        .in('id', savedIds)

      if (!error && data) {
        setAds(data as unknown as Anuncio[])
      }
      setLoading(false)
    }

    loadFavorites()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
               Mis Favoritos 🤍
            </h1>
            <p className="text-gray-500 font-medium">Tus anuncios guardados en este dispositivo.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : ads.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl text-center border border-dashed border-gray-200 max-w-2xl mx-auto shadow-sm">
             <div className="text-6xl mb-6">👻</div>
             <p className="text-2xl font-bold text-gray-900 mb-2">Tu lista está vacía</p>
             <p className="text-gray-500 mb-8">Navega por las categorías y guarda los anuncios que te gusten para verlos más tarde.</p>
             <Link href="/" className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">Explorar NÍTIDO</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ads.map((ad) => (
              <div key={ad.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col border border-gray-100">
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  {ad.fotos_anuncio && ad.fotos_anuncio.length > 0 ? (
                    <Image 
                      src={ad.fotos_anuncio[0].url_imagen} 
                      alt={ad.titulo} 
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 uppercase shadow-sm">
                      {ad.categorias?.nombre} • {ad.ubicacion}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold leading-tight line-clamp-2 text-gray-900">{ad.titulo}</h3>
                    <span className="text-xl font-black text-blue-600 whitespace-nowrap ml-2">
                      DOP {ad.precio.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{ad.descripcion}</p>
                  
                  <div className="h-px bg-gray-100 mb-4"></div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-semibold text-gray-400">Guardado en Favoritos</span>
                    <Link href={`/anuncio/${ad.id}`} className="text-sm font-bold text-blue-600 hover:text-blue-700">Ver Detalles</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
