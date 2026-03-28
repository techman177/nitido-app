'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'

import { Session } from '@supabase/supabase-js'

interface FotoAnuncio {
  url_imagen: string
}

interface PerfilData {
  id: string
  nombre_completo: string
}

interface Anuncio {
  id: number
  titulo: string
  precio: number
  ubicacion: string
  fecha_publicacion: string
  es_premium?: boolean
  fotos_anuncio: FotoAnuncio[]
  categorias: { nombre: string }
}

export default function PerfilPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<PerfilData | null>(null)
  const [ads, setAds] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      
      // Asegurar que el caché del cliente esté fresco
      router.refresh()
      
      // Mock session for compatibility with legacy UI if needed
      setSession({ user } as Session)

      // Fetch Profile
      const { data: profileData } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileData) setProfile(profileData)

      // Fetch My Ads
      const { data: adsData } = await supabase
        .from('anuncios')
        .select(`
          id, titulo, precio, ubicacion, fecha_publicacion, es_premium,
          fotos_anuncio (url_imagen),
          categorias (nombre)
        `)
        .eq('usuario_id', user.id)
        .order('fecha_publicacion', { ascending: false })

      if (adsData) {
         setAds(adsData as unknown as Anuncio[])
      }

      setLoading(false)
    }

    loadData()
  }, [router])

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este anuncio? Esta acción no se puede deshacer.')) return
    
    setDeleteLoading(id)
    
    // Primero borrar las fotos relacionadas en la tabla fotos_anuncio
    await supabase.from('fotos_anuncio').delete().eq('anuncio_id', id)
    // Luego borrar el anuncio
    const { error } = await supabase.from('anuncios').delete().eq('id', id)
    
    if (!error) {
      setAds(ads.filter(ad => ad.id !== id))
    } else {
      alert('Hubo un error al eliminar el anuncio.')
    }
    setDeleteLoading(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 mb-12">
          <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-4xl font-black">
            {profile?.nombre_completo?.charAt(0).toUpperCase() || session?.user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-gray-900">{profile?.nombre_completo || 'Usuario NÍTIDO'}</h1>
            <p className="text-gray-500 font-medium">{session?.user.email}</p>
          </div>
          <div className="md:ml-auto">
             <Link href="/publicar" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
               Publicar Nuevo Anuncio
             </Link>
          </div>
        </div>

        {/* Ads Grid */}
        <h2 className="text-2xl font-bold mb-6">Mis Anuncios ({ads.length})</h2>
        
        {ads.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl text-center border border-dashed border-gray-200">
             <div className="text-6xl mb-4">🛒</div>
             <p className="text-xl font-medium text-gray-500 mb-6">Aún no has publicado ningún anuncio.</p>
             <Link href="/publicar" className="text-blue-600 font-bold hover:underline">Empieza a vender hoy mismo →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col">
                <div className="relative h-48 bg-gray-100">
                  {ad.es_premium && (
                    <div className="absolute inset-0 border-4 border-yellow-400 z-10 pointer-events-none rounded-t-3xl shadow-[inset_0_0_20px_rgba(250,204,21,0.5)]"></div>
                  )}
                  {ad.fotos_anuncio && ad.fotos_anuncio.length > 0 ? (
                    <Image 
                      src={ad.fotos_anuncio[0].url_imagen} 
                      alt={ad.titulo} 
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2 z-20">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-700 uppercase shadow-sm">
                      {ad.categorias?.nombre}
                    </div>
                    {ad.es_premium && (
                      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-2 py-1 rounded-md text-xs font-black uppercase shadow-md flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        Premium
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 leading-tight mb-1 line-clamp-1">{ad.titulo}</h3>
                  <div className="text-lg font-black text-blue-600 mb-4">
                    DOP {ad.precio.toLocaleString()}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between gap-2 overflow-x-auto pb-1">
                    <Link href={`/anuncio/${ad.id}`} className="text-sm font-semibold text-gray-500 hover:text-blue-600 flex-shrink-0">
                      Ver anuncio
                    </Link>
                    
                    <div className="flex items-center gap-2 md:gap-3 ml-auto shrink-0">
                      {!ad.es_premium && (
                        <Link 
                          href={`/checkout/${ad.id}`}
                          className="text-sm font-bold bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm whitespace-nowrap"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                          <span className="hidden sm:inline">Destacar</span>
                        </Link>
                      )}
                      
                      <Link 
                        href={`/editar/${ad.id}`}
                        className="text-sm font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm whitespace-nowrap"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        <span className="hidden sm:inline">Editar</span>
                      </Link>

                      <button 
                        onClick={() => handleDelete(ad.id)}
                        disabled={deleteLoading === ad.id}
                        className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap"
                      >
                        {deleteLoading === ad.id ? (
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        )}
                        <span className="hidden sm:inline">Eliminar</span>
                      </button>
                    </div>
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
