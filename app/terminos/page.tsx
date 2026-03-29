import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-24">
        {/* Header Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">Términos y Condiciones</h1>
          <p className="text-[#B49248] font-bold uppercase tracking-[0.3em] text-xs">Última actualización: 28 de Marzo, 2026</p>
        </div>

        {/* Legal Content */}
        <div className="space-y-12 prose prose-invert prose-gold max-w-none">
          <section className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
            <h2 className="text-[#E5CC89] text-xl font-black uppercase tracking-widest mb-6">1. Aceptación del Servicio</h2>
            <p className="leading-relaxed">
              Al acceder y utilizar NÍTIDO, usted acepta cumplir con estos términos y condiciones. Nuestra plataforma es un marketplace premium diseñado para facilitar transacciones seguras y profesionales en República Dominicana.
            </p>
          </section>

          <section>
            <h2 className="text-[#E5CC89] text-xl font-black uppercase tracking-widest mb-6">2. Responsabilidad de Publicación</h2>
            <p className="leading-relaxed mb-4">
              Cada usuario es el único responsable de la veracidad de la información publicada en sus anuncios. Queda terminantemente prohibido:
            </p>
            <ul className="list-disc pl-6 space-y-3 marker:text-[#B49248]">
              <li>Publicar artículos ilegales o regulados sin los permisos correspondientes.</li>
              <li>Usar imágenes que no correspondan al objeto real de la venta.</li>
              <li>Intentar realizar fraudes o estafas a otros miembros de la comunidad.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[#E5CC89] text-xl font-black uppercase tracking-widest mb-6">3. Seguridad y Verificación</h2>
            <p className="leading-relaxed">
              NÍTIDO ofrece un sistema de <strong>Vendedor Verificado</strong> para aumentar la confianza. Sin embargo, instamos a todos los usuarios a seguir nuestros protocolos de seguridad: encuentros en lugares públicos, revisión del producto antes de pagar y reporte de cualquier anomalía.
            </p>
          </section>

          <section className="border-l-4 border-[#B49248] pl-8 py-4 bg-gradient-to-r from-white/5 to-transparent rounded-r-2xl">
            <h2 className="text-[#E5CC89] text-xl font-black uppercase tracking-widest mb-4">4. Privacidad de Datos</h2>
            <p className="leading-relaxed">
              Sus datos están protegidos bajo nuestros estándares de cifrado. No compartimos información personal con terceros para fines comerciales sin su consentimiento explícito.
            </p>
          </section>

          <section>
            <h2 className="text-[#E5CC89] text-xl font-black uppercase tracking-widest mb-6">5. Limitación de Responsabilidad</h2>
            <p className="leading-relaxed">
              NÍTIDO actúa únicamente como intermediario. No nos hacemos responsables de las disputas entre compradores y vendedores, ni de la calidad o legalidad de los productos transaccionados fuera de nuestros servicios premium certificados.
            </p>
          </section>
        </div>

        {/* Call to action */}
        <div className="mt-20 pt-12 border-t border-white/5 text-center">
          <p className="text-sm text-white/40 mb-8">¿Tienes alguna duda sobre nuestros términos?</p>
          <Link 
            href="/contacto" 
            className="inline-block px-10 py-4 bg-white/5 hover:bg-white/10 border border-[#B49248]/30 rounded-2xl text-[#E5CC89] font-bold transition-all"
          >
            Contactar Soporte Legal
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
