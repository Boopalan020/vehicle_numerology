import { useEffect, useState } from 'react'
import { useLocalStorage } from './useLocalStorage.js'

const DARK_QUERY = '(prefers-color-scheme: dark)'
const THEME_COLOR = { light: '#eef1f4', dark: '#1e2227' }

function systemTheme() {
  return typeof window !== 'undefined' && window.matchMedia?.(DARK_QUERY).matches ? 'dark' : 'light'
}

// Light/dark: follows the device until the viewer taps the theme button,
// then remembers that choice ('enn:theme'). index.html applies a saved
// choice before first paint so a reload doesn't flash the other theme.
export function useTheme() {
  const [choice, setChoice] = useLocalStorage('enn:theme', 'system') // 'system' | 'light' | 'dark'
  const [system, setSystem] = useState(systemTheme)

  useEffect(() => {
    const mq = window.matchMedia?.(DARK_QUERY)
    if (!mq) return
    const onChange = () => setSystem(systemTheme())
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const theme = choice === 'system' ? system : choice

  useEffect(() => {
    const root = document.documentElement
    if (choice === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', choice)
    // Browser chrome (address bar on phones) matches the page.
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
      if (choice === 'system') meta.setAttribute('content', THEME_COLOR[meta.media.includes('dark') ? 'dark' : 'light'])
      else meta.setAttribute('content', THEME_COLOR[choice])
    }
  }, [choice])

  return { theme, toggle: () => setChoice(theme === 'dark' ? 'light' : 'dark') }
}
