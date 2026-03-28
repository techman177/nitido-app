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
      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-lg shadow-yellow-500/30 flex items-center gap-1.5 animate-pulse">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l1.5 3.5H15l-3 2.5 1 4L10 9.5 7 12l1-4-3-2.5h3.5L10 2z"/></svg>
        DESTACADO
      </div>
    </div>
  )
}

function CategoryBadge({ nombre, ubicacion, pink }: { nombre: string; ubicacion: string; pink: boolean }) {
  return (
    <div className="absolute top-4 right-4 z-20">
      <div className={`backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm ${pink ? 'bg-pink-500/90 text-white' : 'bg-white/90 text-gray-700'}`}>
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
        className={`group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all flex flex-col cursor-pointer aspect-[3/4] ${ad.es_premium ? 'ring-4 ring-yellow-400/50' : ''}`}
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
      className={`group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col cursor-pointer ${ad.es_premium ? 'border-2 border-yellow-400 ring-4 ring-yellow-400/20' : 'border border-gray-100'}`}
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

      <div className={`p-6 flex flex-col flex-1 ${ad.es_premium ? 'bg-gradient-to-br from-yellow-50/50 to-white' : ''}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold leading-tight line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">{ad.titulo}</h3>
          <span className="text-xl font-black text-blue-600 whitespace-nowrap ml-2">
            DOP {ad.precio.toLocaleString()}
          </span>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{ad.descripcion}</p>
      </div>
    </Link>
  )
}
