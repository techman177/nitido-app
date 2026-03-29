'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { toast } from 'react-hot-toast'

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
  sector_id?: number
}

interface Sector {
  id: number
  nombre: string
  slug: string
}

export default function PublicarPage() {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [sectorId, setSectorId] = useState('')
  
  // Vehículos
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [anio, setAnio] = useState('')
  const [transmision, setTransmision] = useState('')
  const [combustible, setCombustible] = useState('')

  // Fotos
  const [fotos, setFotos] = useState<File[]>([])

  const [categorias, setCategorias] = useState<Category[]>([])
  const [sectores, setSectores] = useState<Sector[]>([])
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState(false)
  const [idAnuncioGuardado, setIdAnuncioGuardado] = useState<number | null>(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [mayorDeEdad, setMayorDeEdad] = useState<boolean | null>(null)
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        const { data: perfil } = await supabase.from('perfiles').select('fecha_nacimiento').eq('id', session.user.id).single()
        
        let isAdult = true
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
    async function cargarSectores() {
      const { data } = await supabase.from('sectores').select('*').order('nombre')
      if (data) setSectores(data)
    }
    cargarCategorias()
    cargarSectores()
  }, [])

  if (loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-12 h-12 border-4 border-[#B49248]/20 border-t-[#B49248] rounded-full animate-spin"></div>
      </div>
    )
  }

  const categoriaSeleccionada = categorias.find(c => c.id.toString() === categoriaId)?.nombre?.toLowerCase() || '';
  const esVehiculo = categoriaSeleccionada === 'vehículos' || categoriaSeleccionada === 'vehiculos';
  const esConectar = categoriaSeleccionada === 'conectar';

  // Función para optimizar imágenes del lado del cliente
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Redimensionar si es muy grande (máx 1200px)
          const MAX_WIDTH = 1200;
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else resolve(file); // Fallback al original
          }, 'image/jpeg', 0.8); // 80% calidad
        };
      };
    });
  };

  const handleFotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFotos(Array.from(e.target.files))
    }
  }

  const handlePublicar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (!aceptaTerminos) {
      toast.error('Debes aceptar los términos y condiciones')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Sesión expirada. Por favor inicia sesión de nuevo.')
      setLoading(false)
      return
    }

    if (fotos.length === 0) {
      toast.error('Sube al menos una foto para tu anuncio')
      setLoading(false)
      return
    }

    const datosAnuncio: Partial<Anuncio> = {
      usuario_id: user.id,
      titulo,
      descripcion,
      precio: esConectar ? 0 : (precio ? parseFloat(precio) : 0),
      ubicacion,
      categoria_id: parseInt(categoriaId),
      sector_id: sectorId ? parseInt(sectorId) : undefined
    }

    if (esVehiculo || esConectar) {
      datosAnuncio.marca = marca
      datosAnuncio.modelo = modelo
      datosAnuncio.anio = anio ? parseInt(anio) : null
      datosAnuncio.transmision = transmision
      if (esVehiculo) datosAnuncio.combustible = combustible
    }

    // --- SOLUCIÓN ROBUSTA: UPSERT PARA PERFILES ---
    // Aseguramos que el perfil exista sin riesgo de duplicados ("upsert")
    const { error: errorPerfil } = await supabase
      .from('perfiles')
      .upsert({ 
        id: user.id, 
        nombre_completo: user.user_metadata?.nombre_completo || 'Usuario NÍTIDO' 
      }, { onConflict: 'id' })
    
    if (errorPerfil) {
      toast.error('Error al preparar el perfil: ' + errorPerfil.message)
      setLoading(false)
      return
    }
    // ----------------------------------------------

    const { data: anuncioGuardado, error: errorAnuncio } = await supabase.from('anuncios').insert([datosAnuncio]).select().single()
    if (errorAnuncio) {
      toast.error('Error al crear el anuncio: ' + errorAnuncio.message)
      setLoading(false)
      return
    }

    const toastLoading = toast.loading('Optimizando y subiendo tus fotos...')
    for (const foto of fotos) {
      const fileExt = foto.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
      const rutaGuardado = `${user.id}/${fileName}`
      
      // Optimizar antes de subir
      const optimizado = await compressImage(foto);

      const { error: errorUpload } = await supabase.storage
        .from('imagenes_anuncios')
        .upload(rutaGuardado, optimizado, {
          contentType: 'image/jpeg'
        })

      if (!errorUpload) {
        const { data: { publicUrl } } = supabase.storage.from('imagenes_anuncios').getPublicUrl(rutaGuardado)
        await supabase.from('fotos_anuncio').insert([{ anuncio_id: anuncioGuardado.id, url_imagen: publicUrl }])
      }
    }

    toast.dismiss(toastLoading)
    toast.success('¡Anuncio publicado NÍTIDO! 🎉', { duration: 5000 })
    setIdAnuncioGuardado(anuncioGuardado.id)
    setExito(true)
    router.refresh()
    setTitulo(''); setDescripcion(''); setPrecio(''); setUbicacion(''); setCategoriaId('');
    setMarca(''); setModelo(''); setAnio(''); setTransmision(''); setCombustible(''); setFotos([]);
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#050505] py-12 px-4 font-sans text-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-8 md:h-12 w-auto" />
          </Link>
          <Link href="/" className="text-sm font-semibold text-white/40 hover:text-white transition-colors">Volver al inicio</Link>
        </div>

        <div className="bg-[#0a0a0b] p-8 md:p-10 rounded-3xl shadow-2xl border border-white/5 relative overflow-hidden">
          {/* Brillo decorativo */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#B49248]/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
          
          <h1 className="text-3xl font-black mb-2 text-white tracking-tight">Publica tu anuncio</h1>
          <p className="text-white/40 mb-8 font-medium">Llega a la audiencia más exclusiva de RD.</p>

          {mayorDeEdad === false ? (
            <div className="bg-red-500/5 p-8 rounded-2xl text-center border border-red-500/20 mt-4">
              <span className="text-6xl mb-4 block">🚫</span>
              <h2 className="text-2xl font-black text-red-500 mb-3 tracking-tight">Acceso Bloqueado</h2>
              <p className="text-red-400 font-medium mb-2">Debes ser mayor de 18 años para publicar anuncios en NÍTIDO.</p>
              <p className="text-sm text-red-400/40">Si consideras que esto es un error, por favor actualiza tu perfil.</p>
            </div>
          ) : exito && idAnuncioGuardado ? (
            <div className="mt-8 bg-[#B49248]/5 p-10 rounded-[2.5rem] border border-[#B49248]/20 text-center relative overflow-hidden">
               <div className="w-20 h-20 bg-gradient-to-r from-[#B49248] to-[#E5CC89] text-black rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-[0_0_30px_rgba(180,146,72,0.3)]">
                ✨
              </div>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">¡Publicación Finalizada!</h2>
              <p className="text-white/40 font-medium mb-8">Tu anuncio ya brilla en la vitrina principal de NÍTIDO.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href={`/anuncio/${idAnuncioGuardado}`}
                  className="bg-gradient-to-r from-[#B49248] to-[#E5CC89] text-black px-8 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  Ver mi Anuncio
                </Link>
                <Link 
                  href="/perfil"
                  className="bg-white/5 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center"
                >
                  Ir a mi Perfil
                </Link>
              </div>
              <button 
                onClick={() => { setExito(false); setIdAnuncioGuardado(null); }}
                className="mt-8 text-sm font-bold text-white/30 hover:text-[#E5CC89] transition-colors"
              >
                Publicar otro anuncio
              </button>
            </div>
          ) : (
            <form onSubmit={handlePublicar} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2 ml-1">Título del anuncio</label>
                  <input type="text" placeholder="Ej. Toyota Corolla" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:border-[#B49248] outline-none transition-all text-white placeholder:text-white/20" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2 ml-1">Categoría</label>
                  <select className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:border-[#B49248] outline-none transition-all cursor-pointer text-white appearance-none" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
                    <option value="" disabled className="bg-[#0a0a0b]">Selecciona una...</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-[#0a0a0b]">{cat.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              {esVehiculo && (
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="font-bold text-[#B49248] mb-4 uppercase text-xs tracking-widest">Detalles del Vehículo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-white/40 mb-1.5 uppercase ml-1">Marca</label>
                      <input type="text" placeholder="Ej. Toyota" className="w-full p-3 bg-white/5 border border-white/5 rounded-xl outline-none focus:border-[#B49248] text-white" value={marca} onChange={(e) => setMarca(e.target.value)} required={esVehiculo} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/40 mb-1.5 uppercase ml-1">Modelo</label>
                      <input type="text" placeholder="Ej. Corolla" className="w-full p-3 bg-white/5 border border-white/5 rounded-xl outline-none focus:border-[#B49248] text-white" value={modelo} onChange={(e) => setModelo(e.target.value)} required={esVehiculo} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/40 mb-1.5 uppercase ml-1">Año</label>
                      <input type="number" placeholder="Ej. 2018" className="w-full p-3 bg-white/5 border border-white/5 rounded-xl outline-none focus:border-[#B49248] text-white" value={anio} onChange={(e) => setAnio(e.target.value)} required={esVehiculo} />
                    </div>
                  </div>
                </div>
              )}

              {esConectar && (
                <div className="bg-pink-500/5 p-6 rounded-2xl border border-pink-500/10 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">💖</span>
                    <h3 className="font-bold text-pink-500 text-lg tracking-tight">Crea tu Perfil NÍTIDO</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-pink-500/60 uppercase tracking-widest mb-1.5 ml-1">Mi Edad</label>
                      <input type="number" min="18" max="99" placeholder="25" className="w-full p-3 bg-white/5 border border-pink-500/20 rounded-xl outline-none focus:border-pink-500 text-center font-bold text-white" value={anio} onChange={(e) => setAnio(e.target.value)} required={esConectar} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-pink-500/60 uppercase tracking-widest mb-1.5 ml-1">Soy</label>
                      <select className="w-full p-3 bg-white/5 border border-pink-500/20 rounded-xl outline-none focus:border-pink-500 text-white font-medium appearance-none" value={marca} onChange={(e) => setMarca(e.target.value)} required={esConectar}>
                        <option value="" disabled className="bg-[#0a0a0b]">Soy...</option>
                        <option value="Hombre" className="bg-[#0a0a0b]">Hombre</option>
                        <option value="Mujer" className="bg-[#0a0a0b]">Mujer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-pink-500/60 uppercase tracking-widest mb-1.5 ml-1">Busco</label>
                      <select className="w-full p-3 bg-white/5 border border-pink-500/20 rounded-xl outline-none focus:border-pink-500 text-white font-medium appearance-none" value={modelo} onChange={(e) => setModelo(e.target.value)} required={esConectar}>
                        <option value="" disabled className="bg-[#0a0a0b]">Busco...</option>
                        <option value="Hombre" className="bg-[#0a0a0b]">Hombre</option>
                        <option value="Mujer" className="bg-[#0a0a0b]">Mujer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-pink-500/60 uppercase tracking-widest mb-1.5 ml-1">Relación</label>
                      <select className="w-full p-3 bg-white/5 border border-pink-500/20 rounded-xl outline-none focus:border-pink-500 text-white font-medium appearance-none" value={transmision} onChange={(e) => setTransmision(e.target.value)} required={esConectar}>
                        <option value="" disabled className="bg-[#0a0a0b]">Tipo...</option>
                        <option value="Amistad" className="bg-[#0a0a0b]">Amistad</option>
                        <option value="Citas casuales" className="bg-[#0a0a0b]">Citas</option>
                        <option value="Algo serio" className="bg-[#0a0a0b]">Algo serio</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-10 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 text-center hover:border-[#B49248]/50 transition-all group cursor-pointer">
                <label className="block text-sm font-bold text-white/60 mb-3 ml-1 group-hover:text-[#E5CC89] transition-colors">Sube las mejores fotos</label>
                <input type="file" multiple accept="image/*" onChange={handleFotosChange} className="block w-full text-sm text-white/40 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-[#B49248] file:text-black hover:file:bg-[#E5CC89] cursor-pointer" required />
                {fotos.length > 0 && <p className="mt-4 text-xs text-[#B49248] font-black uppercase tracking-widest">{fotos.length} foto(s) listas para brillar</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!esConectar && (
                  <div>
                    <label className="block text-sm font-bold text-white/60 mb-2 ml-1">Precio (DOP)</label>
                    <input type="number" placeholder="Ej. 850000" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:border-[#B49248] outline-none transition-all text-white placeholder:text-white/20" value={precio} onChange={(e) => setPrecio(e.target.value)} required={!esConectar} />
                  </div>
                )}
                <div className={esConectar ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-bold text-white/60 mb-2 ml-1">{esConectar ? 'Ubicación' : 'Sector / Ciudad'}</label>
                  <div className="space-y-3">
                    <select 
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:border-[#B49248] outline-none transition-all cursor-pointer text-white appearance-none"
                      value={sectorId}
                      onChange={(e) => setSectorId(e.target.value)}
                      required
                    >
                      <option value="" disabled className="bg-[#0a0a0b]">Selecciona tu Sector...</option>
                      {sectores.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#0a0a0b]">{s.nombre}</option>
                      ))}
                    </select>
                    <input type="text" placeholder="Ej. Calle Palo Hincado #4" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:border-[#B49248] outline-none transition-all text-white placeholder:text-white/20" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} required />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/60 mb-2 ml-1">{esConectar ? 'Biografía' : 'Descripción detallada'}</label>
                <textarea placeholder={esConectar ? "Cuéntanos de ti..." : "Describe lo que vendes..."} rows={4} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:border-[#B49248] outline-none transition-all resize-none text-white placeholder:text-white/20" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
              </div>

              {/* Legal Checkbox */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-start gap-4 hover:border-[#B49248]/30 transition-all cursor-pointer group" onClick={() => setAceptaTerminos(!aceptaTerminos)}>
                <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${aceptaTerminos ? 'bg-[#B49248] border-[#B49248]' : 'bg-transparent border-white/20'}`}>
                  {aceptaTerminos && (
                    <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <p className="text-sm font-medium text-white/40 leading-snug">
                  Acepto los <Link href="/terminos" target="_blank" className="text-[#E5CC89] hover:underline">términos de NÍTIDO</Link> y confirmo la legalidad de mi producto.
                </p>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#B49248] to-[#E5CC89] text-black py-5 rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_40px_rgba(180,146,72,0.2)] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed">
                {loading ? 'Haciendo magia...' : 'Publicar Ahora'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}