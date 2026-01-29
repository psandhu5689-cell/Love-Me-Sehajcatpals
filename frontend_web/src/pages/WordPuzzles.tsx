import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IoChevronBackOutline, IoCheckmarkCircle } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'

// 5 Puzzles: 4 Crosswords + 1 Word Search
const PUZZLES = [
  // Day 1: Crossword - Love Theme
  {
    type: 'crossword',
    title: 'Love Crossword',
    grid: [
      ['H', 'E', 'A', 'R', 'T', '', '', ''],
      ['', '', '', 'O', '', '', '', ''],
      ['', 'K', 'I', 'S', 'S', '', '', ''],
      ['', '', '', 'E', '', '', '', ''],
      ['L', 'O', 'V', 'E', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
    ],
    clues: {
      across: ['1. Symbol of love (5)', '3. Affectionate touch (4)', '5. Deep affection (4)'],
      down: ['2. Romantic flower (4)'],
    },
  },
  // Day 2: Crossword - Nature Theme
  {
    type: 'crossword',
    title: 'Nature Crossword',
    grid: [
      ['T', 'R', 'E', 'E', '', '', '', ''],
      ['', 'A', '', '', '', '', '', ''],
      ['', 'I', '', '', '', '', '', ''],
      ['S', 'N', 'O', 'W', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', 'S', 'U', 'N', '', '', ''],
    ],
    clues: {
      across: ['1. Woody plant (4)', '4. Winter precipitation (4)', '6. Star in the sky (3)'],
      down: ['2. Water from sky (4)'],
    },
  },
  // Day 3: Crossword - Food Theme
  {
    type: 'crossword',
    title: 'Food Crossword',
    grid: [
      ['C', 'A', 'K', 'E', '', '', '', ''],
      ['', 'P', '', '', '', '', '', ''],
      ['', 'P', '', '', '', '', '', ''],
      ['', 'L', '', '', '', '', '', ''],
      ['', 'E', '', '', '', '', '', ''],
      ['P', 'I', 'Z', 'Z', 'A', '', '', ''],
    ],
    clues: {
      across: ['1. Sweet dessert (4)', '6. Italian dish (5)'],
      down: ['2. Fruit often red (5)'],
    },
  },
  // Day 4: Crossword - Animals Theme
  {
    type: 'crossword',
    title: 'Animals Crossword',
    grid: [
      ['C', 'A', 'T', '', '', '', '', ''],
      ['', '', 'I', '', '', '', '', ''],
      ['', '', 'G', '', '', '', '', ''],
      ['', '', 'E', '', '', '', '', ''],
      ['', '', 'R', '', '', '', '', ''],
      ['D', 'O', 'G', '', '', '', '', ''],
    ],
    clues: {
      across: ['1. Feline pet (3)', '6. Canine pet (3)'],
      down: ['3. Big striped cat (5)'],
    },
  },
  // Day 5: Word Search - Colors
  {
    type: 'wordsearch',
    title: 'Colors Word Search',
    grid: [
      ['R', 'E', 'D', 'B', 'L', 'U', 'E', 'X'],
      ['P', 'I', 'N', 'K', 'Y', 'Z', 'A', 'B'],
      ['G', 'R', 'E', 'E', 'N', 'W', 'C', 'D'],
      ['O', 'R', 'A', 'N', 'G', 'E', 'F', 'G'],
      ['Y', 'E', 'L', 'L', 'O', 'W', 'H', 'I'],
      ['P', 'U', 'R', 'P', 'L', 'E', 'J', 'K'],
    ],
    words: ['RED', 'BLUE', 'PINK', 'GREEN', 'ORANGE', 'YELLOW', 'PURPLE'],
  },
]

export default function WordPuzzles() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  
  // Get puzzle index based on day (0-4, rotating)
  const getDayIndex = () => {
    const startDate = new Date('2025-01-01').getTime()
    const today = new Date().getTime()
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24))
    return daysPassed % 5
  }
  
  const [currentPuzzleIndex] = useState(getDayIndex())
  const currentPuzzle = PUZZLES[currentPuzzleIndex]
  
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set())
  const [isSelecting, setIsSelecting] = useState(false)
  const [currentSelection, setCurrentSelection] = useState<string[]>([])

  const handleCellPress = (row: number, col: number) => {
    haptics.selection()
    const key = `${row},${col}`
    
    if (currentPuzzle.type === 'crossword') {
      // Toggle cell selection for crossword
      setSelectedCells(prev => {
        const newSet = new Set(prev)
        if (newSet.has(key)) {
          newSet.delete(key)
        } else {
          newSet.add(key)
        }
        return newSet
      })
    } else {
      // Word search selection
      if (!isSelecting) {
        setIsSelecting(true)
        setCurrentSelection([key])
      } else {
        const newSelection = [...currentSelection, key]
        setCurrentSelection(newSelection)
        
        // Check if word is found
        const word = newSelection
          .map(k => {
            const [r, c] = k.split(',').map(Number)
            return currentPuzzle.grid[r][c]
          })
          .join('')
        
        if (currentPuzzle.words?.includes(word)) {
          haptics.success()
          setFoundWords(prev => new Set([...prev, word]))
          setSelectedCells(prev => new Set([...prev, ...newSelection]))
          setCurrentSelection([])
          setIsSelecting(false)
        }
      }
    }
  }

  const handleEndSelection = () => {
    if (currentPuzzle.type === 'wordsearch') {
      setIsSelecting(false)
      setCurrentSelection([])
    }
  }

  const isCompleted = () => {
    if (currentPuzzle.type === 'wordsearch') {
      return foundWords.size === currentPuzzle.words?.length
    }
    return false
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: colors.background,
      padding: 24,
      paddingTop: 80,
      position: 'relative',
    }}>
      {/* Header */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          haptics.light()
          navigate(-1)
        }}
        style={{
          position: 'fixed',
          top: 55,
          left: 20,
          width: 40,
          height: 40,
          borderRadius: 12,
          background: colors.glass,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
        }}
      >
        <IoChevronBackOutline size={24} color={colors.textPrimary} />
      </motion.button>

      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 8,
          }}>
            {currentPuzzle.title}
          </h1>
          <p style={{ color: colors.textSecondary, fontSize: 14 }}>
            Day {currentPuzzleIndex + 1} of 5 • {currentPuzzle.type === 'crossword' ? 'Crossword' : 'Word Search'}
          </p>
        </div>

        {/* Puzzle Grid */}
        <div
          style={{
            background: colors.glass,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 24,
            boxShadow: `0 8px 32px ${colors.primaryGlow}`,
          }}
          onMouseUp={handleEndSelection}
          onTouchEnd={handleEndSelection}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${currentPuzzle.grid[0].length}, 1fr)`,
            gap: 4,
            maxWidth: 400,
            margin: '0 auto',
          }}>
            {currentPuzzle.grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const key = `${rowIndex},${colIndex}`
                const isSelected = selectedCells.has(key)
                const isCurrentlySelecting = currentSelection.includes(key)
                const isEmpty = cell === ''

                return (
                  <motion.div
                    key={key}
                    whileTap={{ scale: isEmpty ? 1 : 0.95 }}
                    onClick={() => !isEmpty && handleCellPress(rowIndex, colIndex)}
                    onMouseEnter={() => isSelecting && !isEmpty && handleCellPress(rowIndex, colIndex)}
                    style={{
                      aspectRatio: '1',
                      background: isEmpty
                        ? colors.background
                        : isSelected
                        ? colors.primary
                        : isCurrentlySelecting
                        ? colors.primaryLight
                        : colors.card,
                      border: isEmpty ? 'none' : `2px solid ${isSelected ? colors.primaryDark : colors.border}`,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      fontWeight: 700,
                      color: isSelected ? 'white' : colors.textPrimary,
                      cursor: isEmpty ? 'default' : 'pointer',
                      userSelect: 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {cell}
                  </motion.div>
                )
              })
            )}
          </div>

          {/* Clues or Words to Find */}
          <div style={{ marginTop: 24 }}>
            {currentPuzzle.type === 'crossword' && currentPuzzle.clues && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: colors.textPrimary,
                    marginBottom: 8,
                  }}>
                    Across
                  </h3>
                  {currentPuzzle.clues.across.map((clue, i) => (
                    <p key={i} style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      marginBottom: 4,
                    }}>
                      {clue}
                    </p>
                  ))}
                </div>
                <div>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: colors.textPrimary,
                    marginBottom: 8,
                  }}>
                    Down
                  </h3>
                  {currentPuzzle.clues.down.map((clue, i) => (
                    <p key={i} style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      marginBottom: 4,
                    }}>
                      {clue}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {currentPuzzle.type === 'wordsearch' && currentPuzzle.words && (
              <div>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: colors.textPrimary,
                  marginBottom: 12,
                }}>
                  Find these words:
                </h3>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  {currentPuzzle.words.map((word) => (
                    <div
                      key={word}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: foundWords.has(word) ? colors.primary : colors.card,
                        border: `1px solid ${foundWords.has(word) ? colors.primaryDark : colors.border}`,
                        color: foundWords.has(word) ? 'white' : colors.textPrimary,
                        fontSize: 14,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      {foundWords.has(word) && <IoCheckmarkCircle size={16} />}
                      {word}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Completion Message */}
          {isCompleted() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: 24,
                padding: 16,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                textAlign: 'center',
                color: 'white',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              🎉 Puzzle Complete! Come back tomorrow for a new one!
            </motion.div>
          )}

          {/* Instructions */}
          <p style={{
            marginTop: 16,
            fontSize: 12,
            color: colors.textMuted,
            textAlign: 'center',
          }}>
            {currentPuzzle.type === 'crossword'
              ? 'Click cells to reveal answers'
              : 'Click and drag to select words'}
          </p>
        </div>
      </div>
    </div>
  )
}
