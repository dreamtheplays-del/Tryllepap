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

      // With implicit flow, the browser client auto-detects tokens from the URL hash.
      // onAuthStateChange fires once the session is established.
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          subscription.unsubscribe()
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
        } else if (event === 'SIGNED_OUT' || (event !== 'INITIAL_SESSION' && !session)) {
          subscription.unsubscribe()
          setStatus('Login failed. Returning...')
          setTimeout(() => router.push('/login'), 2000)
        }
      })

      // Fallback: if already signed in (e.g. page refresh), getSession picks it up
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        subscription.unsubscribe()
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
