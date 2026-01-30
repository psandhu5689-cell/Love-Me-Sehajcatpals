/**
 * MR & MRS - Complete Interactive Room
 * FIXED: Wall/Floor seam, Cat sprites render, All buttons interactive
 * NEW: Pixel blanket image, 8 draggable toys with cat reactions
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBackOutline, IoVolumeHigh, IoVolumeMute } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'

import { CatSprite, CatState } from '../components/CatSprite'
import { CompactCatUI } from '../components/CompactCatUI'
import { ToySprite } from '../components/ToySprite'
import { useCatMovement } from '../hooks/useCatMovement'
import { useCatTouch, detectDragApartSadness } from '../hooks/useCatTouch'
import { useToys, CatReaction } from '../hooks/useToys'

type Effect = {
  id: string
  type: 'heart' | 'angry' | 'sparkle' | 'z' | 'exclaim' | 'treat' | 'yarn' | 'confetti'
  x: number
  y: number
  timestamp: number
}

export default function VirtualBed() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  
  const [audioEnabled, setAudioEnabled] = useState(true)
  
  const prabhCat = useCatMovement('prabh')
  const sehajCat = useCatMovement('sehaj')
  
  const [prabhBubble, setPrabhBubble] = useState<string>('')
  const [sehajBubble, setSehajBubble] = useState<string>('')
  const [dimLights, setDimLights] = useState(false)
  const [chaosText, setChaosText] = useState<string>('')
  const [showChaos, setShowChaos] = useState(false)
  
  const [blanketShift, setBlanketShift] = useState(0)
  const [effects, setEffects] = useState<Effect[]>([])
  
  const prabhRef = useRef<HTMLDivElement>(null)
  const sehajRef = useRef<HTMLDivElement>(null)
  const floorRef = useRef<HTMLDivElement>(null)

  // Handle cat reactions from toys
  const handleToyReaction = useCallback((reaction: CatReaction) => {
    haptics.light()
    if (reaction.type === 'angry') {
      if (reaction.cat === 'prabh') {
        prabhCat.triggerAction('annoyed')
        setPrabhBubble('😡')
        spawnEffect('angry', prabhCat.position.x, prabhCat.position.y)
        setTimeout(() => setPrabhBubble(''), 1200)
      } else {
        sehajCat.triggerAction('annoyed')
        setSehajBubble('😡')
        spawnEffect('angry', sehajCat.position.x, sehajCat.position.y)
        setTimeout(() => setSehajBubble(''), 1200)
      }
    } else if (reaction.type === 'happy') {
      if (reaction.cat === 'prabh') {
        prabhCat.triggerAction('happy')
        setPrabhBubble('💕')
        spawnEffect('heart', prabhCat.position.x, prabhCat.position.y)
        setTimeout(() => setPrabhBubble(''), 1200)
      } else {
        sehajCat.triggerAction('happy')
        setSehajBubble('💕')
        spawnEffect('heart', sehajCat.position.x, sehajCat.position.y)
        setTimeout(() => setSehajBubble(''), 1200)
      }
    }
  }, [prabhCat, sehajCat])

  // Toy system with cat reactions
  const toySystem = useToys({
    onCatReaction: handleToyReaction
  })

  // Clean up old effects
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setEffects(prev => prev.filter(e => now - e.timestamp < 3000))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Drag-apart sadness
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
        setTimeout(() => { setPrabhBubble(''); setSehajBubble('') }, 8000)
      } else if (status === 'reunited' && prabhCat.position.state === 'sad') {
        prabhCat.triggerAction('happy')
        sehajCat.triggerAction('happy')
        setPrabhBubble('💕')
        setSehajBubble('💕')
        setTimeout(() => { setPrabhBubble(''); setSehajBubble('') }, 3000)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [prabhCat.position, sehajCat.position])

  const spawnEffect = (type: Effect['type'], x: number, y: number) => {
    setEffects(prev => [...prev, { id: Math.random().toString(), type, x, y, timestamp: Date.now() }])
  }

  const prabhTouch = useCatTouch({
    catId: 'prabh',
    onInteraction: (interaction) => {
      haptics.light()
      if (interaction.type === 'tap') {
        if (interaction.zone === 'head') {
          prabhCat.triggerAction('happy')
          setPrabhBubble('💖')
          spawnEffect('heart', prabhCat.position.x, prabhCat.position.y)
          setTimeout(() => setPrabhBubble(''), 2000)
        } else if (interaction.zone === 'nose') {
          prabhCat.triggerAction('surprised')
          setPrabhBubble('!')
          spawnEffect('exclaim', prabhCat.position.x, prabhCat.position.y)
          setTimeout(() => setPrabhBubble(''), 1500)
        } else if (interaction.zone === 'body') {
          prabhCat.triggerAction('purr')
          setPrabhBubble('😊')
          spawnEffect('sparkle', prabhCat.position.x, prabhCat.position.y)
          setTimeout(() => setPrabhBubble(''), 2000)
        } else if (interaction.zone === 'tail') {
          prabhCat.triggerAction('tailFlick')
          setPrabhBubble('💢')
          spawnEffect('angry', prabhCat.position.x, prabhCat.position.y)
          setTimeout(() => setPrabhBubble(''), 1500)
        }
      } else if (interaction.type === 'doubleTap') {
        prabhCat.triggerAction('bounce')
        setPrabhBubble('🎵')
        spawnEffect('confetti', prabhCat.position.x, prabhCat.position.y)
        setTimeout(() => setPrabhBubble(''), 2000)
      }
    },
    bounds: prabhRef.current?.getBoundingClientRect() || null,
  })

  const sehajTouch = useCatTouch({
    catId: 'sehaj',
    onInteraction: (interaction) => {
      haptics.light()
      if (interaction.type === 'tap') {
        if (interaction.zone === 'head') {
          sehajCat.triggerAction('happy')
          setSehajBubble('💖')
          spawnEffect('heart', sehajCat.position.x, sehajCat.position.y)
          setTimeout(() => setSehajBubble(''), 2000)
        } else if (interaction.zone === 'nose') {
          sehajCat.triggerAction('surprised')
          setSehajBubble('!')
          spawnEffect('exclaim', sehajCat.position.x, sehajCat.position.y)
          setTimeout(() => setSehajBubble(''), 1500)
        } else if (interaction.zone === 'body') {
          sehajCat.triggerAction('purr')
          setSehajBubble('😊')
          spawnEffect('sparkle', sehajCat.position.x, sehajCat.position.y)
          setTimeout(() => setSehajBubble(''), 2000)
        } else if (interaction.zone === 'tail') {
          sehajCat.triggerAction('tailFlick')
          setSehajBubble('💢')
          spawnEffect('angry', sehajCat.position.x, sehajCat.position.y)
          setTimeout(() => setSehajBubble(''), 1500)
        }
      } else if (interaction.type === 'doubleTap') {
        sehajCat.triggerAction('bounce')
        setSehajBubble('🎵')
        spawnEffect('confetti', sehajCat.position.x, sehajCat.position.y)
        setTimeout(() => setSehajBubble(''), 2000)
      }
    },
    bounds: sehajRef.current?.getBoundingClientRect() || null,
  })

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

    // INTERACTIVE ACTIONS
    if (action === 'wake') {
      if (target === 'prabh' || target === 'both') {
        prabhCat.triggerAction('wake')
        spawnEffect('exclaim', prabhCat.position.x, prabhCat.position.y)
      }
      if (target === 'sehaj' || target === 'both') {
        sehajCat.triggerAction('wake')
        spawnEffect('exclaim', sehajCat.position.x, sehajCat.position.y)
      }
    } else if (action === 'sleep') {
      if (target === 'prabh' || target === 'both') {
        prabhCat.triggerAction('sleep')
        spawnEffect('z', prabhCat.position.x, prabhCat.position.y)
      }
      if (target === 'sehaj' || target === 'both') {
        sehajCat.triggerAction('sleep')
        spawnEffect('z', sehajCat.position.x, sehajCat.position.y)
      }
    } else if (action === 'feed') {
      if (target === 'prabh' || target === 'both') {
        prabhCat.triggerAction('eat')
        spawnEffect('treat', prabhCat.position.x, prabhCat.position.y)
      }
      if (target === 'sehaj' || target === 'both') {
        sehajCat.triggerAction('eat')
        spawnEffect('treat', sehajCat.position.x, sehajCat.position.y)
      }
    } else if (action === 'cuddle') {
      prabhCat.triggerAction('happy')
      sehajCat.triggerAction('happy')
      spawnEffect('heart', 50, 50)
    } else if (action === 'gaming') {
      if (target === 'prabh' || target === 'both') {
        prabhCat.triggerAction('happy')
        spawnEffect('sparkle', prabhCat.position.x, prabhCat.position.y)
      }
      if (target === 'sehaj' || target === 'both') {
        sehajCat.triggerAction('happy')
        spawnEffect('sparkle', sehajCat.position.x, sehajCat.position.y)
      }
    } else if (action === 'kick') {
      prabhCat.triggerAction('annoyed')
      sehajCat.triggerAction('annoyed')
      spawnEffect('angry', prabhCat.position.x, prabhCat.position.y)
      spawnEffect('angry', sehajCat.position.x, sehajCat.position.y)
    } else if (action === 'lightsOut') {
      setDimLights(true)
      prabhCat.triggerAction('surprised')
      sehajCat.triggerAction('surprised')
      setTimeout(() => setDimLights(false), 2500)
    } else if (action === 'hogBlanket') {
      // Prabh is on the left, Sehaj is on the right
      // Negative shift = move left towards Prabh
      // Positive shift = move right towards Sehaj
      if (target === 'prabh') setBlanketShift(-1)
      else if (target === 'sehaj') setBlanketShift(1)
      else setBlanketShift(0)
      setTimeout(() => setBlanketShift(0), 3000)
    } else if (action === 'drama') {
      prabhCat.triggerAction('annoyed')
      sehajCat.triggerAction('annoyed')
      setPrabhBubble('😡')
      setSehajBubble('😡')
      spawnEffect('angry', prabhCat.position.x, prabhCat.position.y)
      spawnEffect('angry', sehajCat.position.x, sehajCat.position.y)
      setTimeout(() => { setPrabhBubble(''); setSehajBubble('') }, 2500)
    } else if (action === 'chaos') {
      const chaosLines = [
        "OH MY GOD WHAT'S HAPPENING",
        "THEY'RE FIGHTING AGAIN",
        "SOMEONE STOP THEM",
        "THIS IS PURE CHAOS"
      ]
      setChaosText(chaosLines[Math.floor(Math.random() * chaosLines.length)])
      setShowChaos(true)
      prabhCat.triggerAction('chaos')
      sehajCat.triggerAction('chaos')
      setTimeout(() => { setShowChaos(false); setChaosText('') }, 2500)
    } else if (action === 'treatToss') {
      spawnEffect('treat', 50, 60)
    }

    const state = stateMap[action] || 'sitIdle'
    if (!['wake', 'sleep', 'feed', 'cuddle', 'gaming', 'kick', 'lightsOut', 'hogBlanket', 'drama', 'chaos', 'treatToss'].includes(action)) {
      if (target === 'prabh' || target === 'both') prabhCat.triggerAction(state)
      if (target === 'sehaj' || target === 'both') sehajCat.triggerAction(state)
    }
  }

  const renderEffect = (effect: Effect) => {
    const icons: Record<Effect['type'], string> = {
      heart: '💕',
      angry: '💢',
      sparkle: '✨',
      z: '💤',
      exclaim: '!',
      treat: '🍖',
      yarn: '🧶',
      confetti: '🎊'
    }

    return (
      <motion.div
        key={effect.id}
        initial={{ opacity: 0, scale: 0.5, y: 0 }}
        animate={{ opacity: 1, scale: 1.2, y: -30 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'absolute',
          left: `${effect.x}%`,
          top: `${effect.y}%`,
          fontSize: 28,
          pointerEvents: 'none',
          zIndex: 150,
        }}
      >
        {icons[effect.type]}
      </motion.div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#1a1a2e',
      padding: 24,
      position: 'relative',
      overflow: 'auto',
      paddingBottom: 40,
    }}>
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
          onClick={() => { haptics.light(); navigate('/ideas') }}
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
          onClick={() => { setAudioEnabled(!audioEnabled); haptics.light() }}
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

      <h1 style={{
        textAlign: 'center',
        color: colors.textPrimary,
        fontSize: 32,
        marginBottom: 20,
        marginTop: 80,
      }}>
        Mr & Mrs 🐱💕🐱
      </h1>

      {/* ROOM_VIEW - FIXED SEAM */}
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
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Dim Lights Overlay */}
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

        {/* WALL CONTAINER - NO OVERLAP */}
        <div style={{
          position: 'relative',
          width: '100%',
          margin: 0,
          padding: 0,
          lineHeight: 0,
          zIndex: 10,
        }}>
          <img
            src="/wall.jpg"
            alt="wall"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              margin: 0,
              padding: 0,
            }}
          />
        </div>

        {/* FLOOR CONTAINER - STARTS EXACTLY AT WALL BOTTOM */}
        <div 
          ref={floorRef}
          style={{
            position: 'relative',
            width: '100%',
            height: 400,
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            zIndex: 50,
          }}
        >
          <img
            src="/floor.jpg"
            alt="floor"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* === FLOOR DECORATIONS (Z55) - Behind toys but above floor === */}
          
          {/* RUG in center-back area */}
          <img
            src="/decor/rug.png"
            alt="rug"
            style={{
              position: 'absolute',
              top: '8%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 280,
              height: 100,
              objectFit: 'contain',
              imageRendering: 'pixelated',
              zIndex: 55,
              opacity: 0.9,
            }}
          />

          {/* Cat bed - left back corner */}
          <img
            src="/decor/cat_bed.png"
            alt="cat bed"
            style={{
              position: 'absolute',
              top: '5%',
              left: '8%',
              width: 90,
              height: 55,
              objectFit: 'contain',
              imageRendering: 'pixelated',
              zIndex: 56,
            }}
          />

          {/* Cat bed - right back corner */}
          <img
            src="/decor/cat_bed.png"
            alt="cat bed"
            style={{
              position: 'absolute',
              top: '5%',
              right: '8%',
              width: 90,
              height: 55,
              objectFit: 'contain',
              imageRendering: 'pixelated',
              zIndex: 56,
              transform: 'scaleX(-1)', // Flip for variety
            }}
          />

          {/* Cat tree - left side */}
          <img
            src="/decor/cat_tree.png"
            alt="cat tree"
            style={{
              position: 'absolute',
              top: '2%',
              left: '25%',
              width: 70,
              height: 110,
              objectFit: 'contain',
              imageRendering: 'pixelated',
              zIndex: 57,
            }}
          />

          {/* Food bowl station - back center-left */}
          <div style={{
            position: 'absolute',
            top: '12%',
            left: '38%',
            display: 'flex',
            gap: 8,
            zIndex: 56,
          }}>
            <img
              src="/decor/food_bowl.png"
              alt="food bowl"
              style={{
                width: 45,
                height: 32,
                objectFit: 'contain',
                imageRendering: 'pixelated',
              }}
            />
            <img
              src="/decor/water_bowl.png"
              alt="water bowl"
              style={{
                width: 45,
                height: 32,
                objectFit: 'contain',
                imageRendering: 'pixelated',
              }}
            />
          </div>

          {/* Extra toys in back - yarn ball */}
          <img
            src="/decor/yarn_ball.png"
            alt="yarn ball"
            style={{
              position: 'absolute',
              top: '18%',
              right: '30%',
              width: 35,
              height: 35,
              objectFit: 'contain',
              imageRendering: 'pixelated',
              zIndex: 56,
            }}
          />

          {/* Mouse toy - back right */}
          <img
            src="/decor/mouse_toy.png"
            alt="mouse toy"
            style={{
              position: 'absolute',
              top: '15%',
              right: '18%',
              width: 40,
              height: 22,
              objectFit: 'contain',
              imageRendering: 'pixelated',
              zIndex: 56,
            }}
          />

          {/* Feather toy - left side */}
          <img
            src="/decor/feather_toy.png"
            alt="feather toy"
            style={{
              position: 'absolute',
              top: '20%',
              left: '12%',
              width: 28,
              height: 55,
              objectFit: 'contain',
              imageRendering: 'pixelated',
              zIndex: 56,
            }}
          />

          {/* === END DECORATIONS === */}

          {/* TOYS LAYER (Z60) - 7 draggable toys (chess knight removed) */}
          {toySystem.toys.map(toy => (
            <ToySprite
              key={toy.id}
              toy={toy}
              isDragged={toySystem.draggedToyId === toy.id}
              containerRef={floorRef}
              onDragStart={toySystem.startDrag}
              onDragMove={toySystem.moveDrag}
              onDragEnd={toySystem.endDrag}
              onTap={toySystem.tapToy}
            />
          ))}

          {/* BLANKET (Z80) - New pixel art blanket image - 40% BIGGER */}
          <motion.div
            animate={{ x: blanketShift * 100 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 308,  // 220 * 1.4 = 308
              height: 182, // 130 * 1.4 = 182
              zIndex: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/blanket.png"
              alt="blanket"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                imageRendering: 'pixelated',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
              }}
            />
          </motion.div>

          {/* CATS (Z70) - FLOOR ONLY */}
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
              scale={3.1}
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
              scale={3.1}
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

          {/* EFFECTS LAYER (Z150) */}
          <AnimatePresence>
            {effects.map(effect => renderEffect(effect))}
          </AnimatePresence>
        </div>
      </motion.div>

      <CompactCatUI
        onAction={handleAction}
        prabhState={prabhCat.position.state}
        sehajState={sehajCat.position.state}
      />
    </div>
  )
}
