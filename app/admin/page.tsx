'use client'
import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { 
  LayoutDashboard, Users, ShoppingBag, BarChart3, 
  Settings, ExternalLink, ShieldAlert, TrendingUp,
  ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts'

// --- ANALÍTICAS REALES PRÓXIMAMENTE ---
const mockDataAnalytics = [
  { name: '', ads: 0, users: 0 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalAds: 0,
    totalUsers: 0,
    premiumAds: 0,
    pendingReports: 4, // Mock
    onlineNow: 12,    // Mock
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const { count: adsCount } = await supabase.from('anuncios').select('*', { count: 'exact', head: true })
      const { count: premiumCount } = await supabase.from('anuncios').select('*', { count: 'exact', head: true }).eq('es_premium', true)
      const { count: usersCount } = await supabase.from('perfiles').select('*', { count: 'exact', head: true })

      setStats(prev => ({
        ...prev,
        totalAds: adsCount || 0,
        premiumAds: premiumCount || 0,
        totalUsers: usersCount || 0,
      }))
      setLoading(false)
    }
    loadStats()
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#B49248] selection:text-black">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header con brillo */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#B49248]/10 blur-[100px] pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">SISTEMA LIVE EN TIEMPO REAL</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight mb-2">Consola Élite</h1>
            <p className="text-white/40 font-medium text-lg">Bienvenido al corazón de <span className="text-[#E5CC89]">NÍTIDO Infrastructure</span>.</p>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-sm font-bold hover:bg-white/10 transition-all border-b-4 border-b-white/5 active:border-b-0"
            >
              Vitrina <ExternalLink size={16} />
            </Link>
          </div>
        </div>

        {/* KPIs de Oro */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <KpiCard 
            title="Usuarios Online" 
            value={stats.onlineNow} 
            trend="+24%" 
            icon={<Activity size={20} />}
            color="text-green-500"
          />
          <KpiCard 
            title="Anuncios Élite" 
            value={stats.premiumAds} 
            trend="+12%" 
            icon={<TrendingUp size={20} />}
            color="text-[#B49248]"
          />
          <KpiCard 
            title="Reportes Pendientes" 
            value={stats.pendingReports} 
            trend="-30%" 
            icon={<ShieldAlert size={20} />}
            color="text-red-500"
            negative
          />
          <KpiCard 
            title="Usuarios Totales" 
            value={stats.totalUsers} 
            trend="+5%" 
            icon={<Users size={20} />}
            color="text-blue-500"
          />
        </div>

        {/* Gráficos de Inteligencia */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-[#0a0a0b] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black mb-1">Crecimiento de Plataforma</h3>
                <p className="text-white/30 text-xs font-medium uppercase tracking-widest">Últimos 7 días de actividad</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#B49248] rounded-full"></div>
                  <span className="text-xs font-bold text-white/40">Anuncios</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                  <span className="text-xs font-bold text-white/40">Usuarios</span>
                </div>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockDataAnalytics}>
                  <defs>
                    <linearGradient id="colorAds" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B49248" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#B49248" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ background: '#0a0a0b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                    itemStyle={{ color: '#E5CC89', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="ads" stroke="#B49248" strokeWidth={4} fillOpacity={1} fill="url(#colorAds)" />
                  <Area type="monotone" dataKey="users" stroke="rgba(255,255,255,0.2)" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a160d] to-[#0a0a0b] border border-[#B49248]/20 p-8 rounded-[2.5rem] flex flex-col justify-between group hover:border-[#B49248]/50 transition-all">
            <div>
              <div className="w-16 h-16 bg-[#B49248]/10 rounded-2xl flex items-center justify-center text-[#B49248] mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 size={32} />
              </div>
              <h3 className="text-3xl font-black mb-3">Resumen Visual</h3>
              <p className="text-white/40 leading-relaxed font-medium">El volumen de interacciones ha crecido un <span className="text-[#E5CC89] font-bold">18%</span> en comparación con el periodo anterior.</p>
            </div>
            
            <div className="space-y-4 pt-8">
               <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Capacidad del Servidor</span>
                  <span className="text-sm font-black text-[#E5CC89]">Optimal</span>
               </div>
               <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[45%] h-full bg-[#B49248] shadow-[0_0_15px_rgba(180,146,72,0.5)]"></div>
               </div>
            </div>
          </div>
        </div>

        {/* Accesos Rápidos Pro */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MenuCard 
            title="CRM Usuarios" 
            icon={<Users />} 
            href="/admin/usuarios"
          />
          <MenuCard 
            title="Moderación" 
            icon={<ShieldAlert />} 
            href="/admin/moderacion"
            badge="Alertas"
          />
          <MenuCard 
            title="Configuración" 
            icon={<Settings />} 
            href="/admin/configuracion"
          />
          <MenuCard 
            title="Reportes Live" 
            icon={<LayoutDashboard />} 
            href="/admin/reportes"
          />
        </div>
      </div>
    </div>
  )
}

function KpiCard({ title, value, trend, icon, color, negative = false }: any) {
  return (
    <div className="p-6 rounded-3xl bg-[#0a0a0b] border border-white/5 group hover:border-white/10 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-white/5 ${color}`}>{icon}</div>
        <div className={`flex items-center gap-1 text-[10px] font-black ${negative ? 'text-red-500' : 'text-green-500'}`}>
          {negative ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
          {trend}
        </div>
      </div>
      <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-3xl font-black tracking-tight">{value}</p>
    </div>
  )
}

function MenuCard({ title, icon, href, badge }: any) {
  return (
    <Link href={href} className="p-10 rounded-[2.5rem] bg-[#0a0a0b] border border-white/5 group hover:border-[#B49248]/30 transition-all flex flex-col items-center text-center relative overflow-hidden">
      {badge && (
        <div className="absolute top-4 right-4 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-full animate-bounce shadow-lg">
          {badge}
        </div>
      )}
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-[#B49248] group-hover:bg-[#B49248]/10 transition-all mb-4">
        {icon}
      </div>
      <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">
        {title}
      </h3>
    </Link>
  )
}
