// Tiny module-level toast bus: any code calls toast(); ToastHost (mounted once
// in App) renders whatever arrives. No context/provider needed for one host.
export interface ToastItem {
  id: number
  message: string
}

type Listener = (t: ToastItem) => void

const listeners = new Set<Listener>()
let seq = 0

export function toast(message: string) {
  const item: ToastItem = { id: ++seq, message }
  listeners.forEach((l) => l(item))
}

export function subscribeToasts(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
