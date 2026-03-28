'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface Anuncio {
  id: number
  titulo: string
  precio: number
  es_premium: boolean
  categorias: { nombre: string }
}

export default function CheckoutPage() {
  const params = useParams()
  const adId = params.id as string
  const router = useRouter()
  
  const [ad, setAd] = useState<Anuncio | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  // Form State
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    async function loadAd() {
      if (!adId) return
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('anuncios')
        .select('id, titulo, precio, es_premium, categorias(nombre)')
        .eq('id', adId)
        .eq('usuario_id', session.user.id)
        .single()
        
      if (error || !data) {
        router.push('/perfil')
        return
      }
      
      if (data.es_premium) {
         router.push('/perfil') // Ya es premium
         return
      }

      setAd(data as unknown as Anuncio)
      setLoading(false)
    }
    loadAd()
  }, [adId, router])

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    // Simulador de retraso bancario
    await new Promise(resolve => setTimeout(resolve, 2500))

    // Actualizar Base de Datos (Marcar como Premium)
    const { error } = await supabase
      .from('anuncios')
      .update({ es_premium: true })
      .eq('id', adId)

    setProcessing(false)

    if (error) {
      alert('Hubo un error al procesar el pago.')
    } else {
      setSuccess(true)
      // Redirigir después de celebrar
      setTimeout(() => {
         router.push('/perfil')
      }, 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-yellow-100 border-t-yellow-400 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border-2 border-yellow-400 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-300/20 to-transparent pointer-events-none"></div>
           <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">👑</span>
           </div>
           <h1 className="text-3xl font-black text-gray-900 mb-2">¡Pago Exitoso!</h1>
           <p className="text-gray-500 mb-8">Tu anuncio ahora es Premium y aparecerá impulsado en la primera fila.</p>
           <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
             <div className="bg-yellow-400 h-full animate-[progress_3s_ease-in-out_forwards]"></div>
           </div>
           <p className="text-xs text-gray-400 mt-4 leading-none">Redirigiendo a tu perfil...</p>
        </div>
        <style jsx>{`
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <Link href="/perfil" className="text-sm font-bold text-gray-500 hover:text-gray-800 mb-6 inline-block transition-colors">
          ← Cancelar y volver
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Detalles del Upgrade */}
          <div className="lg:w-1/3 w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-28">
            <h2 className="text-xl font-bold mb-4">Resumen de Compra</h2>
            
            <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100 mb-6">
               <div className="flex items-center gap-2 mb-2">
                 <span className="text-2xl">👑</span>
                 <span className="font-black text-yellow-800 text-lg tracking-tight">Destacado Premium</span>
               </div>
               <p className="text-xs text-yellow-700 leading-relaxed mb-3">
                 Tu anuncio estará en la zona dorada superior durante 7 días y recibirá un borde especial llamativo.
               </p>
               <div className="bg-white/60 p-2 rounded-lg text-sm text-yellow-900 font-medium truncate">
                 Item: {ad?.titulo}
               </div>
            </div>
            
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
               <div className="flex justify-between text-gray-500 text-sm">
                 <span>Subtotal</span>
                 <span>DOP 500.00</span>
               </div>
               <div className="flex justify-between text-gray-500 text-sm">
                 <span>Impuestos (ITBIS 18%)</span>
                 <span>DOP 90.00</span>
               </div>
            </div>
            
            <div className="flex justify-between items-end">
               <span className="font-bold text-gray-900">Total a pagar</span>
               <span className="text-2xl font-black text-gray-900">DOP 590.00</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-4 text-center">Simulación segura. No se harán cargos reales.</p>
          </div>

          {/* Formulario de Pago Mejorado */}
          <div className="lg:w-2/3 w-full">
            <h1 className="text-3xl font-black mb-6">Información de Pago</h1>
            
            {/* Visual Credit Card */}
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl relative overflow-hidden transition-all max-w-[400px]">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
               <div className="flex justify-between items-center mb-8">
                  <svg className="w-12 h-8" viewBox="0 0 48 32" fill="none"><rect width="48" height="32" rx="4" fill="#E0E0E0"/><path d="M4 8h40v4H4V8zm0 12h40v4H4v-4z" fill="#9E9E9E"/></svg>
                  <div className="flex gap-1">
                    <div className="w-8 h-8 rounded-full bg-red-500/80 mix-blend-screen"></div>
                    <div className="w-8 h-8 rounded-full bg-yellow-500/80 -ml-4 mix-blend-screen"></div>
                  </div>
               </div>
               <div className="font-mono text-xl tracking-widest mb-4 opacity-90 h-7 flex items-end">
                 {cardNumber || '•••• •••• •••• ••••'}
               </div>
               <div className="flex justify-between items-end opacity-80 uppercase text-xs tracking-wider">
                 <div>
                   <div className="text-[9px] mb-1 opacity-60">Titular de la tarjeta</div>
                   <div className="font-medium truncate max-w-[150px]">{name || 'NOMBRE APELLIDO'}</div>
                 </div>
                 <div className="text-right">
                   <div className="text-[9px] mb-1 opacity-60">Expira</div>
                   <div className="font-medium">{expiry || 'MM/AA'}</div>
                 </div>
               </div>
            </div>

            <form onSubmit={handlePay} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre en la tarjeta</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value.toUpperCase())}
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-xl outline-none transition-colors"
                  placeholder="JUAN PEREZ"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Número de tarjeta</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                    className="w-full p-4 pl-12 bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-xl outline-none transition-colors font-mono"
                    placeholder="0000 0000 0000 0000"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Vencimiento</label>
                  <input 
                    type="text" 
                    required
                    maxLength={5}
                    value={expiry}
                    onChange={e => setExpiry(formatExpiry(e.target.value))}
                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-xl outline-none transition-colors font-mono"
                    placeholder="MM/AA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CVC</label>
                  <input 
                    type="password" 
                    required
                    maxLength={4}
                    value={cvc}
                    onChange={e => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-xl outline-none transition-colors font-mono"
                    placeholder="123"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={processing || cardNumber.length < 18 || expiry.length < 5 || cvc.length < 3 || !name}
                className="w-full mt-8 bg-gray-900 text-white py-4 md:py-5 rounded-2xl font-bold text-lg hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Procesando Pago Seguro...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                    Pagar DOP 590.00
                  </span>
                )}
                
                {/* Micro animation scan line during processing */}
                {processing && (
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                )}
              </button>
            </form>
          </div>

        </div>
      </main>
      
      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
