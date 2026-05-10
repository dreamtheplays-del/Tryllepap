'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_ITEMS = [
  { href: '/cards',   label: 'Codex',   icon: '📖' },
  { href: '/decks',   label: 'Decks',   icon: '🃏' },
  { href: '/battle',  label: 'Arena',   icon: '⚔️' },
  { href: '/profile', label: 'Profile', icon: '👤' },
]

export default function Navbar() {
  const path = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'linear-gradient(180deg, rgba(10,10,15,0.98) 0%, rgba(10,10,15,0.85) 100%)',
      borderBottom: '1px solid rgba(139,0,0,0.4)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem', height: '64px',
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.1rem',
          color: 'var(--parchment)',
          letterSpacing: '0.1em',
          textShadow: '0 0 20px rgba(201,169,110,0.5)',
        }}>
          ᚦ TRYLDE PAP
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = path.startsWith(href)
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 1rem',
                fontFamily: 'var(--font-display)',
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
                color: active ? 'var(--parchment)' : 'var(--silver-dim)',
                borderBottom: active ? '2px solid var(--crimson)' : '2px solid transparent',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}>
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Auth area */}
      <Link href="/login" style={{ textDecoration: 'none' }}>
        <button className="seal-button" style={{ padding: '0.5rem 1.5rem', fontSize: '0.7rem' }}>
          Enter
        </button>
      </Link>
    </nav>
  )
}
