import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export const darkColors = {
  background: '#0D0D12',
  backgroundSecondary: '#14141B',
  card: '#1A1A24',
  cardHover: '#222230',
  primary: '#E8638F',
  primaryLight: '#F4A5BD',
  primaryDark: '#C74B78',
  primaryGlow: 'rgba(232, 99, 143, 0.3)',
  secondary: '#A78BFA',
  secondaryLight: '#C4B5FD',
  secondaryDark: '#8B5CF6',
  secondaryGlow: 'rgba(167, 139, 250, 0.25)',
  tertiary: '#F4A5BD',
  textPrimary: '#F0EBF4',
  textSecondary: '#9B9BAE',
  textMuted: '#6B6B7B',
  textAccent: '#E8638F',
  border: '#2A2A38',
  borderLight: '#3A3A4A',
  divider: '#252530',
  gradientPrimary: ['#E8638F', '#A78BFA'],
  gradientSecondary: ['#C74B78', '#8B5CF6'],
  overlay: 'rgba(13, 13, 18, 0.85)',
  glass: 'rgba(26, 26, 36, 0.8)',
  success: '#4ADE80',
  error: '#F87171',
  warning: '#FBBF24',
}

export const lightColors = {
  background: '#FFF8F5',
  backgroundSecondary: '#FFF0EB',
  card: '#FFFFFF',
  cardHover: '#FFF5F2',
  primary: '#E8638F',
  primaryLight: '#F4A5BD',
  primaryDark: '#C74B78',
  primaryGlow: 'rgba(232, 99, 143, 0.15)',
  secondary: '#8B5CF6',
  secondaryLight: '#A78BFA',
  secondaryDark: '#7C3AED',
  secondaryGlow: 'rgba(139, 92, 246, 0.12)',
  tertiary: '#F4A5BD',
  textPrimary: '#2D1F36',
  textSecondary: '#5A4A64',
  textMuted: '#8A7A94',
  textAccent: '#E8638F',
  border: '#F0E0E8',
  borderLight: '#FFE0EB',
  divider: '#F5E5ED',
  gradientPrimary: ['#E8638F', '#A78BFA'],
  gradientSecondary: ['#F4A5BD', '#C4B5FD'],
  overlay: 'rgba(45, 31, 54, 0.6)',
  glass: 'rgba(255, 255, 255, 0.9)',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
}

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
  colors: typeof darkColors
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
  colors: darkColors,
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('theme_preference')
    if (saved) setIsDark(saved === 'dark')
  }, [])

  const toggleTheme = () => {
    const newValue = !isDark
    setIsDark(newValue)
    localStorage.setItem('theme_preference', newValue ? 'dark' : 'light')
  }

  const colors = isDark ? darkColors : lightColors

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  )
}