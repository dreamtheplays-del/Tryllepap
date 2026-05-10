'use client'
import { useState } from 'react'
import Link from 'next/link'

const MOCK_ROOMS = [
  { id: 'a1b2', name: "Shadowmancer's Trial", host: 'GrimReaper99', status: 'waiting' },
  { id: 'c3d4', name: 'The Endless Void', host: 'VoidWalker', status: 'waiting' },
  { id: 'e5f6', name: 'Ember Gate Duel', host: 'FlameHerald', status: 'active' },
]

export default function BattleLobbyPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [roomName, setRoomName] = useState('')

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: 'var(--bg-deep)', padding: '80px 2rem 2rem', position: 'relative', overflow: 'hidden' }}>
      {/* Atmosphere */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(139,0,0,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--parchment)', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
              ⚔ Battle Arena
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--silver-dim)' }}>
              Choose your battlefield, warrior
            </p>
          </div>
          <button className="seal-button" onClick={() => setShowCreate(true)}>
            + Open Room
          </button>
        </div>

        {/* Room list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {MOCK_ROOMS.map(room => (
            <div key={room.id} style={{
              background: 'linear-gradient(135deg, #1a1a24, #0f0f18)',
              border: `1px solid ${room.status === 'waiting' ? 'rgba(139,0,0,0.4)' : 'rgba(168,184,200,0.15)'}`,
              borderRadius: '4px',
              padding: '1.5rem 2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'all 0.3s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {/* Status indicator */}
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: room.status === 'waiting' ? '#44aa66' : '#888',
                  boxShadow: room.status === 'waiting' ? '0 0 8px #44aa66' : 'none',
                  flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--parchment)', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                    {room.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--silver-dim)', fontSize: '0.85rem' }}>
                    Host: {room.host} · Room #{room.id}
                  </div>
                </div>
              </div>

              {room.status === 'waiting' ? (
                <Link href={`/battle/${room.id}`} style={{ textDecoration: 'none' }}>
                  <button className="seal-button" style={{ padding: '0.6rem 1.5rem', fontSize: '0.65rem' }}>
                    Enter
                  </button>
                </Link>
              ) : (
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '0.55rem',
                  color: 'var(--silver-dim)', letterSpacing: '0.1em',
                  border: '1px solid rgba(168,184,200,0.2)', borderRadius: '2px',
                  padding: '4px 10px',
                }}>
                  IN BATTLE
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Create room modal */}
        {showCreate && (
          <div onClick={() => setShowCreate(false)} style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              background: 'linear-gradient(145deg, #1a1a28, #0f0f1a)',
              border: '1px solid var(--crimson)',
              borderRadius: '4px',
              padding: '2.5rem',
              width: '400px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--parchment)', letterSpacing: '0.08em', marginBottom: '1.5rem' }}>
                OPEN A NEW ROOM
              </h2>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--silver-dim)', marginBottom: '0.5rem' }}>
                  ROOM NAME
                </label>
                <input
                  className="stone-input"
                  placeholder="Name your battlefield..."
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button className="seal-button" style={{ flex: 1 }}>Open Gates</button>
                <button onClick={() => setShowCreate(false)} style={{
                  flex: 1, background: 'none', border: '1px solid rgba(168,184,200,0.2)',
                  borderRadius: '2px', color: 'var(--silver-dim)',
                  fontFamily: 'var(--font-display)', fontSize: '0.65rem',
                  letterSpacing: '0.08em', cursor: 'pointer',
                }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
