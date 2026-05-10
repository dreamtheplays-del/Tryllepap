'use client'

const BADGES = [
  { id: 1, icon: '⚔️', name: 'First Blood', desc: 'Win your first battle' },
  { id: 2, icon: '🐉', name: 'Dragon Tamer', desc: 'Play 10 creature cards' },
  { id: 3, icon: '📖', name: 'Codex Scholar', desc: 'View 50 cards' },
  { id: 4, icon: '💀', name: 'Death Dealer', desc: 'Win 5 battles' },
]

export default function ProfilePage() {
  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: 'var(--bg-deep)', padding: '80px 2rem 2rem' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Avatar + info */}
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
            background: 'radial-gradient(circle at 35% 35%, #3d0000, #0a0005)',
            border: '2px solid var(--crimson)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem',
            boxShadow: '0 0 20px rgba(139,0,0,0.4)',
          }}>
            🧙
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--parchment)', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
              WARRIOR_NAME
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--silver-dim)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Joined the realm on the 1st day of the First Age
            </p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              {[{ label: 'VICTORIES', val: 12, color: '#44aa66' }, { label: 'DEFEATS', val: 8, color: 'var(--crimson)' }, { label: 'WIN RATE', val: '60%', color: 'var(--parchment)' }].map(s => (
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

        {/* Badges */}
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
