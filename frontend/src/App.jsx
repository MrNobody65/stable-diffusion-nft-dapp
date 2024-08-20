import StableDiffusion from './StableDiffusion.jsx'

import { Buffer } from 'buffer';
window.Buffer = Buffer

function App() {
  return (
    <StableDiffusion />
  )
}

export default App