import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { flowType: 'pkce' } }
    )

    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)

    if (user) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', user.id)
        .single()

      if (!existing) {
        // New user — create a blank profile and send them to pick a username
        await supabase.from('profiles').insert({
          id: user.id,
          username: '',
          avatar_url: user.user_metadata?.avatar_url || '',
          wins: 0,
          losses: 0,
          is_admin: false,
        })
        return NextResponse.redirect(new URL('/choose-username', requestUrl.origin))
      }

      if (!existing.username) {
        return NextResponse.redirect(new URL('/choose-username', requestUrl.origin))
      }
    }
  }

  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
