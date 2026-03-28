'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Category {
  id: number
  nombre: string
}

interface Anuncio {
  id: number
  usuario_id: string
  titulo: string
  descripcion: string
  precio: number
  ubicacion: string
  categoria_id: number
  marca?: string
  modelo?: string
  anio?: number | null
  transmision?: string
  combustible?: string
}

export default function PublicarPage() {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  
  // Vehículos
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [anio, setAnio] = useState('')
  const [transmision, setTransmision] = useState('')
  const [combustible, setCombustible] = useState('')

  // Fotos
  const [fotos, setFotos] = useState<File[]>([])

  const [categorias, setCategorias] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [exito, setExito] = useState(false)
  const [loadingSession, setLoadingSession] = useState(true)
  const [mayorDeEdad, setMayorDeEdad] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        // Redundancy Check: Mayoría de Edad
        // Si no hay fecha_nacimiento, PERMITE el acceso por defecto (cuentas antiguas)
        const { data: perfil } = await supabase.from('perfiles').select('fecha_nacimiento').eq('id', session.user.id).single()
        
        let isAdult = true // Por defecto: permitir acceso
        if (perfil?.fecha_nacimiento) {
          const birthDate = new Date(perfil.fecha_nacimiento)
          const today = new Date()
          let age = today.getFullYear() - birthDate.getFullYear()
          const m = today.getMonth() - birthDate.getMonth()
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
          }
          isAdult = age >= 18
        }
        
        setMayorDeEdad(isAdult)
        setLoadingSession(false)
      }
    }
    checkSession()
  }, [router])

  useEffect(() => {
    async function cargarCategorias() {
      const { data } = await supabase.from('categorias').select('*')
      if (data) setCategorias(data)
    }
    cargarCategorias()
  }, [])

  if (loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  const categoriaSeleccionada = categorias.find(c => c.id.toString() === categoriaId)?.nombre?.toLowerCase() || '';
  const esVehiculo = categoriaSeleccionada === 'vehículos' || categoriaSeleccionada === 'vehiculos';
  const esConectar = categoriaSeleccionada === 'conectar';

  // Manejar selección de fotos
  const handleFotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFotos(Array.from(e.target.files))
    }
  }

  const handlePublicar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensaje('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setMensaje('Debes iniciar sesión para publicar.')
      setLoading(false)
      return
    }

    if (fotos.length === 0) {
      setMensaje('¡Sube al menos una foto para que el anuncio se vea profesional!')
      setLoading(false)
      return
    }

    const datosAnuncio: Partial<Anuncio> = {
      usuario_id: user.id,
      titulo,
      descripcion,
      precio: esConectar ? 0 : (precio ? parseFloat(precio) : 0),
      ubicacion,
      categoria_id: parseInt(categoriaId)
    }

    if (esVehiculo || esConectar) {
      datosAnuncio.marca = marca
      datosAnuncio.modelo = modelo
      datosAnuncio.anio = anio ? parseInt(anio) : null
      datosAnuncio.transmision = transmision
      if (esVehiculo) datosAnuncio.combustible = combustible
    }

    // 1. Crear el anuncio en la base de datos (con .select().single() para obtener el ID)
    const { data: anuncioGuardado, error: errorAnuncio } = await supabase
      .from('anuncios')
      .insert([datosAnuncio])
      .select()
      .single()

    if (errorAnuncio) {
      setMensaje('Error al crear el anuncio: ' + errorAnuncio.message)
      setLoading(false)
      return
    }

    // 2. Subir las fotos al "Disco Duro" de Supabase
    setMensaje('Subiendo fotos, por favor espera...')
    
    for (const foto of fotos) {
      const fileExt = foto.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
      const rutaGuardado = `${user.id}/${fileName}`

      const { error: errorUpload } = await supabase.storage
        .from('anuncios')
        .upload(rutaGuardado, foto)

      if (!errorUpload) {
        // 3. Conseguir el link público de la foto y guardarlo en la tabla fotos_anuncio
        const { data: { publicUrl } } = supabase.storage.from('anuncios').getPublicUrl(rutaGuardado)
        await supabase.from('fotos_anuncio').insert([{
          anuncio_id: anuncioGuardado.id,
          url_imagen: publicUrl
        }])
      }
    }

    setMensaje('¡Anuncio publicado NÍTIDO con todo y fotos! 🎉 Redirigiendo a tu perfil...')
    setExito(true)
    
    // Redirigir después de 2 segundos para que el usuario vea el éxito
    setTimeout(() => {
      router.push('/perfil')
    }, 2000)
    
    // Limpiar todo
    setTitulo(''); setDescripcion(''); setPrecio(''); setUbicacion(''); setCategoriaId('');
    setMarca(''); setModelo(''); setAnio(''); setTransmision(''); setCombustible(''); setFotos([]);
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans text-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter">NÍTIDO.</Link>
          <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-blue-600">Volver al inicio</Link>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
          <h1 className="text-3xl font-bold mb-2">Publica tu anuncio</h1>
          <p className="text-gray-500 mb-8">Llega a miles de personas en República Dominicana.</p>

          {mayorDeEdad === false ? (
            <div className="bg-red-50 p-8 rounded-2xl text-center border-2 border-red-200 shadow-sm mt-4">
              <span className="text-6xl mb-4 block">🚫</span>
              <h2 className="text-2xl font-black text-red-700 mb-3 tracking-tight">Acceso Bloqueado</h2>
              <p className="text-red-600 font-medium mb-2">Debes ser mayor de 18 años para publicar anuncios en NÍTIDO.</p>
              <p className="text-sm text-red-500/80">Si consideras que esto es un error o tu cuenta es antigua, por favor actualiza tu fecha de nacimiento en Editar Perfil.</p>
            </div>
          ) : (
            <form onSubmit={handlePublicar} className="space-y-6">
              
              {/* Título y Categoría */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Título del anuncio</label>
                <input type="text" placeholder="Ej. Toyota Corolla" className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-600 outline-none transition-all" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                <select className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-600 outline-none transition-all cursor-pointer" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
                  <option value="" disabled>Selecciona una...</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Vehículos Dinámico */}
            {esVehiculo && (
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4">
                <h3 className="font-bold text-blue-800 mb-4">Detalles del Vehículo</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Marca</label>
                    <input type="text" placeholder="Ej. Toyota" className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500" value={marca} onChange={(e) => setMarca(e.target.value)} required={esVehiculo} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Modelo</label>
                    <input type="text" placeholder="Ej. Corolla" className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500" value={modelo} onChange={(e) => setModelo(e.target.value)} required={esVehiculo} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Año</label>
                    <input type="number" placeholder="Ej. 2018" className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500" value={anio} onChange={(e) => setAnio(e.target.value)} required={esVehiculo} />
                  </div>
                </div>
              </div>
            )}

            {/* Conectar Dinámico */}
            {esConectar && (
              <div className="bg-pink-50 p-6 rounded-2xl border border-pink-100 space-y-4 shadow-[inset_0_2px_10px_rgba(252,165,165,0.1)]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">💖</span>
                  <h3 className="font-bold text-pink-700 text-lg tracking-tight">Crea tu Perfil NÍTIDO</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-pink-600 uppercase tracking-widest mb-1.5 ml-1">Mi Edad</label>
                    <input type="number" min="18" max="99" placeholder="Ej. 25" className="w-full p-3 bg-white border-2 border-pink-100 rounded-xl outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20 text-center font-bold text-gray-700" value={anio} onChange={(e) => setAnio(e.target.value)} required={esConectar} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-pink-600 uppercase tracking-widest mb-1.5 ml-1">Soy</label>
                    <select className="w-full p-3 bg-white border-2 border-pink-100 rounded-xl outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20 text-gray-700 font-medium" value={marca} onChange={(e) => setMarca(e.target.value)} required={esConectar}>
                      <option value="" disabled>Seleccionar...</option>
                      <option value="Hombre">Hombre</option>
                      <option value="Mujer">Mujer</option>
                      <option value="Ambos">Ambos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-pink-600 uppercase tracking-widest mb-1.5 ml-1">Qué busco</label>
                    <select className="w-full p-3 bg-white border-2 border-pink-100 rounded-xl outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20 text-gray-700 font-medium" value={modelo} onChange={(e) => setModelo(e.target.value)} required={esConectar}>
                      <option value="" disabled>Seleccionar...</option>
                      <option value="Hombre">Hombre</option>
                      <option value="Mujer">Mujer</option>
                      <option value="Ambos">Ambos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-pink-600 uppercase tracking-widest mb-1.5 ml-1">Tipo de Relación</label>
                    <select className="w-full p-3 bg-white border-2 border-pink-100 rounded-xl outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20 text-gray-700 font-medium" value={transmision} onChange={(e) => setTransmision(e.target.value)} required={esConectar}>
                      <option value="" disabled>Seleccionar...</option>
                      <option value="Amistad">Amistad 👋</option>
                      <option value="Citas casuales">Citas casuales 🍻</option>
                      <option value="Algo serio">Algo serio 💍</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* FOTOS (NUEVO) */}
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 text-center hover:border-blue-500 transition-all">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sube las fotos (Obligatorio)</label>
              <input type="file" multiple accept="image/*" onChange={handleFotosChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" required />
              {fotos.length > 0 && <p className="mt-3 text-sm text-green-600 font-bold">{fotos.length} foto(s) seleccionada(s)</p>}
            </div>

            {/* Precio y Ubicación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!esConectar && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Precio (DOP)</label>
                  <input type="number" placeholder="Ej. 850000" className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-600 outline-none transition-all" value={precio} onChange={(e) => setPrecio(e.target.value)} required={!esConectar} />
                </div>
              )}
              <div className={esConectar ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{esConectar ? 'En qué ciudad te ubicas' : 'Sector / Ciudad'}</label>
                <input type="text" placeholder="Ej. Santo Domingo Este" className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-600 outline-none transition-all" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} required />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{esConectar ? 'Biografía (Cuéntanos de ti)' : 'Descripción'}</label>
              <textarea placeholder={esConectar ? "Me encanta la playa, leer libros y busco una persona con quien compartir buenos momentos..." : "Motivo de superación, excelentes condiciones..."} rows={4} className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-600 outline-none transition-all resize-none" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              {loading ? 'Subiendo datos y fotos...' : 'Publicar Anuncio'}
            </button>
          </form>
          )}

          {mensaje && (
            <div className={`mt-6 p-4 rounded-xl text-center font-bold border ${exito ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
              {mensaje}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}