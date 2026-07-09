import { EMAIL, LINKS } from '@/lib/data'
import { copyEmail } from '@/lib/clipboard'
import { cn } from '@/lib/utils'

const linkClass =
  'text-[12px] text-white/80 hover:text-white no-underline transition-colors duration-200 whitespace-nowrap'

type FooterItem =
  | { label: string; href: string; external: boolean }
  | { label: string; onClick: () => void; title: string }

const ITEMS: FooterItem[] = [
  { label: 'Instagram', href: LINKS.instagram, external: true },
  { label: 'Linktree',  href: LINKS.linktree,  external: true },
  { label: 'Email',     onClick: copyEmail,    title: `Copy ${EMAIL} to clipboard` },
  { label: 'Join PSS',  href: LINKS.amsSignup, external: true },
]

export default function Footer() {
  return (
    <footer className="bg-pss-900 px-8 md:px-12 py-7">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Logo, left */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <img
            src="/logo-96.webp"
            alt=""
            aria-hidden="true"
            className="w-9 h-9 rounded-full border border-white/30 bg-white/10 p-0.5 object-cover"
          />
          <span className="font-syne text-[12px] font-bold tracking-wider text-white/80 whitespace-nowrap hidden lg:block">
            UBC Project STEM Search
          </span>
        </div>

        {/* Acknowledgement, centre, fills available space */}
        <p className="flex-1 text-[11px] text-white/75 leading-relaxed text-center max-w-[580px] mx-auto">
          UBC Project STEM Search operates on the traditional, ancestral, and unceded territory of the{' '}
          <span className="text-white font-medium">xʷməθkʷəy̓əm (Musqueam)</span> people. As we build
          tomorrow's research community, we acknowledge our responsibility to understand and respect
          Indigenous histories, lands, and cultures.
        </p>

        {/* Links, right */}
        <nav aria-label="Footer navigation" className="flex-shrink-0 w-full md:w-auto">
          <ul className="flex flex-wrap gap-5 justify-center md:justify-end list-none">
            {ITEMS.map((item) => (
              <li key={item.label}>
                {'href' in item ? (
                  <a
                    href={item.href}
                    {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className={cn(linkClass, 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm')}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={item.onClick}
                    title={item.title}
                    className={cn(linkClass, 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm')}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
