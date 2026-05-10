'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('OPENING THE GATE...')

  useEffect(() => {
    const run = async () => {
      setStatus('VERIFYING YOUR IDENTITY...')

      // getSession() automatically reads tokens from the URL hash on first call
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session?.user) {
        console.error('Auth failed:', error)
        setStatus('Login failed. Returning...')
        setTimeout(() => router.push('/login'), 2000)
        return
      }

      const user = session.user
      setStatus('CHECKING YOUR PROFILE...')

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
