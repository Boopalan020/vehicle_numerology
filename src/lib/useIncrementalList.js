import { useCallback, useState } from 'react'

// Renders a long list a page at a time. A full 0001–9999 range is 9,999
// tiles — mounting them all at once froze the tab for seconds on every filter
// change (e.g. switching the Fancy filter off). Callers render `visible` plus a
// <LoadMore> at the end, which grows the page as it scrolls into view.
//
// The page size resets whenever `items` changes identity (new filter, new
// calculation). That's done during render rather than in an effect, so the
// first render after a filter change is already the short list — an effect
// would first paint the new items at the old, possibly huge, count.
export function useIncrementalList(items, pageSize) {
  const [state, setState] = useState({ items, count: pageSize })
  let count = state.count
  if (state.items !== items) {
    count = pageSize
    setState({ items, count })
  }

  // Stable identity — LoadMore's observer effect depends on it.
  const showMore = useCallback(() => setState((s) => ({ ...s, count: s.count + pageSize })), [pageSize])

  return {
    visible: count >= items.length ? items : items.slice(0, count),
    total: items.length,
    hasMore: count < items.length,
    showMore,
  }
}
