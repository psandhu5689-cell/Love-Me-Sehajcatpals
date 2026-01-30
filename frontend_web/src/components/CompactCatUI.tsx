/**
 * COMPACT GAME-STYLE CAT UI
 * Bottom action bar + secondary drawer
 * Icon-first, minimal, playful
 * 
 * NEW: Freakiness bar, Mood bar, Sleep status, Room level
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ActionType = 
  | 'wake' 
  | 'sleep' 
  | 'feed' 
  | 'gaming'
  | 'pet'
  | 'nudge'
  | 'kick'
  | 'hogBlanket'
  | 'cuddle'
  | 'drama'
  | 'lightsOut'
  | 'treatToss'
  | 'laser'
  | 'chaos'
  | 'water'

type Target = 'prabh' | 'sehaj' | 'both'
type Mood = 'cozy' | 'happy' | 'annoyed' | 'sleepy' | 'sad'

interface CompactCatUIProps {
  onAction: (action: ActionType, target: Target) => void
  prabhState?: string
  sehajState?: string
  prabhMood?: Mood
  sehajMood?: Mood
  prabhFreakiness?: number
  sehajFreakiness?: number
  roomLevel?: number
  disabled?: boolean
}

interface ActionButton {
  id: ActionType
  icon: string
  label: string
  primary?: boolean
}

const PRIMARY_ACTIONS: ActionButton[] = [
  { id: 'wake', icon: '👁️', label: 'Wake', primary: true },
  { id: 'sleep', icon: '😴', label: 'Sleep', primary: true },
  { id: 'feed', icon: '🍖', label: 'Feed', primary: true },
  { id: 'water', icon: '💧', label: 'Water', primary: true },
]

const SECONDARY_ACTIONS: ActionButton[] = [
  { id: 'gaming', icon: '🎮', label: 'Gaming' },
  { id: 'pet', icon: '🐾', label: 'Pet' },
  { id: 'nudge', icon: '💕', label: 'Nudge' },
  { id: 'kick', icon: '💥', label: 'Kick' },
  { id: 'hogBlanket', icon: '🧣', label: 'Hog Blanket' },
  { id: 'cuddle', icon: '❤️', label: 'Cuddle' },
  { id: 'drama', icon: '🎭', label: 'Drama' },
  { id: 'lightsOut', icon: '🌙', label: 'Lights Out' },
  { id: 'treatToss', icon: '🐟', label: 'Treat' },
  { id: 'chaos', icon: '💀', label: 'fuck' },
]

const MOOD_ICONS: Record<Mood, string> = {
  cozy: '😊',
  happy: '😸',
  annoyed: '😾',
  sleepy: '😴',
  sad: '😿',
}

const GLASSY_STYLE = {
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
}

export function CompactCatUI({ 
  onAction, 
  prabhState, 
  sehajState, 
  prabhMood = 'happy',
  sehajMood = 'happy',
  prabhFreakiness = 42,
  sehajFreakiness = 38,
  roomLevel = 1,
  disabled 
}: CompactCatUIProps) {
  const [target, setTarget] = useState<Target>('both')
  const [showDrawer, setShowDrawer] = useState(false)

  const handleAction = (action: ActionType) => {
    if (disabled) return
    
    onAction(action, target)
    
    // Close drawer after action
    if (!PRIMARY_ACTIONS.find(a => a.id === action)) {
      setTimeout(() => setShowDrawer(false), 300)
    }
  }

  const isDisabled = (action: ActionType) => {
    if (disabled) return true
    
    // Context-sensitive disabling
    if (action === 'wake' && target !== 'both') {
      const state = target === 'prabh' ? prabhState : sehajState
      return state !== 'sleep'
    }
    if (action === 'sleep' && target !== 'both') {
      const state = target === 'prabh' ? prabhState : sehajState
      return state === 'sleep'
    }
    
    return false
  }

  // Check if cats are sleeping
  const prabhSleeping = prabhState === 'sleep'
  const sehajSleeping = sehajState === 'sleep'

  return (
    <div style={{
      width: '100%',
      maxWidth: 800,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      paddingBottom: 20,
    }}>
      {/* 1) Target Selector - Glassy segmented control */}
      <div style={{
        display: 'flex',
        gap: 4,
        ...GLASSY_STYLE,
        borderRadius: 20,
        padding: 4,
      }}>
        {(['sehaj', 'prabh', 'both'] as Target[]).map(t => (
          <motion.button
            key={t}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTarget(t)}
            style={{
              padding: '8px 16px',
              borderRadius: 16,
              border: 'none',
              background: target === t 
                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                : 'transparent',
              color: 'white',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {t === 'sehaj' ? '🧡 Sehaj' : t === 'prabh' ? '🖤 Prabh' : '💕 Both'}
          </motion.button>
        ))}
      </div>

      {/* 2) Freakiness Bar */}
      <div style={{
        ...GLASSY_STYLE,
        borderRadius: 12,
        padding: '8px 16px',
        width: '100%',
        maxWidth: 300,
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 6,
        }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 500 }}>
            Freakiness
          </span>
          <span style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>
            {target === 'both' 
              ? `${Math.round((sehajFreakiness + prabhFreakiness) / 2)}%`
              : target === 'sehaj' ? `${sehajFreakiness}%` : `${prabhFreakiness}%`
            }
          </span>
        </div>
        {/* Bars */}
        {target === 'both' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', width: 40 }}>Sehaj</span>
              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${sehajFreakiness}%` }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #f97316, #ea580c)', borderRadius: 3 }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', width: 40 }}>Prabh</span>
              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${prabhFreakiness}%` }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #4f46e5)', borderRadius: 3 }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${target === 'sehaj' ? sehajFreakiness : prabhFreakiness}%` }}
              style={{ 
                height: '100%', 
                background: target === 'sehaj' 
                  ? 'linear-gradient(90deg, #f97316, #ea580c)' 
                  : 'linear-gradient(90deg, #6366f1, #4f46e5)', 
                borderRadius: 4 
              }}
            />
          </div>
        )}
      </div>

      {/* 3) Mood Bar - Compact mood indicators */}
      <div style={{ display: 'flex', gap: 8 }}>
        {(target === 'both' || target === 'sehaj') && (
          <div style={{
            ...GLASSY_STYLE,
            borderRadius: 12,
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span style={{ fontSize: 14 }}>{MOOD_ICONS[sehajMood]}</span>
            <span style={{ color: 'white', fontSize: 11, fontWeight: 500 }}>
              {sehajMood.charAt(0).toUpperCase() + sehajMood.slice(1)}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>Sehaj</span>
          </div>
        )}
        {(target === 'both' || target === 'prabh') && (
          <div style={{
            ...GLASSY_STYLE,
            borderRadius: 12,
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span style={{ fontSize: 14 }}>{MOOD_ICONS[prabhMood]}</span>
            <span style={{ color: 'white', fontSize: 11, fontWeight: 500 }}>
              {prabhMood.charAt(0).toUpperCase() + prabhMood.slice(1)}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>Prabh</span>
          </div>
        )}
      </div>

      {/* 4) Sleep Status Bar - Shows when cat is sleeping */}
      <AnimatePresence>
        {(sehajSleeping || prabhSleeping) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              display: 'flex',
              gap: 8,
            }}
          >
            {sehajSleeping && (
              <div style={{
                ...GLASSY_STYLE,
                borderRadius: 20,
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <span style={{ color: 'white', fontSize: 11 }}>Sehaj sleeping</span>
                <span style={{ fontSize: 14 }}>😴</span>
              </div>
            )}
            {prabhSleeping && (
              <div style={{
                ...GLASSY_STYLE,
                borderRadius: 20,
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <span style={{ color: 'white', fontSize: 11 }}>Prabh sleeping</span>
                <span style={{ fontSize: 14 }}>😴</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Bar - Glassy look */}
      <motion.div
        style={{
          display: 'flex',
          gap: 12,
          ...GLASSY_STYLE,
          borderRadius: 30,
          padding: '12px 20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        {PRIMARY_ACTIONS.map(action => (
          <ActionIconButton
            key={action.id}
            action={action}
            onClick={() => handleAction(action.id)}
            disabled={isDisabled(action.id)}
          />
        ))}
        
        {/* More Button */}
        <ActionIconButton
          action={{ id: 'drama', icon: '⋯', label: 'More' }}
          onClick={() => setShowDrawer(!showDrawer)}
          active={showDrawer}
        />
      </motion.div>

      {/* Secondary Action Drawer - This stays fixed as a modal */}
      <AnimatePresence>
        {showDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 998,
              }}
            />
            
            {/* Drawer - Glassy look */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: '45vh',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                padding: '24px 20px 40px',
                zIndex: 999,
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 -4px 32px rgba(0, 0, 0, 0.2)',
              }}
            >
              {/* Drag Handle */}
              <div style={{
                width: 40,
                height: 4,
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 2,
                margin: '0 auto 20px',
              }} />
              
              {/* Action Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
                maxWidth: 400,
                margin: '0 auto',
              }}>
                {SECONDARY_ACTIONS.map(action => (
                  <ActionGridButton
                    key={action.id}
                    action={action}
                    onClick={() => handleAction(action.id)}
                    disabled={isDisabled(action.id)}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 5) Room Level Bar - Bottom right */}
      <div style={{
        alignSelf: 'flex-end',
        marginRight: 10,
        ...GLASSY_STYLE,
        borderRadius: 16,
        padding: '6px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span style={{ fontSize: 12 }}>🏠</span>
        <span style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>
          Room Lv. {roomLevel}
        </span>
      </div>
    </div>
  )
}

// Action Icon Button (for bottom bar)
function ActionIconButton({ 
  action, 
  onClick, 
  disabled, 
  active 
}: { 
  action: ActionButton
  onClick: () => void
  disabled?: boolean
  active?: boolean
}) {
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.9 }}
      whileHover={disabled ? {} : { scale: 1.05 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        border: 'none',
        background: active 
          ? 'linear-gradient(135deg, #667eea, #764ba2)'
          : disabled
          ? 'rgba(60, 60, 80, 0.5)'
          : 'rgba(60, 60, 80, 0.8)',
        color: disabled ? 'rgba(255, 255, 255, 0.3)' : 'white',
        fontSize: 24,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        boxShadow: active ? '0 0 20px rgba(102, 126, 234, 0.5)' : 'none',
        transition: 'all 0.2s',
      }}
    >
      <span style={{ fontSize: 20 }}>{action.icon}</span>
    </motion.button>
  )
}

// Action Grid Button (for drawer)
function ActionGridButton({ 
  action, 
  onClick, 
  disabled 
}: { 
  action: ActionButton
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        aspectRatio: '1',
        borderRadius: 16,
        border: 'none',
        background: disabled
          ? 'rgba(60, 60, 80, 0.3)'
          : 'rgba(60, 60, 80, 0.7)',
        color: disabled ? 'rgba(255, 255, 255, 0.3)' : 'white',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        padding: 12,
        transition: 'all 0.2s',
      }}
    >
      <span style={{ fontSize: 28 }}>{action.icon}</span>
      <span style={{ 
        fontSize: 10, 
        fontWeight: 600,
        opacity: 0.8,
      }}>
        {action.label}
      </span>
    </motion.button>
  )
}
