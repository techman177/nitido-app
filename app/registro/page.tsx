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
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMenorEdad, setErrorMenorEdad] = useState('')

  const isEmpresa = tipoCuenta === 'empresa'

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setErrorMenorEdad('')
    
    // Validación de Mayoría de Edad
    const birthDate = new Date(fechaNacimiento)
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

    // 1. Crear la cuenta en Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
    
    if (authError) {
      setMessage(authError.message)
      setLoading(false)
      return
    }

    // 2. Guardar perfil completo
    if (authData.user) {
      await supabase.from('perfiles').insert([{ 
        id: authData.user.id, 
        nombre_completo: isEmpresa ? nombreEmpresa : nombre,
        telefono: telefono || null,
        fecha_nacimiento: fechaNacimiento,
        tipo_cuenta: tipoCuenta,
        nombre_empresa: isEmpresa ? nombreEmpresa : null,
        rnc: isEmpresa ? rnc : null,
      }])
    }

    setMessage(isEmpresa 
      ? '¡Cuenta Empresarial creada! Revisa tu correo para confirmarla.' 
      : '¡Cuenta creada! Revisa tu correo electrónico para confirmarla.'
    )
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans text-gray-900 py-12">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-center text-blue-600 mb-2 tracking-tighter">Únete a NÍTIDO.</h2>
        <p className="text-center text-gray-500 mb-6 text-sm font-medium">Publica anuncios y conecta con gente real.</p>
        
        {/* Selector de Tipo de Cuenta */}
        <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-2xl">
          <button 
            type="button"
            onClick={() => setTipoCuenta('personal')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${!isEmpresa ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            👤 Personal
          </button>
          <button 
            type="button"
            onClick={() => setTipoCuenta('empresa')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${isEmpresa ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            🏢 Empresarial
          </button>
        </div>

        {isEmpresa && (
          <div className="bg-indigo-50 rounded-2xl p-4 mb-6 border border-indigo-100">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Cuenta Empresarial</p>
            <p className="text-sm text-indigo-700/80">Publica ofertas laborales, destaca tu marca y accede a herramientas de contratación.</p>
          </div>
        )}
        
        <form onSubmit={handleRegistro} className="space-y-5">
          
          {isEmpresa ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Nombre de la Empresa</label>
                <input type="text" placeholder="Ej. Grupo ABC, SRL" className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-indigo-600 outline-none transition-all" value={nombreEmpresa} onChange={(e) => setNombreEmpresa(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">RNC <span className="text-gray-400 text-xs font-normal">(opcional)</span></label>
                <input type="text" placeholder="Ej. 130-12345-6" className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-indigo-600 outline-none transition-all" value={rnc} onChange={(e) => setRnc(e.target.value)} />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Nombre Completo</label>
              <input type="text" placeholder="Ej. Juan Pérez" className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-600 outline-none transition-all" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Teléfono <span className="text-gray-400 text-xs font-normal">(para WhatsApp)</span></label>
            <input type="tel" placeholder="Ej. 829-555-1234" className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-600 outline-none transition-all" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Fecha de Nacimiento <span className="text-red-500 font-bold">*</span></label>
            <input type="date" className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-600 outline-none transition-all text-gray-700" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Correo Electrónico</label>
            <input type="email" placeholder={isEmpresa ? "contacto@miempresa.com" : "ejemplo@correo.com"} className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-600 outline-none transition-all" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Contraseña</label>
            <input type="password" placeholder="Mínimo 6 caracteres" className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-600 outline-none transition-all" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          </div>
          
          {errorMenorEdad && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
              <div className="flex items-center gap-3 text-red-700">
                <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                <span className="font-bold">{errorMenorEdad}</span>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className={`w-full text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg mt-2 ${isEmpresa ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-indigo-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}>
            {loading ? 'Creando cuenta...' : (isEmpresa ? '🏢 Crear Cuenta Empresarial' : 'Crear Cuenta')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="h-px w-full bg-gray-100 my-4"></div>
          <p className="text-sm text-gray-500">¿Ya tienes cuenta? <Link href="/login" className="text-blue-600 font-bold hover:underline">Inicia sesión aquí</Link></p>
        </div>
        {message && <p className="mt-4 text-center text-sm font-medium text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">{message}</p>}
      </div>
    </div>
  )
}