'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/supabase'

const BADGES = [
  { id: 1, icon: '⚔️', name: 'First Blood', desc: 'Win your first battle' },
  { id: 2, icon: '🐉', name: 'Dragon Tamer', desc: 'Play 10 creature cards' },
  { id: 3, icon: '📖', name: 'Codex Scholar', desc: 'View 50 cards' },
  { id: 4, icon: '💀', name: 'Death Dealer', desc: 'Win 5 battles' },
]

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'var(--font-display)', color: 'var(--silver-dim)', letterSpacing: '0.15em' }}>CONSULTING THE ORACLE...</span>
    </div>
  )

  if (!profile) return null

  const winRate = profile.wins + profile.losses > 0
    ? Math.round((profile.wins / (profile.wins + profile.losses)) * 100)
    : 0

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: 'var(--bg-deep)', padding: '80px 2rem 2rem' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{
          display: 'flex', gap: '2rem', alignItems: 'flex-start',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, #1a1a24, #0f0f18)',
          border: '1px solid rgba(139,0,0,0.4)',
          borderRadius: '4px',
          padding: '2rem',
        }}>
          <div style={{
            width: '80px', height: '80px', flexShrink: 0,
            borderRadius: '50%',
            background: profile.avatar_url
              ? `url(${profile.avatar_url}) center/cover`
              : 'radial-gradient(circle at 35% 35%, #3d0000, #0a0005)',
            border: '2px solid var(--crimson)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem',
            boxShadow: '0 0 20px rgba(139,0,0,0.4)',
          }}>
            {!profile.avatar_url && '🧙'}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--parchment)', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
              {profile.username || 'Unknown Warrior'}
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--silver-dim)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Joined the realm on {new Date(profile.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              {[
                { label: 'VICTORIES', val: profile.wins, color: '#44aa66' },
                { label: 'DEFEATS', val: profile.losses, color: 'var(--crimson)' },
                { label: 'WIN RATE', val: `${winRate}%`, color: 'var(--parchment)' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: s.color, letterSpacing: '0.05em' }}>
                    {s.val}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', letterSpacing: '0.15em', color: 'var(--silver-dim)' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.15em', color: 'var(--parchment)', marginBottom: '1rem' }}>
          ✦ ACHIEVEMENTS
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {BADGES.map(b => (
            <div key={b.id} style={{
              background: 'linear-gradient(135deg, #1a1a24, #0f0f18)',
              border: '1px solid rgba(212,169,53,0.3)',
              borderRadius: '4px',
              padding: '1rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{b.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'var(--gold)', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                {b.name}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--silver-dim)', fontSize: '0.8rem' }}>
                {b.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
