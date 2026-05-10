'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

function EmberParticles() {
  const [embers, setEmbers] = useState<{ id: number; left: string; delay: string; size: string }[]>([])

  useEffect(() => {
    const initial = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
      size: `${Math.random() * 4 + 2}px`,
    }))
    setEmbers(initial)

    const interval = setInterval(() => {
      setEmbers(prev => [
        ...prev.slice(-30),
        {
          id: Date.now(),
          left: `${Math.random() * 100}%`,
          delay: '0s',
          size: `${Math.random() * 4 + 2}px`,
        },
      ])
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {embers.map(e => (
        <div
          key={e.id}
          className="animate-ember"
          style={{
            position: 'absolute',
            bottom: 0,
            left: e.left,
            width: e.size,
            height: e.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ff9944, #ff4400)',
            animationDelay: e.delay,
            animationDuration: `${2 + Math.random() * 3}s`,
            boxShadow: '0 0 6px #ff6600',
          }}
        />
      ))}
    </div>
  )
}

const FEATURE_PANELS = [
  {
    href: '/cards',
    title: 'The Codex',
    subtitle: 'Browse the full grimoire of cards',
    icon: '📖',
    scene: 'An open grimoire illuminated by candlelight',
    color: '#4a2a0a',
    glyph: 'ᚱ',
  },
  {
    href: '/decks/new',
    title: 'Forge a Deck',
    subtitle: 'Craft your arsenal of dark power',
    icon: '⚒️',
    scene: 'Anvil and cards upon a stone altar',
    color: '#1a0a2a',
    glyph: 'ᚦ',
  },
  {
    href: '/battle',
    title: 'Enter the Arena',
    subtitle: 'Challenge foes across the void',
    icon: '⚔️',
    scene: 'Two figures across a cracked stone table',
    color: '#1a0000',
    glyph: 'ᛏ',
  },
]

export default function LandingPage() {
  const [hoveredPanel, setHoveredPanel] = useState<number | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-deep)',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: '64px',
    }}>
      {/* Atmospheric layers */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(139,0,0,0.15) 0%, transparent 70%)',
      }} />
      <div className="animate-fog" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 20% 80%, rgba(201,169,110,0.04) 0%, transparent 50%)',
        width: '150%',
      }} />

      <EmberParticles />

      {/* Hero */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '70vh', textAlign: 'center', padding: '4rem 2rem',
        position: 'relative', zIndex: 1,
      }}>
        {/* Runic ring decoration */}
        <div style={{
          fontSize: '4rem', marginBottom: '1rem', lineHeight: 1,
          animation: 'runeGlow 3s ease-in-out infinite',
          animationName: 'runeGlow',
        }}>
          ᚦ
        </div>

        <h1 className="animate-rune" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          color: 'var(--parchment)',
          letterSpacing: '0.15em',
          lineHeight: 1.1,
          marginBottom: '0.5rem',
          textShadow: '0 0 40px rgba(201,169,110,0.4), 0 4px 20px rgba(0,0,0,0.8)',
        }}>
          TRYLDE PAP
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
          color: 'var(--silver)',
          letterSpacing: '0.2em',
          marginBottom: '0.5rem',
        }}>
          ─── A Living Grimoire of Card Battles ───
        </p>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.1rem',
          color: 'var(--silver-dim)',
          maxWidth: '480px',
          lineHeight: 1.7,
          marginBottom: '3rem',
        }}>
          Forge your deck from the ancient codex. Command creatures of shadow and flame.
          Challenge all who dare oppose you.
        </p>

        {isLoggedIn ? (
          <button
            className="seal-button"
            style={{ fontSize: '0.9rem', padding: '1rem 3rem' }}
            onClick={handleLogout}
          >
            Log Out
          </button>
        ) : (
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button className="seal-button animate-pulse-glow" style={{ fontSize: '0.9rem', padding: '1rem 3rem' }}>
              Log In
            </button>
          </Link>
        )}

        {/* Decorative divider */}
        <div style={{
          marginTop: '4rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
          color: 'var(--silver-dim)', fontSize: '1.2rem', letterSpacing: '0.5em',
        }}>
          <div style={{ width: '80px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--silver-dim))' }} />
          ᚱ ᚦ ᛏ
          <div style={{ width: '80px', height: '1px', background: 'linear-gradient(270deg, transparent, var(--silver-dim))' }} />
        </div>
      </section>

      {/* Feature panels */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '2rem 2rem 6rem',
        position: 'relative', zIndex: 1,
      }}>
        {FEATURE_PANELS.map((panel, i) => (
          <Link key={panel.href} href={panel.href} style={{ textDecoration: 'none' }}>
            <div
              onMouseEnter={() => setHoveredPanel(i)}
              onMouseLeave={() => setHoveredPanel(null)}
              style={{
                background: `linear-gradient(145deg, ${panel.color}, var(--bg-mid))`,
                border: `1px solid ${hoveredPanel === i ? 'var(--parchment)' : 'var(--silver-dim)'}`,
                borderRadius: '4px',
                padding: '2.5rem 2rem',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                transform: hoveredPanel === i ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hoveredPanel === i
                  ? '0 16px 40px rgba(0,0,0,0.6), 0 0 30px rgba(201,169,110,0.1)'
                  : '0 4px 20px rgba(0,0,0,0.4)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Background glyph */}
              <div style={{
                position: 'absolute', right: '1rem', bottom: '-0.5rem',
                fontSize: '6rem', opacity: 0.06,
                fontFamily: 'var(--font-display)',
                color: 'var(--parchment)',
                userSelect: 'none',
                transition: 'opacity 0.3s',
              }}>
                {panel.glyph}
              </div>

              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{panel.icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                color: 'var(--parchment)',
                letterSpacing: '0.08em',
                marginBottom: '0.75rem',
              }}>
                {panel.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontStyle: 'italic',
                color: 'var(--silver)',
                fontSize: '1rem',
                lineHeight: 1.6,
              }}>
                {panel.subtitle}
              </p>

              <div style={{
                marginTop: '1.5rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                color: hoveredPanel === i ? 'var(--parchment)' : 'var(--silver-dim)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                transition: 'color 0.3s',
              }}>
                <span>ENTER</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}
