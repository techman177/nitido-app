import Link from 'next/link'
import Logo from './Logo'
import { ShieldAlert } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0b] text-gray-400 mt-auto border-t border-gray-800/30">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Mission */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              <Logo className="h-9 md:h-12 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-gray-500">
              La plataforma premium de República Dominicana para comprar, vender, trabajar y conectar con lo que realmente importa.
            </p>
            <div className="flex gap-4">
               {/* Social placeholders could go here */}
            </div>
          </div>

          {/* Categorías */}
          <div>
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-[0.2em] mb-6">Explorar</h4>
            <ul className="space-y-3.5 text-sm">
              <li><Link href="/categoria/inmuebles" className="hover:text-blue-500 transition-all duration-300">Inmuebles</Link></li>
              <li><Link href="/categoria/vehículos" className="hover:text-blue-500 transition-all duration-300">Vehículos</Link></li>
              <li><Link href="/categoria/empleos" className="hover:text-blue-500 transition-all duration-300">Mercado Laboral</Link></li>
              <li><Link href="/categoria/servicios" className="hover:text-blue-500 transition-all duration-300">Servicios</Link></li>
              <li><Link href="/categoria/conectar" className="text-pink-500/80 hover:text-pink-400 transition-all duration-300 flex items-center gap-2">Conectar <span className="text-[10px] bg-pink-500/10 px-1.5 py-0.5 rounded-full">Social</span></Link></li>
            </ul>
          </div>

          {/* Cuenta & Soporte */}
          <div>
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-[0.2em] mb-6">Plataforma</h4>
            <ul className="space-y-3.5 text-sm">
              <li><Link href="/registro" className="hover:text-white transition-colors">Crear Perfil</Link></li>
              <li><Link href="/registro" className="text-blue-400/90 hover:text-blue-400 transition-colors">Cuenta Empresas 🏢</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Acceso Usuarios</Link></li>
              <li><Link href="/publicar" className="hover:text-white transition-colors font-medium">Publicar Anuncio</Link></li>
              <li><Link href="/ayuda" className="hover:text-white transition-colors text-gray-600">Centro de Ayuda</Link></li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="bg-gray-900/40 p-6 rounded-3xl border border-gray-800/50 backdrop-blur-sm">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Newsletter</h4>
            <p className="text-xs text-gray-500 mb-4">Recibe las mejores ofertas y noticias directamente.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="bg-black/40 border border-gray-800 rounded-xl px-3 py-2 text-xs w-full focus:outline-none focus:border-blue-500 transition-colors" />
              <button className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="text-xs text-gray-600">© {new Date().getFullYear()} NÍTIDO. Todos los derechos reservados.</p>
            <div className="hidden md:block w-px h-3 bg-gray-800"></div>
            <p className="text-[10px] uppercase tracking-widest text-gray-700 font-bold">
              Creado por <span className="text-gray-400 hover:text-white transition-colors cursor-default">IntegratCore</span>
            </p>
          </div>
          
          <div className="flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-700">
            <Link href="/terminos" className="hover:text-[#E5CC89] transition-all">Términos</Link>
            <Link href="/seguridad" className="hover:text-red-400 transition-all flex items-center gap-1.5 focus:text-red-400 group">
              <ShieldAlert className="w-3.5 h-3.5 transition-colors text-white/10 group-hover:text-red-500" />
              Seguridad
            </Link>
            <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
