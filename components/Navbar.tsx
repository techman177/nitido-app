'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

export default function Navbar() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 border-b border-gray-100 bg-white/95 sticky top-0 z-50 shadow-sm backdrop-blur-md">
      <Link href="/" className="hover:opacity-80 transition-opacity flex items-center">
        <Image src="/logo.png" alt="NÍTIDO" width={120} height={40} priority className="h-8 md:h-10 w-auto object-contain" />
      </Link>
      
      <div className="flex gap-4 md:gap-6 items-center">
        {!loading && (
          <>
            {session ? (
              <>
                <Link href="/favoritos" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors hidden md:block">
                  Favoritos (🤍)
                </Link>
                <Link href="/perfil" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <span className="hidden sm:inline">Mi Perfil</span>
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    {session.user.email?.charAt(0).toUpperCase()}
                  </div>
                </Link>
                <button onClick={handleLogout} className="text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors hidden sm:block">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link href="/favoritos" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors hidden md:block">
                  Favoritos (🤍)
                </Link>
                <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                  Iniciar Sesión
                </Link>
              </>
            )}
            
            <Link href="/publicar" className="bg-blue-600 text-white px-5 md:px-6 py-2 md:py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap">
              Publicar Anuncio
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
