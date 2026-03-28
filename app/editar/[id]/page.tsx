'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface Category {
  id: number
  nombre: string
}

export default function EditarPage() {
  const { id } = useParams()
  const router = useRouter()
  
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

  const [categorias, setCategorias] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadData() {
      // 1. Cargar categorías
      const { data: cats } = await supabase.from('categorias').select('*')
      if (cats) setCategorias(cats)

      // 2. Cargar anuncio
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: ad, error: adError } = await supabase
        .from('anuncios')
        .select('*')
        .eq('id', id)
        .single()

      if (adError || !ad) {
        setError(true)
        setMensaje('No pudimos encontrar el anuncio.')
        setLoading(false)
        return
      }

      // 3. Verificar propiedad
      if (ad.usuario_id !== user.id) {
        setError(true)
        setMensaje('No tienes permiso para editar este anuncio.')
        setLoading(false)
        return
      }

      // 4. Llenar estados
      setTitulo(ad.titulo)
      setDescripcion(ad.descripcion)
      setPrecio(ad.precio.toString())
      setUbicacion(ad.ubicacion)
      setCategoriaId(ad.categoria_id.toString())
      setMarca(ad.marca || '')
      setModelo(ad.modelo || '')
      setAnio(ad.anio ? ad.anio.toString() : '')
      setTransmision(ad.transmision || '')
      setCombustible(ad.combustible || '')
      
      setLoading(false)
    }

    loadData()
  }, [id, router])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMensaje('')

    const updates = {
      titulo,
      descripcion,
      precio: parseFloat(precio || '0'),
      ubicacion,
      categoria_id: parseInt(categoriaId),
      marca: marca || null,
      modelo: modelo || null,
      anio: anio ? parseInt(anio) : null,
      transmision: transmision || null,
      combustible: combustible || null
    }

    const { error: updateError } = await supabase
      .from('anuncios')
      .update(updates)
      .eq('id', id)

    if (updateError) {
      setMensaje('Error al actualizar: ' + updateError.message)
      setSaving(false)
    } else {
      setMensaje('¡Anuncio actualizado correctamente! Redirigiendo...')
      setTimeout(() => {
        router.push('/perfil')
      }, 1500)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <span className="text-6xl mb-4">⛔</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{mensaje}</h1>
        <Link href="/perfil" className="text-blue-600 font-bold hover:underline">Volver a mis anuncios</Link>
      </div>
    )
  }

  const categoriaSeleccionada = categorias.find(c => c.id.toString() === categoriaId)?.nombre?.toLowerCase() || '';
  const esVehiculo = categoriaSeleccionada === 'vehículos' || categoriaSeleccionada === 'vehiculos';
  const esConectar = categoriaSeleccionada === 'conectar';

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2 tracking-tighter">Editar Anuncio</h1>
            <p className="text-gray-500 font-medium">Modifica los detalles de tu publicación.</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Título</label>
                <input type="text" className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-medium" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Categoría</label>
                <select className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-medium cursor-pointer" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {esVehiculo && (
              <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                <h3 className="font-bold text-blue-800 mb-2 ml-1">Detalles del Vehículo</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Marca" className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-medium" value={marca} onChange={(e) => setMarca(e.target.value)} required={esVehiculo} />
                  <input type="text" placeholder="Modelo" className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-medium" value={modelo} onChange={(e) => setModelo(e.target.value)} required={esVehiculo} />
                  <input type="number" placeholder="Año" className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-medium" value={anio} onChange={(e) => setAnio(e.target.value)} required={esVehiculo} />
                </div>
              </div>
            )}

            {esConectar && (
              <div className="bg-pink-50 p-6 rounded-[2rem] border border-pink-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                <h3 className="font-bold text-pink-700 mb-2 ml-1">Detalles de Perfil</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="number" placeholder="Tu Edad" className="w-full p-3 bg-white border border-pink-200 rounded-xl outline-none focus:border-pink-500 font-medium text-pink-900" value={anio} onChange={(e) => setAnio(e.target.value)} required={esConectar} />
                  <select className="w-full p-3 bg-white border border-pink-200 rounded-xl outline-none focus:border-pink-500 font-medium text-pink-900" value={transmision} onChange={(e) => setTransmision(e.target.value)} required={esConectar}>
                    <option value="" disabled>Relación...</option>
                    <option value="Amistad">Amistad</option>
                    <option value="Citas casuales">Citas casuales</option>
                    <option value="Algo serio">Algo serio</option>
                  </select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!esConectar && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Precio (DOP)</label>
                  <input type="number" className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-medium" value={precio} onChange={(e) => setPrecio(e.target.value)} required={!esConectar} />
                </div>
              )}
              <div className={esConectar ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Ubicación</label>
                <input type="text" className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-medium" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Descripción</label>
              <textarea rows={6} className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-medium resize-none" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
            </div>

            <button type="submit" disabled={saving} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50">
              {saving ? 'Guardando cambios...' : 'Guardar Cambios NÍTIDOS'}
            </button>
            
            <Link href="/perfil" className="block text-center text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
              Cancelar edición
            </Link>
          </form>

          {mensaje && (
            <div className={`mt-6 p-4 rounded-2xl text-center font-bold border animate-in fade-in duration-300 ${mensaje.includes('error') ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
              {mensaje}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
