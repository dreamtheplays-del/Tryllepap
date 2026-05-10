'use client'
import { Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function ConfirmHandler() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      // Give Supabase time to parse the hash and set the session
      await new Promise(resolve => setTimeout(resolve, 1500))

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: existing } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', user.id)
        .single()

      if (!existing) {
        await supabase.from('profiles').insert({
          id: user.id,
          username: '',
          avatar_url: user.user_metadata?.avatar_url || '',
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

    handleAuth()
  }, [router])

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
