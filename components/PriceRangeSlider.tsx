'use client'
import React, { useState, useEffect } from 'react'
import * as Slider from '@radix-ui/react-slider'
import { useRouter, useSearchParams } from 'next/navigation'

export default function PriceRangeSlider() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const initialMin = parseInt(searchParams.get('min') || '0')
  const initialMax = parseInt(searchParams.get('max') || '10000000')
  
  const [values, setValues] = useState([initialMin, initialMax])

  const handleValueChange = (newValues: number[]) => {
    setValues(newValues)
  }

  const handleValueCommit = (finalValues: number[]) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('min', finalValues[0].toString())
    params.set('max', finalValues[1].toString())
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const formatPrice = (val: number) => {
    return `RD$ ${val.toLocaleString()}`
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 bg-white/5 rounded-3xl border border-white/5">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Rango de Precio</span>
        <div className="text-xs font-black text-[#E5CC89] tracking-tighter">
          {formatPrice(values[0])} — {formatPrice(values[1])}
        </div>
      </div>

      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={values}
        max={10000000}
        step={50000}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
      >
        <Slider.Track className="bg-black border border-white/10 relative grow rounded-full h-[6px]">
          <Slider.Range className="absolute bg-gradient-to-r from-[#B49248] to-[#E5CC89] rounded-full h-full shadow-[0_0_15px_rgba(180,146,72,0.4)]" />
        </Slider.Track>
        
        <Slider.Thumb
          className="block w-6 h-6 bg-gradient-to-tr from-[#B49248] to-[#E5CC89] shadow-[0_4px_15px_rgba(0,0,0,0.5),0_0_10px_rgba(180,146,72,0.6)] rounded-full hover:scale-110 focus:outline-none transition-transform cursor-pointer border-2 border-white/20"
          aria-label="Precio Mínimo"
        />
        <Slider.Thumb
          className="block w-6 h-6 bg-gradient-to-tr from-[#B49248] to-[#E5CC89] shadow-[0_4px_15px_rgba(0,0,0,0.5),0_0_10px_rgba(180,146,72,0.6)] rounded-full hover:scale-110 focus:outline-none transition-transform cursor-pointer border-2 border-white/20"
          aria-label="Precio Máximo"
        />
      </Slider.Root>

      <div className="flex justify-between text-[8px] font-bold text-white/20 uppercase tracking-widest px-1">
        <span>Mínimo</span>
        <span>RD$ 10M+</span>
      </div>
    </div>
  )
}
