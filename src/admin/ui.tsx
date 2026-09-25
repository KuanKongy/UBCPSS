/**
 * Tiny shared styling vocabulary for the dashboard. Utilitarian on purpose:
 * the admin is a tool, not part of the public site's design language.
 */
import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Scrolls the element into view when it mounts. The edit forms render above
 * the list, so without this, clicking Edit far down the page looks like
 * nothing happened.
 */
export function useRevealOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])
  return ref
}

export const inputCls =
  'w-full rounded-lg border border-pss-300 bg-white px-3 py-2 text-[14px] text-pss-700 ' +
  'placeholder:text-pss-400 focus:outline-none focus:ring-2 focus:ring-pss-500/40'

export const btnPrimary =
  'rounded-lg bg-pss-600 px-4 py-2 text-[13px] font-bold text-white transition-colors ' +
  'hover:bg-pss-700 disabled:opacity-50 disabled:cursor-not-allowed'

export const btnGhost =
  'rounded-lg border border-pss-300 bg-white px-3 py-1.5 text-[13px] font-semibold text-pss-600 ' +
  'transition-colors hover:border-pss-500 hover:text-pss-700 disabled:opacity-40 disabled:cursor-not-allowed'

export const btnDanger =
  'rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-red-600 ' +
  'transition-colors hover:border-red-400 hover:bg-red-50'

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-bold uppercase tracking-[0.06em] text-pss-600">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-pss-500">{hint}</span>}
    </label>
  )
}

export function RowActions({
  onUp, onDown, onEdit, onDelete, upDisabled, downDisabled,
}: {
  onUp: () => void
  onDown: () => void
  onEdit: () => void
  onDelete: () => void
  upDisabled?: boolean
  downDisabled?: boolean
}) {
  return (
    <div className="flex flex-shrink-0 items-center gap-1.5">
      <button type="button" className={btnGhost} onClick={onUp} disabled={upDisabled} aria-label="Move up">↑</button>
      <button type="button" className={btnGhost} onClick={onDown} disabled={downDisabled} aria-label="Move down">↓</button>
      <button type="button" className={btnGhost} onClick={onEdit}>Edit</button>
      <button type="button" className={btnDanger} onClick={onDelete}>Delete</button>
    </div>
  )
}

export function EditorHeader({ title, hint, onAdd, addLabel }: {
  title: string
  hint?: string
  onAdd?: () => void
  addLabel?: string
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="font-syne text-[22px] font-bold text-pss-700">{title}</h2>
        {hint && <p className="text-[13px] text-pss-600">{hint}</p>}
      </div>
      {onAdd && (
        <button type="button" className={btnPrimary} onClick={onAdd}>
          {addLabel ?? '+ Add'}
        </button>
      )}
    </div>
  )
}
