'use client'
import Link from 'next/link'

const MOCK_DECKS = [
  { id: '1', name: 'Void Ascendancy', description: 'Control & drain', card_count: 40, is_public: true },
  { id: '2', name: 'Ember Rush', description: 'Fast aggro burn', card_count: 38, is_public: false },
  { id: '3', name: 'Bone Legion', description: 'Sacrifice and reanimate', card_count: 40, is_public: true },
]

export default function DecksPage() {
  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: 'var(--bg-deep)', padding: '80px 2rem 2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--parchment)', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
              My Decks
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--silver-dim)' }}>
              Your arsenal of constructed power
            </p>
          </div>
          <Link href="/decks/new" style={{ textDecoration: 'none' }}>
            <button className="seal-button">+ Forge New Deck</button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {MOCK_DECKS.map(deck => (
            <Link key={deck.id} href={`/decks/${deck.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'linear-gradient(145deg, #1a1a24, #0f0f18)',
                border: '1px solid rgba(139,0,0,0.4)',
                borderRadius: '4px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--parchment)'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(0,0,0,0.5)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,0,0,0.4)'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}
              >
                {/* Background glyph */}
                <div style={{
                  position: 'absolute', right: '-10px', bottom: '-20px',
                  fontSize: '5rem', opacity: 0.04,
                  fontFamily: 'var(--font-display)', color: 'var(--parchment)',
                }}>🃏</div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '0.85rem',
                    color: 'var(--parchment)', letterSpacing: '0.06em',
                  }}>
                    {deck.name}
                  </h3>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: '0.5rem',
                    color: deck.is_public ? '#44aa66' : 'var(--silver-dim)',
                    border: `1px solid ${deck.is_public ? '#44aa66' : 'var(--silver-dim)'}`,
                    borderRadius: '2px', padding: '2px 6px',
                    letterSpacing: '0.1em',
                  }}>
                    {deck.is_public ? '🔓 PUBLIC' : '🔒 PRIVATE'}
                  </span>
                </div>

                <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--silver-dim)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {deck.description}
                </p>

                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontFamily: 'var(--font-display)', fontSize: '0.55rem',
                  color: 'var(--silver-dim)', letterSpacing: '0.08em',
                }}>
                  <span>{deck.card_count}/40 cards</span>
                  <span style={{ color: deck.card_count === 40 ? '#44aa66' : 'var(--crimson)' }}>
                    {deck.card_count === 40 ? '✓ READY' : '⚠ INCOMPLETE'}
                  </span>
                </div>

                {/* Mana curve mini */}
                <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '24px', marginTop: '1rem' }}>
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} style={{
                      flex: 1,
                      height: `${Math.random() * 100}%`,
                      background: `rgba(106,179,255,${0.3 + i * 0.05})`,
                      borderRadius: '1px 1px 0 0',
                      minHeight: '2px',
                    }} />
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
