import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useTheme } from '../theme/ThemeContext';
import { useIsFocused } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Video sources - use URLs for now to avoid require issues
const VIDEO_URLS = [
  'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/04jb8vk3_5744FE7D-DE20-40FB-94A9-C39CB3EDC595.MOV',
  'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/5qfbtsdz_4AC0D8EE-3674-4B81-B9A7-B6D93624CD39.MOV',
  'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/ep4xd9gw_7AE7E78A-C9AA-4437-B148-3644D4D18B0D.MOV',
  'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/iyxch1nu_ACAF7C77-F271-4132-9484-CA469D89580D.MOV',
  'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/cfyjmwjq_F42C870F-FAA3-401C-8272-6260F51FBD2A.MOV',
];

interface HeartVideoProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
}

export const HeartVideo: React.FC<HeartVideoProps> = ({
  position,
  size = 90,
}) => {
  const { colors } = useTheme();
  const isFocused = useIsFocused();
  const videoRef = useRef<Video>(null);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [videoIndex] = useState(() => Math.floor(Math.random() * VIDEO_URLS.length));
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.7,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Pause/play based on screen focus
  useEffect(() => {
    if (videoRef.current) {
      if (isFocused) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }
    }
  }, [isFocused]);

  const handlePress = () => {
    setIsEnlarged(!isEnlarged);
    Animated.spring(scaleAnim, {
      toValue: isEnlarged ? 1 : 1.3,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const getPositionStyle = () => {
    const offset = 12;
    switch (position) {
      case 'top-left':
        return { top: offset + 50, left: offset };
      case 'top-right':
        return { top: offset + 50, right: offset };
      case 'bottom-left':
        return { bottom: offset + 100, left: offset };
      case 'bottom-right':
        return { bottom: offset + 100, right: offset };
      default:
        return { top: offset + 50, right: offset };
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={[styles.container, getPositionStyle()]}
    >
      <Animated.View
        style={[
          styles.heartWrapper,
          {
            width: size,
            height: size,
            transform: [
              { scale: Animated.multiply(scaleAnim, pulseAnim) },
            ],
          },
        ]}
      >
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glow,
            {
              width: size + 20,
              height: size + 20,
              backgroundColor: colors.primary,
              opacity: glowAnim,
            },
          ]}
        />
        
        {/* Heart-shaped mask container */}
        <View style={[styles.heartMask, { width: size, height: size }]}>
          <View style={[styles.heartShape, { borderColor: colors.primary }]}>
            <Video
              ref={videoRef}
              source={{ uri: VIDEO_URLS[videoIndex] }}
              style={styles.video}
              resizeMode={ResizeMode.COVER}
              isLooping
              isMuted
              shouldPlay={isFocused}
            />
          </View>
        </View>

        {/* Heart outline glow */}
        <View
          style={[
            styles.heartOutline,
            {
              width: size,
              height: size,
              borderColor: colors.primary,
              shadowColor: colors.primary,
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 5,
  },
  heartWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    borderRadius: 100,
    transform: [{ scale: 1.2 }],
  },
  heartMask: {
    overflow: 'hidden',
    borderRadius: 50,
  },
  heartShape: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
  },
  video: {
    width: '150%',
    height: '150%',
    marginLeft: '-25%',
    marginTop: '-25%',
  },
  heartOutline: {
    position: 'absolute',
    borderRadius: 50,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
});

export default HeartVideo;
