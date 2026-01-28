import React, { createContext, useContext, useRef, ReactNode } from 'react'
import { Howl } from 'howler'

const SOUNDS = {
  kiss: 'https://customer-assets.emergentagent.com/job_sehaj-love/artifacts/vgnxn01x_f2f5a9b3.mp3',
  click: 'https://customer-assets.emergentagent.com/job_sehaj-love/artifacts/yk7vpdni_8e9b3679.mp3',
  magic: 'https://customer-assets.emergentagent.com/job_sehaj-love/artifacts/rbq2tpfb_93dca5e8.mp3',
  complete: 'https://customer-assets.emergentagent.com/job_sehaj-love/artifacts/zq4fnhkt_2c1b1fbe.mp3',
  drumroll: 'https://customer-assets.emergentagent.com/job_sehaj-love/artifacts/u3a2wqxd_c5e8fe9a.mp3',
  pop: 'https://customer-assets.emergentagent.com/job_sehaj-love/artifacts/zzwxc4v2_ab39c8e7.mp3',
}

interface AudioContextType {
  playKiss: () => void
  playClick: () => void
  playMagic: () => void
  playComplete: () => void
  playDrumroll: () => void
  playPop: () => void
}

const AudioContext = createContext<AudioContextType>({
  playKiss: () => {},
  playClick: () => {},
  playMagic: () => {},
  playComplete: () => {},
  playDrumroll: () => {},
  playPop: () => {},
})

export const useAudio = () => useContext(AudioContext)

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const soundsRef = useRef<{ [key: string]: Howl }>({})

  const playSound = (key: keyof typeof SOUNDS) => {
    if (!soundsRef.current[key]) {
      soundsRef.current[key] = new Howl({
        src: [SOUNDS[key]],
        volume: 0.5,
      })
    }
    soundsRef.current[key].play()
  }

  return (
    <AudioContext.Provider
      value={{
        playKiss: () => playSound('kiss'),
        playClick: () => playSound('click'),
        playMagic: () => playSound('magic'),
        playComplete: () => playSound('complete'),
        playDrumroll: () => playSound('drumroll'),
        playPop: () => playSound('pop'),
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}