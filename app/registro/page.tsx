'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function RegistroPage() {
  const [tipoCuenta, setTipoCuenta] = useState<'personal' | 'empresa'>('personal')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [nombreEmpresa, setNombreEmpresa] = useState('')
  const [rnc, setRnc] = useState('')
  const [telefono, setTelefono] = useState('')
  const [dia, setDia] = useState('')
  const [mes, setMes] = useState('')
  const [anio, setAnio] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMenorEdad, setErrorMenorEdad] = useState('')

  const isEmpresa = tipoCuenta === 'empresa'

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setErrorMenorEdad('')
    
    if (!dia || !mes || !anio) {
      setMessage('Por favor, selecciona tu fecha de nacimiento completa.')
      setLoading(false)
      return
    }

    const birthDateStr = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
    const birthDate = new Date(birthDateStr)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    if (age < 18) {
      setErrorMenorEdad('Debes ser mayor de 18 años para unirte a NÍTIDO.')
      setLoading(false)
      return
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
    
    if (authError) {
      setMessage(authError.message)
      setLoading(false)
      return
    }

    if (authData.user) {
      await supabase.from('perfiles').insert([{ 
        id: authData.user.id, 
        nombre_completo: isEmpresa ? nombreEmpresa : nombre,
        telefono: telefono || null,
        fecha_nacimiento: birthDateStr,
        tipo_cuenta: tipoCuenta,
        nombre_empresa: isEmpresa ? nombreEmpresa : null,
        rnc: isEmpresa ? rnc : null,
      }])
    }

    setMessage(isEmpresa 
      ? '¡Cuenta Empresarial creada! Revisa tu correo electrónico.' 
      : '¡Cuenta creada! Revisa tu correo electrónico para confirmarla.'
    )
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 font-sans text-gray-900 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#dbeafe_0%,transparent_50%)] pointer-events-none opacity-50"></div>
      
      <div className="max-w-md w-full relative z-10 transition-all duration-500">
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 backdrop-blur-sm">
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-[900] text-blue-600 mb-2 tracking-tighter">Únete a NÍTIDO.</h2>
            <p className="text-gray-500 text-sm font-medium">Crea tu cuenta premium en segundos.</p>
          </div>
          
          <div className="flex gap-2 mb-8 bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200/50">
            <button 
              type="button"
              onClick={() => setTipoCuenta('personal')}
              className={`flex-1 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${!isEmpresa ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Personal
            </button>
            <button 
              type="button"
              onClick={() => setTipoCuenta('empresa')}
              className={`flex-1 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${isEmpresa ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              Empresas
            </button>
          </div>

          <form onSubmit={handleRegistro} className="space-y-6">
            
            {isEmpresa ? (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <input type="text" placeholder="Nombre de la Empresa" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-medium" value={nombreEmpresa} onChange={(e) => setNombreEmpresa(e.target.value)} required />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <input type="text" placeholder="RNC (opcional)" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-medium" value={rnc} onChange={(e) => setRnc(e.target.value)} />
                </div>
              </div>
            ) : (
              <div className="relative group animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input type="text" placeholder="Nombre Completo" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-medium" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <input type="tel" placeholder="Teléfono" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-medium" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Fecha de Nacimiento</label>
              <div className="grid grid-cols-3 gap-2">
                <select className="p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all text-sm font-bold text-gray-700 cursor-pointer appearance-none text-center" value={dia} onChange={(e) => setDia(e.target.value)} required>
                  <option value="" disabled>Día</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select className="p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all text-sm font-bold text-gray-700 cursor-pointer appearance-none text-center" value={mes} onChange={(e) => setMes(e.target.value)} required>
                  <option value="" disabled>Mes</option>
                  {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((m, i) => (
                    <option key={i+1} value={i+1}>{m}</option>
                  ))}
                </select>
                <select className="p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all text-sm font-bold text-gray-700 cursor-pointer appearance-none text-center" value={anio} onChange={(e) => setAnio(e.target.value)} required>
                  <option value="" disabled>Año</option>
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <input type="email" placeholder="Correo Electrónico" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-medium" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <input type="password" placeholder="Contraseña (min. 6)" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-medium" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
            </div>
            
            {errorMenorEdad && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-2xl animate-pulse">
                <p className="text-xs font-bold text-red-700">{errorMenorEdad}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className={`w-full text-white py-5 rounded-[1.25rem] font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0 ${isEmpresa ? 'bg-gradient-to-r from-blue-700 to-indigo-700 shadow-indigo-200' : 'bg-gradient-to-r from-blue-500 to-blue-700 shadow-blue-200'}`}>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Procesando...</span>
                </div>
              ) : (isEmpresa ? 'Crear Perfil Empresa' : 'Crear Cuenta NÍTIDA')}
            </button>
          </form>

          <div className="mt-10 px-4 text-center">
            <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">Al registrarte, aceptas nuestros <Link href="/terminos" className="text-blue-600 hover:underline">Términos de Servicio</Link> y <Link href="/privacidad" className="text-blue-600 hover:underline">Privacidad</Link>.</p>
            <div className="h-px w-full bg-gray-100 mb-8"></div>
            <p className="text-sm text-gray-500 font-medium">¿Ya eres parte? <Link href="/login" className="text-blue-600 font-bold hover:underline">Inicia sesión</Link></p>
          </div>
          
        </div>
      </div>
      
      {message && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            {message}
          </div>
        </div>
      )}
    </div>
  )
}