import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// Star configuration
const NUM_STARS = 80;
const NUM_SHOOTING_STARS = 3;

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: Animated.Value;
  duration: number;
}

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  animation: Animated.Value;
  delay: number;
}

// Generate random stars
const generateStars = (): Star[] => {
  return Array.from({ length: NUM_STARS }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * (height * 0.7),
    size: Math.random() * 2.5 + 1,
    opacity: new Animated.Value(Math.random() * 0.5 + 0.3),
    duration: Math.random() * 2000 + 1500,
  }));
};

// Generate shooting stars
const generateShootingStars = (): ShootingStar[] => {
  return Array.from({ length: NUM_SHOOTING_STARS }, (_, i) => ({
    id: i,
    startX: Math.random() * width * 0.5,
    startY: Math.random() * height * 0.3,
    animation: new Animated.Value(0),
    delay: i * 8000 + Math.random() * 5000,
  }));
};

export default function FirstIntro() {
  const router = useRouter();
  const [stars] = useState<Star[]>(generateStars);
  const [shootingStars] = useState<ShootingStar[]>(generateShootingStars);
  
  const contentFadeAnim = useRef(new Animated.Value(0)).current;
  const contentScaleAnim = useRef(new Animated.Value(0.95)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const starFieldAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Star twinkling animation
    stars.forEach((star) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.7 + 0.3,
            duration: star.duration,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.3 + 0.1,
            duration: star.duration,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Shooting star animations
    shootingStars.forEach((shootingStar) => {
      const animateShootingStar = () => {
        shootingStar.animation.setValue(0);
        Animated.timing(shootingStar.animation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start(() => {
          setTimeout(animateShootingStar, shootingStar.delay + Math.random() * 10000);
        });
      };
      setTimeout(animateShootingStar, shootingStar.delay);
    });

    // Slow star field movement
    Animated.loop(
      Animated.timing(starFieldAnim, {
        toValue: 1,
        duration: 60000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Content fade in animation (all together)
    Animated.sequence([
      Animated.delay(800),
      Animated.parallel([
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(contentScaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Button fade in after content
    Animated.sequence([
      Animated.delay(3000),
      Animated.timing(buttonFadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Text glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleContinue = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Mark intro as seen (for first-time users)
    await AsyncStorage.setItem('first_intro_seen', 'true');
    
    // Always mark that intro was shown this session for Sehaj
    await AsyncStorage.setItem('sehaj_intro_shown_session', 'true');
    
    // Fade out and navigate
    Animated.parallel([
      Animated.timing(contentFadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(buttonFadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.replace('/');
    });
  };

  const starFieldTranslate = starFieldAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  const textShadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      {/* Starry Background */}
      <Animated.View 
        style={[
          styles.starField,
          { transform: [{ translateY: starFieldTranslate }] }
        ]}
      >
        {stars.map((star) => (
          <Animated.View
            key={star.id}
            style={[
              styles.star,
              {
                left: star.x,
                top: star.y,
                width: star.size,
                height: star.size,
                borderRadius: star.size / 2,
                opacity: star.opacity,
              },
            ]}
          />
        ))}

        {/* Shooting Stars */}
        {shootingStars.map((shootingStar) => {
          const translateX = shootingStar.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, width * 0.8],
          });
          const translateY = shootingStar.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, height * 0.5],
          });
          const opacity = shootingStar.animation.interpolate({
            inputRange: [0, 0.1, 0.8, 1],
            outputRange: [0, 1, 0.8, 0],
          });
          const scaleX = shootingStar.animation.interpolate({
            inputRange: [0, 0.3, 1],
            outputRange: [0, 1, 0.3],
          });

          return (
            <Animated.View
              key={`shooting-${shootingStar.id}`}
              style={[
                styles.shootingStar,
                {
                  left: shootingStar.startX,
                  top: shootingStar.startY,
                  opacity,
                  transform: [
                    { translateX },
                    { translateY },
                    { rotate: '45deg' },
                    { scaleX },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={['#FFFFFF', 'rgba(255,255,255,0.5)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.shootingStarGradient}
              />
            </Animated.View>
          );
        })}
      </Animated.View>

      {/* Content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: contentFadeAnim,
            transform: [{ scale: contentScaleAnim }],
          },
        ]}
      >
        {/* Glow effect behind text */}
        <Animated.View 
          style={[
            styles.textGlow,
            { opacity: textShadowOpacity }
          ]} 
        />

        <Text style={styles.greeting}>Hey baby,</Text>
        
        <Text style={styles.messageText}>
          I know I'm not the best boyfriend at times…{'\n'}
          but I'm definitely a goated one.
        </Text>

        <Text style={styles.messageText}>
          I dedicate this app to everything you mean to me.
        </Text>

        <Text style={styles.messageText}>
          My purpose wasn't to sugarcoat or win you over.{'\n'}
          It was to show you that no matter what task,{'\n'}
          no matter what time,{'\n'}
          no matter what skill…
        </Text>

        <Text style={[styles.messageText, styles.highlightText]}>
          I will do anything for you.
        </Text>

        <Text style={styles.messageText}>
          Today I made an app.{'\n'}
          Tomorrow I'll be taking your pictures on a Canon G7X{'\n'}
          while you gracefully sit on the edge of a crescent moon.
        </Text>

        <View style={styles.signatureContainer}>
          <Text style={styles.signatureText}>Sincerely,</Text>
          <Text style={styles.signatureName}>your awesome man</Text>
          <Text style={styles.signatureAlias}>(aka Prabh)</Text>
        </View>
      </Animated.View>

      {/* Continue Button */}
      <Animated.View
        style={[
          styles.buttonContainer,
          { opacity: buttonFadeAnim },
        ]}
      >
        <TouchableOpacity
          onPress={handleContinue}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#FF6B9D', '#C44569', '#8B3A62']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  starField: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  shootingStar: {
    position: 'absolute',
    width: 100,
    height: 2,
  },
  shootingStarGradient: {
    flex: 1,
    borderRadius: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 120,
  },
  textGlow: {
    position: 'absolute',
    width: width * 0.9,
    height: height * 0.6,
    backgroundColor: 'rgba(255, 107, 157, 0.08)',
    borderRadius: 200,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFFFFF',
    marginBottom: 24,
    fontStyle: 'italic',
    textShadowColor: 'rgba(255, 107, 157, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  messageText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    textShadowColor: 'rgba(255, 107, 157, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  highlightText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FF6B9D',
    fontStyle: 'italic',
    textShadowColor: 'rgba(255, 107, 157, 0.6)',
    textShadowRadius: 12,
  },
  signatureContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  signatureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  signatureName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    textShadowColor: 'rgba(255, 107, 157, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  signatureAlias: {
    fontSize: 14,
    color: 'rgba(255, 107, 157, 0.8)',
    fontStyle: 'italic',
    marginTop: 4,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 50,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 2,
  },
});
