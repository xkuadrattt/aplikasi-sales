import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@assets/css/style.css"
import CustomRouter from './router/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomRouter />
  </StrictMode>,
)
