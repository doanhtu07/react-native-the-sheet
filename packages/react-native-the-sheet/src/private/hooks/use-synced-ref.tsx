import { useRef } from 'react'

export function useSyncedRef<T>(value: T) {
  const ref = useRef(value)
  ref.current = value
  return ref
}
