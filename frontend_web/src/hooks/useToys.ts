/**
 * TOY SYSTEM HOOK - Draggable toys with cat reactions
 * 
 * Features:
 * - 8 draggable toys placed on floor
 * - Side steal mechanic (anger cat if toy crosses midline)
 * - Idle animations (wobble, bounce, sparkle)
 * - Interaction animations (tap bounce, long press spin)
 */

import { useState, useEffect, useRef, useCallback } from 'react'

export type ToyId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type ToyState = 'idle' | 'dragged' | 'wobble' | 'bounce' | 'angryShake' | 'sparkle' | 'spin'

export interface Toy {
  id: ToyId
  name: string
  image: string
  x: number  // Percentage within floor bounds
  y: number  // Percentage within floor bounds
  homeSide: 'left' | 'right'
  state: ToyState
  zIndex: number
}

export type CatReaction = {
  cat: 'prabh' | 'sehaj'
  type: 'angry' | 'happy'
  timestamp: number
}

// Toy definitions with initial scattered positions - MORE SPREAD OUT
const INITIAL_TOYS: Toy[] = [
  // Left side (Prabh's toys) - spread across left half
  { id: 1, name: 'duck', image: '/toys/toy_01_duck.png', x: 8, y: 25, homeSide: 'left', state: 'idle', zIndex: 60 },
  { id: 2, name: 'knight', image: '/toys/toy_02_knight.png', x: 22, y: 80, homeSide: 'left', state: 'idle', zIndex: 60 },
  { id: 3, name: 'ball', image: '/toys/toy_03_ball.png', x: 38, y: 30, homeSide: 'left', state: 'idle', zIndex: 60 },
  { id: 4, name: 'blocks', image: '/toys/toy_04_blocks.png', x: 12, y: 55, homeSide: 'left', state: 'idle', zIndex: 60 },
  // Right side (Sehaj's toys) - spread across right half
  { id: 5, name: 'puzzle', image: '/toys/toy_05_puzzle.png', x: 62, y: 25, homeSide: 'right', state: 'idle', zIndex: 60 },
  { id: 6, name: 'rings', image: '/toys/toy_06_rings.png', x: 78, y: 80, homeSide: 'right', state: 'idle', zIndex: 60 },
  { id: 7, name: 'robot', image: '/toys/toy_07_robot.png', x: 92, y: 45, homeSide: 'right', state: 'idle', zIndex: 60 },
  { id: 8, name: 'teddy', image: '/toys/toy_08_teddy.png', x: 88, y: 75, homeSide: 'right', state: 'idle', zIndex: 60 },
]

// Floor bounds (percentage)
const FLOOR_BOUNDS = {
  minX: 5,
  maxX: 95,
  minY: 15,
  maxY: 85,
}

// Midline for side detection (50% of floor)
const MIDLINE_X = 50

interface UseToyOptions {
  onCatReaction?: (reaction: CatReaction) => void
}

