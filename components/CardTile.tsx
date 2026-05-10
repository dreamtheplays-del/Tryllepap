'use client'
import { useState } from 'react'
import { Card } from '@/lib/supabase'

const TYPE_ICONS: Record<string, string> = {
  creature: '🐉',
  spell: '✨',
  artifact: '⚗️',
}

const RARITY_COLORS: Record<string, string> = {
  common: '#607080',
  rare: '#4a7fad',
  epic: '#7b4fa8',
  legendary: '#d4a935',
}

const RARITY_LABELS: Record<string, string> = {
  common: '◆',
  rare: '◆◆',
  epic: '◆◆◆',
  legendary: '✦',
}

// Placeholder card art patterns
const CARD_PATTERNS: Record<string, string> = {
  creature: 'radial-gradient(ellipse at 50% 30%, #3d1a0a 0%, #1a0a05 60%, #0a0508 100%)',
  spell: 'radial-gradient(ellipse at 50% 50%, #1a0a3d 0%, #0a0520 60%, #050310 100%)',
  artifact: 'radial-gradient(ellipse at 50% 20%, #2a2a0a 0%, #151508 60%, #080806 100%)',
}

interface CardTileProps {
  card: Card
  onClick?: (card: Card) => void
  size?: 'sm' | 'md' | 'lg'
  showAdd?: boolean
  onAdd?: (card: Card) => void
}

export default function CardTile({ card, onClick, size = 'md', showAdd, onAdd }: CardTileProps) {
  const [hovered, setHovered] = useState(false)
  const rarityColor = RARITY_COLORS[card.rarity] || '#607080'

  const dimensions = {
    sm: { width: '120px', height: '168px', nameFontSize: '0.55rem' },
    md: { width: '160px', height: '224px', nameFontSize: '0.65rem' },
    lg: { width: '200px', height: '280px', nameFontSize: '0.75rem' },
  }[size]

  return (
    <div
      onClick={() => onClick?.(card)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        background: CARD_PATTERNS[card.type] || CARD_PATTERNS.creature,
        border: `2px solid ${hovered ? rarityColor : 'rgba(168,184,200,0.3)'}`,
        borderRadius: '6px',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-6px) scale(1.03)' : 'translateY(0) scale(1)',
        boxShadow: hovered
          ? `0 12px 30px rgba(0,0,0,0.6), 0 0 20px ${rarityColor}44`
          : '0 4px 12px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Mana cost */}
      <div className="mana-crystal" style={{
        position: 'absolute', top: '6px', right: '6px',
        width: '22px', height: '22px', fontSize: '0.65rem',
      }}>
        {card.mana_cost}
      </div>

      {/* Art area */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '55%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size === 'sm' ? '2rem' : '2.8rem',
        opacity: 0.7,
      }}>
        {TYPE_ICONS[card.type]}
      </div>

      {/* Card info bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'rgba(0,0,0,0.75)',
        borderTop: `1px solid ${rarityColor}66`,
        padding: '6px 8px',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: dimensions.nameFontSize,
          color: 'var(--parchment)',
          letterSpacing: '0.05em',
          marginBottom: '2px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {card.name}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.5rem',
            color: rarityColor,
            letterSpacing: '0.05em',
          }}>
            {RARITY_LABELS[card.rarity]}
          </span>
          {card.type === 'creature' && (
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.55rem',
              color: 'var(--silver)',
            }}>
              {card.attack}/{card.defense}
            </span>
          )}
        </div>
      </div>

      {/* Add button on hover */}
      {showAdd && hovered && (
        <button
          onClick={e => { e.stopPropagation(); onAdd?.(card) }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(139,0,0,0.9)',
            border: '1px solid var(--parchment)',
            borderRadius: '50%',
            width: '36px', height: '36px',
            color: 'var(--parchment)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2,
          }}
        >
          +
        </button>
      )}
    </div>
  )
}
