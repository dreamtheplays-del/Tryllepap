'use client'
import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function ConfirmHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')

    if (code) {
      // PKCE flow - exchange code for session
      supabase.auth.exchangeCodeForSession(code).then(async ({ data: { user }, error }) => {
        if (error || !user) { router.push('/login'); return }
        await handleUser(user.id, user.user_metadata?.avatar_url || '')
      })
      return
    }

    // Implicit flow - listen for the session to be set from the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        subscription.unsubscribe()
        await handleUser(session.user.id, session.user.user_metadata?.avatar_url || '')
      }
      if (event === 'SIGNED_OUT') {
        router.push('/login')
      }
    })

    // Fallback timeout in case event already fired
    const timeout = setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      await handleUser(user.id, user.user_metadata?.avatar_url || '')
    }, 3000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [router, searchParams])

  async function handleUser(userId: string, avatarUrl: string) {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('id', userId)
      .single()

    if (!existing) {
      await supabase.from('profiles').insert({
        id: userId,
        username: '',
        avatar_url: avatarUrl,
        wins: 0,
        losses: 0,
        is_admin: false,
      })
      router.push('/choose-username')
      return
    }

    if (!existing.username) {
      router.push('/choose-username')
      return
    }

    router.push('/')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-deep)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--crimson)' }}>ᚦ</div>
        <p style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--silver-dim)',
          letterSpacing: '0.15em',
          fontSize: '0.8rem',
        }}>
          OPENING THE GATE...
        </p>
      </div>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmHandler />
    </Suspense>
  )
}
