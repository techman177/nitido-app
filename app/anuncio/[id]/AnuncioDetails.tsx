'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { User } from '@supabase/supabase-js'
import VerifiedBadge from '@/components/VerifiedBadge'
import WhatsAppContactButton from '@/components/WhatsAppContactButton'
import SecurityModal from '@/components/SecurityModal'

interface FotoAnuncio {
  url_imagen: string
}

interface Perfil {
  nombre_completo: string
  telefono?: string
  created_at?: string
  es_verificado?: boolean
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
  sectores?: { nombre: string }
}

interface AnuncioDetailsProps {
  ad: Anuncio
  currentUser: User | null
}

export default function AnuncioDetails({ ad, currentUser }: AnuncioDetailsProps) {
  const adId = ad.id.toString()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [hasSeenSecurity, setHasSeenSecurity] = useState(true) // Default to true to prevent flickering

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favoritos_nitido') || '[]')
    if (saved.includes(adId)) {
      setIsSaved(true)
    }

    const seenSecurity = localStorage.getItem('nitido_safety_seen') === 'true'
    setHasSeenSecurity(seenSecurity)
  }, [adId])

  const handleContactClick = () => {
    if (!hasSeenSecurity) {
      setShowSecurityModal(true)
    }
  }

  const handleSecurityConfirm = () => {
    localStorage.setItem('nitido_safety_seen', 'true')
    setHasSeenSecurity(true)
    setShowSecurityModal(false)
  }

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
  const isOwner = currentUser?.id === ad.usuario_id
  
  const memberSince = ad.perfiles?.created_at 
    ? new Date(ad.perfiles.created_at).toLocaleDateString('es-DO', { month: 'long', year: 'numeric' })
    : 'Miembro reciente'

  const memberInitial = ad.perfiles?.nombre_completo?.charAt(0).toUpperCase() || 'U'

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
                    {ad.sectores?.nombre ? `${ad.sectores.nombre}, ${ad.ubicacion}` : ad.ubicacion}
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
                
                <div className="space-y-4 relative">
                  {!hasSeenSecurity ? (
                    <button 
                      onClick={handleContactClick}
                      className="w-full bg-black p-[4px] rounded-[2rem] hover:scale-[1.02] transition-all shadow-[0_20px_40px_rgba(180,146,72,0.15)] block group"
                    >
                      <div className="bg-black rounded-[1.8rem] py-5 px-6 flex items-center justify-center gap-3 border-2 border-transparent relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#B49248] to-[#E5CC89] -z-10 opacity-100 p-[2px]"></div>
                        <div className="absolute inset-[2px] bg-black rounded-[1.7rem] -z-10"></div>
                        <span className="text-[#E5CC89] font-black text-xs uppercase tracking-[0.2em]">Ver contacto seguro</span>
                      </div>
                    </button>
                  ) : (
                    <WhatsAppContactButton 
                      phone={ad.perfiles?.telefono} 
                      title={ad.titulo} 
                      price={ad.precio} 
                    />
                  )}

                  <button className="w-full bg-white/5 text-white/60 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">
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

      <SecurityModal 
        isOpen={showSecurityModal} 
        onClose={() => setShowSecurityModal(false)} 
        onConfirm={handleSecurityConfirm} 
      />
    </div>
  )
}
