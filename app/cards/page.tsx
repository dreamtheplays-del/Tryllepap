'use client'
import { useState, useMemo } from 'react'
import CardTile from '@/components/CardTile'
import CardModal from '@/components/CardModal'
import { MOCK_CARDS } from '@/lib/mockData'
import { Card } from '@/lib/supabase'

const TYPES = ['creature', 'spell', 'artifact']
const RARITIES = ['common', 'rare', 'epic', 'legendary']
const TYPE_ICONS: Record<string, string> = { creature: '🐉', spell: '✨', artifact: '⚗️' }
const RARITY_COLORS: Record<string, string> = { common: '#607080', rare: '#4a7fad', epic: '#7b4fa8', legendary: '#d4a935' }

export default function CardsPage() {
  const [search, setSearch] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])
  const [manaRange, setManaRange] = useState(10)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  const filtered = useMemo(() => {
    return MOCK_CARDS.filter(c => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedTypes.length && !selectedTypes.includes(c.type)) return false
      if (selectedRarities.length && !selectedRarities.includes(c.rarity)) return false
      if (c.mana_cost > manaRange) return false
      return true
    })
  }, [search, selectedTypes, selectedRarities, manaRange])

  const toggle = (arr: string[], val: string, set: (a: string[]) => void) => {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: 'var(--bg-deep)', display: 'flex' }}>
      {/* Filter sidebar */}
      <div style={{
        width: '240px', flexShrink: 0,
        background: 'linear-gradient(180deg, #12121a, #0f0f18)',
        borderRight: '1px solid rgba(139,0,0,0.3)',
        padding: '2rem 1.5rem',
        overflowY: 'auto',
        height: 'calc(100vh - 64px)',
        position: 'sticky', top: '64px',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.6rem', letterSpacing: '0.2em',
          color: 'var(--silver-dim)', marginBottom: '2rem',
          borderBottom: '1px solid rgba(139,0,0,0.3)',
          paddingBottom: '1rem',
        }}>
          ᚱ FILTER CODEX
        </div>

        {/* Type filter */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--parchment)', marginBottom: '0.75rem' }}>
            CARD TYPE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {TYPES.map(t => (
              <button key={t} onClick={() => toggle(selectedTypes, t, setSelectedTypes)} style={{
                background: selectedTypes.includes(t) ? 'rgba(139,0,0,0.3)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedTypes.includes(t) ? 'var(--crimson)' : 'rgba(168,184,200,0.15)'}`,
                borderRadius: '2px',
                padding: '0.5rem 0.75rem',
                cursor: 'pointer',
                color: selectedTypes.includes(t) ? 'var(--parchment)' : 'var(--silver-dim)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.6rem',
                letterSpacing: '0.08em',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}>
                {TYPE_ICONS[t]} {t}
              </button>
            ))}
          </div>
        </div>

        {/* Rarity filter */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--parchment)', marginBottom: '0.75rem' }}>
            RARITY
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {RARITIES.map(r => (
              <button key={r} onClick={() => toggle(selectedRarities, r, setSelectedRarities)} style={{
                background: selectedRarities.includes(r) ? `${RARITY_COLORS[r]}22` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedRarities.includes(r) ? RARITY_COLORS[r] : 'rgba(168,184,200,0.15)'}`,
                borderRadius: '2px',
                padding: '0.5rem 0.75rem',
                cursor: 'pointer',
                color: selectedRarities.includes(r) ? RARITY_COLORS[r] : 'var(--silver-dim)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.6rem',
                letterSpacing: '0.08em',
                transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}>
                ◆ {r}
              </button>
            ))}
          </div>
        </div>

        {/* Mana slider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--parchment)', marginBottom: '0.75rem' }}>
            MAX MANA: {manaRange}
          </div>
          <input type="range" min={0} max={10} value={manaRange}
            onChange={e => setManaRange(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--crimson)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: '0.5rem', color: 'var(--silver-dim)', marginTop: '0.25rem' }}>
            <span>0</span><span>10</span>
          </div>
        </div>

        {/* Reset */}
        <button onClick={() => { setSelectedTypes([]); setSelectedRarities([]); setManaRange(10); setSearch('') }} style={{
          width: '100%', background: 'none', border: '1px solid rgba(168,184,200,0.15)',
          borderRadius: '2px', padding: '0.5rem',
          color: 'var(--silver-dim)', fontFamily: 'var(--font-display)', fontSize: '0.55rem',
          letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s',
        }}>
          CLEAR FILTERS
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.4rem',
            color: 'var(--parchment)', letterSpacing: '0.1em', marginBottom: '0.25rem',
          }}>
            The Codex
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--silver-dim)', fontSize: '0.95rem' }}>
            {filtered.length} of {MOCK_CARDS.length} cards found
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '2rem', maxWidth: '400px' }}>
          <span style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--silver-dim)', fontSize: '1rem',
          }}>🔍</span>
          <input
            className="stone-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search the codex..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Card grid */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '1.25rem',
        }}>
          {filtered.map(card => (
            <CardTile key={card.id} card={card} onClick={setSelectedCard} size="md" />
          ))}
          {filtered.length === 0 && (
            <div style={{
              width: '100%', textAlign: 'center', padding: '4rem',
              color: 'var(--silver-dim)', fontFamily: 'var(--font-body)', fontStyle: 'italic',
            }}>
              No cards match your incantation...
            </div>
          )}
        </div>
      </div>

      <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
    </div>
  )
}
