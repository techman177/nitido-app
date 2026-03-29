'use client'
import React from 'react'
import { BadgeCheck } from 'lucide-react'

export default function VerifiedBadge() {
  return (
    <div className="relative group inline-flex items-center ml-1.5 align-middle">
      <BadgeCheck 
        className="w-5 h-5 text-[#B49248] drop-shadow-[0_0_8px_rgba(180,146,72,0.4)] transition-all group-hover:scale-110" 
        fill="url(#goldGradient)"
      />
      
      {/* SVG Gradient definition for the fill */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#B49248', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#E5CC89', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>

      {/* Tooltip Premium */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-[#1a1a1a] border border-[#B49248]/30 rounded-lg text-[10px] font-black text-[#E5CC89] uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-2xl flex items-center gap-2">
        <div className="w-1 h-1 bg-[#B49248] rounded-full animate-pulse"></div>
        Vendedor Verificado por NÍTIDO
      </div>
    </div>
  )
}
