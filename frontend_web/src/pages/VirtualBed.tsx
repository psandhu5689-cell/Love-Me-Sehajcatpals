import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBackOutline, IoSunny, IoMoon } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'

// Reference images from user
const BED_IMAGE = 'https://customer-assets.emergentagent.com/job_ea00522a-d50f-4f38-a93e-0ece2d9e5cd8/artifacts/mr5zc8fj_Image%2010.jpeg'
const CAT_IMAGE = 'https://customer-assets.emergentagent.com/job_ea00522a-d50f-4f38-a93e-0ece2d9e5cd8/artifacts/a6djxcrh_Image%209.jpeg'
const BLANKET_IMAGE = 'https://customer-assets.emergentagent.com/job_ea00522a-d50f-4f38-a93e-0ece2d9e5cd8/artifacts/0yx76l6q_Image%2011.jpeg'

type CatMood = 'cozy' | 'happy' | 'mischievous' | 'sleepy' | 'annoyed'
type CatAction = 'idle' | 'waking' | 'sleeping' | 'nudging' | 'kicking' | 'eating' | 'gaming'

interface CatState {
  mood: number // 0-100
  action: CatAction
  isAwake: boolean
}

const FOOD_ITEMS = ['🐟', '🦴', '🍖']

export default function VirtualBed() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [isNight, setIsNight] = useState(false)
  const [blanketOffset, setBlanketOffset] = useState(50) // 0-100, where 50 is centered
  
  const [brownCat, setBrownCat] = useState<CatState>({
    mood: 75,
    action: 'idle',
    isAwake: true,
  })
  
  const [blackCat, setBlackCat] = useState<CatState>({
    mood: 75,
    action: 'idle',
    isAwake: true,
  })

  const [showEffect, setShowEffect] = useState<{
    type: 'heart' | 'z' | 'puff' | 'sparkle' | 'food'
    x: number
    y: number
    value?: string
  } | null>(null)

  const [currentFood, setCurrentFood] = useState(0)

  // Auto toggle day/night every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsNight(prev => !prev)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Reset actions to idle after animation
  useEffect(() => {
    if (brownCat.action !== 'idle' && brownCat.action !== 'sleeping') {
      const timeout = setTimeout(() => {
        setBrownCat(prev => ({ ...prev, action: prev.isAwake ? 'idle' : 'sleeping' }))
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [brownCat.action, brownCat.isAwake])

  useEffect(() => {
    if (blackCat.action !== 'idle' && blackCat.action !== 'sleeping') {
      const timeout = setTimeout(() => {
        setBlackCat(prev => ({ ...prev, action: prev.isAwake ? 'idle' : 'sleeping' }))
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [blackCat.action, blackCat.isAwake])

  // Clear effects after animation
  useEffect(() => {
    if (showEffect) {
      const timeout = setTimeout(() => setShowEffect(null), 1500)
      return () => clearTimeout(timeout)
    }
  }, [showEffect])

  const getMoodLabel = (mood: number): string => {
    if (mood > 80) return 'Happy'
    if (mood > 60) return 'Cozy'
    if (mood > 40) return 'Okay'
    if (mood > 20) return 'Annoyed'
    return 'Mischievous'
  }

  const handleCatAction = (
    cat: 'brown' | 'black',
    action: 'wake' | 'sleep' | 'nudge' | 'kick' | 'hog' | 'feed' | 'game'
  ) => {
    haptics.light()
    const isLeft = cat === 'brown'
    const setCat = cat === 'brown' ? setBrownCat : setBlackCat
    const otherCat = cat === 'brown' ? blackCat : brownCat
    const setOtherCat = cat === 'brown' ? setBlackCat : setBrownCat

    switch (action) {
      case 'wake':
        setCat(prev => ({ ...prev, isAwake: true, action: 'waking', mood: Math.min(100, prev.mood + 10) }))
        break
      
      case 'sleep':
        setCat(prev => ({ ...prev, isAwake: false, action: 'sleeping', mood: Math.min(100, prev.mood + 5) }))
        setShowEffect({ type: 'z', x: isLeft ? 35 : 65, y: 35 })
        break
      
      case 'nudge':
        setCat(prev => ({ ...prev, action: 'nudging', mood: Math.min(100, prev.mood + 15) }))
        setOtherCat(prev => ({ ...prev, mood: Math.min(100, prev.mood + 15) }))
        setShowEffect({ type: 'heart', x: 50, y: 35 })
        break
      
      case 'kick':
        setCat(prev => ({ ...prev, action: 'kicking', mood: Math.max(0, prev.mood - 5) }))
        setOtherCat(prev => ({ ...prev, mood: Math.max(0, prev.mood - 10) }))
        setShowEffect({ type: 'puff', x: isLeft ? 60 : 40, y: 45 })
        break
      
      case 'hog':
        setBlanketOffset(isLeft ? 30 : 70)
        setCat(prev => ({ ...prev, mood: Math.min(100, prev.mood + 10) }))
        setOtherCat(prev => ({ ...prev, mood: Math.max(0, prev.mood - 15) }))
        setTimeout(() => setBlanketOffset(50), 3000)
        break
      
      case 'feed':
        setCat(prev => ({ ...prev, action: 'eating', mood: Math.min(100, prev.mood + 20) }))
        setShowEffect({ type: 'food', x: isLeft ? 35 : 65, y: 40, value: FOOD_ITEMS[currentFood] })
        setCurrentFood((currentFood + 1) % FOOD_ITEMS.length)
        break
      
      case 'game':
        setCat(prev => ({ ...prev, action: 'gaming', mood: Math.min(100, prev.mood + 15) }))
        setShowEffect({ type: 'sparkle', x: isLeft ? 35 : 65, y: 45 })
        break
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
    }}>
      {/* Header */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          haptics.light()
          navigate(-1)
        }}
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          width: 40,
          height: 40,
          borderRadius: 12,
          background: colors.glass,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
        }}
      >
        <IoChevronBackOutline size={24} color={colors.textPrimary} />
      </motion.button>

      {/* Day/Night Toggle */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          haptics.medium()
          setIsNight(prev => !prev)
        }}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          width: 40,
          height: 40,
          borderRadius: 12,
          background: colors.glass,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
        }}
      >
        {isNight ? <IoMoon size={20} color="#FFD700" /> : <IoSunny size={20} color="#FFA500" />}
      </motion.button>

      {/* Main Content */}
      <div style={{
        maxWidth: 600,
        margin: '80px auto 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}>
        <h1 style={{
          fontSize: 32,
          fontWeight: 700,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
        }}>
          Virtual Bed 🛏️
        </h1>

        {/* Room Scene */}
        <motion.div
          style={{
            background: colors.glass,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${colors.border}`,
            borderRadius: 24,
            padding: 24,
            position: 'relative',
            boxShadow: `0 8px 32px ${colors.primaryGlow}`,
          }}
        >
          {/* Window */}
          <div style={{
            width: 140,
            height: 110,
            background: isNight 
              ? 'linear-gradient(180deg, #0f0f1e 0%, #1a1a2e 100%)'
              : 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 100%)',
            border: `4px solid ${isNight ? '#4a4a5e' : '#8B4513'}`,
            borderRadius: 12,
            margin: '0 auto 20px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 1s ease',
            boxShadow: isNight 
              ? 'inset 0 0 30px rgba(255,255,255,0.1)'
              : 'inset 0 0 30px rgba(255,255,255,0.4)',
          }}>
            {/* Window Frame Dividers */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: 4,
              height: '100%',
              background: isNight ? '#4a4a5e' : '#8B4513',
              transform: 'translateX(-50%)',
            }} />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: '100%',
              height: 4,
              background: isNight ? '#4a4a5e' : '#8B4513',
              transform: 'translateY(-50%)',
            }} />
            
            {/* Stars or Sun */}
            {isNight ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    position: 'absolute',
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #FFF8DC 0%, #FFD700 100%)',
                    boxShadow: '0 0 20px #FFD700',
                    top: '25%',
                    right: '20%',
                  }}
                />
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2 + i * 0.3, delay: i * 0.2, repeat: Infinity }}
                    style={{
                      position: 'absolute',
                      width: 3,
                      height: 3,
                      background: 'white',
                      borderRadius: '50%',
                      left: `${15 + (i % 4) * 22}%`,
                      top: `${20 + Math.floor(i / 4) * 25}%`,
                      boxShadow: '0 0 2px white',
                    }}
                  />
                ))}
              </>
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #FFD700 0%, #FFA500 100%)',
                  boxShadow: '0 0 30px #FFA500',
                  top: '20%',
                  right: '15%',
                }}
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: 6,
                      height: 20,
                      background: '#FFD700',
                      top: '50%',
                      left: '50%',
                      transformOrigin: '3px -15px',
                      transform: `rotate(${i * 45}deg)`,
                      borderRadius: 3,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>

          {/* Bed and Cats Container */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: 350,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Bed Image */}
            <img
              src={BED_IMAGE}
              alt="Bed"
              style={{
                position: 'absolute',
                width: '90%',
                height: 'auto',
                bottom: 0,
                left: '5%',
                objectFit: 'contain',
                zIndex: 1,
              }}
            />

            {/* Brown Cat (Left) */}
            <motion.div
              animate={{
                scale: brownCat.action === 'nudging' ? [1, 1.1, 1] : brownCat.action === 'kicking' ? [1, 0.95, 1] : 1,
                y: brownCat.action === 'waking' ? [-5, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                left: '20%',
                bottom: '35%',
                zIndex: 2,
              }}
            >
              <motion.img
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: brownCat.isAwake ? 1 : 0.8,
                }}
                transition={{ duration: 2, repeat: Infinity }}
                src={CAT_IMAGE}
                alt="Brown Cat"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: 'contain',
                  filter: `brightness(${brownCat.isAwake ? 1 : 0.7}) hue-rotate(20deg)`,
                }}
              />
              {brownCat.action === 'gaming' && (
                <div style={{
                  position: 'absolute',
                  bottom: -5,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: 24,
                }}>
                  🎮
                </div>
              )}
            </motion.div>

            {/* Black Cat (Right) */}
            <motion.div
              animate={{
                scale: blackCat.action === 'nudging' ? [1, 1.1, 1] : blackCat.action === 'kicking' ? [1, 0.95, 1] : 1,
                y: blackCat.action === 'waking' ? [-5, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                right: '20%',
                bottom: '35%',
                zIndex: 2,
              }}
            >
              <motion.img
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: blackCat.isAwake ? 1 : 0.8,
                }}
                transition={{ duration: 2.2, repeat: Infinity }}
                src={CAT_IMAGE}
                alt="Black Cat"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: 'contain',
                  filter: `brightness(${blackCat.isAwake ? 1 : 0.7}) hue-rotate(-180deg) saturate(0)`,
                  transform: 'scaleX(-1)',
                }}
              />
              {blackCat.action === 'gaming' && (
                <div style={{
                  position: 'absolute',
                  bottom: -5,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: 24,
                }}>
                  🎮
                </div>
              )}
            </motion.div>

            {/* Blanket Overlay */}
            <motion.img
              animate={{
                x: `${blanketOffset - 50}%`,
              }}
              transition={{ type: 'spring', damping: 20 }}
              src={BLANKET_IMAGE}
              alt="Blanket"
              style={{
                position: 'absolute',
                width: '70%',
                height: 'auto',
                bottom: '25%',
                left: '15%',
                objectFit: 'contain',
                zIndex: 3,
                opacity: 0.95,
              }}
            />

            {/* Visual Effects */}
            <AnimatePresence>
              {showEffect && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 0 }}
                  animate={{ opacity: 1, scale: 1.2, y: -30 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  style={{
                    position: 'absolute',
                    left: `${showEffect.x}%`,
                    top: `${showEffect.y}%`,
                    fontSize: 32,
                    zIndex: 10,
                    pointerEvents: 'none',
                  }}
                >
                  {showEffect.type === 'heart' && '💕'}
                  {showEffect.type === 'z' && '💤'}
                  {showEffect.type === 'puff' && '💥'}
                  {showEffect.type === 'sparkle' && '✨'}
                  {showEffect.type === 'food' && showEffect.value}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cat Status Bars */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 20,
            marginBottom: 20,
            gap: 16,
          }}>
            {/* Brown Cat Status */}
            <div style={{ flex: 1 }}>
              <p style={{ color: colors.textPrimary, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                🐱 Brown Cat
              </p>
              <div style={{
                width: '100%',
                height: 8,
                background: colors.card,
                borderRadius: 4,
                overflow: 'hidden',
                border: `1px solid ${colors.border}`,
              }}>
                <motion.div
                  animate={{ width: `${brownCat.mood}%` }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                />
              </div>
              <p style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>
                {getMoodLabel(brownCat.mood)} • {brownCat.mood}/100
              </p>
            </div>

            {/* Black Cat Status */}
            <div style={{ flex: 1 }}>
              <p style={{ color: colors.textPrimary, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                🐱 Black Cat
              </p>
              <div style={{
                width: '100%',
                height: 8,
                background: colors.card,
                borderRadius: 4,
                overflow: 'hidden',
                border: `1px solid ${colors.border}`,
              }}>
                <motion.div
                  animate={{ width: `${blackCat.mood}%` }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${colors.secondary}, ${colors.primary})`,
                  }}
                />
              </div>
              <p style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>
                {getMoodLabel(blackCat.mood)} • {blackCat.mood}/100
              </p>
            </div>
          </div>

          {/* Control Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}>
            {/* Brown Cat Controls */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
              <p style={{ color: colors.textPrimary, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                Brown Cat Actions:
              </p>
              {[
                { label: '👁️ Wake', action: 'wake' as const },
                { label: '😴 Sleep', action: 'sleep' as const },
                { label: '💕 Nudge', action: 'nudge' as const },
                { label: '🦵 Kick', action: 'kick' as const },
                { label: '🧣 Hog', action: 'hog' as const },
                { label: '🍖 Feed', action: 'feed' as const },
                { label: '🎮 Game', action: 'game' as const },
              ].map((btn) => (
                <motion.button
                  key={btn.action}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCatAction('brown', btn.action)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 20,
                    background: colors.card,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {btn.label}
                </motion.button>
              ))}
            </div>

            {/* Black Cat Controls */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
              <p style={{ color: colors.textPrimary, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                Black Cat Actions:
              </p>
              {[
                { label: '👁️ Wake', action: 'wake' as const },
                { label: '😴 Sleep', action: 'sleep' as const },
                { label: '💕 Nudge', action: 'nudge' as const },
                { label: '🦵 Kick', action: 'kick' as const },
                { label: '🧣 Hog', action: 'hog' as const },
                { label: '🍖 Feed', action: 'feed' as const },
                { label: '🎮 Game', action: 'game' as const },
              ].map((btn) => (
                <motion.button
                  key={btn.action}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCatAction('black', btn.action)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 20,
                    background: colors.card,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {btn.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
