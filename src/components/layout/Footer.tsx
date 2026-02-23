import { LINKS } from '@/lib/data'

export default function Footer() {
  return (
    <footer className="bg-pss-900 px-8 md:px-12 py-7">
      <div className="flex items-center gap-6">
        {/* Logo — left */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <img
            src="/favicon.svg"
            alt=""
            aria-hidden="true"
            className="w-9 h-9 rounded-full border border-white/30 bg-white/10 p-0.5 object-cover"
          />
          <span className="font-syne text-[12px] font-bold tracking-wider text-white/50 whitespace-nowrap hidden lg:block">
            UBC Project STEM Search
          </span>
        </div>

        {/* Acknowledgement — centre, fills available space */}
        <p className="flex-1 text-[11px] text-white/55 leading-relaxed text-center max-w-[380px] mx-auto">
          UBC Project STEM Search operates on the traditional, ancestral, and unceded territory of the{' '}
          <span className="text-white/80 font-medium">xʷməθkʷəy̓əm (Musqueam)</span> people. As we build
          tomorrow's research community, we acknowledge our responsibility to understand and respect
          Indigenous histories, lands, and cultures.
        </p>

        {/* Links — right */}
        <nav aria-label="Footer navigation" className="flex-shrink-0">
          <ul className="flex flex-wrap gap-5 justify-end list-none">
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
                  className="text-[12px] text-white/45 hover:text-white no-underline transition-colors duration-200 whitespace-nowrap"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
