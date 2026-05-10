'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function ConfirmHandler() {
  const router = useRouter()
  const [status, setStatus] = useState('OPENING THE GATE...')

  useEffect(() => {
    const run = async () => {
      setStatus('VERIFYING YOUR IDENTITY...')

      // Session is already exchanged server-side in /auth/callback/route.ts
      // We just need to read the current user from the session cookie
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        console.error('No active session:', error)
        setStatus('Login failed. Returning...')
        setTimeout(() => router.push('/login'), 2000)
        return
      }

      setStatus('CHECKING YOUR PROFILE...')

      // maybeSingle() returns null instead of 406 when no row found
      const { data: existing } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', user.id)
        .maybeSingle()

      if (!existing) {
        setStatus('CREATING YOUR PROFILE...')
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

      setStatus('WELCOME BACK!')
      router.push('/')
    }

    run()
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
          {status}
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
