import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from './_layout';

const { width } = Dimensions.get('window');
const CELL_SIZE = Math.min((width - 60) / 9, 38);

// Crossword grid - 9 columns x 11 rows
// null = black cell, number = starting cell for a word, '' = white cell
const GRID_TEMPLATE = [
  [null, 1,    null, null, null, null, 2,    null, null], // Row 0
  [null, '',   null, null, null, null, '',   null, null], // Row 1
  [3,    '',   '',   '',   '',   '',   '',   null, null], // Row 2 - BABYGRL (7)
  [null, '',   null, null, null, null, '',   null, null], // Row 3
  [4,    '',   '',   '',   '',   '',   '',   '',   '', ], // Row 4 - USFOREVER (9)
  [null, '',   null, null, null, 6,    '',   null, '', ], // Row 5
  [5,    '',   '',   '',   '',   '',   '',   null, '', ], // Row 6 - FOREVER (7)
  [null, null, null, null, null, '',   null, null, '', ], // Row 7
  [7,    '',   '',   '',   '',   '',   '',   8,    '', ], // Row 8 - LOVERAJ (7) + 8 start
  [null, null, null, null, null, '',   null, '',   '', ], // Row 9
  [10,   '',   '',   '',   '',   '',   '',   '',   null], // Row 10 - FOREVER (7)
];

// Clues with answers
const CLUES = {
  across: [
    { num: 3, clue: "im your _______", answer: "BABYGRL", row: 2, col: 1, length: 7 },
    { num: 4, clue: "me and you _________", answer: "USFOREVER", row: 4, col: 0, length: 9 },
    { num: 5, clue: "_______ and always", answer: "FOREVER", row: 6, col: 0, length: 7 },
    { num: 7, clue: "my name is _______", answer: "LOVERAJ", row: 8, col: 0, length: 7 },
    { num: 10, clue: "your my _______", answer: "FOREVER", row: 10, col: 0, length: 7 },
  ],
  down: [
    { num: 1, clue: "home, kids, ______", answer: "FUTURE", row: 0, col: 1, length: 6 },
    { num: 2, clue: "your my _______", answer: "EVERYTHING", row: 0, col: 6, length: 10 },
    { num: 6, clue: "you make me feel like ___", answer: "HOME", row: 5, col: 5, length: 4 },
    { num: 8, clue: "love you _____", answer: "ALWAYS", row: 8, col: 7, length: 6 },
  ],
};

// Build the actual grid data structure
const buildGrid = () => {
  const grid: (string | null)[][] = [];
  for (let r = 0; r < 11; r++) {
    grid[r] = [];
    for (let c = 0; c < 9; c++) {
      const cell = GRID_TEMPLATE[r]?.[c];
      if (cell === null) {
        grid[r][c] = null; // Black cell
      } else {
        grid[r][c] = ''; // White cell (empty)
      }
    }
  }
  return grid;
};

// Get cell number if it's a starting cell
const getCellNumber = (row: number, col: number): number | null => {
  const cell = GRID_TEMPLATE[row]?.[col];
  if (typeof cell === 'number') {
    return cell;
  }
  return null;
};

