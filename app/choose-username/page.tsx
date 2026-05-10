'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ChooseUsernamePage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // If user already has a username, redirect home
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

      if (data?.username) { router.push('/'); return }
      setChecking(false)
    }
    check()
  }, [router])

  const handleSubmit = async () => {
    const trimmed = username.trim()
    if (!trimmed) { setError('Choose a warrior name.'); return }
    if (trimmed.length < 3) { setError('Must be at least 3 characters.'); return }
    if (trimmed.length > 20) { setError('Must be 20 characters or less.'); return }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) { setError('Only letters, numbers, and underscores.'); return }

    setLoading(true)
    setError('')

    // Check if username is taken
    const { data: taken } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', trimmed)
      .single()

    if (taken) {
      setError('That name is already taken.')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ username: trimmed })
      .eq('id', user.id)

    if (updateError) {
      setError('Something went wrong. Try again.')
      setLoading(false)
      return
    }

    router.push('/')
  }

  if (checking) return null

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '64px',
      background: 'var(--bg-deep)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: '440px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--crimson)' }}>ᚦ</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.2rem',
            color: 'var(--parchment)', letterSpacing: '0.15em', marginBottom: '0.25rem',
          }}>
            FORGE YOUR NAME
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--silver-dim)', fontSize: '0.95rem' }}>
            Choose the name legends will remember you by
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(145deg, #1a1a28, #0f0f1a)',
          border: '1px solid rgba(139,0,0,0.5)',
          borderRadius: '4px',
          padding: '2.5rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <label style={{
            display: 'block', marginBottom: '0.4rem',
            fontFamily: 'var(--font-display)', fontSize: '0.6rem',
            letterSpacing: '0.15em', color: 'var(--silver-dim)',
          }}>
            WARRIOR NAME
          </label>
          <input
            className="stone-input"
            placeholder="e.g. ShadowBlade_99"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            maxLength={20}
            style={{ marginBottom: '1rem' }}
          />

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.8rem',
            color: 'var(--silver-dim)', fontStyle: 'italic',
            marginBottom: '1.25rem',
          }}>
            3–20 characters. Letters, numbers, underscores only.
          </p>

          {error && (
            <div style={{
              background: 'rgba(139,0,0,0.15)',
              border: '1px solid var(--crimson)',
              borderRadius: '2px',
              padding: '0.75rem 1rem',
              color: '#ff6666',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              fontStyle: 'italic',
              marginBottom: '1rem',
            }}>
              ⚠ {error}
            </div>
          )}

          <button
            className="seal-button"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '⟳ Binding the name...' : 'Claim Your Name'}
          </button>
        </div>
      </div>
    </div>
  )
}
