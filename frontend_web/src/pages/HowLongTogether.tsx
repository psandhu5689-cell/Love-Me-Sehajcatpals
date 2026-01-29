import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IoChevronBack, IoHeart, IoCalendar, IoTime } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'

// February 26, 2025 - When we started
const START_DATE = new Date('2025-02-26T00:00:00')

export default function HowLongTogether() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date()
      const diff = now.getTime() - START_DATE.getTime()

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTime({ days, hours, minutes, seconds })
    }

    calculateTime()
    const interval = setInterval(calculateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  const TimeCard = ({ value, label, color }: { value: number; label: string; color: string }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        background: colors.glass,
        backdropFilter: 'blur(20px)',
        border: `2px solid ${color}`,
        borderRadius: 20,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        boxShadow: `0 8px 24px ${color}30`,
      }}
    >
      <motion.div
        key={value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: color,
        }}
      >
        {value}
      </motion.div>
      <p style={{
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 1,
      }}>
        {label}
      </p>
    </motion.div>
  )

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ marginBottom: 16 }}
          >
            <IoHeart size={64} color={colors.primary} />
          </motion.div>
          <h1 style={{
            color: colors.textPrimary,
            fontSize: 32,
            fontWeight: 600,
            marginBottom: 12,
          }}>
            How Long We've Been Together
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: colors.textSecondary,
            fontSize: 16,
          }}>
            <IoCalendar size={20} />
            <span>Since February 26, 2025</span>
          </div>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16,
          marginBottom: 32,
        }}>
          <TimeCard value={time.days} label="Days" color={colors.primary} />
          <TimeCard value={time.hours} label="Hours" color={colors.secondary} />
          <TimeCard value={time.minutes} label="Minutes" color="#43E97B" />
          <TimeCard value={time.seconds} label="Seconds" color="#4FACFE" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: colors.glass,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${colors.border}`,
            borderRadius: 24,
            padding: 32,
            textAlign: 'center',
          }}
        >
          <p style={{
            color: colors.textPrimary,
            fontSize: 20,
            fontWeight: 600,
            lineHeight: 1.6,
          }}>
            Every second with you is a gift.
          </p>
          <p style={{
            color: colors.textSecondary,
            fontSize: 16,
            marginTop: 12,
            lineHeight: 1.5,
          }}>
            And I want every second that comes next.
          </p>
        </motion.div>

        <div style={{ height: 40 }} />
      </div>
    </div>
  )
}
