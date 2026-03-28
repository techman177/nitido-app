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

interface AnuncioDetailsProps {
  ad: Anuncio
  currentUser: User | null
}

export default function AnuncioDetails({ ad, currentUser }: AnuncioDetailsProps) {
  const adId = ad.id.toString()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

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
  const whatsappUrl = `https://wa.me/${sellerPhone}?text=Hola,%20vi%20tu%20anuncio%20"${encodeURIComponent(ad.titulo)}"%20por%20${ad.precio.toLocaleString()}%20en%20NÍTIDO%20y%20me%20interesa.%20¿Sigue%20disponible?`
  const isOwner = currentUser?.id === ad.usuario_id
  
  const memberSince = ad.perfiles?.created_at 
    ? new Date(ad.perfiles.created_at).toLocaleDateString('es-DO', { month: 'long', year: 'numeric' })
    : 'Miembro reciente'

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* BREADCRUMBS */}
        <nav className="flex mb-8 text-xs font-bold text-white/30 uppercase tracking-widest overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
          <Link href="/" className="hover:text-[#E5CC89] transition-colors">Inicio</Link>
          <span className="mx-3">/</span>
          <span className="text-white/60">{ad.categorias?.nombre || 'General'}</span>
          <span className="mx-3">/</span>
          <span className="text-[#E5CC89] truncate max-w-[200px]">{ad.titulo}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LADO IZQUIERDO (70%) - GALERÍA Y DESCRIPCIÓN */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* GALERÍA PRINCIPAL */}
            <div className="space-y-4">
              <div className="relative aspect-[16/10] bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl group">
                {hasImages ? (
                  <Image 
                    src={images[activeImageIndex]} 
                    alt={ad.titulo} 
                    fill 
                    className="object-contain p-4"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/10">
                    <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="font-black uppercase tracking-widest text-xs">Sin imágenes</span>
                  </div>
                )}
                
                {/* Badge Premium si aplica */}
                <div className="absolute top-6 left-6 z-10">
                   <div className="bg-gradient-to-r from-[#B49248] to-[#E5CC89] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                     NÍTIDO Gold
                   </div>
                </div>
              </div>

              {/* MINIATURAS */}
              {hasImages && images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar snap-x">
                  {images.map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-24 h-24 flex-shrink-0 snap-start rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImageIndex === idx ? 'border-[#B49248] scale-105 shadow-[0_0_20px_rgba(180,146,72,0.3)]' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                    >
                      <Image src={img} alt={`Miniatura ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ATRIBUTOS (VISIBLE EN MÓVIL) */}
            <div className="lg:hidden space-y-4">
               <h1 className="text-3xl font-black tracking-tighter text-white">{ad.titulo}</h1>
               <div className="text-4xl font-black text-[#E5CC89]">DOP {ad.precio.toLocaleString()}</div>
            </div>

            {/* DETALLES Y CARACTERÍSTICAS */}
            <div className="bg-[#0a0a0a] p-8 md:p-12 rounded-[3rem] border border-white/5 space-y-12">
              
              {/* Características Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-1">
                  <span className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Ubicación</span>
                  <div className="flex items-center gap-2 text-white/80 font-bold">
                    <svg className="w-4 h-4 text-[#B49248]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    {ad.ubicacion}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Categoría</span>
                  <div className="text-white/80 font-bold">{ad.categorias?.nombre}</div>
                </div>
                {ad.anio && (
                  <div className="space-y-1">
                    <span className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Año</span>
                    <div className="text-white/80 font-bold">{ad.anio}</div>
                  </div>
                )}
                {ad.marca && (
                  <div className="space-y-1">
                    <span className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Marca</span>
                    <div className="text-white/80 font-bold">{ad.marca}</div>
                  </div>
                )}
              </div>

              {/* Divisor */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

              {/* Descripción */}
              <div className="space-y-6">
                <h3 className="text-sm font-black text-white/30 uppercase tracking-[0.3em]">Descripción Detallada</h3>
                <p className="text-white/70 leading-relaxed text-lg whitespace-pre-line font-medium">
                  {ad.descripcion}
                </p>
              </div>

              {/* Detalles Técnicos si es Vehículo */}
              {(ad.modelo || ad.transmision) && (
                <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-white/5 p-6 rounded-2xl flex justify-between items-center">
                     <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Modelo</span>
                     <span className="text-[#E5CC89] font-black uppercase text-xs tracking-widest">{ad.modelo}</span>
                   </div>
                   <div className="bg-white/5 p-6 rounded-2xl flex justify-between items-center">
                     <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Transmisión</span>
                     <span className="text-[#E5CC89] font-black uppercase text-xs tracking-widest">{ad.transmision}</span>
                   </div>
                </div>
              )}
            </div>
          </div>
          
          {/* LADO DERECHO (30%) - SIDEBAR FIJO */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-32 space-y-6">
              
              {/* CARD DE PRECIO Y ACCIONES */}
              <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-3xl text-center">
                <div className="text-5xl font-black text-[#E5CC89] mb-4 tracking-tighter">
                  DOP {ad.precio.toLocaleString()}
                </div>
                <h1 className="text-2xl font-black text-white mb-8 leading-tight tracking-tight hidden lg:block">
                  {ad.titulo}
                </h1>
                
                <div className="space-y-4">
                  <a 
                    href={whatsappUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-[#B49248] to-[#E5CC89] text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_10px_30px_rgba(180,146,72,0.2)] flex items-center justify-center gap-3 group"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.9 1.866 1.87 2.893 4.35 2.892 6.99-.004 5.453-4.436 9.887-9.885 9.887m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    Contactar Vía WhatsApp
                  </a>

                  <button className="w-full bg-white/5 text-white/60 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">
                    Enviar un Mensaje
                  </button>

                  <button 
                    onClick={toggleSave}
                    className={`w-full py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${isSaved ? 'text-red-500' : 'text-white/30 hover:text-white'}`}
                  >
                    <svg className={`w-4 h-4 ${isSaved ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    {isSaved ? 'Anuncio Guardado' : 'Guardar en Favoritos'}
                  </button>
                </div>
              </div>

              {/* CARD DEL VENDEDOR */}
              <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#B49248] to-[#E5CC89] flex items-center justify-center text-black text-2xl font-black shadow-lg">
                    {ad.perfiles?.nombre_completo?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-black text-white tracking-tight">{ad.perfiles?.nombre_completo || 'Usuario Premium'}</h3>
                    <p className="text-xs font-bold text-[#E5CC89] uppercase tracking-widest">Vendedor Verificado</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black text-white/30 uppercase tracking-[0.2em] border-t border-white/5 pt-6">
                  <span>Miembro desde</span>
                  <span className="text-white/60">{memberSince}</span>
                </div>
              </div>

              {/* ACCIÓN DE DUEÑO */}
              {isOwner && (
                <Link 
                  href={`/editar/${ad.id}`}
                  className="w-full bg-blue-600/10 text-blue-400 py-4 rounded-2xl font-black text-center text-xs uppercase tracking-widest border border-blue-600/20 hover:bg-blue-600/20 transition-all block"
                >
                  Editar mi anuncio
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
