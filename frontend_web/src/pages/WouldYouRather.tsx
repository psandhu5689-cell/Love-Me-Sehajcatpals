import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoArrowForward, IoSwapHorizontal } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'

const WOULD_YOU_RATHER_QUESTIONS = [
  {
    question: "Would you rather...",
    optionA: "Have a quiet night in watching movies",
    optionB: "Go out on an adventure together",
  },
  {
    question: "Would you rather...",
    optionA: "Know everything about my past",
    optionB: "Know everything about my future",
  },
  {
    question: "Would you rather...",
    optionA: "Always be the big spoon",
    optionB: "Always be the little spoon",
  },
  {
    question: "Would you rather...",
    optionA: "Have breakfast in bed every morning",
    optionB: "Have a date night every weekend",
  },
  {
    question: "Would you rather...",
    optionA: "Live in the city together",
    optionB: "Live in the countryside together",
  },
  {
    question: "Would you rather...",
    optionA: "Always make me laugh",
    optionB: "Always make me feel safe",
  },
  {
    question: "Would you rather...",
    optionA: "Have a cat together",
    optionB: "Have a dog together",
  },
  {
    question: "Would you rather...",
    optionA: "Travel the world with me",
    optionB: "Build a cozy home with me",
  },
  {
    question: "Would you rather...",
    optionA: "Always know what I'm thinking",
    optionB: "Always surprise me",
  },
  {
    question: "Would you rather...",
    optionA: "Be able to read my mind",
    optionB: "Be able to feel my emotions",
  },
]

export default function WouldYouRather() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null)

  const handleNext = () => {
    haptics.light()
    setSelectedOption(null)
    setCurrentIndex((prev) => (prev + 1) % WOULD_YOU_RATHER_QUESTIONS.length)
  }

  const handleSelect = (option: 'A' | 'B') => {
    haptics.medium()
    setSelectedOption(option)
  }

  const current = WOULD_YOU_RATHER_QUESTIONS[currentIndex]

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
          Would You Rather?
        </motion.h1>

        <p style={{
          color: colors.textSecondary,
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 40,
        }}>
          {currentIndex + 1} of {WOULD_YOU_RATHER_QUESTIONS.length}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <motion.div
              style={{
                background: colors.glass,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${colors.border}`,
                borderRadius: 24,
                padding: 32,
                marginBottom: 24,
                textAlign: 'center',
              }}
            >
              <p style={{
                color: colors.textPrimary,
                fontSize: 22,
                fontWeight: 600,
                marginBottom: 8,
              }}>
                {current.question}
              </p>
              <IoSwapHorizontal size={32} color={colors.primary} style={{ margin: '16px auto' }} />
            </motion.div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect('A')}
                style={{
                  background: selectedOption === 'A' ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.glass,
                  backdropFilter: 'blur(20px)',
                  border: `2px solid ${selectedOption === 'A' ? colors.primary : colors.border}`,
                  borderRadius: 20,
                  padding: 24,
                  cursor: 'pointer',
                  textAlign: 'left',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  background: selectedOption === 'A' ? 'white' : colors.card,
                  border: `2px solid ${selectedOption === 'A' ? 'white' : colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: selectedOption === 'A' ? colors.primary : colors.textSecondary,
                  fontWeight: 700,
                }}>
                  A
                </div>
                <p style={{
                  color: selectedOption === 'A' ? 'white' : colors.textPrimary,
                  fontSize: 18,
                  fontWeight: 500,
                  lineHeight: 1.5,
                  paddingRight: 40,
                }}>
                  {current.optionA}
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect('B')}
                style={{
                  background: selectedOption === 'B' ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.glass,
                  backdropFilter: 'blur(20px)',
                  border: `2px solid ${selectedOption === 'B' ? colors.primary : colors.border}`,
                  borderRadius: 20,
                  padding: 24,
                  cursor: 'pointer',
                  textAlign: 'left',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  background: selectedOption === 'B' ? 'white' : colors.card,
                  border: `2px solid ${selectedOption === 'B' ? 'white' : colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: selectedOption === 'B' ? colors.primary : colors.textSecondary,
                  fontWeight: 700,
                }}>
                  B
                </div>
                <p style={{
                  color: selectedOption === 'B' ? 'white' : colors.textPrimary,
                  fontSize: 18,
                  fontWeight: 500,
                  lineHeight: 1.5,
                  paddingRight: 40,
                }}>
                  {current.optionB}
                </p>
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          style={{
            width: '100%',
            marginTop: 24,
            padding: '16px 24px',
            borderRadius: 16,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            border: 'none',
            color: 'white',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: `0 4px 16px ${colors.primaryGlow}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          Next Question
          <IoArrowForward size={20} />
        </motion.button>

        <div style={{ height: 40 }} />
      </div>
    </div>
  )
}
