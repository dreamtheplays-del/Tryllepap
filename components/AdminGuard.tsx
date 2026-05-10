'use client'
import { useEffect, useState } from 'react'
import { getCurrentProfile, Profile } from '@/lib/supabase'

interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentProfile().then(p => {
      setProfile(p)
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '4rem', color: 'var(--silver-dim)',
      fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '0.1em',
    }}>
      ⟳ Consulting the oracle...
    </div>
  )

  if (!profile?.is_admin) return fallback ? <>{fallback}</> : (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', gap: '1rem',
    }}>
      <div style={{ fontSize: '3rem' }}>🔒</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--crimson)', letterSpacing: '0.1em' }}>
        ACCESS DENIED
      </h2>
      <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--silver-dim)' }}>
        This realm is sealed to mortals.
      </p>
    </div>
  )

  return <>{children}</>
}