export function useToys({ onCatReaction }: UseToyOptions = {}) {
  const [toys, setToys] = useState<Toy[]>(INITIAL_TOYS)
  const [draggedToyId, setDraggedToyId] = useState<ToyId | null>(null)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const idleAnimationTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Get current side based on position
  const getCurrentSide = (x: number): 'left' | 'right' => {
    return x < MIDLINE_X ? 'left' : 'right'
  }

  // Clamp position within floor bounds
  const clampPosition = (x: number, y: number) => ({
    x: Math.max(FLOOR_BOUNDS.minX, Math.min(FLOOR_BOUNDS.maxX, x)),
    y: Math.max(FLOOR_BOUNDS.minY, Math.min(FLOOR_BOUNDS.maxY, y)),
  })

  // Start dragging
  const startDrag = useCallback((toyId: ToyId, clientX: number, clientY: number) => {
    setDraggedToyId(toyId)
    dragStartRef.current = { x: clientX, y: clientY }
    
    // Bring to front and set dragged state
    setToys(prev => prev.map(t => 
      t.id === toyId 
        ? { ...t, state: 'dragged' as ToyState, zIndex: 75 }
        : t
    ))
    
    // Start long press timer for spin
    longPressTimerRef.current = setTimeout(() => {
      setToys(prev => prev.map(t =>
        t.id === toyId ? { ...t, state: 'spin' as ToyState } : t
      ))
      // Reset after spin
      setTimeout(() => {
        setToys(prev => prev.map(t =>
          t.id === toyId ? { ...t, state: 'dragged' as ToyState } : t
        ))
      }, 1000)
    }, 800)
  }, [])

  // Move while dragging
  const moveDrag = useCallback((toyId: ToyId, containerRect: DOMRect, clientX: number, clientY: number) => {
    if (draggedToyId !== toyId) return
    
    // Cancel long press if moved
    if (longPressTimerRef.current) {
      const startPos = dragStartRef.current
      if (startPos && (Math.abs(clientX - startPos.x) > 5 || Math.abs(clientY - startPos.y) > 5)) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }
    }
    
    // Calculate percentage position
    const xPercent = ((clientX - containerRect.left) / containerRect.width) * 100
    const yPercent = ((clientY - containerRect.top) / containerRect.height) * 100
    
    const clamped = clampPosition(xPercent, yPercent)
    
    setToys(prev => prev.map(t =>
      t.id === toyId ? { ...t, x: clamped.x, y: clamped.y } : t
    ))
  }, [draggedToyId])

  // End dragging
  const endDrag = useCallback((toyId: ToyId) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
    
    setToys(prev => {
      const toy = prev.find(t => t.id === toyId)
      if (!toy) return prev
      
      const currentSide = getCurrentSide(toy.x)
      const wasStolen = currentSide !== toy.homeSide
      
      // Check if toy was stolen (crossed midline)
      if (wasStolen) {
        // Trigger cat anger
        const angryCat = toy.homeSide === 'left' ? 'prabh' : 'sehaj'
        onCatReaction?.({
          cat: angryCat,
          type: 'angry',
          timestamp: Date.now(),
        })
        
        // Angry shake animation on toy
        setTimeout(() => {
          setToys(p => p.map(t =>
            t.id === toyId ? { ...t, state: 'angryShake' as ToyState, zIndex: 60 } : t
          ))
          setTimeout(() => {
            setToys(p => p.map(t =>
              t.id === toyId ? { ...t, state: 'idle' as ToyState } : t
            ))
          }, 600)
        }, 100)
      } else {
        // Check if toy was returned to home side
        const wasOnWrongSide = prev.some(t => 
          t.id === toyId && getCurrentSide(t.x) !== t.homeSide
        )
        if (wasOnWrongSide) {
          // Trigger cat happiness
          const happyCat = toy.homeSide === 'left' ? 'prabh' : 'sehaj'
          onCatReaction?.({
            cat: happyCat,
            type: 'happy',
            timestamp: Date.now(),
          })
        }
      }
      
      return prev.map(t =>
        t.id === toyId ? { ...t, state: 'idle' as ToyState, zIndex: 60 } : t
      )
    })
    
    setDraggedToyId(null)
    dragStartRef.current = null
  }, [onCatReaction])

  // Tap interaction (not drag)
  const tapToy = useCallback((toyId: ToyId) => {
    setToys(prev => prev.map(t =>
      t.id === toyId ? { ...t, state: 'bounce' as ToyState } : t
    ))
    setTimeout(() => {
      setToys(prev => prev.map(t =>
        t.id === toyId ? { ...t, state: 'sparkle' as ToyState } : t
      ))
      setTimeout(() => {
        setToys(prev => prev.map(t =>
          t.id === toyId ? { ...t, state: 'idle' as ToyState } : t
        ))
      }, 400)
    }, 200)
  }, [])

  // Idle animations
  useEffect(() => {
    const triggerRandomIdleAnimation = () => {
      const randomToyIndex = Math.floor(Math.random() * toys.length)
      const toy = toys[randomToyIndex]
      
      if (toy.state === 'idle') {
        const animations: ToyState[] = ['wobble', 'bounce', 'sparkle']
        const randomAnim = animations[Math.floor(Math.random() * animations.length)]
        
        setToys(prev => prev.map(t =>
          t.id === toy.id ? { ...t, state: randomAnim } : t
        ))
        
        // Reset to idle after animation
        setTimeout(() => {
          setToys(prev => prev.map(t =>
            t.id === toy.id && t.state === randomAnim ? { ...t, state: 'idle' as ToyState } : t
          ))
        }, 600)
      }
    }
    
    // Random interval between 8-14 seconds
    const scheduleNextAnimation = () => {
      const delay = 8000 + Math.random() * 6000
      idleAnimationTimerRef.current = setTimeout(() => {
        triggerRandomIdleAnimation()
        scheduleNextAnimation()
      }, delay)
    }
    
    scheduleNextAnimation()
    
    return () => {
      if (idleAnimationTimerRef.current) {
        clearTimeout(idleAnimationTimerRef.current)
      }
    }
  }, [])

  return {
    toys,
    draggedToyId,
    startDrag,
    moveDrag,
    endDrag,
    tapToy,
    FLOOR_BOUNDS,
    MIDLINE_X,
  }
}
