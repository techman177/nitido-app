import { createBrowserClient } from '@supabase/ssr'

// Singleton client para uso en el lado del cliente
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
