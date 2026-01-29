import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoHeart } from 'react-icons/io5'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'

// Cat states
type CatState = 'sleeping' | 'awake' | 'rolling' | 'kicking' | 'hogging' | 'cuddling'

interface CatAction {
  id: string
  label: string
  emoji: string
  state: CatState
  message: string
}

const CAT_ACTIONS: CatAction[] = [
  { id: 'sleep', label: 'Sleep', emoji: '😴', state: 'sleeping', message: 'zzz...' },
  { id: 'wake', label: 'Wake', emoji: '👀', state: 'awake', message: 'meow?' },
  { id: 'roll', label: 'Roll', emoji: '🔄', state: 'rolling', message: '*rolls over*' },
  { id: 'kick', label: 'Kick', emoji: '🦶', state: 'kicking', message: '*kicks legs*' },
  { id: 'hog', label: 'Hog Blanket', emoji: '🛏️', state: 'hogging', message: '*steals blanket*' },
  { id: 'cuddle', label: 'Cuddle', emoji: '🤗', state: 'cuddling', message: '*snuggles close*' },
]

export default function VirtualBed() {
  const navigate = useNavigate()
  const { colors, isDark } = useTheme()
  const [blackCatState, setBlackCatState] = useState<CatState>('sleeping')
  const [brownCatState, setBrownCatState] = useState<CatState>('sleeping')
  const [blackCatMessage, setBlackCatMessage] = useState('')
  const [brownCatMessage, setBrownCatMessage] = useState('')

  const handleCatAction = (cat: 'black' | 'brown', action: CatAction) => {
    haptics.medium()
    
    if (cat === 'black') {
      setBlackCatState(action.state)
      setBlackCatMessage(action.message)
      setTimeout(() => setBlackCatMessage(''), 2000)
    } else {
      setBrownCatState(action.state)
      setBrownCatMessage(action.message)
      setTimeout(() => setBrownCatMessage(''), 2000)
    }
  }

  const getCatAnimation = (state: CatState) => {
    switch (state) {
      case 'sleeping':
        return { y: [0, -2, 0], scale: [1, 1.02, 1] }
      case 'awake':
        return { rotate: [0, -5, 5, 0] }
      case 'rolling':
        return { rotate: [0, 360], x: [0, 20, -20, 0] }
      case 'kicking':
        return { x: [0, 5, -5, 5, 0], y: [0, -10, 0] }
      case 'hogging':
        return { scale: [1, 1.2, 1.15] }
      case 'cuddling':
        return { x: [0, 10, 0], rotate: [0, 5, 0] }
      default:
        return {}
    }
  }

  const getCatEmoji = (state: CatState, isBlack: boolean) => {
    const base = isBlack ? '🐈‍⬛' : '🐱'
    switch (state) {
      case 'sleeping': return isBlack ? '😺' : '😸'
      case 'awake': return '😼'
      case 'rolling': return '🙀'
      case 'kicking': return '😾'
      case 'hogging': return '😼'
      case 'cuddling': return '😻'
      default: return base
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      padding: 20,
      paddingTop: 70,
      overflow: 'auto',
    }}>
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          haptics.light()
          navigate(-1)
        }}
        style={{
          position: 'fixed',
          top: 20,
          left: 16,
          width: 44,
          height: 44,
          borderRadius: 22,
          background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 101,
        }}
      >
        <IoChevronBack size={24} color={colors.primary} />
      </motion.button>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ color: colors.textPrimary, fontSize: 28, fontWeight: 600, marginBottom: 8 }}>
          🛏️ Virtual Bed
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: 14 }}>Two sleepy cats sharing a cozy bed</p>
      </div>

      {/* Bed Scene */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 400,
        margin: '0 auto',
        aspectRatio: '4/3',
      }}>
        {/* Bed Frame */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '85%',
          background: isDark 
            ? 'linear-gradient(180deg, #4A3728 0%, #3A2A1E 100%)'
            : 'linear-gradient(180deg, #DEB887 0%, #D2691E 100%)',
          borderRadius: 20,
          border: `3px solid ${isDark ? '#2A1A10' : '#8B4513'}`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }} />

        {/* Blanket */}
        <motion.div
          animate={{
            scaleX: blackCatState === 'hogging' ? 0.7 : brownCatState === 'hogging' ? 1.3 : 1,
            x: blackCatState === 'hogging' ? -30 : brownCatState === 'hogging' ? 30 : 0,
          }}
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '10%',
            right: '10%',
            height: '50%',
            background: isDark
              ? 'linear-gradient(135deg, #5D4E6D, #8E7B9D)'
              : 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
            borderRadius: 15,
            boxShadow: 'inset 0 5px 20px rgba(0,0,0,0.1)',
          }}
        />

        {/* Pillows */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '15%',
          width: '30%',
          height: '25%',
          background: isDark ? '#E8E0E8' : '#FFFFFF',
          borderRadius: '50% 50% 50% 50%',
          boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
        }} />
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '15%',
          width: '30%',
          height: '25%',
          background: isDark ? '#E8E0E8' : '#FFFFFF',
          borderRadius: '50% 50% 50% 50%',
          boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
        }} />

        {/* Black Cat (Left) */}
        <motion.div
          animate={getCatAnimation(blackCatState)}
          transition={{ duration: 0.5, repeat: blackCatState !== 'sleeping' ? 0 : Infinity, repeatDelay: 1 }}
          style={{
            position: 'absolute',
            top: '25%',
            left: '15%',
            fontSize: 50,
            zIndex: 10,
          }}
        >
          <span style={{ filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.3))' }}>
            🐈‍⬛
          </span>
          <AnimatePresence>
            {blackCatMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  top: -30,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.95)',
                  padding: '4px 10px',
                  borderRadius: 10,
                  fontSize: 12,
                  color: colors.textPrimary,
                  whiteSpace: 'nowrap',
                }}
              >
                {blackCatMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Brown Cat (Right) */}
        <motion.div
          animate={getCatAnimation(brownCatState)}
          transition={{ duration: 0.5, repeat: brownCatState !== 'sleeping' ? 0 : Infinity, repeatDelay: 1 }}
          style={{
            position: 'absolute',
            top: '25%',
            right: '15%',
            fontSize: 50,
            zIndex: 10,
            transform: 'scaleX(-1)',
          }}
        >
          <span style={{ filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.3))' }}>
            🐱
          </span>
          <AnimatePresence>
            {brownCatMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  top: -30,
                  left: '50%',
                  transform: 'translateX(-50%) scaleX(-1)',
                  background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.95)',
                  padding: '4px 10px',
                  borderRadius: 10,
                  fontSize: 12,
                  color: colors.textPrimary,
                  whiteSpace: 'nowrap',
                }}
              >
                {brownCatMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Heart when both cuddling */}
        <AnimatePresence>
          {blackCatState === 'cuddling' && brownCatState === 'cuddling' && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{
                position: 'absolute',
                top: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 30,
                zIndex: 20,
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                💕
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Panels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        marginTop: 24,
        maxWidth: 400,
        margin: '24px auto 0',
        width: '100%',
      }}>
        {/* Black Cat Controls */}
        <div style={{
          background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          padding: 12,
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        }}>
          <p style={{ 
            color: colors.textPrimary, 
            fontSize: 14, 
            fontWeight: 600, 
            marginBottom: 10,
            textAlign: 'center',
          }}>
            🐈‍⬛ Black Cat
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {CAT_ACTIONS.map((action) => (
              <motion.button
                key={`black-${action.id}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCatAction('black', action)}
                style={{
                  background: blackCatState === action.state 
                    ? `${colors.primary}30` 
                    : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${blackCatState === action.state ? colors.primary : 'transparent'}`,
                  borderRadius: 10,
                  padding: '8px 4px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <span style={{ fontSize: 16 }}>{action.emoji}</span>
                <span style={{ color: colors.textSecondary, fontSize: 9, fontWeight: 500 }}>
                  {action.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Brown Cat Controls */}
        <div style={{
          background: isDark ? 'rgba(139,90,43,0.2)' : 'rgba(255,160,122,0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          padding: 12,
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        }}>
          <p style={{ 
            color: colors.textPrimary, 
            fontSize: 14, 
            fontWeight: 600, 
            marginBottom: 10,
            textAlign: 'center',
          }}>
            🐱 Brown Cat
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {CAT_ACTIONS.map((action) => (
              <motion.button
                key={`brown-${action.id}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCatAction('brown', action)}
                style={{
                  background: brownCatState === action.state 
                    ? `${colors.secondary}30` 
                    : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${brownCatState === action.state ? colors.secondary : 'transparent'}`,
                  borderRadius: 10,
                  padding: '8px 4px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <span style={{ fontSize: 16 }}>{action.emoji}</span>
                <span style={{ color: colors.textSecondary, fontSize: 9, fontWeight: 500 }}>
                  {action.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Status */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <p style={{ color: colors.textMuted, fontSize: 12 }}>
          {blackCatState === 'sleeping' && brownCatState === 'sleeping' 
            ? '😴 Both cats are peacefully sleeping...'
            : blackCatState === 'cuddling' && brownCatState === 'cuddling'
            ? '💕 They\'re cuddling! So cute!'
            : blackCatState === 'kicking' || brownCatState === 'kicking'
            ? '⚠️ Someone\'s having a wild dream!'
            : '🐱 The cats are being playful...'}
        </p>
      </div>
    </div>
  )
}
