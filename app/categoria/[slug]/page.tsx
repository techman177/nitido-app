'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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
  marca?: string
  modelo?: string
  transmision?: string
  anio?: number
  fotos_anuncio: FotoAnuncio[]
}

interface Categoria {
  id: number
  nombre: string
}

export default function CategoriaPage() {
  const params = useParams()
  const slug = params.slug as string
  const [ads, setAds] = useState<Anuncio[]>([])
  const [category, setCategory] = useState<Categoria | null>(null)
  const [loading, setLoading] = useState(true)

  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [appliedMin, setAppliedMin] = useState<number | null>(null)
  const [appliedMax, setAppliedMax] = useState<number | null>(null)
  
  // Connection Filters
  const [minAge, setMinAge] = useState('')
  const [maxAge, setMaxAge] = useState('')
  const [appliedMinAge, setAppliedMinAge] = useState<number | null>(null)
  const [appliedMaxAge, setAppliedMaxAge] = useState<number | null>(null)
  const [genderFilter, setGenderFilter] = useState('')
  const [appliedGender, setAppliedGender] = useState('')

  const isConectar = category?.nombre?.toLowerCase() === 'conectar'

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      
      // Intentamos buscar la categoría por nombre, siendo flexibles con los acentos para "vehículos"
      const variations = [slug];
      const lowerSlug = slug.toLowerCase();
      if (lowerSlug === 'vehiculos') variations.push('Vehículos');
      if (lowerSlug === 'vehículos') variations.push('Vehiculos');

      let foundCat: Categoria | null = null;
      for (const v of variations) {
        const { data } = await supabase.from('categorias').select('*').ilike('nombre', v).single();
        if (data) {
          foundCat = data as Categoria;
          break;
        }
      }

      if (!foundCat) {
        setLoading(false)
        return
      }
      setCategory(foundCat)

      // 2. Fetch ads with their images
      let adsQuery = supabase
        .from('anuncios')
        .select(`
          *,
          fotos_anuncio (url_imagen)
        `)
        .eq('categoria_id', foundCat.id);

      if (foundCat.nombre.toLowerCase() !== 'conectar') {
        if (appliedMin !== null) adsQuery = adsQuery.gte('precio', appliedMin);
        if (appliedMax !== null) adsQuery = adsQuery.lte('precio', appliedMax);
      } else {
        if (appliedMinAge !== null) adsQuery = adsQuery.gte('anio', appliedMinAge);
        if (appliedMaxAge !== null) adsQuery = adsQuery.lte('anio', appliedMaxAge);
        if (appliedGender) adsQuery = adsQuery.eq('marca', appliedGender); // Soy (marca) = Lo que busco filtar
      }

      const { data: adsData, error: adsError } = await adsQuery
        .order('es_premium', { ascending: false })
        .order('fecha_publicacion', { ascending: false })

      if (adsError) {
        console.error('Error fetching ads:', adsError)
      } else {
        setAds((adsData as unknown as Anuncio[]) || [])
      }
      setLoading(false)
    }

    if (slug) fetchData()
  }, [slug, appliedMin, appliedMax, appliedMinAge, appliedMaxAge, appliedGender])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!category && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
        <div className="text-6xl mb-4">🤷‍♂️</div>
        <h1 className="text-3xl font-bold mb-2">Categoría no encontrada</h1>
        <p className="text-gray-500 mb-8">Parece que lo que buscas no está por aquí (por ahora).</p>
        <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg">Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/" className="text-sm font-bold text-blue-600 mb-2 block">← Volver al inicio</Link>
            {category && (
              <h1 className="text-4xl font-extrabold capitalize">{category.nombre} <span className="text-gray-300 font-light">|</span> {ads.length} {isConectar ? 'perfiles' : 'anuncios'}</h1>
            )}
          </div>
          
          {/* Controles de Filtro */}
          <div className={`bg-white p-3 rounded-2xl shadow-sm border ${isConectar ? 'border-pink-100 bg-pink-50/20' : 'border-gray-100'} flex items-end gap-3 w-full md:w-auto overflow-x-auto`}>
            {!isConectar ? (
              <>
                <div className="flex-1 md:w-32">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Precio Mín.</label>
                  <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Ej. 1000" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white transition-colors" />
                </div>
                <div className="flex-1 md:w-32">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Precio Máx.</label>
                  <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Sin límite" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white transition-colors" />
                </div>
                <button 
                  onClick={() => { setAppliedMin(minPrice ? Number(minPrice) : null); setAppliedMax(maxPrice ? Number(maxPrice) : null); }} 
                  className="bg-blue-600 text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                >
                  Filtrar
                </button>
              </>
            ) : (
              <>
                <div className="flex-1 md:w-24">
                  <label className="block text-[10px] font-bold text-pink-500 uppercase tracking-wider mb-1 px-1">Edad Mín.</label>
                  <input type="number" value={minAge} onChange={e => setMinAge(e.target.value)} placeholder="18" className="w-full bg-white border border-pink-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-pink-500 transition-colors text-pink-900" />
                </div>
                <div className="flex-1 md:w-24">
                  <label className="block text-[10px] font-bold text-pink-500 uppercase tracking-wider mb-1 px-1">Edad Máx.</label>
                  <input type="number" value={maxAge} onChange={e => setMaxAge(e.target.value)} placeholder="99" className="w-full bg-white border border-pink-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-pink-500 transition-colors text-pink-900" />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-[10px] font-bold text-pink-500 uppercase tracking-wider mb-1 px-1">Soy</label>
                  <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)} className="w-full bg-white border border-pink-100 rounded-xl px-2 py-2 text-sm outline-none focus:border-pink-500 text-pink-900 font-medium">
                    <option value="">Todos</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                  </select>
                </div>
                <button 
                  onClick={() => { setAppliedMinAge(minAge ? Number(minAge) : null); setAppliedMaxAge(maxAge ? Number(maxAge) : null); setAppliedGender(genderFilter); }} 
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold px-5 py-2 rounded-xl text-sm hover:from-pink-600 hover:to-rose-600 transition-all shadow-[0_4px_10px_rgba(244,63,94,0.3)] ml-2 whitespace-nowrap"
                >
                  Filtrar 💕
                </button>
              </>
            )}
          </div>
        </div>

        {ads.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-gray-200">
             <div className="text-5xl mb-4">⌛</div>
             <p className="text-xl font-medium text-gray-500">Todavía no hay anuncios en esta categoría.</p>
             <p className="text-sm text-gray-400 mt-2">¡Sé el primero en publicar el tuyo!</p>
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
