'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError('Credenciales incorrectas. Por favor, verifica tu correo y contraseña.')
      setLoading(false)
      return
    }

    // Redirigir al inicio o a la página de publicación si venía de ahí
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans text-gray-900">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-center text-blue-600 mb-2 tracking-tighter">Hola de nuevo.</h2>
        <p className="text-center text-gray-500 mb-8 text-sm font-medium">Inicia sesión para gestionar tus anuncios.</p>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="ejemplo@correo.com" 
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-600 outline-none transition-all" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              autoComplete="email"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-600">Contraseña</label>
              <Link href="/forgot-password" id="forgot-password" className="text-xs font-bold text-blue-600 hover:underline">¿Olvidaste tu contraseña?</Link>
            </div>
            <input 
              type="password" 
              placeholder="Tu contraseña" 
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-600 outline-none transition-all" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              autoComplete="current-password"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Entrando...
              </>
            ) : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="h-px w-full bg-gray-100 my-4"></div>
          <p className="text-sm text-gray-500">
            ¿No tienes cuenta? <Link href="/registro" className="text-blue-600 font-bold hover:underline">Regístrate aquí</Link>
          </p>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center text-sm font-bold animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}