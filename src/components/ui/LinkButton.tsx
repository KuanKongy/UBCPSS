import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'outline' | 'outline-white'
type Size = 'default' | 'sm'

const base =
  'inline-flex items-center gap-2 rounded-full font-sans font-bold transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pss-500 focus-visible:ring-offset-2'

const variants: Record<Variant, string> = {
  primary:       'bg-pss-700 text-white hover:bg-pss-600 hover:-translate-y-0.5 active:scale-95',
  outline:       'bg-transparent text-pss-700 border-2 border-pss-400 hover:bg-white/60 hover:-translate-y-0.5 active:scale-95',
  'outline-white': 'bg-transparent text-white border-2 border-white/50 hover:bg-white/15 hover:-translate-y-0.5 active:scale-95',
}

const sizes: Record<Size, string> = {
  default: 'text-[15px] px-7 py-3.5',
  sm:      'text-[13px] px-5 py-2',
}

interface LinkButtonProps {
  href: string
  variant?: Variant
  size?: Size
  external?: boolean
  children: ReactNode
  className?: string
}

export default function LinkButton({
  href,
  variant = 'primary',
  size = 'default',
  external = false,
  children,
  className,
}: LinkButtonProps) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </a>
  )
}
