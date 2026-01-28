import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import { MusicProvider } from './context/MusicContext'
import { UserProvider } from './context/UserContext'
import { AudioProvider } from './context/AudioContext'
import { PresenceProvider } from './context/PresenceContext'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <PresenceProvider>
            <MusicProvider>
              <AudioProvider>
                <App />
              </AudioProvider>
            </MusicProvider>
          </PresenceProvider>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)