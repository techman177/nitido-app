'use client'
import { useState, useMemo, useTransition, useEffect } from 'react'
import AdCard from './AdCard'
import CategoryBar from './CategoryBar'
import LocationFilter from './LocationFilter'
import PriceRangeSlider from './PriceRangeSlider'
import { useRouter, useSearchParams } from 'next/navigation'

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

interface Category {
  id: number
  nombre: string
  slug: string
  icono: string
}

interface HomeAdsGalleryProps {
  initialAds: Anuncio[]
  categories: Category[]
}

export default function HomeAdsGallery({ initialAds, categories }: HomeAdsGalleryProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')

  // Sincronizar búsqueda local con URL al escribir
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchTerm) {
        params.set('q', searchTerm)
      } else {
        params.delete('q')
      }
      startTransition(() => {
        router.push(`/?${params.toString()}`, { scroll: false })
      })
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, router, searchParams])

  // Aunque el filtrado ahora es mayormente del lado del servidor (Supabase),
  // mantenemos un filtrado local para la búsqueda instantánea (debounced)
  const filteredAds = useMemo(() => {
    return initialAds.filter(ad => {
      const matchesSearch = ad.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           ad.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ad.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })
  }, [initialAds, searchTerm])

  return (
    <div className="space-y-12 relative">
      {/* ⚡ SPINNER DORADO DE CARGA ⚡ */}
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
          <div className="w-16 h-16 border-4 border-[#B49248]/20 border-t-[#E5CC89] rounded-full animate-spin shadow-[0_0_20px_rgba(180,146,72,0.4)]"></div>
        </div>
      )}

      {/* 1. SECCIÓN DE CATEGORÍAS (GOLD SHINE) */}
      <CategoryBar categories={categories} />

      {/* 2. BARRA DE BÚSQUEDA Y FILTROS AVANZADOS */}
      <div className="space-y-4 px-2 sm:px-0">
        <div className="bg-[#0a0a0b]/80 p-2 rounded-[2.5rem] border border-white/10 shadow-2xl sticky top-20 z-40 backdrop-blur-2xl">
          <div className="flex flex-col lg:flex-row gap-2">
            
            {/* Search Input */}
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-[#B49248] opacity-50 group-focus-within:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="¿Qué buscas?" 
                className="w-full pl-14 pr-6 py-4 md:py-5 bg-transparent text-white placeholder-white/20 outline-none font-bold text-base md:text-lg transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Location Selector */}
            <div className="lg:w-80">
               <LocationFilter />
            </div>
          </div>
        </div>

        {/* Price Slider Section */}
        <div className="max-w-md ml-auto">
          <PriceRangeSlider />
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-4">
        <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em]">
          {filteredAds.length} resultados encontrados
        </p>
        <div className="h-px flex-1 mx-8 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      </div>

      {/* Ads Grid */}
      {filteredAds.length === 0 ? (
        <div className="py-40 text-center animate-in fade-in zoom-in duration-700 px-6">
          <div className="relative inline-block mb-10">
            <div className="absolute inset-0 bg-[#B49248] blur-[60px] opacity-20 animate-pulse"></div>
            <div className="w-28 h-28 bg-gradient-to-tr from-[#B49248] to-[#E5CC89] rounded-full relative flex items-center justify-center text-5xl shadow-[0_0_50px_rgba(180,146,72,0.3)]">
              ✨
            </div>
          </div>
          <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">Tu búsqueda no tiene límites,</h3>
          <p className="text-white/30 font-medium text-lg max-w-sm mx-auto">Pero no encontramos nada con estos filtros. Prueba algo nuevo.</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-10 text-[#E5CC89] font-black uppercase tracking-widest text-xs hover:text-white transition-colors"
          >
            Limpiar búsqueda →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-20 px-4 sm:px-0">
          {filteredAds.map((ad, idx) => (
            <div key={ad.id} className="animate-in fade-in slide-in-from-bottom-5 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
              <AdCard ad={ad} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
