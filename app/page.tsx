import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeAdsGallery from "@/components/HomeAdsGallery";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";

// Deshabilitar cacheo agresivo para que la vitrina siempre traiga lo último
export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface FotoAnuncio {
  url_imagen: string
}

interface Category {
  id: number
  nombre: string
  slug: string
  icono: string
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

export default async function Home(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient()

  // 1. Construir query dinámica
  let query = supabase
    .from('anuncios')
    .select(`
      *,
      fotos_anuncio (url_imagen),
      categorias!inner (nombre, slug),
      sectores!inner (slug),
      perfiles!inner (nombre_completo, es_verificado, rol)
    `)

  // Filtros aplicados desde la URL
  if (searchParams.categoria) {
    query = query.eq('categorias.slug', searchParams.categoria)
  }
  
  if (searchParams.sector) {
    query = query.eq('sectores.slug', searchParams.sector)
  }

  if (searchParams.min) {
    query = query.gte('precio', parseInt(searchParams.min))
  }

  if (searchParams.max) {
    query = query.lte('precio', parseInt(searchParams.max))
  }

  // ORDEN DE ELITE:
  // 1. Primero los marcados como es_premium
  // 2. Luego los de vendedores_pro (o admins)
  // 3. Luego por fecha reciente
  const { data } = await query
    .order('es_premium', { ascending: false })
    .order('perfiles(rol)', { ascending: false }) // 'vendedor_pro' alphabetic priority over 'usuario'? Not really reliable.
    // Usaremos un truco de filtrado o simplemente orden cronológico después de premium.
    // Dado que Supabase no soporta CASE en .order() fácilmente sin RPC, 
    // priorizamos premium y luego fecha. El rol lo manejaremos visualmente con el sello.
    .order('fecha_publicacion', { ascending: false })

  const ads = (data as unknown as Anuncio[]) || []

  // Traer las categorías oficiales con sus iconos
  const { data: categoriesData } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre')

  const categories = (categoriesData as Category[]) || []

  // Traer configuración global (Banner)
  const { data: configData } = await supabase
    .from('configuracion_global')
    .select('banner_home_texto')
    .single()

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-[#B49248] selection:text-black">
      <Navbar />

      {/* 1. HERO SECTION (Transformado a Lux) */}
      <main className="relative max-w-6xl mx-auto px-6 pt-32 pb-40 text-center">
        {/* Luces de fondo dramáticas */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#B49248]/10 blur-[150px] -z-10 pointer-events-none"></div>
        
        <div className="inline-block px-4 py-1.5 rounded-full border border-[#B49248]/30 bg-[#B49248]/5 text-[#E5CC89] text-[10px] font-black uppercase tracking-[0.4em] mb-10 overflow-hidden relative">
          {configData?.banner_home_texto || 'Bienvenido a la Élite Dominicana'}
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-[-0.04em] mb-10 text-white leading-[0.9]">
          Encuentra lo <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B49248] via-[#E5CC89] to-[#B49248]">NÍTIDO.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/30 mb-8 max-w-3xl mx-auto font-medium leading-relaxed tracking-tight">
          La vitrina exclusiva para comprar, vender y conectar en la República Dominicana con un toque de lujo.
        </p>
      </main>

      {/* 2. LA VITRINA INTELIGENTE (HomeAdsGallery) */}
      <section className="max-w-6xl mx-auto px-6 pt-20 border-t border-white/5 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#B49248]/30 to-transparent"></div>
        <Suspense fallback={<div className="text-center text-white/50 py-20 font-bold uppercase tracking-widest">Cargando la élite...</div>}>
          <HomeAdsGallery initialAds={ads} categories={categories} />
        </Suspense>
      </section>

      <Footer />
    </div>
  );
}