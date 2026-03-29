import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 1. Verificar Modo Mantenimiento
  const { data: config } = await supabase
    .from('configuracion_global')
    .select('mantenimiento_activo')
    .single()

  const isMantenimiento = config?.mantenimiento_activo === true
  
  // Si estamos en mantenimiento y no es una ruta de admin/login/mantenimiento
  const isPublicRoute = !request.nextUrl.pathname.startsWith('/admin') && 
                       !request.nextUrl.pathname.startsWith('/login') &&
                       !request.nextUrl.pathname.startsWith('/mantenimiento') &&
                       !request.nextUrl.pathname.startsWith('/api')

  if (isMantenimiento && isPublicRoute) {
    // Verificar si el usuario logueado es admin antes de bloquear
    let isAdmin = false
    if (user) {
      const { data: perfil } = await supabase.from('perfiles').select('es_admin').eq('id', user.id).single()
      isAdmin = perfil?.es_admin === true
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/mantenimiento', request.url))
    }
  }

  // 2. Proteger la ruta /admin (Ya existente)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // LISTA BLANCA DE ADMINS POR CORREO (CRÍTICO PARA technr07@gmail.com)
    const adminEmails = ['technr07@gmail.com'];
    const isWhiteListed = adminEmails.includes(user.email || '');

    if (isWhiteListed) {
       return supabaseResponse;
    }

    // Verificar si es admin en la tabla perfiles
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('es_admin')
      .eq('id', user.id)
      .single()

    const isAdmin = perfil?.es_admin === true

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
