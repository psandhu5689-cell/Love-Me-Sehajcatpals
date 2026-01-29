import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoImages, IoPlay, IoPause, IoClose, IoMusicalNotes } from 'react-icons/io5'
import { Howl } from 'howler'
import { useTheme } from '../context/ThemeContext'
import { useMusic, PLAYLIST } from '../context/MusicContext'

const VIDEOS = [
  'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/04jb8vk3_5744FE7D-DE20-40FB-94A9-C39CB3EDC595.MOV',
  'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/5qfbtsdz_4AC0D8EE-3674-4B81-B9A7-B6D93624CD39.MOV',
  'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/ep4xd9gw_7AE7E78A-C9AA-4437-B148-3644D4D18B0D.MOV',
  'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/iyxch1nu_ACAF7C77-F271-4132-9484-CA469D89580D.MOV',
  'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/cfyjmwjq_F42C870F-FAA3-401C-8272-6260F51FBD2A.MOV',
  'https://customer-assets.emergentagent.com/job_add-this-1/artifacts/zr6k5md8_6ED17C90-F068-4114-862A-9C69C98D65D1.MOV',
]

const GALLERY_ITEMS = [
  { id: '1', media: VIDEOS[0], title: 'Golden Memories', song: PLAYLIST[0] },
  { id: '2', media: VIDEOS[1], title: 'Sweet Moments', song: PLAYLIST[1] },
  { id: '3', media: VIDEOS[2], title: 'Together Always', song: PLAYLIST[2] },
  { id: '4', media: VIDEOS[3], title: 'Beautiful Days', song: PLAYLIST[3] },
  { id: '5', media: VIDEOS[4], title: 'Our Love', song: PLAYLIST[4] },
  { id: '6', media: VIDEOS[5], title: 'Forever Us', song: PLAYLIST[0] },
]

export default function Gallery() {
  const navigate = useNavigate()
  const { colors, isDark } = useTheme()
  const { toggleMute, isMuted } = useMusic()
  const [selectedItem, setSelectedItem] = useState<typeof GALLERY_ITEMS[0] | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const soundRef = useRef<Howl | null>(null)
  const progressInterval = useRef<number | null>(null)
  const wasMutedRef = useRef(isMuted)

  useEffect(() => {
    wasMutedRef.current = isMuted
    if (!isMuted) toggleMute()

    return () => {
      soundRef.current?.unload()
      if (progressInterval.current) clearInterval(progressInterval.current)
      if (!wasMutedRef.current) toggleMute()
    }
  }, [])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const openFullscreen = (item: typeof GALLERY_ITEMS[0]) => {
    setSelectedItem(item)
    
    if (soundRef.current) {
      soundRef.current.unload()
    }

    soundRef.current = new Howl({
      src: [item.song.url],
      html5: true,
      volume: 1.0,
      onload: () => {
        setDuration(soundRef.current?.duration() || 0)
        soundRef.current?.play()
        setIsPlaying(true)
        startProgressTracking()
      },
      onend: () => {
        setIsPlaying(false)
        setProgress(0)
      },
    })
  }

  const startProgressTracking = () => {
    if (progressInterval.current) clearInterval(progressInterval.current)
    progressInterval.current = window.setInterval(() => {
      if (soundRef.current) {
        setProgress(soundRef.current.seek() as number)
      }
    }, 500)
  }

  const closeFullscreen = () => {
    soundRef.current?.stop()
    soundRef.current?.unload()
    soundRef.current = null
    setIsPlaying(false)
    setProgress(0)
    setDuration(0)
    setSelectedItem(null)
    if (progressInterval.current) clearInterval(progressInterval.current)
  }

  const togglePlayPause = () => {
    if (!soundRef.current) return
    
    if (isPlaying) {
      soundRef.current.pause()
      setIsPlaying(false)
    } else {
      soundRef.current.play()
      setIsPlaying(true)
      startProgressTracking()
    }
  }

  const handleBack = () => {
    soundRef.current?.stop()
    soundRef.current?.unload()
    navigate(-1)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      padding: '80px 16px 24px',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '16px',
        background: colors.background,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background: colors.card,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <IoChevronBack size={24} color={colors.primary} />
        </motion.button>
        
        <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.textPrimary }}>Gallery</h1>
        
        <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IoImages size={24} color={colors.primary} />
        </div>
      </div>

      <p style={{ color: colors.textSecondary, textAlign: 'center', fontStyle: 'italic', marginBottom: 16 }}>
        Tap a memory to play 💕
      </p>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 16,
      }}>
        {GALLERY_ITEMS.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openFullscreen(item)}
            style={{
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            <div style={{ position: 'relative', paddingTop: '100%' }}>
              <video
                src={item.media}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  background: colors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <IoPlay size={20} color="white" style={{ marginLeft: 2 }} />
                </div>
              </div>
            </div>
            <div style={{ padding: 10 }}>
              <p style={{ color: colors.textPrimary, fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                {item.title}
              </p>
              <p style={{ color: colors.textMuted, fontSize: 12 }}>
                🎵 {item.song.title} - {item.song.artist}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.9)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              zIndex: 1000,
            }}
          >
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeFullscreen}
              style={{
                position: 'absolute',
                top: 55,
                right: 20,
                width: 44,
                height: 44,
                borderRadius: 22,
                background: colors.card,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <IoClose size={28} color={colors.textPrimary} />
            </motion.button>

            {/* Video */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              style={{
                width: 'calc(100vw - 60px)',
                maxWidth: 400,
                aspectRatio: '1',
                borderRadius: 20,
                overflow: 'hidden',
                border: `2px solid ${colors.border}`,
              }}
            >
              <video
                src={selectedItem.media}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </motion.div>

            {/* Title */}
            <h2 style={{ color: colors.textPrimary, fontSize: 24, fontWeight: 700, marginTop: 20 }}>
              {selectedItem.title}
            </h2>

            {/* Music Player */}
            <div style={{
              width: '100%',
              maxWidth: 400,
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              padding: 20,
              marginTop: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <IoMusicalNotes size={24} color={colors.primary} />
                <div>
                  <p style={{ color: colors.textPrimary, fontSize: 18, fontWeight: 600 }}>
                    {selectedItem.song.title}
                  </p>
                  <p style={{ color: colors.textMuted, fontSize: 14 }}>
                    {selectedItem.song.artist}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{
                width: '100%',
                height: 6,
                background: colors.border,
                borderRadius: 3,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${duration > 0 ? (progress / duration) * 100 : 0}%`,
                  height: '100%',
                  background: colors.primary,
                  transition: 'width 0.5s linear',
                }} />
              </div>

              {/* Time */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ color: colors.textMuted, fontSize: 12 }}>{formatTime(progress)}</span>
                <span style={{ color: colors.textMuted, fontSize: 12 }}>{formatTime(duration)}</span>
              </div>

              {/* Play/Pause */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlayPause}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  background: colors.primary,
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  margin: '16px auto 0',
                }}
              >
                {isPlaying ? (
                  <IoPause size={32} color="white" />
                ) : (
                  <IoPlay size={32} color="white" style={{ marginLeft: 4 }} />
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}