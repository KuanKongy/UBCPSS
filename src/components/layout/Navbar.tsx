import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LINKS } from '@/lib/data'

const NAV_LINKS = [
  { label: 'About',        href: '#about'        },
  { label: 'What We Do',   href: '#what'         },
  { label: 'Events',       href: '#events'       },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ',          href: '#faq'          },
  { label: 'Contact',      href: '#get-started'  },
] as const

export default function Navbar() {
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Active section highlight on scroll
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[id]')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  // Close drawer on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handle = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [menuOpen])

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-3.5
                   bg-pss-100/85 backdrop-blur-[16px] border-b border-pss-400/20"
        style={{ WebkitBackdropFilter: 'blur(16px)' }}
      >
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className="flex items-center gap-2.5 text-decoration-none group"
          aria-label="UBC Project STEM Search — back to top"
        >
          <img
            src="/favicon.svg"
            alt=""
            aria-hidden="true"
            className="w-[44px] h-[44px] flex-shrink-0 rounded-full border border-pss-500/40 bg-pss-100 p-0.5 object-cover"
          />
          <span className="font-syne text-[13px] font-bold tracking-[0.04em] text-pss-700 hidden sm:block">
            UBC PROJECT STEM SEARCH
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-7 list-none" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                onClick={(e) => { e.preventDefault(); handleNavClick(href) }}
                className={`text-[13px] font-medium no-underline transition-colors duration-200
                            ${active === href.slice(1) ? 'text-pss-700 font-semibold' : 'text-pss-500 hover:text-pss-700'}`}
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={LINKS.linktree}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pss-700 text-white text-[13px] font-bold px-[22px] py-2 rounded-full
                         hover:bg-pss-600 transition-all duration-200 hover:-translate-y-px"
            >
              Join Now
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] cursor-pointer
                     rounded-lg hover:bg-pss-100/60 transition-colors"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="block w-5 h-0.5 bg-pss-700 rounded-full origin-center"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.15 }}
            className="block w-5 h-0.5 bg-pss-700 rounded-full"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="block w-5 h-0.5 bg-pss-700 rounded-full origin-center"
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={drawerRef}
            key="mobile-drawer"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed top-[57px] left-0 right-0 z-40 bg-pss-100/95 backdrop-blur-xl
                       border-b border-pss-400/20 shadow-lg md:hidden"
            style={{ WebkitBackdropFilter: 'blur(20px)' }}
          >
            <div className="flex flex-col py-4 px-6 gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(href) }}
                  className="text-[16px] font-medium text-pss-700 py-3 px-2 rounded-lg
                             hover:bg-pss-200/60 transition-colors"
                >
                  {label}
                </a>
              ))}
              <div className="pt-3 pb-1">
                <a
                  href={LINKS.linktree}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-pss-700 text-white text-[15px] font-bold
                             py-3 rounded-full hover:bg-pss-600 transition-colors"
                >
                  Join Now ↗
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
