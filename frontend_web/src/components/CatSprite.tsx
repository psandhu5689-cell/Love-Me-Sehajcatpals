/**
 * GAME-GRADE CAT SPRITE ANIMATOR - FIXED RENDERING
 * NO SLIDING - Movement only occurs during walk animations
 * Frame-based position updates
 */

import React, { useState, useEffect, useRef } from 'react'
import prabhSheet from '../assets/sprites/black_cat_sheet.png'
import sehajSheet from '../assets/sprites/ginger_cat_labeled.png'

// Core animation states
export type CatState = 
  | 'sitIdle'
  | 'layIdle'
  | 'walkUp'
  | 'walkDown'
  | 'walkLeft'
  | 'walkRight'
  | 'sleep'
  | 'wake'
  | 'eat'
  | 'happy'
  | 'annoyed'
  | 'sad'
  | 'surprised'
  | 'purr'
  | 'tailFlick'
  | 'bounce'
  | 'pickUp'
  | 'chaos'

interface AnimationDef {
  start: number
  end: number
  fps: number
  loop: boolean
}

// BLACK CAT (Prabh)
const PRABH_ANIMATIONS: Record<CatState, AnimationDef> = {
  sitIdle: { start: 144, end: 144, fps: 1, loop: true },
  layIdle: { start: 145, end: 145, fps: 1, loop: true },
  walkUp: { start: 18, end: 23, fps: 8, loop: true },
  walkDown: { start: 0, end: 5, fps: 8, loop: true },
  walkLeft: { start: 54, end: 59, fps: 8, loop: true },
  walkRight: { start: 36, end: 41, fps: 8, loop: true },
  sleep: { start: 666, end: 671, fps: 6, loop: true },
  wake: { start: 671, end: 666, fps: 10, loop: false },
  eat: { start: 864, end: 873, fps: 10, loop: false },
  happy: { start: 504, end: 514, fps: 12, loop: false },
  annoyed: { start: 936, end: 945, fps: 10, loop: false },
  sad: { start: 936, end: 938, fps: 6, loop: true },
  surprised: { start: 144, end: 145, fps: 12, loop: false },
  purr: { start: 504, end: 506, fps: 8, loop: true },
  tailFlick: { start: 936, end: 940, fps: 10, loop: false },
  bounce: { start: 504, end: 510, fps: 12, loop: false },
  pickUp: { start: 144, end: 146, fps: 6, loop: true },
  chaos: { start: 936, end: 945, fps: 14, loop: false },
}

// GINGER CAT (Sehaj) - Same structure
const SEHAJ_ANIMATIONS: Record<CatState, AnimationDef> = {
  ...PRABH_ANIMATIONS
}

interface CatSpriteProps {
  cat: 'prabh' | 'sehaj'
  state: CatState
  onAnimationComplete?: () => void
  flip?: boolean
  scale?: number
}

export function CatSprite({ cat, state, onAnimationComplete, flip = false, scale = 1.8 }: CatSpriteProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const animRef = useRef<number | null>(null)
  const lastTimeRef = useRef(0)
  const completedRef = useRef(false)

  const spriteSheet = cat === 'prabh' ? prabhSheet : sehajSheet
  const animations = cat === 'prabh' ? PRABH_ANIMATIONS : SEHAJ_ANIMATIONS
  const anim = animations[state] || animations.sitIdle

  const FRAME_SIZE = 64
  const COLS = 18

  // Reset frame when state changes
  useEffect(() => {
    setCurrentFrame(anim.start)
    completedRef.current = false
    lastTimeRef.current = 0
  }, [state, anim.start])

  // Animation loop
  useEffect(() => {
    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time

      const delta = time - lastTimeRef.current
      const frameTime = 1000 / anim.fps

      if (delta >= frameTime) {
        setCurrentFrame(prev => {
          const next = prev + 1

          if (next > anim.end) {
            if (anim.loop) {
              return anim.start
            } else {
              if (!completedRef.current) {
                completedRef.current = true
                setTimeout(() => onAnimationComplete?.(), 50)
              }
              return anim.end
            }
          }

          return next
        })

        lastTimeRef.current = time
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current)
      }
    }
  }, [state, anim.fps, anim.start, anim.end, anim.loop, onAnimationComplete])

  // Calculate sprite position
  const frameIndex = Math.max(anim.start, Math.min(currentFrame, anim.end))
  const col = frameIndex % COLS
  const row = Math.floor(frameIndex / COLS)

  const displaySize = FRAME_SIZE * scale

  return (
    <div
      style={{
        width: displaySize,
        height: displaySize,
        position: 'relative',
        transform: flip ? 'scaleX(-1)' : 'none',
      }}
    >
      <img
        src={spriteSheet}
        alt="cat"
        style={{
          position: 'absolute',
          top: -row * FRAME_SIZE * scale,
          left: -col * FRAME_SIZE * scale,
          width: FRAME_SIZE * COLS * scale,
          height: 'auto',
          imageRendering: 'pixelated',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
