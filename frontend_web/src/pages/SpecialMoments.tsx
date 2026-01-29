import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { IoChevronBack, IoArrowForward, IoBook } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { SPECIAL_MOMENT_NOTES } from '../data/personalContent'
import haptics from '../utils/haptics'

export default function SpecialMoments() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    haptics.light()
    setCurrentIndex((prev) => (prev + 1) % SPECIAL_MOMENT_NOTES.length)
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
          Special Moments
        </motion.h1>

        <p style={{
          color: colors.textSecondary,
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 40,
        }}>
          {currentIndex + 1} of {SPECIAL_MOMENT_NOTES.length}
        </p>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            background: colors.glass,
            backdropFilter: 'blur(20px)',
            border: '2px solid #FFA8A8',
            borderRadius: 24,
            padding: 48,
            boxShadow: '0 8px 32px rgba(255, 168, 168, 0.3)',
            minHeight: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <IoBook size={120} color="#FFA8A8" style={{ opacity: 0.1 }} />
          </motion.div>

          <p style={{
            color: colors.textPrimary,
            fontSize: 20,
            fontWeight: 500,
            textAlign: 'center',
            lineHeight: 1.7,
            position: 'relative',
            zIndex: 1,
            fontStyle: 'italic',
          }}>
            {SPECIAL_MOMENT_NOTES[currentIndex]}
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
            background: 'linear-gradient(135deg, #FFA8A8, #FCFF00)',
            border: 'none',
            color: 'white',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(255, 168, 168, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          Next Moment
          <IoArrowForward size={20} />
        </motion.button>

        <div style={{ height: 40 }} />
      </div>
    </div>
  )
}
