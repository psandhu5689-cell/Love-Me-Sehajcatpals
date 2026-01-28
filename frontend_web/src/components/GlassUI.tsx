import React, { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  blur?: number
  opacity?: number
  borderRadius?: number
  padding?: number | string
  borderColor?: string
  glowColor?: string
  hoverScale?: number
}

export default function GlassCard({
  children,
  blur = 10,
  opacity = 0.1,
  borderRadius = 20,
  padding = 20,
  borderColor = 'rgba(255,255,255,0.2)',
  glowColor,
  hoverScale = 1.02,
  style,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: hoverScale - 0.02 }}
      style={{
        background: `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        borderRadius,
        padding,
        border: `1px solid ${borderColor}`,
        boxShadow: glowColor 
          ? `0 8px 32px rgba(0,0,0,0.1), 0 0 40px ${glowColor}20, inset 0 0 20px rgba(255,255,255,0.05)`
          : '0 8px 32px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.05)',
        transition: 'all 0.3s ease',
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Animated glass button
interface GlassButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  glowColor?: string
}

export function GlassButton({
  children,
  variant = 'primary',
  glowColor = '#FF6B9D',
  style,
  ...props
}: GlassButtonProps) {
  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${glowColor}cc, ${glowColor}99)`,
      border: 'none',
      color: 'white',
    },
    secondary: {
      background: 'rgba(255,255,255,0.1)',
      border: `1px solid ${glowColor}50`,
      color: glowColor,
    },
    ghost: {
      background: 'transparent',
      border: `1px solid rgba(255,255,255,0.2)`,
      color: 'white',
    },
  }

  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        boxShadow: `0 0 30px ${glowColor}40`,
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        ...variants[variant],
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: 25,
        padding: '14px 28px',
        fontSize: 16,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'all 0.3s ease',
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// Floating animation wrapper
interface FloatingProps {
  children: ReactNode
  duration?: number
  distance?: number
}

export function Floating({ children, duration = 3, distance = 10 }: FloatingProps) {
  return (
    <motion.div
      animate={{
        y: [-distance/2, distance/2, -distance/2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

// Pulse animation wrapper
interface PulseProps {
  children: ReactNode
  scale?: number
  duration?: number
}

export function Pulse({ children, scale = 1.1, duration = 2 }: PulseProps) {
  return (
    <motion.div
      animate={{
        scale: [1, scale, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

// Shimmer effect
interface ShimmerProps {
  children: ReactNode
  width?: string | number
}

export function Shimmer({ children, width = '100%' }: ShimmerProps) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', width }}>
      {children}
      <motion.div
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
