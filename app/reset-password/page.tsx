'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [ready, setReady] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    // Supabase sets the session from the URL hash automatically
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
    })
  }, [supabase])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' })
      return
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' })
      return
    }

    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: '¡Contraseña actualizada! Redirigiendo...' })
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Fondo decorativo */}
      <div
        aria-hidden
        className="absolute top-[-20%] left-[30%] w-[700px] h-[700px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}
      />

      {/* Logo */}
      <Link href="/" className="text-3xl font-black tracking-tighter text-white mb-10 hover:opacity-80 transition-opacity">
        NÍTIDO.
      </Link>

      {/* Tarjeta */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Nueva contraseña</h1>
          <p className="text-gray-400 text-sm mt-2">
            Elige una contraseña segura para tu cuenta NÍTIDO.
          </p>
        </div>

        {!ready ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-3 text-gray-400 text-sm">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Verificando enlace...
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nueva contraseña
              </label>
              <input
                id="new-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar contraseña
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                minLength={6}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repite tu contraseña"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            {message && (
              <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
                message.type === 'error'
                  ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                  : 'bg-green-500/10 border border-green-500/20 text-green-400'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              id="reset-submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-500 active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Guardando...
                </span>
              ) : 'Guardar nueva contraseña'}
            </button>
          </form>
        )}
      </div>

      <p className="text-gray-600 text-xs mt-8">© 2025 NÍTIDO · República Dominicana</p>
    </div>
  )
}
