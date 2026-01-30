/**
 * TOY SPRITE COMPONENT - Animated draggable toy
 * 
 * Supports states: idle, dragged, wobble, bounce, angryShake, sparkle, spin
 */

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Toy, ToyState } from '../hooks/useToys'

interface ToySpriteProps {
  toy: Toy
  isDragged: boolean
  containerRef: React.RefObject<HTMLDivElement>
  onDragStart: (toyId: number, clientX: number, clientY: number) => void
  onDragMove: (toyId: number, rect: DOMRect, clientX: number, clientY: number) => void
  onDragEnd: (toyId: number) => void
  onTap: (toyId: number) => void
}

// Animation variants for different states
const getAnimationStyle = (state: ToyState, isDragged: boolean) => {
  if (isDragged) {
    return {
      scale: 1.1,
      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
    }
  }
  
  switch (state) {
    case 'wobble':
      return { rotate: [0, -3, 3, -3, 3, 0], transition: { duration: 0.5 } }
    case 'bounce':
      return { y: [0, -8, 0], transition: { duration: 0.3 } }
    case 'angryShake':
      return { x: [0, -4, 4, -4, 4, -4, 4, 0], transition: { duration: 0.5 } }
    case 'sparkle':
      return { scale: [1, 1.1, 1], transition: { duration: 0.4 } }
    case 'spin':
      return { rotate: 360, transition: { duration: 1 } }
    default:
      return { scale: 1, rotate: 0 }
  }
}

export function ToySprite({
  toy,
  isDragged,
  containerRef,
  onDragStart,
  onDragMove,
  onDragEnd,
  onTap,
}: ToySpriteProps) {
  const toyRef = useRef<HTMLDivElement>(null)
  const [showSparkle, setShowSparkle] = useState(false)
  const tapStartRef = useRef<{ x: number; y: number; time: number } | null>(null)

  // Show sparkle effect
  useEffect(() => {
    if (toy.state === 'sparkle' || toy.state === 'bounce') {
      setShowSparkle(true)
      const timer = setTimeout(() => setShowSparkle(false), 600)
      return () => clearTimeout(timer)
    }
  }, [toy.state])

  // Handle pointer down (mouse or touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const clientX = e.clientX
    const clientY = e.clientY
    
    tapStartRef.current = { x: clientX, y: clientY, time: Date.now() }
    onDragStart(toy.id, clientX, clientY)
    
    // Capture pointer for smoother dragging
    if (toyRef.current) {
      toyRef.current.setPointerCapture(e.pointerId)
    }
  }

  // Handle pointer move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragged) return
    e.preventDefault()
    e.stopPropagation()
    
    const container = containerRef.current
    if (!container) return
    
    const rect = container.getBoundingClientRect()
    onDragMove(toy.id, rect, e.clientX, e.clientY)
  }

  // Handle pointer up
  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Check if it was a tap (minimal movement, short duration)
    if (tapStartRef.current) {
      const dx = Math.abs(e.clientX - tapStartRef.current.x)
      const dy = Math.abs(e.clientY - tapStartRef.current.y)
      const duration = Date.now() - tapStartRef.current.time
      
      if (dx < 5 && dy < 5 && duration < 200) {
        onTap(toy.id)
      }
    }
    
    onDragEnd(toy.id)
    tapStartRef.current = null
    
    // Release pointer
    if (toyRef.current) {
      toyRef.current.releasePointerCapture(e.pointerId)
    }
  }

  const animStyle = getAnimationStyle(toy.state, isDragged)
  const toySize = 79 // Base size in pixels - 20% bigger (was 66)

  return (
    <motion.div
      ref={toyRef}
      animate={animStyle}
      style={{
        position: 'absolute',
        left: `${toy.x}%`,
        top: `${toy.y}%`,
        transform: 'translate(-50%, -50%)',
        width: toySize,
        height: toySize,
        zIndex: toy.zIndex,
        cursor: isDragged ? 'grabbing' : 'grab',
        touchAction: 'none',
        userSelect: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <img
        src={toy.image}
        alt={toy.name}
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          imageRendering: 'pixelated',
          pointerEvents: 'none',
          filter: isDragged ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none',
        }}
      />
      
      {/* Sparkle effect */}
      {showSparkle && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: -15 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 20,
            pointerEvents: 'none',
          }}
        >
          ✨
        </motion.div>
      )}
    </motion.div>
  )
}
