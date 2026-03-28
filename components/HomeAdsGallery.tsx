'use client'
import { useState, useMemo } from 'react'
import AdCard from './AdCard'

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

interface HomeAdsGalleryProps {
  initialAds: Anuncio[]
}

export default function HomeAdsGallery({ initialAds }: HomeAdsGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [selectedPriceRange, setSelectedPriceRange] = useState('Todos')

  const categories = ['Todas', ...Array.from(new Set(initialAds.map(ad => ad.categorias?.nombre)))]

  const filteredAds = useMemo(() => {
    return initialAds.filter(ad => {
      const matchesSearch = ad.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           ad.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ad.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'Todas' || ad.categorias?.nombre === selectedCategory
      
      let matchesPrice = true
      if (selectedPriceRange === 'Bajo') matchesPrice = ad.precio < 1000
      if (selectedPriceRange === 'Medio') matchesPrice = ad.precio >= 1000 && ad.precio <= 5000
      if (selectedPriceRange === 'Alto') matchesPrice = ad.precio > 5000

      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [initialAds, searchTerm, selectedCategory, selectedPriceRange])

  return (
    <div className="space-y-12">
      {/* Search and Filters Bar */}
      <div className="bg-[#0a0a0a] p-2 rounded-[2.5rem] border border-white/5 shadow-2xl sticky top-24 z-40 backdrop-blur-xl bg-black/40">
        <div className="flex flex-col md:flex-row gap-2">
          {/* Search Input */}
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-[#B49248] opacity-50 group-focus-within:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="¿Qué buscas hoy?" 
              className="w-full pl-14 pr-6 py-5 bg-transparent text-white placeholder-white/20 outline-none font-bold text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 p-1">
            <select 
              className="bg-white/5 text-[#E5CC89] px-6 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest border border-white/5 outline-none cursor-pointer hover:bg-white/10 transition-colors appearance-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="Todas">Categorías</option>
              {categories.filter(c => c !== 'Todas').map(cat => (
                <option key={cat} value={cat} className="bg-black text-white">{cat}</option>
              ))}
            </select>

            <select 
              className="bg-white/5 text-[#E5CC89] px-6 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest border border-white/5 outline-none cursor-pointer hover:bg-white/10 transition-colors appearance-none"
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
            >
              <option value="Todos">Precios</option>
              <option value="Bajo" className="bg-black text-white">Menos de $1,000</option>
              <option value="Medio" className="bg-black text-white">$1,000 - $5,000</option>
              <option value="Alto" className="bg-black text-white">Más de $5,000</option>
            </select>
          </div>
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
        <div className="py-32 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-gradient-to-tr from-[#B49248] to-[#E5CC89] rounded-full mx-auto mb-8 flex items-center justify-center text-4xl shadow-[0_0_50px_rgba(180,146,72,0.2)]">
            🔍
          </div>
          <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">No encontramos nada similar</h3>
          <p className="text-white/40 font-medium">Prueba con otros términos o filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
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
