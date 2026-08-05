// Band colors live as CSS custom properties (src/index.css) so both themes
// and the Design System wireframes share one source of truth. This just
// names the lookup — never build Tailwind class names dynamically from a
// band key, since arbitrary template-literal classes aren't picked up by
// Tailwind's static scanner.
export function bandColorVar(key) {
  return `var(--band-${key})`
}

export function bandTintVar(key, pct = 18) {
  return `color-mix(in oklab, var(--band-${key}) ${pct}%, transparent)`
}
