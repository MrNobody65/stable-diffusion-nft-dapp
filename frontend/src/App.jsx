import React, { createContext, useState } from 'react'
import MetaMask from "./MetaMask.jsx"
import StableDiffusion from './StableDiffusion.jsx'
import SDNCollection from './SDNCollection.jsx'

export const ConnectedContext = createContext()

function ConnectedProvider({ children }) {
  const [connected, setConnected] = useState(false)

  return (
    <ConnectedContext.Provider value={{ connected, setConnected }}>
      {children}
    </ConnectedContext.Provider>
  )
}

function App() {


  return (
    <>
      <ConnectedProvider>
        <MetaMask />
        <StableDiffusion />
        <SDNCollection />
      </ConnectedProvider>
    </>

  )
}

export default App