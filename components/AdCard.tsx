import Link from 'next/link'
import Image from 'next/image'

interface FotoAnuncio {
  url_imagen: string
}

interface Anuncio {
  id: number
  titulo: string
  descripcion: string
  precio: number
  ubicacion: string
  es_premium?: boolean
  anio?: number
  marca?: string
  modelo?: string
  fotos_anuncio: FotoAnuncio[]
  categorias: { nombre: string }
}

/* ── Componentes auxiliares declarados FUERA del render ── */

function PremiumBadge() {
  return (
    <div className="absolute top-4 left-4 z-20">
      <div className="bg-gradient-to-r from-[#B49248] via-[#E5CC89] to-[#B49248] text-black px-3 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(180,146,72,0.4)] flex items-center gap-1.5 animate-pulse">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l1.5 3.5H15l-3 2.5 1 4L10 9.5 7 12l1-4-3-2.5h3.5L10 2z"/></svg>
        PREMIUM
      </div>
    </div>
  )
}

function CategoryBadge({ nombre, ubicacion, pink }: { nombre: string; ubicacion: string; pink: boolean }) {
  return (
    <div className="absolute top-4 right-4 z-20">
      <div className={`backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border ${pink ? 'bg-pink-600/90 text-white border-pink-400/30' : 'bg-black/60 text-[#E5CC89] border-[#B49248]/30'}`}>
        {nombre} • {ubicacion}
      </div>
    </div>
  )
}

function PlaceholderLogo({ pink }: { pink: boolean }) {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center text-gray-300 ${pink ? 'bg-pink-50' : 'bg-gray-50'}`}>
      <span className="text-4xl font-black text-gray-200 tracking-tighter mb-2">NÍTIDO.</span>
      <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    </div>
  )
}

/* ── Componente principal ── */

export default function AdCard({ ad }: { ad: Anuncio }) {
  const isConectar = ad.categorias?.nombre?.toLowerCase() === 'conectar'
  const hasImage = ad.fotos_anuncio && ad.fotos_anuncio.length > 0

  if (isConectar) {
    // ─── TINDER-STYLE FULL-PHOTO CARD ───
    return (
    <Link
        href={`/anuncio/${ad.id}`}
        className={`group relative rounded-3xl overflow-hidden shadow-2xl transition-all flex flex-col cursor-pointer aspect-[3/4] border ${ad.es_premium ? 'border-[#B49248] ring-4 ring-[#B49248]/20' : 'border-white/5 opacity-90 hover:opacity-100'}`}
      >
        {ad.es_premium && <PremiumBadge />}
        <CategoryBadge nombre={ad.categorias?.nombre} ubicacion={ad.ubicacion} pink />

        {/* Foto de fondo a pantalla completa */}
        <div className="absolute inset-0 bg-gray-100">
          {hasImage ? (
            <Image
              src={ad.fotos_anuncio[0].url_imagen}
              alt={ad.titulo}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <PlaceholderLogo pink />
          )}
        </div>

        {/* Gradiente oscuro estilo Tinder con datos sobrepuestos */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent flex flex-col justify-end p-6 z-10 opacity-90 group-hover:opacity-100 transition-opacity">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1 rounded-full text-xs font-bold drop-shadow-md">
              {ad.anio} años
            </span>
            <span className="bg-pink-500/80 backdrop-blur-md border border-pink-400/50 text-white px-3 py-1 rounded-full text-xs font-bold drop-shadow-md">
              Soy {ad.marca}
            </span>
            {ad.modelo && (
              <span className="bg-purple-500/80 backdrop-blur-md border border-purple-400/50 text-white px-3 py-1 rounded-full text-xs font-bold drop-shadow-md">
                Busco {ad.modelo}
              </span>
            )}
          </div>

          <h3 className="text-2xl font-bold leading-tight text-white group-hover:text-pink-200 transition-colors drop-shadow-lg mb-2">{ad.titulo}</h3>
          <p className="text-gray-300 text-sm line-clamp-2 drop-shadow-md font-medium">{ad.descripcion}</p>
        </div>
      </Link>
    )
  }

  // ─── STANDARD PRODUCT CARD ───
  return (
    <Link
      href={`/anuncio/${ad.id}`}
      className={`group bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl transition-all flex flex-col cursor-pointer border ${ad.es_premium ? 'border-[#B49248] ring-4 ring-[#B49248]/20 bg-gradient-to-br from-[#1a160d] to-[#0a0a0a]' : 'border-white/5 hover:border-[#B49248]/30'}`}
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        {ad.es_premium && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none"></div>
        )}
        {ad.es_premium && <PremiumBadge />}
        <CategoryBadge nombre={ad.categorias?.nombre} ubicacion={ad.ubicacion} pink={false} />

        {hasImage ? (
          <Image
            src={ad.fotos_anuncio[0].url_imagen}
            alt={ad.titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <PlaceholderLogo pink={false} />
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-col gap-2 mb-4">
          <span className="text-[10px] font-black text-[#B49248] uppercase tracking-[0.2em]">{ad.categorias?.nombre}</span>
          <h3 className="text-xl font-black leading-tight line-clamp-2 text-white group-hover:text-[#E5CC89] transition-colors">{ad.titulo}</h3>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#B49248] via-[#E5CC89] to-[#B49248]">
            DOP {ad.precio.toLocaleString()}
          </span>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:border-[#B49248] group-hover:text-[#E5CC89] transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
