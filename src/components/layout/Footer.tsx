import { LINKS } from '@/lib/data'

export default function Footer() {
  return (
    <footer>
      {/* Main footer row */}
      <div
        className="bg-pss-900 flex flex-wrap items-center justify-between gap-5
                   px-12 py-9 md:flex-row flex-col text-center md:text-left"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img
            src="/favicon.svg"
            alt=""
            aria-hidden="true"
            className="w-10 h-10 flex-shrink-0 rounded-full border border-white/30 bg-white/10 p-0.5 object-cover"
          />
          <span className="font-syne text-[13px] font-bold tracking-wider text-white/50">
            UBC Project STEM Search
          </span>
        </div>

        {/* Links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-6 md:gap-7 justify-center list-none">
            {[
              { label: 'Instagram', href: LINKS.instagram, external: true  },
              { label: 'Linktree',  href: LINKS.linktree,  external: true  },
              { label: 'Email',     href: LINKS.email,     external: false },
              { label: 'Join PSS',  href: LINKS.amsSignup, external: true  },
            ].map(({ label, href, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="text-[13px] text-white/40 hover:text-white no-underline transition-colors duration-200"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Land acknowledgement */}
      <div className="bg-black/30 px-8 py-4 text-center">
        <p className="text-[11px] text-white/28 max-w-[600px] mx-auto leading-relaxed">
          UBC Project STEM Search operates on the traditional, ancestral, and unceded territory of the{' '}
          <span className="text-white/40">xʷməθkʷəy̓əm (Musqueam)</span> people. As we build
          tomorrow's research community, we acknowledge our responsibility to understand and respect
          Indigenous histories, lands, and cultures.
        </p>
      </div>
    </footer>
  )
}
