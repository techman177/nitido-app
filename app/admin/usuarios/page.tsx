'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import { 
  Users, Search, ShieldCheck, ShieldAlert, 
  Ban, CheckCircle2, MoreVertical, Mail, 
  Calendar, UserPlus, FileText
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Perfil {
  id: string
  nombre_completo: string
  es_admin: boolean
  es_verificado: boolean
  estado: string // activo, suspendido
  rol: string // usuario, vendedor_pro, moderador, admin
  ultima_conexion?: string
  created_at: string
}

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState<Perfil[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    cargarUsuarios()
  }, [])

  async function cargarUsuarios() {
    setLoading(true)
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setUsuarios(data as Perfil[])
    setLoading(false)
  }

  const handleUpdateRole = async (id: string, newRole: string) => {
    setActionLoading(id)
    const { error } = await supabase
      .from('perfiles')
      .update({ rol: newRole })
      .eq('id', id)
    
    if (!error) {
      toast.success(`Rol actualizado a ${newRole}`)
      cargarUsuarios()
    } else {
      toast.error('Error al actualizar rol')
    }
    setActionLoading(null)
  }

  const handleToggleStatus = async (usuario: Perfil) => {
    const newStatus = usuario.estado === 'suspendido' ? 'activo' : 'suspendido'
    if (!confirm(`¿Estás seguro de que quieres ${newStatus === 'suspendido' ? 'SUSPENDER' : 'ACTIVAR'} a ${usuario.nombre_completo}?`)) return

    setActionLoading(usuario.id)
    const { error } = await supabase
      .from('perfiles')
      .update({ estado: newStatus })
      .eq('id', usuario.id)
    
    if (!error) {
      toast.success(`Usuario ${newStatus === 'suspendido' ? 'Suspendido' : 'Activado'}`)
      cargarUsuarios()
    } else {
      toast.error('Error al cambiar estado')
    }
    setActionLoading(null)
  }

  const filteredUsers = usuarios.filter(u => 
    u.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#B49248] selection:text-black">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">CRM de Usuarios</h1>
            <p className="text-white/40 font-medium">Gestiona la base de datos de la élite de NÍTIDO.</p>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-white/20 group-focus-within:text-[#B49248] transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Buscar por nombre o ID..." 
              className="pl-12 pr-6 py-4 bg-[#0a0a0b] border border-white/5 rounded-2xl outline-none focus:border-[#B49248]/50 transition-all w-full md:w-80 text-sm font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-[#0a0a0b] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          {/* Header de la tabla */}
          <div className="grid grid-cols-12 gap-4 p-8 border-b border-white/5 text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">
            <div className="col-span-4">Usuario</div>
            <div className="col-span-2">Rango / Rol</div>
            <div className="col-span-2 text-center">Estado</div>
            <div className="col-span-2 text-center">Registro</div>
            <div className="col-span-2 text-right">Acciones</div>
          </div>

          <div className="divide-y divide-white/5">
            {loading ? (
              <div className="p-20 text-center text-white/20 font-bold uppercase tracking-widest animate-pulse">Cargando base de datos...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-20 text-center text-white/20 font-bold uppercase tracking-widest">No se encontraron usuarios.</div>
            ) : filteredUsers.map((user) => (
              <div key={user.id} className="grid grid-cols-12 gap-4 p-8 items-center group hover:bg-white/[0.02] transition-colors relative">
                
                {/* Usuario Info */}
                <div className="col-span-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-lg ${user.rol === 'admin' ? 'bg-gradient-to-tr from-[#B49248] to-[#E5CC89] text-black' : 'bg-white/5 text-white/40'}`}>
                    {user.nombre_completo?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-[#E5CC89] transition-colors">{user.nombre_completo || 'Sin Nombre'}</h3>
                    <p className="text-white/20 text-xs font-mono truncate max-w-[150px]">{user.id}</p>
                  </div>
                </div>

                {/* Rol / Rango */}
                <div className="col-span-2">
                   <select 
                    value={user.rol || 'usuario'} 
                    onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                    disabled={actionLoading === user.id}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white/60 focus:border-[#B49248] outline-none cursor-pointer appearance-none hover:bg-white/10"
                   >
                     <option value="usuario">Usuario Estándar</option>
                     <option value="vendedor_pro">Vendedor Pro</option>
                     <option value="moderador">Moderador</option>
                     <option value="admin">Administrador</option>
                   </select>
                </div>

                {/* Estado */}
                <div className="col-span-2 flex justify-center">
                  <button 
                    onClick={() => handleToggleStatus(user)}
                    disabled={actionLoading === user.id}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    user.estado === 'suspendido' 
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' 
                    : 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white'
                  }`}>
                    {user.estado === 'suspendido' ? 'Baneado' : 'Activo'}
                  </button>
                </div>

                {/* Registro */}
                <div className="col-span-2 text-center">
                   <div className="text-xs font-bold text-white/40">{new Date(user.created_at).toLocaleDateString()}</div>
                   <div className="text-[10px] font-medium text-white/10 uppercase tracking-widest">Inscrito</div>
                </div>

                {/* Acciones */}
                <div className="col-span-2 flex justify-end gap-2">
                   <button className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-[#E5CC89] transition-all">
                      <Mail size={16} />
                   </button>
                   <button className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all">
                      <FileText size={16} />
                   </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
