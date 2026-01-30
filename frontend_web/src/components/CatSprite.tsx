/**
 * GAME-GRADE CAT SPRITE ANIMATOR - CLEAN SPRITES (NO LABELS)
 * NO SLIDING - Movement only occurs during walk animations
 * Frame-based position updates
 * 
 * Using unlabeled sprite sheets: prabh_sprites.png (black) and sehaj_sprites.png (ginger)
 * Sheet dimensions: 896x4608 (14 columns x 72 rows of 64px frames)
 */

import React, { useState, useEffect, useRef } from 'react'

// Use CLEAN sprite sheets (no text labels)
const prabhSheet = '/prabh_sprites.png'  // Black cat
const sehajSheet = '/sehaj_sprites.png'  // Ginger/tan cat

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

// Animation frame mappings for clean sprite sheets (14 columns)
// Row 0: Walk down (frames 0-5)
// Row 1: Walk left (frames 14-19)
// Row 2: Walk right (frames 28-33)
// Row 3: Walk up (frames 42-47)
// etc.
const ANIMATIONS: Record<CatState, AnimationDef> = {
  sitIdle: { start: 0, end: 0, fps: 1, loop: true },        // Standing idle
  layIdle: { start: 56, end: 56, fps: 1, loop: true },      // Lying idle
  walkDown: { start: 0, end: 5, fps: 8, loop: true },       // Row 0
  walkLeft: { start: 14, end: 19, fps: 8, loop: true },     // Row 1
  walkRight: { start: 28, end: 33, fps: 8, loop: true },    // Row 2
  walkUp: { start: 42, end: 47, fps: 8, loop: true },       // Row 3
  sleep: { start: 56, end: 59, fps: 4, loop: true },        // Lying/sleep frames
  wake: { start: 59, end: 56, fps: 8, loop: false },        // Wake up (reverse sleep)
  eat: { start: 70, end: 75, fps: 8, loop: false },         // Eating animation
  happy: { start: 84, end: 89, fps: 10, loop: false },      // Happy/excited
  annoyed: { start: 98, end: 103, fps: 8, loop: false },    // Annoyed
  sad: { start: 98, end: 100, fps: 4, loop: true },         // Sad (short loop)
  surprised: { start: 112, end: 114, fps: 10, loop: false },// Surprised
  purr: { start: 84, end: 86, fps: 6, loop: true },         // Purring
  tailFlick: { start: 126, end: 130, fps: 8, loop: false }, // Tail flick
  bounce: { start: 84, end: 91, fps: 12, loop: false },     // Bouncy/playful
  pickUp: { start: 140, end: 143, fps: 6, loop: true },     // Being picked up
  chaos: { start: 98, end: 105, fps: 14, loop: false },     // Chaos mode (fast annoyed)
}

// Both cats use the same animation structure
const PRABH_ANIMATIONS = ANIMATIONS
const SEHAJ_ANIMATIONS = ANIMATIONS

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
