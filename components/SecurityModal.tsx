'use client'
import React, { useEffect, useState } from 'react'
import { ShieldAlert, CheckCircle, X } from 'lucide-react'

interface SecurityModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function SecurityModal({ isOpen, onClose, onConfirm }: SecurityModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const safetyTips = [
    {
      title: 'Encuentros Públicos',
      desc: 'Reúnete siempre en lugares concurridos y seguros (plazas, bancos o estaciones).',
      icon: ShieldAlert
    },
    {
      title: 'Inspección Obligatoria',
      desc: 'No entregues dinero sin antes haber revisado el producto físicamente.',
      icon: ShieldAlert
    },
    {
      title: 'Evita Transferencias',
      desc: 'Sospecha de vendedores que solo aceptan pagos remotos antes de la entrega.',
      icon: ShieldAlert
    },
    {
      title: 'Reporta Anomalías',
      desc: 'Si algo parece demasiado bueno para ser verdad, repórtalo de inmediato.',
      icon: ShieldAlert
    }
  ]

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 bg-[#050505]/95 backdrop-blur-xl ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`relative w-full max-w-lg bg-[#0a0a0b] border border-[#B49248]/30 rounded-[3rem] p-10 shadow-[0_0_100px_rgba(180,146,72,0.15)] transform transition-all duration-500 scale-110 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#B49248] to-[#E5CC89] rounded-full mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-[#B49248]/20">
            <ShieldAlert className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Protocolo de Seguridad</h2>
          <p className="text-[#B49248] text-[10px] font-black uppercase tracking-[0.3em]">Tu protección es nuestra prioridad</p>
        </div>

        {/* Safety Tips List */}
        <div className="space-y-6 mb-12">
          {safetyTips.map((tip, idx) => (
            <div key={idx} className="flex gap-5 group items-start">
              <div className="mt-1 w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center transition-all group-hover:border-[#B49248]/50 group-hover:bg-[#B49248]/10">
                <tip.icon className="w-4 h-4 text-[#E5CC89]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white tracking-tight">{tip.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed font-medium">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button 
          onClick={onConfirm}
          className="w-full bg-gradient-to-r from-[#B49248] to-[#E5CC89] text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(180,146,72,0.3)] flex items-center justify-center gap-3"
        >
          <CheckCircle className="w-5 h-5" />
          He leído y acepto los consejos
        </button>

        <p className="mt-6 text-center text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">NÍTIDO Marketplace Dominicana</p>
      </div>
    </div>
  )
}
