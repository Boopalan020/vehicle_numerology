// Mirrors HeroUI's own Vite template: v3 components are mostly self-contained
// react-aria primitives, so there's no NextUI-v2-style global provider required.
// This is the seam to add <ToastProvider> later for the pin/save toast in the
// interaction spec (design doc §4).
export function Provider({ children }) {
  return <>{children}</>
}
