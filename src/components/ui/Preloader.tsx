'use client'

import { color } from 'framer-motion'
import { useEffect, useState } from 'react'

const TEXT = '_portfolio.'

export function Preloader() {
  const [phase, setPhase] = useState<'intro' | 'count' | 'exit' | 'done'>('intro')
  const [count, setCount] = useState(0)
  const [letters, setLetters] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Bloque le scroll pendant le pré-loader
  useEffect(() => {
    const lenis = (window as any).lenis

    if (phase === 'done') {
      document.body.style.overflow = ''
      if (lenis) lenis.start()
    } else {
      document.body.style.overflow = 'hidden'
      if (lenis) lenis.stop()
    }

    return () => {
      document.body.style.overflow = ''
      if (lenis) lenis.start()
    }
  }, [phase])

  useEffect(() => {
    // Détecte prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    // Si reduced motion, sortie rapide en 300ms
    if (mediaQuery.matches) {
      setLetters(true)
      setCount(100)
      const quickExit = setTimeout(() => {
        setPhase('done')
      }, 300)
      return () => clearTimeout(quickExit)
    }

    // Phase 1 : reveal lettres
    const t1 = setTimeout(() => setLetters(true), 50)

    // Phase 2 : compteur
    const t2 = setTimeout(() => {
      setPhase('count')
      let start: number | null = null
      const duration = 1400

      function step(ts: number) {
        if (!start) start = ts
        const progress = Math.min((ts - start) / duration, 1)
        // easing cubic-bezier(0.4, 0, 0.2, 1)
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2
        setCount(Math.floor(eased * 100))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, 400)

    // Phase 3 : exit
    const t3 = setTimeout(() => setPhase('exit'), 1800)

    // Done
    const t4 = setTimeout(() => {
      setPhase('done')
    }, 2500)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  if (phase === 'done') return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      pointerEvents: 'none',
      opacity: 1,
      transition: reducedMotion ? 'opacity 300ms ease' : 'none',
    }}>
      {/* Panneau haut */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '50vh',
        background: '#0d0e12',
        transform: !reducedMotion && phase === 'exit' ? 'translateY(-100%)' : 'translateY(0)',
        transition: !reducedMotion && phase === 'exit' ? 'transform 700ms cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
      }} />

      {/* Panneau bas */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '50vh',
        background: '#0d0e12',
        transform: !reducedMotion && phase === 'exit' ? 'translateY(100%)' : 'translateY(0)',
        transition: !reducedMotion && phase === 'exit' ? 'transform 700ms cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
      }} />

      {/* Contenu centré (texte + compteur) */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: phase === 'exit' ? 0 : 1,
        transition: 'opacity 200ms ease',
        zIndex: 1,
      }}>
        {/* Texte lettre par lettre */}
        <div style={{
          fontFamily: 'var(--font-mono), montsserat, sans-serif',
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 1000,
          color: 'var(--text-primary)',
          letterSpacing: '0.03em',
          display: 'flex',
        }}>
          {TEXT.split('').map((char, i) => (
            <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
              <span style={{
                display: 'inline-block',
                transform: !reducedMotion && letters ? 'translateY(0)' : !reducedMotion ? 'translateY(110%)' : 'translateY(0)',
                transition: reducedMotion ? 'none' : `transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 40}ms`,
                color: char === '.' ? 'var(--accent)' : 'var(--text-primary)',
              }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Compteur — bas droite */}
      <div style={{
        position: 'absolute', bottom: '2rem', right: '2.5rem',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: '11px',
        letterSpacing: '0.08em',
        color: 'var(--text-subtle)',
        opacity: phase === 'exit' ? 0 : 1,
        transition: 'opacity 200ms ease',
        zIndex: 1,
      }}>
        <span style={{ color: 'var(--accent)' }}>{String(count).padStart(3, '0')}</span>%
      </div>
    </div>
  )
}
