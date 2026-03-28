'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MapPin } from 'lucide-react'

interface Sector {
  id: number
  nombre: string
  slug: string
}

export default function LocationFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sectores, setSectores] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const selectedSector = searchParams.get('sector') || ''

  useEffect(() => {
    async function loadSectores() {
      const { data } = await supabase.from('sectores').select('*').order('nombre')
      if (data) setSectores(data)
      setLoading(false)
    }
    loadSectores()
  }, [])

  const handleSelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === '') {
      params.delete('sector')
    } else {
      params.set('sector', slug)
    }
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
        <MapPin className="h-5 w-5 text-[#B49248] opacity-50 group-focus-within:opacity-100 transition-opacity" />
      </div>
      <select 
        className="w-full pl-14 pr-10 py-5 bg-transparent text-[#E5CC89] outline-none font-bold text-lg appearance-none cursor-pointer border-r border-white/5"
        value={selectedSector}
        onChange={(e) => handleSelect(e.target.value)}
      >
        <option value="" className="bg-black text-white">Ubicación (Toda RD)</option>
        {sectores.map((s) => (
          <option key={s.id} value={s.slug} className="bg-black text-white">{s.nombre}</option>
        ))}
        {loading && <option disabled className="bg-black text-white">Cargando...</option>}
      </select>
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
        <svg className="w-4 h-4 text-[#B49248] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  )
}
