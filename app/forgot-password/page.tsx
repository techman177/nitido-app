'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Te hemos enviado un correo con el enlace para restablecer tu contraseña.' })
      setEmail('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans text-gray-900">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
        
        <Link href="/login" className="text-sm font-bold text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2 transition-colors">
          ← Volver al login
        </Link>
        
        <h2 className="text-3xl font-black text-center text-gray-900 mb-2 tracking-tighter">Recuperar Acceso</h2>
        <p className="text-center text-gray-500 mb-8 text-sm font-medium">Ingresa el correo electrónico asociado a tu cuenta NÍTIDO.</p>
        
        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="ejemplo@correo.com" 
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-600 outline-none transition-all" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !email} 
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Enviando correo...
              </>
            ) : 'Enviar enlace seguro'}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-xl text-center text-sm font-bold animate-in fade-in slide-in-from-bottom-2 ${
            message.type === 'error' 
              ? 'bg-red-50 border border-red-200 text-red-600'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}
