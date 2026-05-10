'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuth = async () => {
      const code = searchParams.get('code')
      if (!code) { router.push('/'); return }

      const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error || !user) {
        router.push('/login')
        return
      }

      // Check if profile exists
      const { data: existing } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', user.id)
        .single()

      if (!existing) {
        // Create blank profile for new user
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
          OPENING THE GATE...
        </p>
      </div>
    </div>
  )
}
