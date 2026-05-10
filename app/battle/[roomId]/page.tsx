'use client'
import { useState } from 'react'
import Link from 'next/link'

const HAND_CARDS = [
  { id: '1', name: 'Void Wraith', mana: 4, atk: 5, def: 3, type: 'creature', emoji: '🐉' },
  { id: '2', name: 'Crimson Bolt', mana: 2, atk: null, def: null, type: 'spell', emoji: '✨' },
  { id: '3', name: 'Iron Sentinel', mana: 3, atk: 2, def: 6, type: 'creature', emoji: '🛡️' },
  { id: '4', name: 'Shadow Step', mana: 3, atk: null, def: null, type: 'spell', emoji: '🌑' },
]

const OPPONENT_BOARD = [
  { id: 'o1', name: 'Bone Colossus', atk: 9, def: 8, emoji: '💀' },
]

export default function BattlePage({ params }: { params: { roomId: string } }) {
  const [playerHp, setPlayerHp] = useState(30)
  const [opponentHp, setOpponentHp] = useState(30)
  const [playerMana, setPlayerMana] = useState(5)
  const [playerBoard, setPlayerBoard] = useState<typeof HAND_CARDS>([])
  const [hand, setHand] = useState(HAND_CARDS)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameOver, setGameOver] = useState<'win' | 'lose' | null>(null)

  const playCard = (card: typeof HAND_CARDS[0]) => {
    if (!isPlayerTurn || card.mana > playerMana) return
    if (card.type === 'creature') {
      setPlayerBoard(prev => [...prev, card])
    } else {
      setOpponentHp(hp => Math.max(0, hp - 4))
      if (opponentHp - 4 <= 0) setGameOver('win')
    }
    setHand(prev => prev.filter(c => c.id !== card.id))
    setPlayerMana(m => m - card.mana)
    setSelectedCard(null)
  }

  const attack = (attacker: typeof HAND_CARDS[0]) => {
    if (!isPlayerTurn) return
    setOpponentHp(hp => {
      const newHp = Math.max(0, hp - attacker.atk!)
      if (newHp <= 0) setGameOver('win')
      return newHp
    })
    setSelectedCard(null)
  }

  const endTurn = () => {
    setIsPlayerTurn(false)
    setTimeout(() => {
      setPlayerHp(hp => Math.max(0, hp - 3))
      setPlayerMana(m => Math.min(10, m + 1))
      setIsPlayerTurn(true)
      if (playerHp - 3 <= 0) setGameOver('lose')
    }, 1500)
  }

  if (gameOver) {
    return (
      <div style={{
        minHeight: '100vh', paddingTop: '64px',
        background: gameOver === 'win' ? 'radial-gradient(ellipse at 50% 50%, #0a2a0a, #050f05)' : 'radial-gradient(ellipse at 50% 50%, #2a0a0a, #0f0505)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>
          {gameOver === 'win' ? '⚔️' : '💀'}
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--parchment)', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
          {gameOver === 'win' ? 'VICTORY' : 'DEFEAT'}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--silver-dim)', marginBottom: '2rem' }}>
          {gameOver === 'win' ? 'The void claims your enemies.' : 'Your legend is not yet written.'}
        </p>
        <Link href="/battle" style={{ textDecoration: 'none' }}>
          <button className="seal-button">Return to Lobby</button>
        </Link>
      </div>
    )
  }

  return (
    <div style={{
      height: '100vh', paddingTop: '64px',
      background: 'radial-gradient(ellipse at 50% 50%, #1a0a0a, #0a0a0f)',
      display: 'flex', flexDirection: 'column',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%238b000011\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      overflow: 'hidden',
    }}>
      {/* Opponent info bar */}
      <div style={{
        padding: '0.75rem 2rem',
        background: 'rgba(0,0,0,0.5)',
        borderBottom: '1px solid rgba(139,0,0,0.3)',
        display: 'flex', alignItems: 'center', gap: '1rem',
      }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-mid)', border: '1px solid var(--silver-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
          💀
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'var(--silver)', letterSpacing: '0.08em' }}>BONE_LORD</div>
        </div>
        <div className="hp-orb" style={{ width: '44px', height: '44px', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
          {opponentHp}
        </div>
        <div style={{ display: 'flex', gap: '4px', marginLeft: '0.5rem' }}>
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="mana-crystal" style={{ width: '16px', height: '16px', fontSize: '0', opacity: i < 7 ? 0.4 : 0 }} />
          ))}
        </div>
        <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--silver-dim)' }}>
          🃏 × 5 in hand
        </div>
      </div>

      {/* Opponent battlefield */}
      <div style={{
        flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '1rem', padding: '1rem',
        borderBottom: '2px solid rgba(139,0,0,0.3)',
      }}>
        {OPPONENT_BOARD.map(c => (
          <div
            key={c.id}
            onClick={() => {
              if (selectedCard) {
                const attacker = playerBoard.find(p => p.id === selectedCard)
                if (attacker) attack(attacker)
              }
            }}
            style={{
              width: '90px', height: '126px',
              background: 'radial-gradient(ellipse at 50% 30%, #3d1a0a, #0a0508)',
              border: '2px solid rgba(139,0,0,0.6)',
              borderRadius: '4px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '4px', cursor: selectedCard ? 'crosshair' : 'default',
              transition: 'all 0.2s',
              boxShadow: selectedCard ? '0 0 20px rgba(139,0,0,0.6)' : 'none',
            }}
          >
            <div style={{ fontSize: '2rem' }}>{c.emoji}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', color: 'var(--parchment)', textAlign: 'center', letterSpacing: '0.04em' }}>
              {c.name}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'var(--silver)' }}>
              {c.atk}/{c.def}
            </div>
          </div>
        ))}
        {OPPONENT_BOARD.length === 0 && (
          <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'rgba(168,184,200,0.2)', fontSize: '0.9rem' }}>
            — Enemy battlefield is empty —
          </div>
        )}
      </div>

      {/* Center bar */}
      <div style={{
        padding: '0.5rem 2rem',
        background: 'rgba(0,0,0,0.6)',
        borderTop: '1px solid rgba(139,0,0,0.2)',
        borderBottom: '1px solid rgba(139,0,0,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', letterSpacing: '0.15em', color: isPlayerTurn ? '#44aa66' : 'var(--silver-dim)' }}>
          {isPlayerTurn ? '⚔ YOUR TURN' : '⟳ OPPONENT\'S TURN...'}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', color: 'var(--silver-dim)', letterSpacing: '0.1em' }}>
          ROOM #{params.roomId}
        </div>
      </div>

      {/* Player battlefield */}
      <div style={{
        flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '1rem', padding: '1rem',
        borderBottom: '1px solid rgba(201,169,110,0.15)',
      }}>
        {playerBoard.map(c => (
          <div
            key={c.id}
            onClick={() => setSelectedCard(selected => selected === c.id ? null : c.id)}
            style={{
              width: '90px', height: '126px',
              background: 'radial-gradient(ellipse at 50% 30%, #1a3d0a, #050a03)',
              border: `2px solid ${selectedCard === c.id ? 'var(--parchment)' : 'rgba(68,170,102,0.4)'}`,
              borderRadius: '4px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '4px', cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: selectedCard === c.id ? '0 0 20px rgba(201,169,110,0.4)' : 'none',
              transform: selectedCard === c.id ? 'translateY(-8px)' : 'none',
            }}
          >
            <div style={{ fontSize: '2rem' }}>{c.emoji}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', color: 'var(--parchment)', textAlign: 'center', letterSpacing: '0.04em' }}>
              {c.name}
            </div>
            {c.atk && (
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'var(--silver)' }}>
                {c.atk}/{c.def}
              </div>
            )}
          </div>
        ))}
        {playerBoard.length === 0 && (
          <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'rgba(168,184,200,0.2)', fontSize: '0.9rem' }}>
            — Play creatures from your hand —
          </div>
        )}
      </div>

      {/* Player hand */}
      <div style={{
        padding: '1rem 2rem',
        background: 'rgba(0,0,0,0.4)',
        borderTop: '1px solid rgba(201,169,110,0.1)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        gap: '0.5rem', minHeight: '120px',
      }}>
        {hand.map((card, i) => (
          <div
            key={card.id}
            onClick={() => playCard(card)}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              width: '80px', height: '112px',
              background: card.type === 'creature'
                ? 'radial-gradient(ellipse at 50% 30%, #3d1a0a, #0a0508)'
                : 'radial-gradient(ellipse at 50% 50%, #1a0a3d, #050310)',
              border: `1px solid ${card.mana > playerMana || !isPlayerTurn ? 'rgba(168,184,200,0.15)' : 'rgba(201,169,110,0.5)'}`,
              borderRadius: '4px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '3px', cursor: isPlayerTurn && card.mana <= playerMana ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              transform: hoveredCard === card.id ? 'translateY(-20px) scale(1.1)' : `rotate(${(i - hand.length / 2) * 3}deg)`,
              transformOrigin: 'bottom center',
              opacity: !isPlayerTurn || card.mana > playerMana ? 0.5 : 1,
              zIndex: hoveredCard === card.id ? 10 : i,
              flexShrink: 0,
            }}
          >
            <div className="mana-crystal" style={{ width: '18px', height: '18px', fontSize: '0.55rem' }}>
              {card.mana}
            </div>
            <div style={{ fontSize: '1.6rem' }}>{card.emoji}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.45rem', color: 'var(--parchment)', textAlign: 'center', padding: '0 4px', letterSpacing: '0.03em' }}>
              {card.name}
            </div>
            {card.type === 'creature' && (
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', color: 'var(--silver)' }}>
                {card.atk}/{card.def}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Player info bar */}
      <div style={{
        padding: '0.75rem 2rem',
        background: 'rgba(0,0,0,0.6)',
        borderTop: '1px solid rgba(139,0,0,0.3)',
        display: 'flex', alignItems: 'center', gap: '1rem',
      }}>
        <div className="hp-orb" style={{ width: '44px', height: '44px', fontSize: '0.85rem' }}>
          {playerHp}
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: playerMana }, (_, i) => (
            <div key={i} className="mana-crystal" style={{ width: '18px', height: '18px', fontSize: '0' }} />
          ))}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--silver-dim)', letterSpacing: '0.08em' }}>
          YOU · {playerMana} mana
        </div>

        <button
          className="seal-button"
          onClick={endTurn}
          disabled={!isPlayerTurn}
          style={{
            marginLeft: 'auto',
            opacity: isPlayerTurn ? 1 : 0.4,
            fontSize: '0.7rem',
            padding: '0.6rem 1.5rem',
          }}
        >
          End Turn →
        </button>
      </div>
    </div>
  )
}
