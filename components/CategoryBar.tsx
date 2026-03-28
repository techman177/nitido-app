'use client'
import React from 'react'
import * as LucideIcons from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Category {
  id: number
  nombre: string
  slug: string
  icono: string
}

interface CategoryBarProps {
  categories: Category[]
}

export default function CategoryBar({ categories }: CategoryBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedSlug = searchParams.get('categoria') || 'todas'

  const handleSelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === 'todas') {
      params.delete('categoria')
    } else {
      params.set('categoria', slug)
    }
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="w-full overflow-hidden mb-12">
      <div className="flex items-center gap-4 overflow-x-auto pb-6 px-4 no-scrollbar snap-x scroll-smooth">
        {/* Opción "Todas" */}
        <button
          onClick={() => handleSelect('todas')}
          className={`flex flex-col items-center gap-3 min-w-[100px] snap-start transition-all duration-500 group`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
            selectedSlug === 'todas' 
            ? 'bg-[#B49248] border-[#E5CC89] shadow-[0_0_30px_rgba(180,146,72,0.6)] scale-110' 
            : 'bg-white/5 border-white/5 group-hover:border-white/20 group-hover:bg-white/10'
          }`}>
            <LucideIcons.LayoutGrid 
              className={`w-7 h-7 transition-all duration-500 ${
                selectedSlug === 'todas' ? 'text-black' : 'text-white/40 group-hover:text-[#E5CC89]'
              }`} 
            />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
            selectedSlug === 'todas' ? 'text-[#E5CC89] scale-110 shadow-gold' : 'text-white/30 group-hover:text-white'
          }`}>
            Todas
          </span>
        </button>

        {/* Categorías Dinámicas */}
        {categories.map((cat) => {
          const IconComponent = (LucideIcons as any)[cat.icono] || LucideIcons.Package;
          const isActive = selectedSlug === cat.slug;

          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.slug)}
              className="flex flex-col items-center gap-3 min-w-[100px] snap-start transition-all duration-500 group"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                isActive 
                ? 'bg-gradient-to-tr from-[#B49248] to-[#E5CC89] border-[#E5CC89] shadow-[0_0_40px_rgba(180,146,72,0.8)] scale-110' 
                : 'bg-white/5 border-white/5 group-hover:border-[#B49248]/30 group-hover:bg-white/10'
              }`}>
                <IconComponent 
                  className={`w-7 h-7 transition-all duration-500 ${
                    isActive ? 'text-black' : 'text-white/40 group-hover:text-[#E5CC89] group-hover:drop-shadow-[0_0_10px_rgba(229,204,137,0.5)]'
                  }`} 
                />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 text-center px-1 ${
                isActive ? 'text-[#E5CC89] scale-110 font-black' : 'text-white/30 group-hover:text-white'
              }`}>
                {cat.nombre}
              </span>
            </button>
          )
        })}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .shadow-gold {
          text-shadow: 0 0 15px rgba(229, 204, 137, 0.5);
        }
      `}</style>
    </div>
  )
}
