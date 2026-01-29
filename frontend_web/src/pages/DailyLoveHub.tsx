import React from 'react'
import { motion } from 'framer-motion'
import { IoChevronBack, IoHeart, IoHelpCircle, IoTrophy, IoChatbubbles, IoStar, IoBook } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'

export default function DailyLoveHub() {
  const navigate = useNavigate()
  const { colors } = useTheme()

  const activities = [
    {
      id: 'timer',
      title: 'How Long Together',
      subtitle: 'Every second with you',
      icon: IoTime,
      gradient: ['#667eea', '#764ba2'],
      route: '/how-long-together',
    },
    {
      id: 'would-you-rather',
      title: 'Would You Rather',
      subtitle: 'Fun questions for us',
      icon: IoSwapHorizontal,
      gradient: ['#f093fb', '#f5576c'],
      route: '/would-you-rather',
    },
    {
      id: 'gallery',
      title: 'Memories',
      subtitle: 'Our moments together',
      icon: IoImages,
      gradient: ['#4facfe', '#00f2fe'],
      route: '/gallery',
    },
    {
      id: 'compliments',
      title: 'Daily Compliments',
      subtitle: 'Words from my heart',
      icon: IoHeart,
      gradient: ['#FF6B9D', '#C471ED'],
      route: '/daily-compliments',
    },
    {
      id: 'why-i-love-you',
      title: 'Why I Love You',
      subtitle: 'Because reasons',
      icon: IoStar,
      gradient: ['#FF9472', '#F2709C'],
      route: '/why-i-love-you',
    },
    {
      id: 'questions',
      title: 'Daily Questions',
      subtitle: 'Let me know you better',
      icon: IoHelpCircle,
      gradient: ['#4FACFE', '#00F2FE'],
      route: '/daily-questions',
    },
    {
      id: 'challenges',
      title: 'Daily Challenges',
      subtitle: 'Small things for us',
      icon: IoTrophy,
      gradient: ['#43E97B', '#38F9D7'],
      route: '/daily-challenges',
    },
    {
      id: 'sad',
      title: "When You're Sad",
      subtitle: "I'm here for you",
      icon: IoChatbubbles,
      gradient: ['#A8EDEA', '#FED6E3'],
      route: '/daily-love',
    },
    {
      id: 'notes',
      title: 'Special Moments',
      subtitle: 'Things I remember',
      icon: IoBook,
      gradient: ['#FFA8A8', '#FCFF00'],
      route: '/special-moments',
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
      padding: 20,
    }}>
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          haptics.light()
          navigate('/')
        }}
        style={{
          position: 'absolute',
          top: 20,
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

      {/* Content */}
      <div style={{
        maxWidth: 600,
        margin: '80px auto 0',
        width: '100%',
      }}>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          <h1 style={{
            color: colors.textPrimary,
            fontSize: 32,
            fontWeight: 600,
            marginBottom: 8,
          }}>
            This and That
          </h1>
          <p style={{
            color: colors.textSecondary,
            fontSize: 16,
          }}>
            Daily love for my girl
          </p>
        </motion.div>

        {/* Activity Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  haptics.medium()
                  navigate(activity.route)
                }}
                style={{
                  background: colors.glass,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${colors.border}`,
                  borderRadius: 20,
                  padding: 24,
                  cursor: 'pointer',
                  boxShadow: `0 8px 32px ${colors.primaryGlow}`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${activity.gradient[0]}, ${activity.gradient[1]})`,
                }} />

                {/* Icon */}
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${activity.gradient[0]}, ${activity.gradient[1]})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <Icon size={28} color="white" />
                </div>

                {/* Text */}
                <h3 style={{
                  color: colors.textPrimary,
                  fontSize: 20,
                  fontWeight: 600,
                  marginBottom: 8,
                }}>
                  {activity.title}
                </h3>
                <p style={{
                  color: colors.textSecondary,
                  fontSize: 14,
                  lineHeight: 1.5,
                }}>
                  {activity.subtitle}
                </p>
              </motion.div>
            )
          })}
        </div>

        <div style={{ height: 40 }} />
      </div>
    </div>
  )
}
