import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from './provider.jsx'
import { LangProvider } from './lib/LangContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <LangProvider>
        <App />
      </LangProvider>
    </Provider>
  </StrictMode>,
)
