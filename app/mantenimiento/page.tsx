'use client'
import Logo from '@/components/Logo'

export default function MantenimientoPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col items-center justify-center p-6 text-center">
      {/* Luces de fondo dramáticas */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B49248]/5 blur-[120px] -z-10 pointer-events-none"></div>
      
      <div className="max-w-xl mx-auto space-y-12">
        <div className="flex justify-center">
          <Logo className="h-20 w-auto animate-pulse" />
        </div>
        
        <div className="space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full border border-[#B49248]/30 bg-[#B49248]/5 text-[#E5CC89] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            Estamos Pulinedo el Lujo
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Estamos preparando algo <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B49248] via-[#E5CC89] to-[#B49248]">NÍTIDO</span> para ti.
          </h1>
          
          <p className="text-white/40 text-lg font-medium leading-relaxed">
            Estamos trabajando en mejoras exclusivas para ofrecerte la mejor experiencia del mercado. Volvemos en breve.
          </p>
        </div>

        <div className="pt-10 flex flex-col items-center gap-4">
           <div className="flex gap-2">
             <div className="w-2 h-2 rounded-full bg-[#B49248] animate-bounce [animation-delay:-0.3s]"></div>
             <div className="w-2 h-2 rounded-full bg-[#B49248] animate-bounce [animation-delay:-0.15s]"></div>
             <div className="w-2 h-2 rounded-full bg-[#B49248] animate-bounce"></div>
           </div>
           <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">NÍTIDO Infrastructure • v2.0</span>
        </div>
      </div>
    </div>
  )
}
