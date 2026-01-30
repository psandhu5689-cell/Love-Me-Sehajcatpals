/**
 * MR & MRS - Clean Room Remake
 * ONLY: Wall + Floor + Cats + Blanket + Compact UI
 * NO: Window, rain, furniture, decorations
 */

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBackOutline, IoVolumeHigh, IoVolumeMute } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'

// NEW: Complete animation system
import { CatSprite, CatState } from '../components/CatSprite'
import { CompactCatUI } from '../components/CompactCatUI'
import { useCatMovement } from '../hooks/useCatMovement'
import { useCatTouch, detectDragApartSadness } from '../hooks/useCatTouch'

export default function VirtualBed() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  
  // Audio
  const [audioEnabled, setAudioEnabled] = useState(true)
  
  // NEW: Cat movement with NO SLIDING
  const prabhCat = useCatMovement('prabh')
  const sehajCat = useCatMovement('sehaj')
  
  // UI states
  const [prabhBubble, setPrabhBubble] = useState<string>('')
  const [sehajBubble, setSehajBubble] = useState<string>('')
  const [dimLights, setDimLights] = useState(false)
  const [chaosText, setChaosText] = useState<string>('')
  const [showChaos, setShowChaos] = useState(false)
  
  // Blanket state for Hog Blanket mechanic
  const [blanketShift, setBlanketShift] = useState(0) // -1 = left, 0 = center, 1 = right
  
  // Refs for touch
  const prabhRef = useRef<HTMLDivElement>(null)
  const sehajRef = useRef<HTMLDivElement>(null)

  // Drag-apart sadness detection
  useEffect(() => {
    const interval = setInterval(() => {
      const status = detectDragApartSadness(
        { x: prabhCat.position.x, y: prabhCat.position.y },
        { x: sehajCat.position.x, y: sehajCat.position.y }
      )

      if (status === 'sad') {
        prabhCat.triggerAction('sad')
        sehajCat.triggerAction('sad')
        setPrabhBubble('🥺')
        setSehajBubble('😿')
        setTimeout(() => {
          setPrabhBubble('')
          setSehajBubble('')
        }, 8000)
      } else if (status === 'reunited') {
        if (prabhCat.position.state === 'sad') {
          prabhCat.triggerAction('happy')
          sehajCat.triggerAction('happy')
          setPrabhBubble('💕')
          setSehajBubble('💕')
          setTimeout(() => {
            setPrabhBubble('')
            setSehajBubble('')
          }, 3000)
        }
      }
    }, 500)

    return () => clearInterval(interval)
  }, [prabhCat.position, sehajCat.position])

  // Touch handlers for Prabh
  const prabhTouch = useCatTouch({
    catId: 'prabh',
    onInteraction: (interaction) => {
      haptics.light()
      if (interaction.type === 'tap') {
        if (interaction.zone === 'head') {
          prabhCat.triggerAction('happy')
          setPrabhBubble('💖')
          setTimeout(() => setPrabhBubble(''), 2000)
        } else if (interaction.zone === 'nose') {
          prabhCat.triggerAction('surprised')
          setPrabhBubble('!')
          setTimeout(() => setPrabhBubble(''), 1500)
        } else if (interaction.zone === 'body') {
          prabhCat.triggerAction('purr')
          setPrabhBubble('😊')
          setTimeout(() => setPrabhBubble(''), 2000)
        } else if (interaction.zone === 'tail') {
          prabhCat.triggerAction('tailFlick')
          setPrabhBubble('💢')
          setTimeout(() => setPrabhBubble(''), 1500)
        }
      } else if (interaction.type === 'doubleTap') {
        prabhCat.triggerAction('bounce')
        setPrabhBubble('🎵')
        setTimeout(() => setPrabhBubble(''), 2000)
      } else if (interaction.type === 'longPress') {
        prabhCat.triggerAction('pickUp')
        setPrabhBubble('👆')
        setTimeout(() => setPrabhBubble(''), 1500)
      }
    },
    bounds: prabhRef.current?.getBoundingClientRect() || null,
  })

  // Touch handlers for Sehaj
  const sehajTouch = useCatTouch({
    catId: 'sehaj',
    onInteraction: (interaction) => {
      haptics.light()
      if (interaction.type === 'tap') {
        if (interaction.zone === 'head') {
          sehajCat.triggerAction('happy')
          setSehajBubble('💖')
          setTimeout(() => setSehajBubble(''), 2000)
        } else if (interaction.zone === 'nose') {
          sehajCat.triggerAction('surprised')
          setSehajBubble('!')
          setTimeout(() => setSehajBubble(''), 1500)
        } else if (interaction.zone === 'body') {
          sehajCat.triggerAction('purr')
          setSehajBubble('😊')
          setTimeout(() => setSehajBubble(''), 2000)
        } else if (interaction.zone === 'tail') {
          sehajCat.triggerAction('tailFlick')
          setSehajBubble('💢')
          setTimeout(() => setSehajBubble(''), 1500)
        }
      } else if (interaction.type === 'doubleTap') {
        sehajCat.triggerAction('bounce')
        setSehajBubble('🎵')
        setTimeout(() => setSehajBubble(''), 2000)
      } else if (interaction.type === 'longPress') {
        sehajCat.triggerAction('pickUp')
        setSehajBubble('👆')
        setTimeout(() => setSehajBubble(''), 1500)
      }
    },
    bounds: sehajRef.current?.getBoundingClientRect() || null,
  })

  // Action handler for CompactCatUI
  const handleAction = (action: string, target: 'prabh' | 'sehaj' | 'both') => {
    haptics.light()
    
    const stateMap: Record<string, CatState> = {
      wake: 'wake',
      sleep: 'sleep',
      feed: 'eat',
      pet: 'happy',
      nudge: 'happy',
      kick: 'annoyed',
      cuddle: 'happy',
      drama: 'annoyed',
      lightsOut: 'surprised',
      chaos: 'chaos',
      gaming: 'happy',
      treatToss: 'eat',
    }

    // Special actions
    if (action === 'lightsOut') {
      setDimLights(true)
      setTimeout(() => setDimLights(false), 2500)
    } else if (action === 'hogBlanket') {
      // Hog Blanket: shift blanket left or right based on which cat
      if (target === 'prabh') {
        setBlanketShift(1) // Shift right (Prabh side)
      } else if (target === 'sehaj') {
        setBlanketShift(-1) // Shift left (Sehaj side)
      } else {
        setBlanketShift(0) // Reset to center
      }
      setTimeout(() => setBlanketShift(0), 3000) // Reset after 3s
    } else if (action === 'drama') {
      setPrabhBubble('😡')
      setSehajBubble('😡')
      setTimeout(() => {
        setPrabhBubble('')
        setSehajBubble('')
      }, 2500)
    } else if (action === 'chaos') {
      const chaosLines = [
        "OH MY GOD WHAT'S HAPPENING",
        "THEY'RE FIGHTING AGAIN",
        "SOMEONE STOP THEM",
        "THIS IS PURE CHAOS",
        "WHY ARE THEY LIKE THIS"
      ]
      setChaosText(chaosLines[Math.floor(Math.random() * chaosLines.length)])
      setShowChaos(true)
      
      setTimeout(() => {
        setShowChaos(false)
        setChaosText('')
      }, 2500)
    }

    const state = stateMap[action] || 'sitIdle'

    if (target === 'prabh' || target === 'both') {
      prabhCat.triggerAction(state)
    }
    if (target === 'sehaj' || target === 'both') {
      sehajCat.triggerAction(state)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#1a1a2e',
      padding: 24,
      position: 'relative',
      overflow: 'auto',
      paddingBottom: 160,
    }}>
      {/* Chaos Overlay */}
      <AnimatePresence>
        {showChaos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.9)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              style={{
                color: 'white',
                fontSize: 32,
                fontWeight: 'bold',
                textAlign: 'center',
                textShadow: '0 0 20px rgba(255,0,0,0.8)',
                padding: 20,
              }}
            >
              {chaosText}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Controls */}
      <div style={{
        position: 'fixed',
        top: 20,
        left: 20,
        right: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
      }}>
        <button
          onClick={() => {
            haptics.light()
            navigate('/ideas')
          }}
          style={{
            background: colors.glass,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
            padding: 12,
            color: colors.textPrimary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IoChevronBackOutline size={20} />
        </button>

        <button
          onClick={() => {
            setAudioEnabled(!audioEnabled)
            haptics.light()
          }}
          style={{
            background: colors.glass,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
            padding: 12,
            color: colors.textPrimary,
            cursor: 'pointer',
          }}
        >
          {audioEnabled ? <IoVolumeHigh size={20} /> : <IoVolumeMute size={20} />}
        </button>
      </div>

      {/* Title */}
      <h1 style={{
        textAlign: 'center',
        color: colors.textPrimary,
        fontSize: 32,
        marginBottom: 20,
        marginTop: 80,
      }}>
        Mr & Mrs 🐱💕🐱
      </h1>

      {/* ============================================ */}
      {/* ROOM_VIEW: ONLY Wall + Floor + Cats + Blanket */}
      {/* ============================================ */}
      <motion.div
        id="room-view"
        style={{
          background: colors.glass,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colors.border}`,
          borderRadius: 24,
          padding: 0,
          position: 'relative',
          boxShadow: `0 8px 32px ${colors.primaryGlow}`,
          overflow: 'hidden',
          marginBottom: 20,
          maxWidth: 800,
          margin: '0 auto 20px',
        }}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          height: 600,
          overflow: 'hidden',
          borderRadius: 24,
        }}>
          {/* Dim Lights Overlay - dims EVERYTHING */}
          <AnimatePresence>
            {dimLights && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'black',
                  zIndex: 200,
                  pointerEvents: 'none',
                }}
              />
            )}
          </AnimatePresence>

          {/* Z-PLANE 10: WALL (Top half) */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '50%',
            backgroundImage: 'url(/wall.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 10,
          }} />

          {/* Z-PLANE 50: FLOOR (Bottom half) */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '50%',
            backgroundImage: 'url(/floor.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 50,
          }} />

          {/* Z-PLANE 70: CATS (on floor only) */}
          {/* Prabh (Black Cat) */}
          <div
            ref={prabhRef}
            onMouseDown={prabhTouch.handleTouchStart}
            onMouseMove={prabhTouch.handleTouchMove}
            onMouseUp={prabhTouch.handleTouchEnd}
            onTouchStart={prabhTouch.handleTouchStart as any}
            onTouchMove={prabhTouch.handleTouchMove as any}
            onTouchEnd={prabhTouch.handleTouchEnd as any}
            style={{
              position: 'absolute',
              left: `${prabhCat.position.x}%`,
              top: `${50 + (prabhCat.position.y / 2)}%`, // Floor starts at 50%, map 0-100 to 50-100
              transform: 'translate(-50%, -50%)',
              zIndex: 70,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <CatSprite
              cat="prabh"
              state={prabhCat.position.state}
              onAnimationComplete={prabhCat.onAnimationComplete}
              flip={prabhCat.position.state === 'walkLeft'}
              scale={2.5}
            />
            {prabhBubble && (
              <motion.div
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: -10 }}
                style={{
                  position: 'absolute',
                  top: -40,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'white',
                  borderRadius: 12,
                  padding: '6px 10px',
                  fontSize: 20,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                {prabhBubble}
              </motion.div>
            )}
          </div>

          {/* Sehaj (Ginger Cat) */}
          <div
            ref={sehajRef}
            onMouseDown={sehajTouch.handleTouchStart}
            onMouseMove={sehajTouch.handleTouchMove}
            onMouseUp={sehajTouch.handleTouchEnd}
            onTouchStart={sehajTouch.handleTouchStart as any}
            onTouchMove={sehajTouch.handleTouchMove as any}
            onTouchEnd={sehajTouch.handleTouchEnd as any}
            style={{
              position: 'absolute',
              left: `${sehajCat.position.x}%`,
              top: `${50 + (sehajCat.position.y / 2)}%`, // Floor starts at 50%, map 0-100 to 50-100
              transform: 'translate(-50%, -50%)',
              zIndex: 70,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <CatSprite
              cat="sehaj"
              state={sehajCat.position.state}
              onAnimationComplete={sehajCat.onAnimationComplete}
              flip={sehajCat.position.state === 'walkLeft'}
              scale={2.5}
            />
            {sehajBubble && (
              <motion.div
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: -10 }}
                style={{
                  position: 'absolute',
                  top: -40,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'white',
                  borderRadius: 12,
                  padding: '6px 10px',
                  fontSize: 20,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                {sehajBubble}
              </motion.div>
            )}
          </div>

          {/* Z-PLANE 80: BLANKET OVERLAY (for Hog Blanket mechanic) */}
          <motion.div
            animate={{
              x: blanketShift * 60, // Shift left/right by 60px
            }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              bottom: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 200,
              height: 120,
              background: 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 50%, #FFB6C1 100%)',
              borderRadius: 16,
              border: '3px solid #FF69B4',
              zIndex: 80,
              opacity: 0.7,
              boxShadow: '0 4px 12px rgba(255,105,180,0.4)',
            }}
          >
            {/* Blanket texture pattern */}
            <div style={{
              position: 'absolute',
              inset: 8,
              border: '2px dashed rgba(255,255,255,0.4)',
              borderRadius: 12,
            }} />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 40,
              opacity: 0.6,
            }}>
              🧣
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* CONTROL_PANEL: Compact UI */}
      {/* ============================================ */}
      <CompactCatUI
        onAction={handleAction}
        prabhState={prabhCat.position.state}
        sehajState={sehajCat.position.state}
      />
    </div>
  )
}
