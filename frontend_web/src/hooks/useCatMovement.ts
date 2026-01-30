/**
 * CAT MOVEMENT HOOK - NO SLIDING RULE
 * Position only updates when walk animation is playing
 */

import { useState, useEffect, useRef } from 'react'
import { CatState } from '../components/CatSprite'

// 6 FLOOR SPOTS for roaming (reduced scope)
const FLOOR_SPOTS = [
  { x: 25, y: 35, name: 'left-back' },
  { x: 50, y: 35, name: 'center-back' },
  { x: 75, y: 35, name: 'right-back' },
  { x: 30, y: 55, name: 'left-front' },
  { x: 50, y: 55, name: 'center-front' },
  { x: 70, y: 55, name: 'right-front' },
]

interface CatPosition {
  x: number
  y: number
  state: CatState
  targetSpot: number | null
}

export function useCatMovement(catId: 'prabh' | 'sehaj') {
  const [position, setPosition] = useState<CatPosition>({
    x: catId === 'prabh' ? FLOOR_SPOTS[2].x : FLOOR_SPOTS[0].x,
    y: catId === 'prabh' ? FLOOR_SPOTS[2].y : FLOOR_SPOTS[0].y,
    state: 'sitIdle',
    targetSpot: null,
  })

  const roamTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-roam logic
  useEffect(() => {
    const scheduleRoam = () => {
      const delay = 6000 + Math.random() * 6000 // 6-12 seconds
      
      roamTimerRef.current = setTimeout(() => {
        // 40% idle, 60% move
        if (Math.random() < 0.4) {
          scheduleRoam()
          return
        }

        // Pick random spot
        const currentSpot = FLOOR_SPOTS.findIndex(
          s => Math.abs(s.x - position.x) < 5 && Math.abs(s.y - position.y) < 5
        )
        
        let targetIdx = Math.floor(Math.random() * FLOOR_SPOTS.length)
        while (targetIdx === currentSpot) {
          targetIdx = Math.floor(Math.random() * FLOOR_SPOTS.length)
        }

        const target = FLOOR_SPOTS[targetIdx]
        const walkState = calculateWalkDirection(position.x, position.y, target.x, target.y)

        setPosition(prev => ({
          ...prev,
          state: walkState,
          targetSpot: targetIdx,
        }))

        scheduleRoam()
      }, delay)
    }

    scheduleRoam()

    return () => {
      if (roamTimerRef.current) clearTimeout(roamTimerRef.current)
    }
  }, [position.x, position.y])

  // Movement during walk animation
  useEffect(() => {
    if (!position.state.startsWith('walk') || position.targetSpot === null) {
      return
    }

    const target = FLOOR_SPOTS[position.targetSpot]
    const speed = 0.5 // percent per frame

    const interval = setInterval(() => {
      setPosition(prev => {
        const dx = target.x - prev.x
        const dy = target.y - prev.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 1) {
          // Arrived! Return to idle
          return {
            ...prev,
            x: target.x,
            y: target.y,
            state: 'sitIdle',
            targetSpot: null,
          }
        }

        // Move towards target
        const moveX = (dx / dist) * speed
        const moveY = (dy / dist) * speed

        return {
          ...prev,
          x: prev.x + moveX,
          y: prev.y + moveY,
        }
      })
    }, 1000 / 8) // 8 FPS movement update

    return () => clearInterval(interval)
  }, [position.state, position.targetSpot])

  const triggerAction = (newState: CatState) => {
    setPosition(prev => ({
      ...prev,
      state: newState,
      targetSpot: null, // Cancel any roaming
    }))
  }

  const onAnimationComplete = () => {
    if (!position.state.startsWith('walk')) {
      setPosition(prev => ({ ...prev, state: 'sitIdle' }))
    }
  }

  return {
    position,
    triggerAction,
    onAnimationComplete,
  }
}

function calculateWalkDirection(x1: number, y1: number, x2: number, y2: number): CatState {
  const dx = x2 - x1
  const dy = y2 - y1

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'walkRight' : 'walkLeft'
  } else {
    return dy > 0 ? 'walkDown' : 'walkUp'
  }
}
