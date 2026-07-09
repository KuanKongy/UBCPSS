import { MotionConfig } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ToastHost from '@/components/shared/Toast'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import WhatWeDo from '@/components/sections/WhatWeDo'
import Events from '@/components/sections/Events'
import Testimonials from '@/components/sections/Testimonials'
import Gallery from '@/components/sections/Gallery'
import FAQ from '@/components/sections/FAQ'
import GetStarted from '@/components/sections/GetStarted'
import Team from '@/components/sections/Team'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="overflow-x-hidden">
        <Navbar />
        <main>
          <Hero />
          <About />
          <WhatWeDo />
          <Events />
          <Testimonials />
          <Gallery />
          <FAQ />
          <GetStarted />
          <Team />
        </main>
        <Footer />
        <ToastHost />
      </div>
    </MotionConfig>
  )
}
