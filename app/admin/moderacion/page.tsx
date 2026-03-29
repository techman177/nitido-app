'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import { 
  ShieldAlert, ShieldCheck, Trash2, 
  CheckCircle2, AlertCircle, Filter, 
  MoreHorizontal, Eye, ExternalLink,
  ChevronRight, Sparkles
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

interface Anuncio {
  id: number
  titulo: string
  precio: number
  es_premium: boolean
  es_verificado: boolean
  fotos_anuncio: { url_imagen: string }[]
  perfiles: { nombre_completo: string }
  created_at: string
}

export default function ModeracionAdmin() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    cargarAnuncios()
  }, [])

  async function cargarAnuncios() {
    setLoading(true)
    const { data } = await supabase
      .from('anuncios')
      .select(`
        id, titulo, precio, es_premium, es_verificado, created_at,
        fotos_anuncio (url_imagen),
        perfiles (nombre_completo)
      `)
      .order('created_at', { ascending: false })
    
    if (data) setAnuncios(data as unknown as Anuncio[])
    setLoading(false)
  }

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleBulkAction = async (action: 'premium' | 'delete') => {
    if (selectedIds.length === 0) return
    const text = action === 'premium' ? 'marcar como PREMIUM' : 'ELIMINAR'
    if (!confirm(`¿Estás seguro de que quieres ${text} ${selectedIds.length} anuncios seleccionados?`)) return

    setActionLoading(true)
    const toastId = toast.loading('Haciendo magia masiva...')

    try {
      if (action === 'premium') {
        const { error } = await supabase
          .from('anuncios')
          .update({ es_premium: true, es_verificado: true })
          .in('id', selectedIds)
        if (error) throw error
        toast.success(`${selectedIds.length} anuncios ahora son Élite ✨`, { id: toastId })
      } else {
        // Borrar fotos primero
        await supabase.from('fotos_anuncio').delete().in('anuncio_id', selectedIds)
        const { error } = await supabase.from('anuncios').delete().in('id', selectedIds)
        if (error) throw error
        toast.success(`Limpieza profunda completada: ${selectedIds.length} anuncios borrados`, { id: toastId })
      }
      setSelectedIds([])
      cargarAnuncios()
    } catch (err) {
      toast.error('Error al realizar acción masiva', { id: toastId })
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={18} className="text-[#B49248]" />
              <span className="text-[10px] font-black tracking-widest uppercase text-white/30">Capa de Moderación Élite</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Auditoría de Contenido</h1>
            <p className="text-white/40 font-medium">Control total sobre la calidad de la vitrina.</p>
          </div>
          
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-4 bg-[#B49248]/10 border border-[#B49248]/30 p-2 pl-6 rounded-2xl animate-in slide-in-from-right-10">
               <span className="text-xs font-black text-[#E5CC89] uppercase tracking-widest">{selectedIds.length} Seleccionados</span>
               <div className="flex gap-2">
                  <button 
                    onClick={() => handleBulkAction('premium')}
                    disabled={actionLoading}
                    className="bg-[#B49248] text-black px-4 py-2 rounded-xl text-xs font-black uppercase hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Sparkles size={14} /> Elevar a Premium
                  </button>
                  <button 
                    onClick={() => handleBulkAction('delete')}
                    disabled={actionLoading}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Trash2 size={14} /> Eliminar
                  </button>
               </div>
            </div>
          )}
        </div>

        <div className="bg-[#0a0a0b] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          {/* Header Mobile Oculto */}
          <div className="hidden lg:grid grid-cols-12 gap-4 p-8 border-b border-white/5 text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">
            <div className="col-span-1"></div>
            <div className="col-span-5">Detalle del Anuncio</div>
            <div className="col-span-2">Estado Activo</div>
            <div className="col-span-2 text-center">Vendedor</div>
            <div className="col-span-2 text-right">Preview</div>
          </div>

          <div className="divide-y divide-white/5 max-h-[700px] overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="p-20 text-center animate-pulse text-white/20 font-black uppercase tracking-widest text-sm">Cargando Vitrina...</div>
            ) : anuncios.length === 0 ? (
              <div className="p-20 text-center text-white/20 font-black uppercase tracking-widest text-sm">Sin anuncios pendientes</div>
            ) : anuncios.map((ad) => (
              <div 
                key={ad.id} 
                onClick={() => toggleSelect(ad.id)}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-4 p-6 lg:p-8 items-center cursor-pointer transition-all hover:bg-white/[0.03] group ${selectedIds.includes(ad.id) ? 'bg-[#B49248]/10' : ''}`}
              >
                
                {/* Selector */}
                <div className="col-span-1 flex justify-center">
                   <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedIds.includes(ad.id) ? 'bg-[#B49248] border-[#B49248] scale-110' : 'bg-transparent border-white/10'}`}>
                      {selectedIds.includes(ad.id) && <CheckCircle2 size={14} className="text-black" />}
                   </div>
                </div>

                {/* Info Principal */}
                <div className="col-span-5 flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white/5 shrink-0">
                    {ad.fotos_anuncio[0] ? (
                      <Image src={ad.fotos_anuncio[0].url_imagen} alt="" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10">N</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-[#E5CC89] transition-colors">{ad.titulo}</h3>
                    <div className="flex gap-4 mt-1">
                       <span className="text-[#B49248] font-black text-xs uppercase tracking-widest">DOP {ad.precio.toLocaleString()}</span>
                       <span className="text-white/20 font-medium text-[10px] uppercase tracking-widest">{new Date(ad.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Badges de Estado */}
                <div className="col-span-2 flex flex-wrap gap-2">
                   {ad.es_premium && (
                     <span className="bg-[#B49248]/10 text-[#E5CC89] border border-[#B49248]/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-md">Premium</span>
                   )}
                   {ad.es_verificado && (
                     <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-md">Verificado</span>
                   )}
                   {!ad.es_premium && !ad.es_verificado && (
                     <span className="bg-white/5 text-white/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-md">Estándar</span>
                   )}
                </div>

                {/* Vendedor */}
                <div className="col-span-2 text-center text-xs font-bold text-white/40 uppercase tracking-widest">
                   {ad.perfiles?.nombre_completo || 'N/A'}
                </div>

                {/* Link Externo */}
                <div className="col-span-2 text-right">
                   <Link href={`/anuncio/${ad.id}`} target="_blank" className="p-4 rounded-2xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all inline-flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest">Ver Link</span>
                      <ExternalLink size={14} />
                   </Link>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
