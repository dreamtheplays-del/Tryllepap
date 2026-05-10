import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)

    // Auto-create profile if it doesn't exist yet (first Google login)
    if (user) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!existing) {
        await supabase.from('profiles').insert({
          id: user.id,
          username: user.email?.split('@')[0] || 'warrior',
          avatar_url: user.user_metadata?.avatar_url || '',
          wins: 0,
          losses: 0,
          is_admin: false,
        })
      }
    }
  }

  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
