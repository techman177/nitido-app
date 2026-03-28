import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-black text-white tracking-tighter mb-3">NÍTIDO.</h3>
            <p className="text-sm leading-relaxed">La plataforma premium de República Dominicana para comprar, vender, trabajar y conectar.</p>
          </div>

          {/* Categorías */}
          <div>
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">Categorías</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/categoria/inmuebles" className="hover:text-white transition-colors">Inmuebles</Link></li>
              <li><Link href="/categoria/vehículos" className="hover:text-white transition-colors">Vehículos</Link></li>
              <li><Link href="/categoria/empleos" className="hover:text-white transition-colors">Empleos</Link></li>
              <li><Link href="/categoria/servicios" className="hover:text-white transition-colors">Servicios</Link></li>
              <li><Link href="/categoria/conectar" className="hover:text-pink-400 transition-colors">Conectar 💖</Link></li>
            </ul>
          </div>

          {/* Cuenta */}
          <div>
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">Tu Cuenta</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/registro" className="hover:text-white transition-colors">Crear Cuenta</Link></li>
              <li><Link href="/registro" className="hover:text-indigo-400 transition-colors">Cuenta Empresarial 🏢</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Iniciar Sesión</Link></li>
              <li><Link href="/publicar" className="hover:text-white transition-colors">Publicar Anuncio</Link></li>
              <li><Link href="/favoritos" className="hover:text-white transition-colors">Mis Favoritos</Link></li>
            </ul>
          </div>

          {/* Premium */}
          <div>
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">Premium</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="text-yellow-400 font-semibold">⭐ Anuncios Destacados</li>
              <li className="text-gray-500 text-xs">Haz que tu anuncio aparezca primero en los resultados de búsqueda.</li>
            </ul>
            <div className="mt-6 bg-gray-800 rounded-xl p-4 border border-gray-700">
              <p className="text-xs text-gray-400 mb-2">¿Eres empresa?</p>
              <p className="text-sm text-white font-bold">Publica ofertas de empleo y destaca tu marca.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} NÍTIDO. Todos los derechos reservados. República Dominicana.</p>
          <div className="flex gap-6 text-xs text-gray-500">
            <span className="hover:text-white cursor-pointer transition-colors">Términos</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacidad</span>
            <span className="hover:text-white cursor-pointer transition-colors">Contacto</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
