import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { IoChevronBack, IoArrowForward, IoTrophy } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { DAILY_CHALLENGES } from '../data/personalContent'
import haptics from '../utils/haptics'

export default function DailyChallenges() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    haptics.light()
    setCurrentIndex((prev) => (prev + 1) % DAILY_CHALLENGES.length)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
      padding: 20,
    }}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          haptics.light()
          navigate(-1)
        }}
        style={{
          position: 'absolute',
          top: 55,
          left: 20,
          width: 44,
          height: 44,
          borderRadius: 22,
          background: colors.card,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
        }}
      >
        <IoChevronBack size={24} color={colors.primary} />
      </motion.button>

      <div style={{
        maxWidth: 600,
        margin: '80px auto 0',
        width: '100%',
      }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            color: colors.textPrimary,
            fontSize: 32,
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          Daily Challenge
        </motion.h1>

        <p style={{
          color: colors.textSecondary,
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 40,
        }}>
          {currentIndex + 1} of {DAILY_CHALLENGES.length}
        </p>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            background: colors.glass,
            backdropFilter: 'blur(20px)',
            border: '2px solid #43E97B',
            borderRadius: 24,
            padding: 48,
            boxShadow: '0 8px 32px rgba(67, 233, 123, 0.3)',
            minHeight: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <IoTrophy size={120} color="#43E97B" style={{ opacity: 0.1 }} />
          </motion.div>

          <p style={{
            color: colors.textPrimary,
            fontSize: 22,
            fontWeight: 600,
            textAlign: 'center',
            lineHeight: 1.6,
            position: 'relative',
            zIndex: 1,
          }}>
            {DAILY_CHALLENGES[currentIndex]}
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          style={{
            width: '100%',
            marginTop: 32,
            padding: '16px 24px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #43E97B, #38F9D7)',
            border: 'none',
            color: 'white',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(67, 233, 123, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          Next Challenge
          <IoArrowForward size={20} />
        </motion.button>

        <div style={{ height: 40 }} />
      </div>
    </div>
  )
}