export default function Crossword() {
  const router = useRouter();
  const [grid, setGrid] = useState<(string | null)[][]>(buildGrid());
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [showSolution, setShowSolution] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const solutionAnim = useRef(new Animated.Value(0)).current;
  const { playClick, playSuccess, playComplete } = useAudio();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Check if puzzle is complete
  const checkComplete = (newGrid: (string | null)[][]) => {
    let allCorrect = true;
    
    // Check across answers
    for (const clue of CLUES.across) {
      let word = '';
      for (let i = 0; i < clue.length; i++) {
        const cell = newGrid[clue.row]?.[clue.col + i];
        word += cell || '';
      }
      if (word.toUpperCase() !== clue.answer) {
        allCorrect = false;
        break;
      }
    }
    
    // Check down answers
    if (allCorrect) {
      for (const clue of CLUES.down) {
        let word = '';
        for (let i = 0; i < clue.length; i++) {
          const cell = newGrid[clue.row + i]?.[clue.col];
          word += cell || '';
        }
        if (word.toUpperCase() !== clue.answer) {
          allCorrect = false;
          break;
        }
      }
    }
    
    if (allCorrect) {
      setIsComplete(true);
      playComplete();
      Animated.spring(solutionAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleCellPress = (row: number, col: number) => {
    if (grid[row]?.[col] === null) return; // Can't select black cells
    
    playClick();
    
    if (selectedCell?.row === row && selectedCell?.col === col) {
      // Toggle direction if same cell
      setDirection(d => d === 'across' ? 'down' : 'across');
    } else {
      setSelectedCell({ row, col });
    }
  };

  const handleInput = (text: string, row: number, col: number) => {
    if (grid[row]?.[col] === null) return;
    
    const newGrid = [...grid.map(r => [...r])];
    newGrid[row][col] = text.toUpperCase().slice(-1);
    setGrid(newGrid);
    
    if (text) {
      playSuccess();
      // Move to next cell
      if (direction === 'across') {
        if (col < 8 && grid[row]?.[col + 1] !== null) {
          setSelectedCell({ row, col: col + 1 });
        }
      } else {
        if (row < 10 && grid[row + 1]?.[col] !== null) {
          setSelectedCell({ row: row + 1, col });
        }
      }
    }
    
    checkComplete(newGrid);
  };

  const renderCell = (row: number, col: number) => {
    const cellValue = grid[row]?.[col];
    const cellNumber = getCellNumber(row, col);
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isBlack = cellValue === null;
    
    if (isBlack) {
      return (
        <View key={`${row}-${col}`} style={[styles.cell, styles.blackCell]} />
      );
    }
    
    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={[
          styles.cell,
          styles.whiteCell,
          isSelected && styles.selectedCell,
        ]}
        onPress={() => handleCellPress(row, col)}
        activeOpacity={0.7}
      >
        {cellNumber && (
          <Text style={styles.cellNumber}>{cellNumber}</Text>
        )}
        <TextInput
          style={styles.cellInput}
          value={cellValue || ''}
          onChangeText={(text) => handleInput(text, row, col)}
          maxLength={1}
          autoCapitalize="characters"
          onFocus={() => {
            setSelectedCell({ row, col });
          }}
          editable={!isComplete}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <Text style={styles.pageLabel}>Crossword Puzzle</Text>
            <Text style={styles.subtitle}>Fill in our love story</Text>

            {/* Crossword Grid */}
            <View style={styles.gridContainer}>
              {Array.from({ length: 11 }).map((_, row) => (
                <View key={row} style={styles.gridRow}>
                  {Array.from({ length: 9 }).map((_, col) => renderCell(row, col))}
                </View>
              ))}
            </View>

            {/* Direction Indicator */}
            <View style={styles.directionContainer}>
              <TouchableOpacity
                style={[styles.directionBtn, direction === 'across' && styles.directionBtnActive]}
                onPress={() => setDirection('across')}
              >
                <Ionicons name="arrow-forward" size={16} color={direction === 'across' ? '#FFF' : '#FF6B9D'} />
                <Text style={[styles.directionText, direction === 'across' && styles.directionTextActive]}>Across</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.directionBtn, direction === 'down' && styles.directionBtnActive]}
                onPress={() => setDirection('down')}
              >
                <Ionicons name="arrow-down" size={16} color={direction === 'down' ? '#FFF' : '#FF6B9D'} />
                <Text style={[styles.directionText, direction === 'down' && styles.directionTextActive]}>Down</Text>
              </TouchableOpacity>
            </View>

            {/* Clues */}
            <View style={styles.cluesContainer}>
              <View style={styles.clueSection}>
                <Text style={styles.clueHeader}>Across</Text>
                {CLUES.across.map((clue) => (
                  <Text key={clue.num} style={styles.clueText}>
                    {clue.num}. {clue.clue}
                  </Text>
                ))}
              </View>
              
              <View style={styles.clueSection}>
                <Text style={styles.clueHeader}>Down</Text>
                {CLUES.down.map((clue) => (
                  <Text key={clue.num} style={styles.clueText}>
                    {clue.num}. {clue.clue}
                  </Text>
                ))}
              </View>
            </View>

            {/* Completion Message */}
            {isComplete && (
              <Animated.View
                style={[
                  styles.completionContainer,
                  {
                    opacity: solutionAnim,
                    transform: [{ scale: solutionAnim }],
                  },
                ]}
              >
                <Ionicons name="heart" size={40} color="#FF6B9D" />
                <Text style={styles.completionText}>
                  Perfect! You know our story by heart! 💕
                </Text>
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={() => {
                    playSuccess();
                    router.push('/poems');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                  <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </Animated.View>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  content: {
    alignItems: 'center',
  },
  pageLabel: {
    fontSize: 14,
    color: '#9B7FA7',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B5B6B',
    textAlign: 'center',
    marginBottom: 20,
  },
  gridContainer: {
    backgroundColor: '#333',
    padding: 2,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  gridRow: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blackCell: {
    backgroundColor: '#333',
  },
  whiteCell: {
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  selectedCell: {
    backgroundColor: '#FFE4EC',
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  cellNumber: {
    position: 'absolute',
    top: 1,
    left: 2,
    fontSize: 8,
    fontWeight: '600',
    color: '#666',
  },
  cellInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: CELL_SIZE * 0.5,
    fontWeight: '700',
    color: '#4A1942',
    padding: 0,
  },
  directionContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  directionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFE4EC',
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  directionBtnActive: {
    backgroundColor: '#FF6B9D',
  },
  directionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  directionTextActive: {
    color: '#FFFFFF',
  },
  cluesContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  clueSection: {
    marginBottom: 16,
  },
  clueHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B9D',
    marginBottom: 8,
  },
  clueText: {
    fontSize: 14,
    color: '#4A1942',
    marginBottom: 6,
    lineHeight: 20,
  },
  completionContainer: {
    marginTop: 24,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    width: '100%',
  },
  completionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A1942',
    textAlign: 'center',
    marginVertical: 16,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
