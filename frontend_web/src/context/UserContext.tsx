import React, { createContext, useContext, useState, ReactNode } from 'react'

interface UserContextType {
  userName: string
  setUserName: (name: string) => void
}

const UserContext = createContext<UserContextType>({
  userName: 'Sehaj',
  setUserName: () => {},
})

export const useUser = () => useContext(UserContext)

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState('Sehaj')

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  )
}