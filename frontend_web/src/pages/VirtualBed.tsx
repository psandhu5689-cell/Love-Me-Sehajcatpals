/**
 * MR AND MRS - Virtual Cat Scene
 * COMPLETE INTEGRATION with game-grade animations, NO SLIDING, touch interactions, and compact UI
 */

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBackOutline, IoVolumeHigh, IoVolumeMute } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'
import { Howl } from 'howler'

// NEW: Our complete system
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
  const [lightsOut, setLightsOut] = useState(false)
  const [lightsDimmed, setLightsDimmed] = useState(false)
  const [chaosText, setChaosText] = useState<string>('')
  const [showChaos, setShowChaos] = useState(false)
  
  // Room decor states
  const [lampOn, setLampOn] = useState(true)
  const [lightsOn, setLightsOn] = useState(true)
  
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
      hogBlanket: 'annoyed',
      gaming: 'happy',
      treatToss: 'eat',
    }

    // Special actions
    if (action === 'lightsOut') {
      setLightsOut(true)
      setLightsDimmed(true)
      setLightsOn(false)
      setTimeout(() => {
        setLightsOut(false)
        setLightsDimmed(false)
        setLightsOn(true)
      }, 2500)
    } else if (action === 'drama') {
      setPrabhBubble('😡')
      setSehajBubble('😡')
      setTimeout(() => {
        setPrabhBubble('')
        setSehajBubble('')
      }, 2500)
    } else if (action === 'chaos') {
      // CHAOS SEQUENCE
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
      background: 'transparent',
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
            gap: 8,
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

      {/* Main Title */}
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
      {/* ROOM_VIEW: Complete Living Space */}
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
          height: 500,
          overflow: 'hidden',
          borderRadius: 24,
        }}>
          {/* Lights Out Overlay */}
          <AnimatePresence>
            {lightsOut && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'black',
                  zIndex: 105,
                  pointerEvents: 'none',
                }}
              />
            )}
          </AnimatePresence>

          {/* Z-PLANE 90: WALL */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '55%',
            background: 'linear-gradient(180deg, #FFB6C1 0%, #FFC0CB 100%)',
            zIndex: 90,
          }} />

          {/* Z-PLANE 100: WALL DECOR - Window with Rain */}
          <div style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 120,
            height: 100,
            borderRadius: 8,
            overflow: 'hidden',
            border: '4px solid #FFFFFF',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 100,
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 100%)',
              position: 'relative',
            }}>
              {/* Rain drops */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 1.5 + Math.random(),
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                  style={{
                    position: 'absolute',
                    left: `${15 + i * 15}%`,
                    width: 2,
                    height: 15,
                    background: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: 2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Z-PLANE 100: String Lights */}
          <div style={{
            position: 'absolute',
            top: 10,
            left: 0,
            right: 0,
            height: 30,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 100,
          }}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: lightsOn ? [0.5, 1, 0.5] : 0.2,
                  scale: lightsOn ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                onClick={() => {
                  setLightsOn(!lightsOn)
                  haptics.light()
                }}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: ['#FFD700', '#FF69B4', '#87CEEB', '#98FB98'][i % 4],
                  boxShadow: lightsOn ? `0 0 10px ${['#FFD700', '#FF69B4', '#87CEEB', '#98FB98'][i % 4]}` : 'none',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>

          {/* Z-PLANE 50: FLOOR */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '45%',
            background: 'linear-gradient(180deg, #D2B48C 0%, #8B7355 100%)',
            zIndex: 50,
          }} />

          {/* Z-PLANE 60: RUG */}
          <div style={{
            position: 'absolute',
            bottom: 60,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '65%',
            maxWidth: 320,
            height: 120,
            background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)',
            borderRadius: 8,
            border: '3px solid #654321',
            zIndex: 60,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}>
            {/* Rug pattern */}
            <div style={{
              position: 'absolute',
              inset: 8,
              border: '2px solid #654321',
              borderRadius: 4,
            }} />
          </div>

          {/* Z-PLANE 60: SOFA */}
          <div style={{
            position: 'absolute',
            bottom: 65,
            left: 25,
            width: 70,
            height: 55,
            background: 'linear-gradient(135deg, #8B7355 0%, #6B5644 100%)',
            borderRadius: '40% 40% 15% 15%',
            border: '3px solid #5D4037',
            zIndex: 60,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}>
            {/* Cushion */}
            <div style={{
              position: 'absolute',
              top: 5,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
              height: 15,
              background: 'linear-gradient(180deg, #A0826D 0%, #8B7355 100%)',
              borderRadius: 8,
            }} />
          </div>

          {/* Z-PLANE 60: LAMP with Glow */}
          <div
            onClick={() => {
              setLampOn(!lampOn)
              haptics.light()
            }}
            style={{
              position: 'absolute',
              bottom: 60,
              right: 35,
              cursor: 'pointer',
              zIndex: 60,
            }}
          >
            {/* Lamp base */}
            <div style={{
              width: 30,
              height: 50,
              background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 100%)',
              borderRadius: '50% 50% 0 0',
              position: 'relative',
            }}>
              {/* Lamp shade */}
              <div style={{
                position: 'absolute',
                top: -15,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 35,
                height: 20,
                background: lampOn ? '#FFD700' : '#666',
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
              }} />
            </div>
            
            {/* Glow effect when on */}
            {lampOn && (
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  top: -30,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>

          {/* Z-PLANE 70: CATS */}
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
              top: `${prabhCat.position.y}%`,
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
              scale={2.0}
            />
            {prabhBubble && (
              <motion.div
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: -10 }}
                style={{
                  position: 'absolute',
                  top: -35,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'white',
                  borderRadius: 12,
                  padding: '4px 8px',
                  fontSize: 18,
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
              top: `${sehajCat.position.y}%`,
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
              scale={2.0}
            />
            {sehajBubble && (
              <motion.div
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: -10 }}
                style={{
                  position: 'absolute',
                  top: -35,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'white',
                  borderRadius: 12,
                  padding: '4px 8px',
                  fontSize: 18,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                {sehajBubble}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* NEW COMPACT UI */}
      <CompactCatUI
        onAction={handleAction}
        prabhState={prabhCat.position.state}
        sehajState={sehajCat.position.state}
      />
    </div>
  )
}
