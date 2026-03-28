'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { User } from '@supabase/supabase-js'

interface FotoAnuncio {
  url_imagen: string
}

interface Perfil {
  nombre_completo: string
  telefono?: string
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

interface AnuncioDetailsProps {
  ad: Anuncio
  currentUser: User | null
}

export default function AnuncioDetails({ ad, currentUser }: AnuncioDetailsProps) {
  const adId = ad.id.toString()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

  // Consultar localStorage al cargar
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favoritos_nitido') || '[]')
    if (saved.includes(adId)) {
      setIsSaved(true)
    }
  }, [adId])

  const toggleSave = () => {
    let saved = JSON.parse(localStorage.getItem('favoritos_nitido') || '[]')
    if (isSaved) {
      saved = saved.filter((id: string) => id !== adId)
    } else {
      if (!saved.includes(adId)) saved.push(adId)
    }
    localStorage.setItem('favoritos_nitido', JSON.stringify(saved))
    setIsSaved(!isSaved)
  }

  const images = ad.fotos_anuncio?.map(f => f.url_imagen) || []
  const hasImages = images.length > 0
  const sellerPhone = ad.perfiles?.telefono?.replace(/\D/g, '') || "18290000000"
  const esConectar = ad.categorias?.nombre?.toLowerCase() === 'conectar'
  const whatsappUrl = `https://wa.me/${sellerPhone}?text=Hola,%20me%20interesa%20tu%20${esConectar ? 'perfil' : 'anuncio'}%20de%20NÍTIDO:%20${encodeURIComponent(ad.titulo)}`
  const isOwner = currentUser?.id === ad.usuario_id

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* BREADCRUMBS SEO IMPROVEMENT */}
        <nav className="flex mb-6 text-sm font-medium text-gray-500 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
          <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
          <span className="mx-2">/</span>
          <Link href={`/categoria/${ad.categorias?.nombre?.toLowerCase() || ''}`} className="hover:text-blue-600 transition-colors">
            {ad.categorias?.nombre || 'Categorías'}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 truncate max-w-[200px]">{ad.titulo}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* GALERÍA DE IMÁGENES (Lado Izquierdo) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-video lg:aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden shadow-sm border border-gray-200 group">
              {hasImages ? (
                <Image 
                  src={images[activeImageIndex]} 
                  alt={ad.titulo} 
                  fill 
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <svg className="w-20 h-20 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="font-medium text-sm">Sin imágenes disponibles</span>
                </div>
              )}
            </div>

            {hasImages && images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 snap-start rounded-xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-blue-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={img} alt={`Miniatura ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
            
            {/* Detalles Técnicos Vehículos */}
            {(ad.marca || ad.modelo || ad.anio) && (
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 mt-8">
                <h3 className="font-bold text-gray-900 mb-6 text-xl">Características Específicas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {ad.marca && (
                     <div>
                       <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Marca</span>
                       <span className="font-medium text-gray-900">{ad.marca}</span>
                     </div>
                  )}
                  {ad.modelo && (
                     <div>
                       <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Modelo</span>
                       <span className="font-medium text-gray-900">{ad.modelo}</span>
                     </div>
                  )}
                  {ad.anio && (
                     <div>
                       <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Año</span>
                       <span className="font-medium text-gray-900">{ad.anio}</span>
                     </div>
                  )}
                  {ad.transmision && (
                     <div>
                       <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Transmisión</span>
                       <span className="font-medium text-gray-900">{ad.transmision}</span>
                     </div>
                  )}
                  {ad.combustible && (
                     <div>
                       <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Combustible</span>
                       <span className="font-medium text-gray-900">{ad.combustible}</span>
                     </div>
                  )}
                </div>
              </div>
            )}

            {/* Descripción */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 mt-8">
              <h3 className="font-bold text-gray-900 mb-4 text-xl">Descripción del Anuncio</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{ad.descripcion}</p>
            </div>
          </div>
          
          {/* INFORMACIÓN Y ACCIONES (Lado Derecho) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
              <div className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
                {ad.categorias?.nombre}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-2 tracking-tighter">
                {ad.titulo}
              </h1>
              
              {!esConectar ? (
                <>
                  <div className="text-4xl font-extrabold text-blue-600 mb-6 mt-4">
                    DOP {ad.precio.toLocaleString()}
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-8">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {ad.ubicacion}
                  </div>
                </>
              ) : (
                <div className="mt-6 mb-8 bg-pink-50 p-5 rounded-2xl border border-pink-100">
                  <h3 className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-4">Sobre {ad.perfiles?.nombre_completo?.split(' ')[0] || 'mí'}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Edad</span>
                      <span className="font-bold text-gray-900">{ad.anio || 'N/A'} años</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Soy</span>
                      <span className="font-bold text-gray-900">{ad.marca || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Busco</span>
                      <span className="font-bold text-pink-600 bg-pink-100/50 px-2 py-0.5 rounded">{ad.modelo || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-pink-100 pt-3 mt-1">
                      <span className="text-gray-500 font-medium">Quiero</span>
                      <span className="font-bold text-gray-900">{ad.transmision || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Vendedor INFO</p>
                <p className="text-gray-900 font-bold mb-1">{ad.perfiles?.nombre_completo || 'Usuario NÍTIDO'}</p>
                <p className="text-gray-500 text-sm">Miembro verificado</p>
              </div>

              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1DA851] transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-3 mb-3 group"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.9 1.866 1.87 2.893 4.35 2.892 6.99-.004 5.453-4.436 9.887-9.885 9.887m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                Contactar por WhatsApp
              </a>
              
              <button 
                onClick={toggleSave}
                className={`w-full py-4 rounded-xl font-bold text-lg border-2 transition-all flex items-center justify-center gap-3 mb-3 
                  ${isSaved 
                    ? 'border-red-100 bg-red-50 text-red-500 hover:bg-red-100' 
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <svg className={`w-6 h-6 ${isSaved ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {isSaved ? 'Guardado en Favoritos' : 'Guardar Anuncio'}
              </button>
              
              <div className="text-center mt-6 flex flex-col gap-4">
                 {isOwner && (
                   <Link 
                     href={`/editar/${ad.id}`}
                     className="w-full bg-blue-100/50 text-blue-700 py-3 rounded-xl font-bold text-sm hover:bg-blue-100 transition-all flex items-center justify-center gap-2 border border-blue-200"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                     Editar este anuncio
                   </Link>
                 )}
                 <span className="text-xs text-gray-400">Publicado el {new Date(ad.fecha_publicacion).toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
