/**
 * CROSSWORD PUZZLE GENERATOR
 * Generates multiple unique crossword puzzles with love/relationship theme
 */

export interface CrosswordClue {
  number: number
  clue: string
  answer: string
  row: number
  col: number
  direction: 'across' | 'down'
}

export interface CrosswordPuzzle {
  id: number
  gridSize: number
  clues: CrosswordClue[]
  blackSquares: boolean[][]
  title: string
}

// Love and relationship themed word bank
const WORD_BANK = [
  // 4-letter words
  { answer: 'LOVE', clue: 'Deep affection' },
  { answer: 'KISS', clue: 'Sweet gesture' },
  { answer: 'DATE', clue: 'Romantic outing' },
  { answer: 'CUTE', clue: 'Adorably attractive' },
  { answer: 'SOUL', clue: 'Forever partner (____mate)' },
  { answer: 'CARE', clue: 'Show concern for' },
  
  // 5-letter words
  { answer: 'HEART', clue: 'Symbol of love' },
  { answer: 'SEHAJ', clue: 'Your girl' },
  { answer: 'PRABH', clue: 'Your boy' },
  { answer: 'SMILE', clue: 'Facial expression of joy' },
  { answer: 'BLISS', clue: 'Perfect happiness' },
  { answer: 'CHARM', clue: 'Attractive quality' },
  { answer: 'TRUST', clue: 'Foundation of relationship' },
  { answer: 'SWEET', clue: 'Endearing and kind' },
  
  // 6-letter words
  { answer: 'CUDDLE', clue: 'Close embrace' },
  { answer: 'COUPLE', clue: 'Two partners together' },
  { answer: 'PASSION', clue: 'Intense desire' },
  { answer: 'ROMANCE', clue: 'Love and affection' },
  { answer: 'FOREVER', clue: 'Eternal commitment' },
  
  // 3-letter words
  { answer: 'HUG', clue: 'Warm embrace' },
  { answer: 'WED', clue: 'Get married' },
  { answer: 'BOO', clue: 'Term of endearment' },
]

