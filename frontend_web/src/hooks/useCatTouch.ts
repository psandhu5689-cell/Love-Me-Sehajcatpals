/**
 * COMPREHENSIVE CAT TOUCH INTERACTION SYSTEM
 * Tap, double-tap, hold, drag with NO SLIDING enforcement
 */

import { useRef, useEffect, useState } from 'react'

type TouchZone = 'head' | 'nose' | 'body' | 'tail' | 'none'

interface TouchInteraction {
  type: 'tap' | 'doubleTap' | 'hold' | 'drag' | 'longPress'
  zone: TouchZone
  position: { x: number; y: number }
  duration?: number
}

interface UseCatTouchProps {
  catId: string
  onInteraction: (interaction: TouchInteraction) => void
  bounds: DOMRect | null
}

export function useCatTouch({ catId, onInteraction, bounds }: UseCatTouchProps) {
  const touchStartTime = useRef<number>(0)
  const touchStartPos = useRef<{ x: number; y: number } | null>(null)
  const lastTapTime = useRef<number>(0)
  const holdTimer = useRef<NodeJS.Timeout | null>(null)
  const isDragging = useRef(false)
  const [petMeter, setPetMeter] = useState(0)

  const detectZone = (localX: number, localY: number): TouchZone => {
    if (!bounds) return 'none'
    
    const relX = localX / bounds.width
    const relY = localY / bounds.height

    // Head zone (top 30%)
    if (relY < 0.3) return 'head'
    
    // Nose zone (center-top, small area)
    if (relY >= 0.3 && relY < 0.5 && relX >= 0.35 && relX <= 0.65) return 'nose'
    
    // Tail zone (bottom-right for right-facing, bottom-left for left-facing)
    if (relY > 0.7 && (relX < 0.2 || relX > 0.8)) return 'tail'
    
    // Body (everything else)
    return 'body'
  }

  const handleTouchStart = (e: TouchEvent | MouseEvent) => {
    const touch = 'touches' in e ? e.touches[0] : e
    touchStartTime.current = Date.now()
    touchStartPos.current = { x: touch.clientX, y: touch.clientY }
    isDragging.current = false
    setPetMeter(0)

    // Start hold timer (700ms for pick up)
    holdTimer.current = setTimeout(() => {
      if (!isDragging.current) {
        const zone = bounds ? detectZone(
          touch.clientX - bounds.left,
          touch.clientY - bounds.top
        ) : 'none'
        
        onInteraction({
          type: 'longPress',
          zone,
          position: { x: touch.clientX, y: touch.clientY },
          duration: 700,
        })
      }
    }, 700)
  }

  const handleTouchMove = (e: TouchEvent | MouseEvent) => {
    if (!touchStartPos.current) return
    
    const touch = 'touches' in e ? e.touches[0] : e
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x)
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y)

    // Drag threshold
    if (deltaX > 10 || deltaY > 10) {
      isDragging.current = true
      if (holdTimer.current) {
        clearTimeout(holdTimer.current)
        holdTimer.current = null
      }

      onInteraction({
        type: 'drag',
        zone: 'body',
        position: { x: touch.clientX, y: touch.clientY },
      })
      
      // Increment pet meter if holding in place
      if (deltaX < 5 && deltaY < 5) {
        setPetMeter(prev => Math.min(prev + 2, 100))
      }
    }
  }

  const handleTouchEnd = (e: TouchEvent | MouseEvent) => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current)
      holdTimer.current = null
    }

    const duration = Date.now() - touchStartTime.current
    
    if (!isDragging.current && duration < 300) {
      // Check for double tap
      const timeSinceLastTap = Date.now() - lastTapTime.current
      
      if (timeSinceLastTap < 300) {
        // Double tap
        const zone = bounds && touchStartPos.current ? detectZone(
          touchStartPos.current.x - bounds.left,
          touchStartPos.current.y - bounds.top
        ) : 'none'
        
        onInteraction({
          type: 'doubleTap',
          zone,
          position: touchStartPos.current!,
        })
        
        lastTapTime.current = 0 // Reset
      } else {
        // Single tap
        const zone = bounds && touchStartPos.current ? detectZone(
          touchStartPos.current.x - bounds.left,
          touchStartPos.current.y - bounds.top
        ) : 'none'
        
        onInteraction({
          type: 'tap',
          zone,
          position: touchStartPos.current!,
        })
        
        lastTapTime.current = Date.now()
      }
    } else if (duration >= 300 && duration < 700 && !isDragging.current) {
      // Hold (pet)
      const zone = bounds && touchStartPos.current ? detectZone(
        touchStartPos.current.x - bounds.left,
        touchStartPos.current.y - bounds.top
      ) : 'none'
      
      onInteraction({
        type: 'hold',
        zone,
        position: touchStartPos.current!,
        duration,
      })
    }

    // Check if pet meter filled
    if (petMeter >= 100) {
      onInteraction({
        type: 'hold',
        zone: 'body',
        position: touchStartPos.current!,
        duration: 1000,
      })
    }

    touchStartPos.current = null
    isDragging.current = false
    setPetMeter(0)
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    petMeter,
    isDragging: isDragging.current,
  }
}

// Detect distance between two cats for drag-apart sadness
export function detectDragApartSadness(
  prabh: { x: number; y: number },
  sehaj: { x: number; y: number }
): 'normal' | 'warning' | 'sad' | 'reunited' {
  const dx = prabh.x - sehaj.x
  const dy = prabh.y - sehaj.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance > 200) return 'sad'
  if (distance > 140) return 'warning'
  if (distance < 120) return 'reunited'
  return 'normal'
}
