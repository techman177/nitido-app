'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import { 
  Settings, Power, LayoutPanelTop, 
  Save, AlertTriangle, RefreshCw,
  Edit3, Globe, ShieldCheck
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ConfiguracionAdmin() {
  const [config, setConfig] = useState({
    mantenimiento_activo: false,
    banner_home_texto: 'Bienvenido a la Élite Dominicana',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    cargarConfig()
  }, [])

  async function cargarConfig() {
    setLoading(true)
    const { data, error } = await supabase
      .from('configuracion_global')
      .select('*')
      .single()
    
    if (data) setConfig(data)
    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const toastId = toast.loading('Guardando configuración maestra...')

    const { error } = await supabase
      .from('configuracion_global')
      .upsert({ ...config, id: 1 }) // Asumimos ID 1 para la config global
    
    if (!error) {
      toast.success('Configuración actualizada correctamente ✨', { id: toastId })
    } else {
      toast.error('Error al guardar configuración', { id: toastId })
    }
    setSaving(false)
  }

  const toggleMantenimiento = async () => {
    const newVal = !config.mantenimiento_activo
    const text = newVal ? 'ACTIVAR' : 'DESACTIVAR'
    if (!confirm(`¿Estás seguro de que quieres ${text} el MODO MANTENIMIENTO? Esto afectará a todos los usuarios públicos.`)) return

    setConfig(prev => ({ ...prev, mantenimiento_activo: newVal }))
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#B49248] selection:text-black">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Settings size={18} className="text-[#B49248]" />
            <span className="text-[10px] font-black tracking-widest uppercase text-white/30">NÍTIDO SYSTEM SETTINGS</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Configuración Estructural</h1>
          <p className="text-white/40 font-medium">Controla el comportamiento global de la plataforma.</p>
        </div>

        {loading ? (
          <div className="py-20 text-center animate-pulse text-white/20 font-black uppercase tracking-widest">Conectando con el núcleo...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* Modo Mantenimiento */}
            <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 flex items-center justify-between ${config.mantenimiento_activo ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.1)] bg-red-500/5' : 'border-white/5 bg-[#0a0a0b]'}`}>
                <div className="flex items-center gap-6">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${config.mantenimiento_activo ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-white/20'}`}>
                      <Power size={32} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black mb-1">Modo Mantenimiento</h3>
                      <p className="text-white/40 text-sm font-medium">Bloquea el acceso público mientras realizas cambios.</p>
                   </div>
                </div>
                
                <button 
                  type="button"
                  onClick={toggleMantenimiento}
                  className={`relative w-20 h-10 rounded-full p-1 transition-all duration-500 overflow-hidden border-2 ${config.mantenimiento_activo ? 'bg-red-500 border-red-400' : 'bg-white/10 border-white/5'}`}
                >
                  <div className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-xl transition-all duration-500 ${config.mantenimiento_activo ? 'left-10' : 'left-1'}`}></div>
                </button>
            </div>

            {/* Banner Home */}
            <div className="p-8 rounded-[2.5rem] border border-white/5 bg-[#0a0a0b] space-y-6">
                <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-white/5 rounded-xl text-[#B49248]">
                      <Globe size={24} />
                   </div>
                   <h3 className="text-xl font-black">Mensaje de Bienvenida (Home)</h3>
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-1">Texto del Banner Hero</label>
                   <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                         <Edit3 size={18} className="text-white/20 group-focus-within:text-[#B49248] transition-colors" />
                      </div>
                      <input 
                        type="text" 
                        className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl outline-none focus:border-[#B49248]/50 focus:bg-white/10 transition-all font-bold text-lg"
                        value={config.banner_home_texto}
                        onChange={(e) => setConfig({ ...config, banner_home_texto: e.target.value })}
                        placeholder="Ej. Encuentra lo NÍTIDO..."
                      />
                   </div>
                </div>
            </div>

            {/* Acciones Finales */}
            <div className="flex flex-col md:flex-row gap-4 pt-10">
               <button 
                type="submit" 
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-[#B49248] to-[#E5CC89] text-black py-5 rounded-[2rem] font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_40px_rgba(180,146,72,0.2)] disabled:opacity-50 flex items-center justify-center gap-3"
               >
                 {saving ? <RefreshCw className="animate-spin" /> : <Save />}
                 Sincronizar Cambios Maestros
               </button>
               
               <div className="p-5 border border-white/5 bg-[#0a0a0b] rounded-[2rem] flex items-center gap-4">
                  <div className="p-2.5 bg-green-500/10 text-green-500 rounded-full">
                     <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Estatus de Integridad</h4>
                    <p className="text-xs font-bold text-white/40">Conexión Segura (TLS)</p>
                  </div>
               </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-3xl flex items-start gap-4">
               <AlertTriangle className="text-amber-500 shrink-0 mt-1" />
               <p className="text-xs font-medium text-amber-500/80 leading-relaxed">
                 Cualquier cambio realizado aquí afecta la infraestructura de producción en tiempo real. Actúa con precaución, Administrador.
               </p>
            </div>

          </form>
        )}
      </div>
    </div>
  )
}
