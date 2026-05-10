'use client'
import { useState, useMemo } from 'react'
import CardTile from '@/components/CardTile'
import { MOCK_CARDS } from '@/lib/mockData'
import { Card } from '@/lib/supabase'

export default function DeckBuilderPage() {
  const [deckName, setDeckName] = useState('Untitled Grimoire')
  const [editingName, setEditingName] = useState(false)
  const [deckCards, setDeckCards] = useState<{ card: Card; qty: number }[]>([])
  const [search, setSearch] = useState('')
  const [saved, setSaved] = useState(false)

  const totalCards = deckCards.reduce((s, d) => s + d.qty, 0)

  const filteredLibrary = useMemo(() =>
    MOCK_CARDS.filter(c => c.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  )

  const addCard = (card: Card) => {
    setDeckCards(prev => {
      const existing = prev.find(d => d.card.id === card.id)
      if (existing) {
        if (existing.qty >= 2) return prev // max 2 copies
        return prev.map(d => d.card.id === card.id ? { ...d, qty: d.qty + 1 } : d)
      }
      return [...prev, { card, qty: 1 }]
    })
  }

  const removeCard = (cardId: string) => {
    setDeckCards(prev => {
      const existing = prev.find(d => d.card.id === cardId)
      if (!existing) return prev
      if (existing.qty <= 1) return prev.filter(d => d.card.id !== cardId)
      return prev.map(d => d.card.id === cardId ? { ...d, qty: d.qty - 1 } : d)
    })
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Mana curve
  const manaCurve = useMemo(() => {
    const curve = Array(8).fill(0)
    deckCards.forEach(({ card, qty }) => {
      const idx = Math.min(card.mana_cost, 7)
      curve[idx] += qty
    })
    return curve
  }, [deckCards])
  const maxCurveVal = Math.max(...manaCurve, 1)

  return (
    <div style={{
      paddingTop: '64px', height: '100vh', display: 'flex',
      background: 'var(--bg-deep)', overflow: 'hidden',
    }}>
      {/* LEFT: Card library */}
      <div style={{
        width: '55%', display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(180deg, #12121a, #0f0f18)',
        borderRight: '1px solid rgba(139,0,0,0.3)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid rgba(168,184,200,0.1)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--silver-dim)', marginBottom: '0.75rem' }}>
            ᚱ CARD LIBRARY
          </div>
          <input
            className="stone-input"
            placeholder="Search cards..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ fontSize: '0.95rem' }}
          />
        </div>
        <div style={{
          flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem',
          display: 'flex', flexWrap: 'wrap', gap: '1rem', alignContent: 'flex-start',
        }}>
          {filteredLibrary.map(card => (
            <CardTile key={card.id} card={card} size="sm" showAdd onAdd={addCard} onClick={addCard} />
          ))}
        </div>
      </div>

      {/* RIGHT: Deck canvas */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(180deg, #1a1410, #0f0d0a)',
        overflow: 'hidden',
      }}>
        {/* Deck header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            {editingName ? (
              <input
                value={deckName}
                onChange={e => setDeckName(e.target.value)}
                onBlur={() => setEditingName(false)}
                autoFocus
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--parchment)',
                  color: 'var(--parchment)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  letterSpacing: '0.08em',
                  outline: 'none',
                  padding: '0.25rem 0',
                }}
              />
            ) : (
              <h2
                onClick={() => setEditingName(true)}
                style={{
                  fontFamily: 'var(--font-display)', fontSize: '1rem',
                  color: 'var(--parchment)', letterSpacing: '0.08em',
                  cursor: 'text',
                }}
              >
                {deckName}
                <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: 'var(--silver-dim)', verticalAlign: 'middle' }}>✎</span>
              </h2>
            )}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '0.55rem', letterSpacing: '0.1em',
            color: totalCards > 40 ? 'var(--crimson-bright)' : totalCards === 40 ? '#44aa66' : 'var(--silver-dim)',
          }}>
            {totalCards}/40 cards {totalCards > 40 ? '— OVER LIMIT' : totalCards === 40 ? '— READY' : ''}
          </div>
        </div>

        {/* Card list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {deckCards.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '3rem 1rem',
              color: 'var(--silver-dim)', fontFamily: 'var(--font-body)', fontStyle: 'italic',
            }}>
              Click or drag cards from the library to add them to your deck...
            </div>
          )}
          {deckCards.map(({ card, qty }) => (
            <div key={card.id} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.6rem 0.75rem',
              marginBottom: '0.35rem',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(168,184,200,0.1)',
              borderRadius: '2px',
              transition: 'background 0.2s',
            }}>
              <div className="mana-crystal" style={{ width: '20px', height: '20px', fontSize: '0.6rem', flexShrink: 0 }}>
                {card.mana_cost}
              </div>
              <span style={{
                flex: 1, fontFamily: 'var(--font-display)', fontSize: '0.65rem',
                letterSpacing: '0.05em', color: 'var(--parchment)',
              }}>
                {card.name}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => removeCard(card.id)} style={{
                  background: 'none', border: '1px solid rgba(168,184,200,0.2)',
                  borderRadius: '2px', width: '20px', height: '20px',
                  color: 'var(--silver-dim)', cursor: 'pointer', fontSize: '0.8rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>−</button>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'var(--parchment)', minWidth: '12px', textAlign: 'center' }}>
                  {qty}
                </span>
                <button onClick={() => addCard(card)} style={{
                  background: 'none', border: '1px solid rgba(168,184,200,0.2)',
                  borderRadius: '2px', width: '20px', height: '20px',
                  color: 'var(--silver-dim)', cursor: 'pointer', fontSize: '0.8rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>+</button>
              </div>
              <button onClick={() => setDeckCards(prev => prev.filter(d => d.card.id !== card.id))} style={{
                background: 'none', border: 'none', color: 'var(--crimson)',
                cursor: 'pointer', fontSize: '0.8rem', padding: '0 2px',
              }}>✕</button>
            </div>
          ))}
        </div>

        {/* Mana curve */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(201,169,110,0.1)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', letterSpacing: '0.15em', color: 'var(--silver-dim)', marginBottom: '0.5rem' }}>
            MANA CURVE
          </div>
          <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '40px' }}>
            {manaCurve.map((count, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <div style={{
                  width: '100%',
                  height: `${(count / maxCurveVal) * 36}px`,
                  background: `rgba(106,179,255,${0.3 + (count / maxCurveVal) * 0.6})`,
                  borderRadius: '1px 1px 0 0',
                  boxShadow: count > 0 ? '0 0 6px rgba(106,179,255,0.4)' : 'none',
                  transition: 'all 0.3s',
                  minHeight: count > 0 ? '3px' : '0',
                }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.45rem', color: 'var(--silver-dim)' }}>
                  {i < 7 ? i : '7+'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(139,0,0,0.3)' }}>
          <button className="seal-button" onClick={handleSave} style={{
            width: '100%',
            background: saved
              ? 'radial-gradient(ellipse, #1a5a1a, #0a2a0a)'
              : undefined,
            transition: 'all 0.3s',
          }}>
            {saved ? '✓ Deck Sealed' : '⚑ Seal the Deck'}
          </button>
        </div>
      </div>
    </div>
  )
}
