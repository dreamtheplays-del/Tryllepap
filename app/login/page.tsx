'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'register'>('signin')
  const [flipping, setFlipping] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const switchMode = () => {
    setFlipping(true)
    setTimeout(() => {
      setMode(m => m === 'signin' ? 'register' : 'signin')
      setFlipping(false)
      setError('')
    }, 300)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setTimeout(() => {
      setLoading(false)
      setError('Email authentication not yet enabled.')
    }, 1200)
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setError(`Google sign-in failed: ${error.message}`)
        setGoogleLoading(false)
      }
    } catch (e: unknown) {
      setError(`Unexpected error: ${e instanceof Error ? e.message : 'unknown'}`)
      setGoogleLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '64px',
      background: 'var(--bg-deep)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(139,0,0,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '440px', padding: '2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="animate-rune" style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--crimson)' }}>ᚦ</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.2rem',
            color: 'var(--parchment)', letterSpacing: '0.15em', marginBottom: '0.25rem',
          }}>
            {mode === 'signin' ? 'RETURN TO THE REALM' : 'FORGE YOUR LEGEND'}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--silver-dim)', fontSize: '0.95rem' }}>
            {mode === 'signin' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(145deg, #1a1a28, #0f0f1a)',
          border: '1px solid rgba(139,0,0,0.5)',
          borderRadius: '4px',
          padding: '2.5rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,169,110,0.1)',
          transition: 'transform 0.3s, opacity 0.3s',
          transform: flipping ? 'rotateY(90deg)' : 'rotateY(0deg)',
          opacity: flipping ? 0 : 1,
          position: 'relative',
        }}>
          {['ᚱ', 'ᚦ', 'ᛏ', 'ᚾ'].map((glyph, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: i < 2 ? '8px' : undefined,
              bottom: i >= 2 ? '8px' : undefined,
              left: i % 2 === 0 ? '12px' : undefined,
              right: i % 2 === 1 ? '12px' : undefined,
              fontFamily: 'var(--font-display)',
              fontSize: '0.7rem',
              color: 'rgba(139,0,0,0.4)',
              userSelect: 'none',
            }}>
              {glyph}
            </div>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'register' && (
              <div>
                <label style={{
                  display: 'block', marginBottom: '0.4rem',
                  fontFamily: 'var(--font-display)', fontSize: '0.6rem',
                  letterSpacing: '0.15em', color: 'var(--silver-dim)',
                }}>
                  WARRIOR NAME
                </label>
                <input
                  className="stone-input"
                  placeholder="Choose your name..."
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
            )}

            <div>
              <label style={{
                display: 'block', marginBottom: '0.4rem',
                fontFamily: 'var(--font-display)', fontSize: '0.6rem',
                letterSpacing: '0.15em', color: 'var(--silver-dim)',
              }}>
                EMAIL SIGIL
              </label>
              <input
                className="stone-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label style={{
                display: 'block', marginBottom: '0.4rem',
                fontFamily: 'var(--font-display)', fontSize: '0.6rem',
                letterSpacing: '0.15em', color: 'var(--silver-dim)',
              }}>
                SECRET RUNE
              </label>
              <input
                className="stone-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

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
              }}>
                ⚠ {error}
              </div>
            )}

            <button
              className="seal-button"
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? '⟳ Consulting the oracle...' : mode === 'signin' ? 'Enter the Realm' : 'Forge Your Legend'}
            </button>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            margin: '1.5rem 0',
            color: 'var(--silver-dim)', fontSize: '0.8rem',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(168,184,200,0.2)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', letterSpacing: '0.1em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(168,184,200,0.2)' }} />
          </div>

          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(168,184,200,0.2)',
              borderRadius: '2px',
              padding: '0.75rem',
              color: 'var(--silver)',
              fontFamily: 'var(--font-display)',
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              cursor: googleLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
              transition: 'all 0.2s',
              opacity: googleLoading ? 0.7 : 1,
            }}
          >
            <span style={{ fontWeight: 'bold', color: '#4285f4', fontSize: '1rem' }}>G</span>
            {googleLoading ? 'Opening the portal...' : 'Continue with Google'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <span style={{ color: 'var(--silver-dim)', fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>
            {mode === 'signin' ? 'New to the realm? ' : 'Already a warrior? '}
          </span>
          <button onClick={switchMode} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--parchment)',
            fontFamily: 'var(--font-display)',
            fontSize: '0.7rem',
            letterSpacing: '0.08em',
            textDecoration: 'underline',
          }}>
            {mode === 'signin' ? 'Create Account' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}
