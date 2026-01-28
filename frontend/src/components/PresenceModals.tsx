import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface UserSetupModalProps {
  visible: boolean;
  onComplete: (user: 'prabh' | 'sehaj') => void;
}

export const UserSetupModal: React.FC<UserSetupModalProps> = ({ visible, onComplete }) => {
  const { colors, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSelect = async (user: 'prabh' | 'sehaj') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await AsyncStorage.setItem('currentUser', user);
    onComplete(user);
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <BlurView intensity={isDark ? 40 : 60} style={StyleSheet.absoluteFill} tint={isDark ? 'dark' : 'light'} />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.primaryGlow }]}>
            <Ionicons name="people" size={40} color={colors.primary} />
          </View>

          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Who is using this phone?
          </Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => handleSelect('prabh')}
              activeOpacity={0.9}
              style={styles.userButtonWrapper}
            >
              <LinearGradient
                colors={['#6B5B95', '#8B7BA7', '#A99BBD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.userButton}
              >
                <Text style={styles.userButtonText}>I'm Prabh</Text>
                <Text style={styles.userEmoji}>👨‍💻</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSelect('sehaj')}
              activeOpacity={0.9}
              style={styles.userButtonWrapper}
            >
              <LinearGradient
                colors={['#FF6B9D', '#FF8FAB', '#FFB3C1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.userButton}
              >
                <Text style={styles.userButtonText}>I'm Sehaj</Text>
                <Text style={styles.userEmoji}>👸</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

interface PresenceCheckModalProps {
  visible: boolean;
  currentUser: 'prabh' | 'sehaj';
  onComplete: (shared: boolean) => void;
}

export const PresenceCheckModal: React.FC<PresenceCheckModalProps> = ({
  visible,
  currentUser,
  onComplete,
}) => {
  const { colors, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (visible) {
      setShowConfirmation(false);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleYes = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const timestamp = Date.now().toString();
    
    if (currentUser === 'prabh') {
      await AsyncStorage.setItem('lastSharedVisit_prabh', timestamp);
      await AsyncStorage.setItem('lastVisitShared_prabh', 'true');
    } else {
      await AsyncStorage.setItem('lastSharedVisit_sehaj', timestamp);
      await AsyncStorage.setItem('lastVisitShared_sehaj', 'true');
    }

    setShowConfirmation(true);
    setTimeout(() => {
      onComplete(true);
    }, 1500);
  };

  const handleNo = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentUser === 'prabh') {
      await AsyncStorage.setItem('lastVisitShared_prabh', 'false');
    } else {
      await AsyncStorage.setItem('lastVisitShared_sehaj', 'false');
    }

    onComplete(false);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <BlurView intensity={isDark ? 40 : 60} style={StyleSheet.absoluteFill} tint={isDark ? 'dark' : 'light'} />
        <Animated.View
          style={[
            styles.modalContainer,
            styles.presenceModal,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {showConfirmation ? (
            <View style={styles.confirmationContainer}>
              <Ionicons name="heart" size={50} color={colors.primary} />
              <Text style={[styles.confirmationText, { color: colors.textPrimary }]}>
                They'll know you were here 💕
              </Text>
            </View>
          ) : (
            <>
              <Ionicons name="eye" size={36} color={colors.secondary} />

              <Text style={[styles.presenceTitle, { color: colors.textPrimary }]}>
                Should I tell them I was here?
              </Text>

              <View style={styles.presenceButtonsContainer}>
                <TouchableOpacity
                  onPress={handleYes}
                  activeOpacity={0.9}
                  style={styles.presenceButtonWrapper}
                >
                  <LinearGradient
                    colors={colors.gradientPrimary as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.presenceButton}
                  >
                    <Text style={styles.presenceButtonText}>Yes bub, I was here</Text>
                    <Ionicons name="heart" size={16} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleNo}
                  activeOpacity={0.8}
                  style={[styles.shyButton, { backgroundColor: colors.glass, borderColor: colors.border }]}
                >
                  <Text style={[styles.shyButtonText, { color: colors.textSecondary }]}>
                    Nah I'm shy / mad / sad{'\n'}and can't lose my nonchalance
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

interface PresenceDisplayProps {
  style?: any;
}

export const PresenceDisplay: React.FC<PresenceDisplayProps> = ({ style }) => {
  const { colors } = useTheme();
  const [prabhPresence, setPrabhPresence] = useState<{ shared: boolean; timestamp: number | null }>({
    shared: false,
    timestamp: null,
  });
  const [sehajPresence, setSehajPresence] = useState<{ shared: boolean; timestamp: number | null }>({
    shared: false,
    timestamp: null,
  });
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    loadPresence();
    // Update every minute
    const interval = setInterval(() => {
      forceUpdate(n => n + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadPresence = async () => {
    try {
      const prabhShared = await AsyncStorage.getItem('lastVisitShared_prabh');
      const prabhTimestamp = await AsyncStorage.getItem('lastSharedVisit_prabh');
      const sehajShared = await AsyncStorage.getItem('lastVisitShared_sehaj');
      const sehajTimestamp = await AsyncStorage.getItem('lastSharedVisit_sehaj');

      setPrabhPresence({
        shared: prabhShared === 'true',
        timestamp: prabhTimestamp ? parseInt(prabhTimestamp) : null,
      });

      setSehajPresence({
        shared: sehajShared === 'true',
        timestamp: sehajTimestamp ? parseInt(sehajTimestamp) : null,
      });
    } catch (error) {
      console.log('Error loading presence:', error);
    }
  };

  const getTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const hasPrabhPresence = prabhPresence.shared && prabhPresence.timestamp;
  const hasSehajPresence = sehajPresence.shared && sehajPresence.timestamp;

  if (!hasPrabhPresence && !hasSehajPresence) {
    return null;
  }

  return (
    <View style={[styles.presenceDisplayContainer, { backgroundColor: colors.glass, borderColor: colors.border }, style]}>
      <Text style={[styles.presenceDisplayTitle, { color: colors.textMuted }]}>Presence</Text>
      
      {hasPrabhPresence && (
        <View style={styles.presenceRow}>
          <Ionicons name="heart" size={14} color="#6B5B95" />
          <Text style={[styles.presenceText, { color: colors.textSecondary }]}>
            Prabh was here recently 💗 ({getTimeAgo(prabhPresence.timestamp!)})
          </Text>
        </View>
      )}

      {hasSehajPresence && (
        <View style={styles.presenceRow}>
          <Ionicons name="heart" size={14} color={colors.primary} />
          <Text style={[styles.presenceText, { color: colors.textSecondary }]}>
            Sehaj was here recently 💗 ({getTimeAgo(sehajPresence.timestamp!)})
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: width - 48,
    padding: 28,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  presenceModal: {
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
  },
  buttonsContainer: {
    width: '100%',
    gap: 14,
  },
  userButtonWrapper: {
    width: '100%',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
  },
  userButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  userEmoji: {
    fontSize: 24,
  },
  presenceTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  presenceButtonsContainer: {
    width: '100%',
    gap: 12,
  },
  presenceButtonWrapper: {
    width: '100%',
  },
  presenceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 8,
  },
  presenceButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  shyButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  shyButtonText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  confirmationContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    textAlign: 'center',
  },
  // Presence Display styles
  presenceDisplayContainer: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 20,
  },
  presenceDisplayTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  presenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  presenceText: {
    fontSize: 13,
    flex: 1,
  },
});

export default { UserSetupModal, PresenceCheckModal, PresenceDisplay };
