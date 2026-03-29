'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import Logo from './Logo'

export default function Navbar() {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdmin = async (user: any) => {
      if (!user) {
        setIsAdmin(false)
        return
      }
      const { data: perfil } = await supabase
        .from('perfiles')
        .select('es_admin')
        .eq('id', user.id)
        .single()
      setIsAdmin(perfil?.es_admin === true)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) checkAdmin(session.user)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) checkAdmin(session.user)
      else setIsAdmin(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="flex items-center justify-between px-3 md:px-8 py-3 md:py-4 border-b border-white/5 bg-black/95 sticky top-0 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md overflow-x-hidden">
      <Link href="/" className="hover:opacity-80 transition-opacity flex items-center flex-shrink-0">
        <Logo className="h-7 md:h-12 w-auto" />
      </Link>
      
      <div className="flex gap-4 md:gap-6 items-center">
        {!loading && (
          <>
            {session ? (
              <>
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="flex lg:flex items-center gap-1.5 bg-[#B49248]/10 border border-[#B49248]/30 text-[#E5CC89] px-3 md:px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#B49248]/20 transition-all mr-1 md:mr-2"
                  >
                    <span className="w-1.5 h-1.5 bg-[#B49248] rounded-full animate-pulse"></span>
                    <span className="hidden sm:inline">Panel Admin</span>
                    <span className="sm:hidden">Admin</span>
                  </Link>
                )}
                <Link href="/favoritos" className="text-sm font-semibold text-gray-400 hover:text-[#E5CC89] transition-colors hidden lg:block uppercase tracking-widest">
                  Favoritos (🤍)
                </Link>
                <Link href="/perfil" className="text-sm font-bold text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="hidden sm:inline">Perfil</span>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#B49248] to-[#E5CC89] text-black flex items-center justify-center font-black shadow-lg group-hover:scale-110 transition-transform">
                    {session.user.email?.charAt(0).toUpperCase()}
                  </div>
                </Link>
                <button onClick={handleLogout} className="text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors hidden md:block">
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link href="/favoritos" className="text-sm font-semibold text-gray-400 hover:text-[#E5CC89] transition-colors hidden md:block uppercase tracking-widest">
                  Favoritos (🤍)
                </Link>
                <Link href="/login" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">
                  Iniciar Sesión
                </Link>
              </>
            )}
            
            <Link href="/publicar" className="bg-gradient-to-r from-[#B49248] via-[#E5CC89] to-[#B49248] text-black px-5 md:px-7 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(180,146,72,0.4)] hover:shadow-[0_0_30px_rgba(180,146,72,0.6)] whitespace-nowrap">
              Publicar Anuncio
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
