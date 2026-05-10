'use client'
import { useEffect } from 'react'
import { Card } from '@/lib/supabase'

const RARITY_COLORS: Record<string, string> = {
  common: '#607080', rare: '#4a7fad', epic: '#7b4fa8', legendary: '#d4a935',
}
const TYPE_ICONS: Record<string, string> = {
  creature: '🐉', spell: '✨', artifact: '⚗️',
}

interface CardModalProps {
  card: Card | null
  onClose: () => void
}

export default function CardModal({ card, onClose }: CardModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!card) return null
  const rarityColor = RARITY_COLORS[card.rarity] || '#607080'

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        padding: '2rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, #1a1a28, #0f0f1a)',
          border: `2px solid ${rarityColor}`,
          borderRadius: '8px',
          maxWidth: '520px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: `0 30px 80px rgba(0,0,0,0.8), 0 0 40px ${rarityColor}33`,
          position: 'relative',
        }}
      >
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '12px', right: '16px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--silver-dim)', fontSize: '1.4rem', zIndex: 1,
          fontFamily: 'var(--font-display)',
        }}>
          ✕
        </button>

        {/* Art header */}
        <div style={{
          height: '200px',
          background: card.type === 'creature'
            ? 'radial-gradient(ellipse at 50% 30%, #3d1a0a 0%, #0a0508 100%)'
            : card.type === 'spell'
            ? 'radial-gradient(ellipse at 50% 50%, #1a0a3d 0%, #050310 100%)'
            : 'radial-gradient(ellipse at 50% 20%, #2a2a0a 0%, #080806 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '5rem',
          borderBottom: `1px solid ${rarityColor}44`,
          position: 'relative',
        }}>
          {TYPE_ICONS[card.type]}

          {/* Mana crystal */}
          <div className="mana-crystal" style={{
            position: 'absolute', top: '12px', left: '12px',
            width: '36px', height: '36px', fontSize: '1rem',
          }}>
            {card.mana_cost}
          </div>

          {/* Rarity badge */}
          <div style={{
            position: 'absolute', top: '12px', right: '44px',
            background: `${rarityColor}22`,
            border: `1px solid ${rarityColor}`,
            borderRadius: '2px',
            padding: '2px 8px',
            fontFamily: 'var(--font-display)',
            fontSize: '0.55rem',
            letterSpacing: '0.1em',
            color: rarityColor,
          }}>
            {card.rarity.toUpperCase()}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '1.5rem 2rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              color: 'var(--parchment)',
              letterSpacing: '0.08em',
            }}>
              {card.name}
            </h2>
            {card.type === 'creature' && (
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                color: 'var(--silver)',
                background: 'rgba(0,0,0,0.4)',
                padding: '2px 12px',
                border: '1px solid var(--silver-dim)',
                borderRadius: '2px',
              }}>
                {card.attack} / {card.defense}
              </span>
            )}
          </div>

          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.6rem',
            color: rarityColor,
            letterSpacing: '0.12em',
            marginBottom: '1rem',
            textTransform: 'uppercase',
          }}>
            {TYPE_ICONS[card.type]} {card.type}
          </p>

          <div style={{
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(168,184,200,0.15)',
            borderRadius: '2px',
            padding: '1rem',
            marginBottom: '1rem',
          }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              color: 'var(--parchment-light)',
              lineHeight: 1.6,
            }}>
              {card.description}
            </p>
          </div>

          {card.lore && (
            <p style={{
              fontFamily: 'var(--font-body)',
              fontStyle: 'italic',
              fontSize: '0.9rem',
              color: 'var(--silver-dim)',
              lineHeight: 1.7,
              borderLeft: `2px solid ${rarityColor}66`,
              paddingLeft: '1rem',
            }}>
              "{card.lore}"
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