// Pre-generated puzzle templates
const PUZZLE_TEMPLATES: CrosswordPuzzle[] = [
  // Puzzle 1
  {
    id: 1,
    gridSize: 11,
    title: 'Love & Affection',
    clues: [
      { number: 1, clue: 'Deep affection (4)', answer: 'LOVE', row: 0, col: 0, direction: 'across' },
      { number: 2, clue: 'Forever partner (4)', answer: 'SOUL', row: 0, col: 6, direction: 'down' },
      { number: 3, clue: 'Symbol of love (5)', answer: 'HEART', row: 2, col: 0, direction: 'across' },
      { number: 4, clue: 'Your girl (5)', answer: 'SEHAJ', row: 0, col: 0, direction: 'down' },
      { number: 5, clue: 'Warm embrace (3)', answer: 'HUG', row: 4, col: 2, direction: 'across' },
      { number: 6, clue: 'Sweet gesture (4)', answer: 'KISS', row: 2, col: 6, direction: 'down' },
      { number: 7, clue: 'Your boy (5)', answer: 'PRABH', row: 6, col: 0, direction: 'across' },
      { number: 8, clue: 'Romantic outing (4)', answer: 'DATE', row: 4, col: 7, direction: 'down' },
      { number: 9, clue: 'Close embrace (6)', answer: 'CUDDLE', row: 8, col: 3, direction: 'across' },
      { number: 10, clue: 'Facial joy (5)', answer: 'SMILE', row: 0, col: 10, direction: 'down' },
    ],
    blackSquares: [],
  },
  // Puzzle 2
  {
    id: 2,
    gridSize: 11,
    title: 'Romance & Passion',
    clues: [
      { number: 1, clue: 'Two partners (6)', answer: 'COUPLE', row: 0, col: 0, direction: 'across' },
      { number: 2, clue: 'Perfect happiness (5)', answer: 'BLISS', row: 0, col: 2, direction: 'down' },
      { number: 3, clue: 'Intense desire (7)', answer: 'PASSION', row: 2, col: 0, direction: 'across' },
      { number: 4, clue: 'Adorably attractive (4)', answer: 'CUTE', row: 0, col: 8, direction: 'down' },
      { number: 5, clue: 'Get married (3)', answer: 'WED', row: 4, col: 3, direction: 'across' },
      { number: 6, clue: 'Attractive quality (5)', answer: 'CHARM', row: 2, col: 7, direction: 'down' },
      { number: 7, clue: 'Show concern (4)', answer: 'CARE', row: 6, col: 1, direction: 'across' },
      { number: 8, clue: 'Love and affection (7)', answer: 'ROMANCE', row: 4, col: 6, direction: 'down' },
      { number: 9, clue: 'Endearing and kind (5)', answer: 'SWEET', row: 8, col: 2, direction: 'across' },
      { number: 10, clue: 'Eternal commitment (7)', answer: 'FOREVER', row: 6, col: 6, direction: 'down' },
    ],
    blackSquares: [],
  },
  // Puzzle 3
  {
    id: 3,
    gridSize: 11,
    title: 'Hearts & Hugs',
    clues: [
      { number: 1, clue: 'Symbol of love (5)', answer: 'HEART', row: 0, col: 0, direction: 'across' },
      { number: 2, clue: 'Term of endearment (3)', answer: 'BOO', row: 0, col: 3, direction: 'down' },
      { number: 3, clue: 'Close embrace (6)', answer: 'CUDDLE', row: 2, col: 0, direction: 'across' },
      { number: 4, clue: 'Sweet gesture (4)', answer: 'KISS', row: 0, col: 7, direction: 'down' },
      { number: 5, clue: 'Foundation of relationship (5)', answer: 'TRUST', row: 4, col: 2, direction: 'across' },
      { number: 6, clue: 'Your girl (5)', answer: 'SEHAJ', row: 2, col: 8, direction: 'down' },
      { number: 7, clue: 'Warm embrace (3)', answer: 'HUG', row: 6, col: 0, direction: 'across' },
      { number: 8, clue: 'Facial joy (5)', answer: 'SMILE', row: 4, col: 9, direction: 'down' },
      { number: 9, clue: 'Your boy (5)', answer: 'PRABH', row: 8, col: 1, direction: 'across' },
      { number: 10, clue: 'Deep affection (4)', answer: 'LOVE', row: 6, col: 5, direction: 'down' },
    ],
    blackSquares: [],
  },
]

// Generate black squares for a puzzle
function generateBlackSquares(gridSize: number, seed: number): boolean[][] {
  const blacks = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false))
  
  // Use seed to generate consistent patterns
  const positions = [
    [1, 3], [1, 7], [3, 1], [3, 5], [3, 9],
    [5, 0], [5, 1], [5, 6], [5, 9], [5, 10],
    [7, 2], [7, 6], [7, 10], [9, 1], [9, 5], [9, 9]
  ]
  
  // Apply seed offset
  positions.forEach(([r, c]) => {
    const newR = (r + seed) % gridSize
    const newC = (c + seed) % gridSize
    if (newR < gridSize && newC < gridSize) {
      blacks[newR][newC] = true
    }
  })
  
  return blacks
}

// Initialize puzzles with black squares
PUZZLE_TEMPLATES.forEach((puzzle, index) => {
  puzzle.blackSquares = generateBlackSquares(puzzle.gridSize, index)
})

/**
 * Get a puzzle by index
 */
export function getPuzzle(index: number): CrosswordPuzzle {
  return PUZZLE_TEMPLATES[index % PUZZLE_TEMPLATES.length]
}

/**
 * Get total number of available puzzles
 */
export function getTotalPuzzles(): number {
  return PUZZLE_TEMPLATES.length
}

/**
 * Get a random puzzle
 */
export function getRandomPuzzle(): CrosswordPuzzle {
  const index = Math.floor(Math.random() * PUZZLE_TEMPLATES.length)
  return getPuzzle(index)
}
