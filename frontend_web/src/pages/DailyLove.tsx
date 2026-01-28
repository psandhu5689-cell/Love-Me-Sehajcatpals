import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoChevronBack, IoSparkles, IoHeart, IoFlash, IoCamera, IoRefresh } from 'react-icons/io5'
import { useTheme } from '../context/ThemeContext'
import { useAudio } from '../context/AudioContext'

const COMPLIMENTS = [
  "You're the most beautiful person I know, inside and out.",
  "Your smile makes my whole day better.",
  "I'm so lucky to have you in my life.",
  "You make everything more fun and exciting.",
  "Your laugh is my favorite sound.",
]

const WHY_I_LOVE_YOU = [
  "Because you accept me for who I am.",
  "Because you make me want to be a better person.",
  "Because your hugs feel like home.",
  "Because you're my best friend.",
  "Because every moment with you is precious.",
]

const CHALLENGES = [
  "Send me a selfie right now 📸",
  "Tell me something you've never told anyone.",
  "Give me a hug next time you see me.",
  "Write me a short love poem.",
  "Send me a voice note saying 'I love you'.",
]

const MEMORIES = [
  "Remember our first date? I was so nervous!",
  "That time we stayed up all night talking...",
  "When you made me laugh so hard I cried.",
  "Our inside jokes that no one else understands.",
  "Every 'good morning' text from you.",
]

const CATEGORIES = [
  { id: 'compliment', title: 'Compliments', icon: IoSparkles, color: '#FF6B9D', data: COMPLIMENTS, emoji: '💫' },
  { id: 'love', title: 'Why I Love You', icon: IoHeart, color: '#E91E63', data: WHY_I_LOVE_YOU, emoji: '❤️' },
  { id: 'challenge', title: 'Challenges', icon: IoFlash, color: '#FF9800', data: CHALLENGES, emoji: '⚡' },
  { id: 'moment', title: 'Memories', icon: IoCamera, color: '#4CAF50', data: MEMORIES, emoji: '📸' },
]

export default function DailyLove() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const { playClick, playMagic } = useAudio()
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0])
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleCategorySelect = (category: typeof CATEGORIES[0]) => {
    playClick()
    setSelectedCategory(category)
    setCurrentIndex(0)
  }

  const getNextContent = () => {
    playMagic()
    setCurrentIndex((prev) => (prev + 1) % selectedCategory.data.length)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
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
          top: 20,
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

      <h1 style={{ fontSize: 24, fontWeight: 300, color: colors.textPrimary, textAlign: 'center', marginBottom: 8 }}>
        Daily Love
      </h1>
      <p style={{ color: colors.textSecondary, textAlign: 'center', fontStyle: 'italic', marginBottom: 24 }}>
        Pick something special 💕
      </p>

      {/* Categories */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12,
        marginBottom: 24,
      }}>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isSelected = selectedCategory.id === cat.id
          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategorySelect(cat)}
              style={{
                background: isSelected ? cat.color : colors.card,
                border: `2px solid ${isSelected ? cat.color : colors.border}`,
                borderRadius: 16,
                padding: 16,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <Icon size={24} color={isSelected ? 'white' : cat.color} />
              <p style={{
                color: isSelected ? 'white' : colors.textPrimary,
                fontSize: 13,
                fontWeight: 600,
                marginTop: 8,
              }}>
                {cat.title}
              </p>
              <p style={{
                color: isSelected ? 'rgba(255,255,255,0.8)' : colors.textMuted,
                fontSize: 11,
                marginTop: 4,
              }}>
                {cat.data.length} items {cat.emoji}
              </p>
            </motion.button>
          )
        })}
      </div>

      {/* Content Card */}
      <motion.div
        key={`${selectedCategory.id}-${currentIndex}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
          boxShadow: `0 0 30px ${colors.primaryGlow}`,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          background: selectedCategory.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          {React.createElement(selectedCategory.icon, { size: 24, color: 'white' })}
        </div>

        <p style={{
          fontSize: 20,
          color: colors.textPrimary,
          textAlign: 'center',
          lineHeight: 1.6,
          fontStyle: 'italic',
        }}>
          "{selectedCategory.data[currentIndex]}"
        </p>

        <p style={{
          color: colors.textMuted,
          fontSize: 12,
          textAlign: 'center',
          marginTop: 16,
        }}>
          {currentIndex + 1} of {selectedCategory.data.length}
        </p>
      </motion.div>

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={getNextContent}
        style={{
          background: selectedCategory.color,
          border: 'none',
          color: 'white',
          padding: '16px 32px',
          borderRadius: 30,
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          margin: '0 auto',
          boxShadow: `0 6px 20px ${selectedCategory.color}40`,
        }}
      >
        Next
        <IoRefresh size={20} />
      </motion.button>
    </div>
  )
}