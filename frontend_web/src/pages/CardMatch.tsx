import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoChevronBack, IoHeart, IoChevronForward } from 'react-icons/io5'
import { useTheme } from '../context/ThemeContext'
import { useAudio } from '../context/AudioContext'

const CARDS = [
  { id: 1, emoji: '💖', text: 'Love' },
  { id: 2, emoji: '💋', text: 'Kiss' },
  { id: 3, emoji: '🥰', text: 'Adore' },
  { id: 4, emoji: '💝', text: 'Forever' },
  { id: 5, emoji: '💖', text: 'Love' },
  { id: 6, emoji: '💋', text: 'Kiss' },
  { id: 7, emoji: '🥰', text: 'Adore' },
  { id: 8, emoji: '💝', text: 'Forever' },
]

export default function CardMatch() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const { playClick, playComplete, playMagic } = useAudio()
  const [shuffledCards, setShuffledCards] = useState<typeof CARDS>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setShuffledCards([...CARDS].sort(() => Math.random() - 0.5))
  }, [])

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return
    
    playClick()
    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped
      if (shuffledCards[first].text === shuffledCards[second].text) {
        playMagic()
        const newMatched = [...matched, first, second]
        setMatched(newMatched)
        setFlipped([])
        
        if (newMatched.length === CARDS.length) {
          playComplete()
          setIsComplete(true)
        }
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '80px 24px 24px',
      position: 'relative',
    }}>
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { playClick(); navigate(-1); }}
        style={{
          position: 'absolute',
          top: 55,
          left: 16,
          width: 44,
          height: 44,
          borderRadius: 22,
          background: colors.card,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <IoChevronBack size={24} color={colors.primary} />
      </motion.button>

      <h1 style={{ fontSize: 28, fontWeight: 300, color: colors.textPrimary, marginBottom: 8 }}>
        Memory Match
      </h1>
      <p style={{ color: colors.textSecondary, fontStyle: 'italic', marginBottom: 30 }}>
        Find all the matching pairs 💕
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        maxWidth: 350,
      }}>
        {shuffledCards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index)
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(index)}
              style={{
                width: 70,
                height: 90,
                borderRadius: 12,
                background: isFlipped ? colors.card : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                border: `2px solid ${matched.includes(index) ? colors.success : colors.border}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isFlipped ? `0 0 20px ${colors.primaryGlow}` : 'none',
              }}
            >
              {isFlipped ? (
                <>
                  <span style={{ fontSize: 28 }}>{card.emoji}</span>
                  <span style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4 }}>{card.text}</span>
                </>
              ) : (
                <IoHeart size={24} color="white" />
              )}
            </motion.div>
          )
        })}
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 30, textAlign: 'center' }}
        >
          <p style={{ color: colors.success, fontSize: 18, marginBottom: 20 }}>
            Perfect! You found all matches! 🎉
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/hold-reveal')}
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              border: 'none',
              color: 'white',
              padding: '16px 36px',
              borderRadius: 30,
              fontSize: 17,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            Continue
            <IoChevronForward size={20} />
          </motion.button>
        </motion.div>
      )}

      {!isComplete && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/hold-reveal')}
          style={{
            marginTop: 30,
            background: 'transparent',
            border: 'none',
            color: colors.textSecondary,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          Skip
          <IoChevronForward size={16} />
        </motion.button>
      )}
    </div>
  )
}