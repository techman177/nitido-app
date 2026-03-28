import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeSearchBar from "@/components/HomeSearchBar";
import AdCard from "@/components/AdCard";
import { createClient } from "@supabase/supabase-js";

// Deshabilitar cacheo agresivo para que la vitrina siempre traiga lo último
export const revalidate = 0;

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
  fotos_anuncio: FotoAnuncio[]
  categorias: { nombre: string }
}

export default async function Home() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Fetch the latest 12 ads, prioritizing premium ones
  const { data } = await supabase
    .from('anuncios')
    .select(`
      *,
      fotos_anuncio (url_imagen),
      categorias (nombre)
    `)
    .order('es_premium', { ascending: false })
    .order('fecha_publicacion', { ascending: false })
    .limit(12)

  const ads = (data as unknown as Anuncio[]) || []

  const categorias = [
    { nombre: "Inmuebles", icono: "🏠", color: "bg-orange-50" },
    { nombre: "Empleos", icono: "💼", color: "bg-blue-50" },
    { nombre: "Vehículos", icono: "🚗", color: "bg-red-50" },
    { nombre: "Servicios", icono: "🛠️", color: "bg-gray-50" },
    { nombre: "Conectar", icono: "🤝", color: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-200 pb-24">
      
      <Navbar />

      {/* 1. HERO SECTION (Buscador Principal) */}
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900">
          Encuentra lo que buscas, <span className="text-blue-600">sin bulto.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto font-medium">
          La plataforma premium de República Dominicana para comprar, vender, trabajar y conectar con gente real.
        </p>

        {/* Buscador Separado */}
        <HomeSearchBar />
      </main>

      {/* 2. CATEGORÍAS (Grid Interactivo) */}
      <section className="max-w-5xl mx-auto px-6 pb-20 border-b border-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center md:text-left">Explora por Categorías</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categorias.map((cat, index) => (
            <Link href={`/categoria/${cat.nombre.toLowerCase()}`} key={index} 
              className="group flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-3xl hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer">
              <div className={`w-16 h-16 flex items-center justify-center rounded-2xl text-3xl mb-4 group-hover:scale-110 transition-transform ${cat.color}`}>
                {cat.icono}
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                {cat.nombre}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. LA VITRINA (Anuncios Recientes y Premium) */}
      <section className="max-w-6xl mx-auto px-6 pt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Recién Publicado en NÍTIDO</h2>
          <Link href="/buscar" className="text-blue-600 font-bold hover:text-blue-800 hidden md:block">Ver todos →</Link>
        </div>

        {ads.length === 0 ? (
          <div className="bg-gray-50 p-12 rounded-3xl text-center border-2 border-dashed border-gray-200">
            <span className="text-5xl mb-4 block">📦</span>
            <p className="text-xl font-medium text-gray-500">Aún no hay anuncios disponibles.</p>
            <Link href="/publicar" className="inline-block mt-4 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition">Sé el primero en Publicar</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad as unknown as Parameters<typeof AdCard>[0]['ad']} />
            ))}
          </div>
        )}
        
        {ads.length > 0 && (
          <div className="mt-12 text-center md:hidden">
            <Link href="/buscar" className="inline-block bg-gray-100 text-gray-600 font-bold px-8 py-3 rounded-xl hover:bg-gray-200 transition-colors">
              Explorar Todos los Anuncios
            </Link>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}