import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage.js'
import { translate, translateError } from './i18n.js'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useLocalStorage('enn:lang', 'en')

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key, ...args) => translate(lang, key, ...args),
      tError: (code) => translateError(lang, code),
      bandLabel: (band) => (lang === 'ta' ? band.labelTa : band.label),
    }),
    [lang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within a LangProvider')
  return ctx
}
