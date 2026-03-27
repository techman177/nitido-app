import Link from "next/link";

export default function Home() {
  const categorias = [
    { nombre: "Inmuebles", icono: "🏠", color: "bg-orange-50" },
    { nombre: "Empleos", icono: "💼", color: "bg-blue-50" },
    { nombre: "Vehículos", icono: "🚗", color: "bg-red-50" },
    { nombre: "Servicios", icono: "🛠️", color: "bg-gray-50" },
    { nombre: "Conectar", icono: "🤝", color: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-200">
      
      {/* 1. NAVBAR (Navegación Superior) */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div className="text-3xl font-black tracking-tighter text-blue-600">
          NÍTIDO.
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
            Iniciar Sesión
          </Link>
          <Link href="/publicar" className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
            Publicar Anuncio
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION (Buscador Principal) */}
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900">
          Encuentra lo que buscas, <span className="text-blue-600">sin bulto.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto font-medium">
          La plataforma premium de República Dominicana para comprar, vender, trabajar y conectar con gente real.
        </p>

        {/* Buscador tipo Inteligencia Artificial */}
        <div className="max-w-3xl mx-auto relative group shadow-sm hover:shadow-md transition-shadow rounded-2xl">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <svg className="h-6 w-6 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            className="block w-full pl-14 pr-32 py-5 text-lg border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-blue-600 transition-all outline-none bg-gray-50 focus:bg-white" 
            placeholder="Ej. Apartamento en la Zona Oriental, Programador..."
          />
          <button className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-8 rounded-xl font-bold hover:bg-blue-700 transition-colors">
            Buscar
          </button>
        </div>
      </main>

      {/* 3. CATEGORÍAS (Grid Interactivo) */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Explora por Categorías</h2>
        
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

    </div>
  );
}