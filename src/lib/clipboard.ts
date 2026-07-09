import { EMAIL } from './data'
import { toast } from './toast'

/**
 * Copy text to the clipboard. Uses the async Clipboard API on secure origins;
 * otherwise a synchronous hidden-textarea + execCommand fallback. The fallback
 * runs before any await so Safari still sees the click as a user gesture.
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // fall through to the legacy path
    }
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.top = '0'
    ta.style.left = '0'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    ta.setSelectionRange(0, text.length)
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

/** Copy the club email and confirm with a toast. Shared by every "Email" control. */
export async function copyEmail() {
  const ok = await copyText(EMAIL)
  toast(ok ? `Email copied: ${EMAIL}` : `Copy failed. Email us at ${EMAIL}`)
}
