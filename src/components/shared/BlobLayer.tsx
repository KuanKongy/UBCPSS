import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

type BlobVariant = 'hero' | 'about' | 'what' | 'events' | 'testi' | 'faq' | 'gs' | 'gallery' | 'team'

interface BlobLayerProps {
  variant: BlobVariant
}

// Coarse-pointer/small screens skip the scroll parallax (checked once — fine for
// a decorative effect; a resize mid-session just means no parallax until reload).
const smallScreen =
  typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

// Mobile blob tints: [primary fill, opacity, secondary fill]
const LIGHT: [string, number, string] = ['#C8E0F2', 0.45, '#B4D1E9']
const DARK: [string, number, string] = ['rgba(255,255,255,.08)', 1, 'rgba(255,255,255,.08)']
const MOBILE_FILLS: Record<BlobVariant, [string, number, string]> = {
  hero: LIGHT, about: LIGHT, what: LIGHT, events: LIGHT, faq: LIGHT, gs: LIGHT, gallery: LIGHT,
  testi: DARK, team: DARK,
}

export default function BlobLayer({ variant }: BlobLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [24, -24])
  const parallax = reducedMotion || smallScreen ? undefined : { y }

  return (
    <div ref={ref} className="blob-layer" aria-hidden="true">
      <motion.div style={parallax} className="w-full h-full">
        {smallScreen ? (
          /* Phones: every desktop box is landscape and gets slice-scaled 3–5×
             on a tall section, which pushes all the blobs off-screen. One
             portrait set, tinted per section, keeps the clouds alive. */
          <svg width="100%" height="100%" viewBox="0 0 480 1000" preserveAspectRatio="xMidYMin slice">
            <path className="blob-drift-a" d="M380 -40 C450 -60,530 0,540 90 C550 180,500 260,430 270 C360 280,300 220,300 140 C300 70,320 -20,380 -40Z" fill={MOBILE_FILLS[variant][0]} opacity={MOBILE_FILLS[variant][1]}/>
            <path className="blob-drift-b" d="M-60 420 C0 370,110 380,150 450 C190 520,170 620,100 650 C30 680,-60 640,-90 570 C-120 500,-110 450,-60 420Z" fill={MOBILE_FILLS[variant][2]} opacity={MOBILE_FILLS[variant][1]}/>
            <path className="blob-drift-c" d="M360 800 C440 760,540 800,560 890 C580 980,530 1060,450 1070 C370 1080,300 1030,290 950 C280 880,300 830,360 800Z" fill={MOBILE_FILLS[variant][0]} opacity={MOBILE_FILLS[variant][1]}/>
          </svg>
        ) : (
        <>
        {variant === 'hero' && (
          <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            {/* Mesh washes: light pools inside each cloud instead of a flat
                fill — the 2–3 tone depth of the club's Instagram clouds */}
            <defs>
              <radialGradient id="heroMeshA" cx="38%" cy="30%" r="80%">
                <stop offset="0%"  stopColor="#C6DEF2"/>
                <stop offset="55%" stopColor="#A4C4E0"/>
                <stop offset="100%" stopColor="#90B6D8"/>
              </radialGradient>
              <radialGradient id="heroMeshB" cx="62%" cy="62%" r="85%">
                <stop offset="0%"  stopColor="#D9EBF9"/>
                <stop offset="60%" stopColor="#B8D4EC"/>
                <stop offset="100%" stopColor="#A6C6E2"/>
              </radialGradient>
            </defs>
            <path className="blob-drift-a" d="M-160 -120 C-40 -180,160 -100,260 60 C360 220,320 440,200 540 C80 640,-80 620,-160 500 C-240 380,-280 180,-260 60 C-250 0,-220 -80,-160 -120Z" fill="url(#heroMeshA)" opacity=".65"/>
            <path className="blob-drift-b" d="M-80 -60 C60 -120,240 -60,340 100 C440 260,400 460,280 550 C160 640,20 610,-60 490 C-140 370,-160 200,-140 80 C-130 20,-100 -40,-80 -60Z" fill="url(#heroMeshB)" opacity=".45"/>
            <path className="blob-drift-c" d="M1280 580 C1380 540,1520 580,1540 700 C1560 820,1480 930,1380 950 C1280 970,1160 910,1140 810 C1120 720,1160 600,1200 570 C1230 545,1250 615,1280 580Z" fill="url(#heroMeshA)" opacity=".55"/>
            <path className="blob-breathe" d="M1340 680 C1400 650,1500 670,1520 750 C1540 830,1500 920,1440 940 C1380 960,1300 920,1280 850 C1260 785,1295 705,1340 680Z" fill="#C2D8EE" opacity=".5"/>
            <path d="M1100 180 C1180 135,1300 155,1340 250 C1380 345,1340 455,1270 480 C1200 510,1100 455,1070 365 C1045 290,1055 218,1100 180Z" fill="url(#heroMeshB)" opacity=".3"/>
          </svg>
        )}
        {variant === 'about' && (
          <svg width="100%" height="100%" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="aboutMesh0" cx="35%" cy="32%" r="82%">
                <stop offset="0%"  stopColor="#E2F1FA"/>
                <stop offset="55%" stopColor="#D0E8F5"/>
                <stop offset="100%" stopColor="#BFD9EE"/>
              </radialGradient>
              <radialGradient id="aboutMesh1" cx="62%" cy="62%" r="82%">
                <stop offset="0%"  stopColor="#DCEDF9"/>
                <stop offset="55%" stopColor="#C8E0F2"/>
                <stop offset="100%" stopColor="#B4D1E9"/>
              </radialGradient>
            </defs>
            <path className="blob-drift-a" d="M1200 90 C1300 40,1460 70,1480 195 C1500 320,1420 420,1320 440 C1220 460,1120 390,1100 290 C1080 198,1132 132,1200 90Z" fill="url(#aboutMesh0)" opacity=".55"/>
            <path className="blob-drift-b" d="M-80 490 C-20 430,105 420,185 475 C265 530,290 635,248 705 C208 775,98 800,18 770 C-62 740,-102 648,-102 578 C-102 538,-100 520,-80 490Z" fill="url(#aboutMesh1)" opacity=".45"/>
          </svg>
        )}
        {variant === 'what' && (
          <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="whatMesh0" cx="35%" cy="32%" r="82%">
                <stop offset="0%"  stopColor="#C6DEF2"/>
                <stop offset="55%" stopColor="#A4C4E0"/>
                <stop offset="100%" stopColor="#90B6D8"/>
              </radialGradient>
              <radialGradient id="whatMesh1" cx="62%" cy="62%" r="82%">
                <stop offset="0%"  stopColor="#98C4DA"/>
                <stop offset="55%" stopColor="#7AAFC8"/>
                <stop offset="100%" stopColor="#66A0BC"/>
              </radialGradient>
            </defs>
            <path className="blob-drift-b" d="M-120 -80 C0 -140,200 -80,280 80 C360 240,320 440,180 520 C40 600,-100 540,-160 400 C-220 260,-220 60,-120 -80Z" fill="url(#whatMesh0)" opacity=".5"/>
            <path className="blob-drift-c" d="M1300 600 C1380 560,1500 580,1520 680 C1540 780,1480 880,1400 900 C1320 920,1220 860,1200 770 C1180 690,1230 632,1300 600Z" fill="url(#whatMesh1)" opacity=".4"/>
            <path className="blob-drift-a" d="M600 -80 C680 -110,800 -80,840 0 C880 80,848 182,788 210 C728 238,640 198,600 118 C564 52,554 -54,600 -80Z" fill="#B8D4EC" opacity=".35"/>
          </svg>
        )}
        {variant === 'events' && (
          /* Width-driven scale anchored to the top (like faq/gallery): the list
             grows when expanded, so a 700-unit xMidYMid box would blow up and
             centre, pushing every side blob off-screen. */
          <svg width="100%" height="100%" viewBox="0 0 1440 1500" preserveAspectRatio="xMidYMin slice">
            <defs>
              <radialGradient id="eventsMesh0" cx="35%" cy="32%" r="82%">
                <stop offset="0%"  stopColor="#DCEDF9"/>
                <stop offset="55%" stopColor="#C8E0F2"/>
                <stop offset="100%" stopColor="#B4D1E9"/>
              </radialGradient>
              <radialGradient id="eventsMesh1" cx="62%" cy="62%" r="82%">
                <stop offset="0%"  stopColor="#D3E1F5"/>
                <stop offset="55%" stopColor="#BDD0EC"/>
                <stop offset="100%" stopColor="#A9C1E2"/>
              </radialGradient>
            </defs>
            {/* 1 top-right, behind the heading */}
            <path className="blob-drift-a" d="M1180 -80 C1300 -60,1445 40,1462 162 C1480 282,1420 382,1320 410 C1220 438,1100 380,1080 278 C1060 188,1110 80,1180 -80Z" fill="url(#eventsMesh0)" opacity=".5"/>
            {/* 2 left, beside the first cards */}
            <path className="blob-drift-c" d="M-60 500 C20 460,140 470,180 540 C220 610,200 700,130 730 C60 760,-40 720,-70 650 C-100 590,-100 530,-60 500Z" fill="url(#eventsMesh1)" opacity=".45"/>
            {/* 3 right, beside the lower cards (flat fill so the breathe reads) */}
            <path className="blob-breathe" d="M1300 900 C1380 850,1520 880,1550 970 C1580 1060,1540 1180,1450 1220 C1360 1260,1260 1210,1240 1120 C1220 1030,1250 950,1300 900Z" fill="#B8D4EC" opacity=".45"/>
            {/* 4 small bottom-left, under the expander */}
            <path className="blob-drift-b" d="M-80 1260 C0 1200,130 1220,170 1300 C210 1380,180 1470,100 1500 C20 1530,-90 1490,-130 1410 C-170 1330,-150 1300,-80 1260Z" fill="url(#eventsMesh1)" opacity=".4"/>
          </svg>
        )}
        {variant === 'testi' && (
          <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="testiMesh0" cx="40%" cy="35%" r="85%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.14)"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0.03)"/>
              </radialGradient>
            </defs>
            <path className="blob-drift-b" d="M-100 100 C-20 40,120 40,180 120 C240 200,220 320,140 380 C60 440,-60 400,-100 310 C-140 230,-160 150,-100 100Z" fill="url(#testiMesh0)"/>
            <path className="blob-drift-a" d="M1260 500 C1340 460,1460 480,1490 580 C1520 680,1470 780,1390 800 C1310 820,1210 760,1190 670 C1170 590,1200 530,1260 500Z" fill="url(#testiMesh0)"/>
          </svg>
        )}
        {variant === 'faq' && (
          /* xMidYMin + tall viewBox: scale always driven by width (1×), anchored to top.
             As accordion opens and section grows, more of the SVG is revealed from the
             bottom — no jump/reposition. */
          <svg width="100%" height="100%" viewBox="0 0 1440 1800" preserveAspectRatio="xMidYMin slice">
            <defs>
              <radialGradient id="faqMesh0" cx="35%" cy="32%" r="82%">
                <stop offset="0%"  stopColor="#E2F1FA"/>
                <stop offset="55%" stopColor="#D0E8F5"/>
                <stop offset="100%" stopColor="#BFD9EE"/>
              </radialGradient>
              <radialGradient id="faqMesh1" cx="62%" cy="62%" r="82%">
                <stop offset="0%"  stopColor="#D6E7F8"/>
                <stop offset="55%" stopColor="#C0D8F0"/>
                <stop offset="100%" stopColor="#ACC8E6"/>
              </radialGradient>
            </defs>
            <path className="blob-drift-a" d="M-100 200 C-20 130,120 110,200 170 C280 230,300 345,260 435 C220 522,110 560,30 522 C-50 482,-100 382,-110 302 C-120 240,-148 250,-100 200Z" fill="url(#faqMesh0)" opacity=".55"/>
            <path className="blob-drift-b" d="M1320 500 C1400 460,1500 480,1520 562 C1540 642,1500 740,1430 758 C1360 778,1270 732,1250 650 C1232 580,1262 530,1320 500Z" fill="url(#faqMesh1)" opacity=".45"/>
            <path className="blob-drift-c" d="M700 -60 C780 -90,900 -60,940 20 C980 100,950 202,880 230 C810 258,720 210,690 130 C660 58,648 -36,700 -60Z" fill="#C8DDF2" opacity=".35"/>
          </svg>
        )}
        {variant === 'gs' && (
          <svg width="100%" height="100%" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="gsMesh0" cx="35%" cy="32%" r="82%">
                <stop offset="0%"  stopColor="#C6DEF2"/>
                <stop offset="55%" stopColor="#A4C4E0"/>
                <stop offset="100%" stopColor="#90B6D8"/>
              </radialGradient>
              <radialGradient id="gsMesh1" cx="62%" cy="62%" r="82%">
                <stop offset="0%"  stopColor="#98C4DA"/>
                <stop offset="55%" stopColor="#7AAFC8"/>
                <stop offset="100%" stopColor="#66A0BC"/>
              </radialGradient>
            </defs>
            <path className="blob-drift-c" d="M-120 -80 C0 -140,200 -80,280 60 C360 200,320 380,180 460 C40 540,-100 480,-160 340 C-220 210,-220 30,-120 -80Z" fill="url(#gsMesh0)" opacity=".55"/>
            <path className="blob-drift-a" d="M1300 -60 C1400 -82,1522 0,1542 120 C1562 242,1500 362,1400 400 C1300 440,1180 378,1160 268 C1140 170,1200 38,1300 -60Z" fill="url(#gsMesh1)" opacity=".45"/>
            <path className="blob-drift-b" d="M580 520 C660 490,780 500,820 570 C860 640,840 730,770 760 C700 790,600 750,565 680 C535 620,530 545,580 520Z" fill="#B8D4EC" opacity=".4"/>
            <path className="blob-breathe" d="M-60 490 C22 452,142 462,182 535 C222 608,200 700,130 730 C60 758,-40 720,-70 650 C-100 588,-100 525,-60 490Z" fill="#A4C4E0" opacity=".4"/>
          </svg>
        )}
        {variant === 'gallery' && (
          /* Width-driven scale anchored to the top (like faq): the section is
             ~1900px tall, so a 900-unit xMidYMid box would blow up and centre,
             pushing every side blob off-screen. Blobs stay in the margins
             (feathering to x≈200 / ≥1240 at most) down the whole section. */
          <svg width="100%" height="100%" viewBox="0 0 1440 2000" preserveAspectRatio="xMidYMin slice">
            <defs>
              <radialGradient id="galleryMesh0" cx="35%" cy="32%" r="82%">
                <stop offset="0%"  stopColor="#DCEDF9"/>
                <stop offset="55%" stopColor="#C8E0F2"/>
                <stop offset="100%" stopColor="#B4D1E9"/>
              </radialGradient>
              <radialGradient id="galleryMesh1" cx="62%" cy="62%" r="82%">
                <stop offset="0%"  stopColor="#CFE2F4"/>
                <stop offset="55%" stopColor="#B8D0E8"/>
                <stop offset="100%" stopColor="#A3C1DE"/>
              </radialGradient>
            </defs>
            {/* 1 top-left, behind the heading / row 1 gutter */}
            <path className="blob-drift-a" d="M-120 120 C-40 40,110 40,180 120 C230 190,225 320,160 395 C95 465,-20 460,-90 390 C-160 320,-180 200,-120 120Z" fill="url(#galleryMesh0)" opacity=".5"/>
            {/* 2 right, beside row 2 */}
            <path className="blob-drift-b" d="M1300 400 C1380 340,1520 360,1560 460 C1600 560,1560 700,1460 750 C1360 800,1250 740,1230 640 C1210 550,1230 460,1300 400Z" fill="url(#galleryMesh1)" opacity=".45"/>
            {/* 3 left, beside row 3 */}
            <path className="blob-drift-c" d="M-80 960 C10 890,150 910,190 1000 C230 1090,200 1240,110 1300 C20 1350,-100 1320,-140 1230 C-180 1140,-160 1020,-80 960Z" fill="url(#galleryMesh0)" opacity=".45"/>
            {/* 4 right, beside the linked cards (flat fill so the breathe reads) */}
            <path className="blob-breathe" d="M1320 1180 C1400 1130,1520 1160,1550 1250 C1580 1340,1540 1460,1450 1500 C1360 1540,1260 1490,1240 1400 C1220 1310,1250 1230,1320 1180Z" fill="#B8D4EC" opacity=".45"/>
            {/* 5 bottom-left, under the wave */}
            <path className="blob-drift-a" d="M-100 1580 C-20 1510,120 1530,170 1620 C220 1710,190 1830,100 1870 C10 1910,-110 1870,-150 1780 C-190 1690,-170 1640,-100 1580Z" fill="#A4C4E0" opacity=".35"/>
            {/* 6 small top-right */}
            <path className="blob-drift-c" d="M1340 -30 C1420 -70,1520 -20,1540 70 C1560 160,1500 230,1420 230 C1340 230,1280 170,1280 90 C1280 30,1290 0,1340 -30Z" fill="url(#galleryMesh1)" opacity=".35"/>
          </svg>
        )}
        </>
        )}
      </motion.div>
    </div>
  )
}
