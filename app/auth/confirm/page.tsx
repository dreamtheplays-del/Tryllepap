'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function ConfirmHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('OPENING THE GATE...')

  useEffect(() => {
    const run = async () => {
      const code = searchParams.get('code')

      if (!code) {
        setStatus('No login code found.')
        setTimeout(() => router.push('/login'), 2000)
        return
      }

      setStatus('VERIFYING YOUR IDENTITY...')

      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error || !data.user) {
        console.error('Session exchange failed:', error)
        setStatus('Login failed. Returning...')
        setTimeout(() => router.push('/login'), 2000)
        return
      }

      const user = data.user
      setStatus('CHECKING YOUR PROFILE...')

      const { data: existing } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', user.id)
        .single()

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
  }, [router, searchParams])

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
