type BlobVariant = 'hero' | 'about' | 'what' | 'events' | 'testi' | 'faq' | 'gs' | 'gallery'

interface BlobLayerProps {
  variant: BlobVariant
}

export default function BlobLayer({ variant }: BlobLayerProps) {
  return (
    <div className="blob-layer" aria-hidden="true">
      {variant === 'hero' && (
        <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <path d="M-160 -120 C-40 -180,160 -100,260 60 C360 220,320 440,200 540 C80 640,-80 620,-160 500 C-240 380,-280 180,-260 60 C-250 0,-220 -80,-160 -120Z" fill="#A4C4E0" opacity=".65"/>
          <path d="M-80 -60 C60 -120,240 -60,340 100 C440 260,400 460,280 550 C160 640,20 610,-60 490 C-140 370,-160 200,-140 80 C-130 20,-100 -40,-80 -60Z" fill="#B8D4EC" opacity=".45"/>
          <path d="M1280 580 C1380 540,1520 580,1540 700 C1560 820,1480 930,1380 950 C1280 970,1160 910,1140 810 C1120 720,1160 600,1200 570 C1230 545,1250 615,1280 580Z" fill="#A4C4E0" opacity=".55"/>
          <path d="M1340 680 C1400 650,1500 670,1520 750 C1540 830,1500 920,1440 940 C1380 960,1300 920,1280 850 C1260 785,1295 705,1340 680Z" fill="#C2D8EE" opacity=".5"/>
          <path d="M1100 180 C1180 135,1300 155,1340 250 C1380 345,1340 455,1270 480 C1200 510,1100 455,1070 365 C1045 290,1055 218,1100 180Z" fill="#B8D0E8" opacity=".3"/>
        </svg>
      )}
      {variant === 'about' && (
        <svg width="100%" height="100%" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
          <path d="M1200 90 C1300 40,1460 70,1480 195 C1500 320,1420 420,1320 440 C1220 460,1120 390,1100 290 C1080 198,1132 132,1200 90Z" fill="#D0E8F5" opacity=".55"/>
          <path d="M-80 490 C-20 430,105 420,185 475 C265 530,290 635,248 705 C208 775,98 800,18 770 C-62 740,-102 648,-102 578 C-102 538,-100 520,-80 490Z" fill="#C8E0F2" opacity=".45"/>
        </svg>
      )}
      {variant === 'what' && (
        <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <path d="M-120 -80 C0 -140,200 -80,280 80 C360 240,320 440,180 520 C40 600,-100 540,-160 400 C-220 260,-220 60,-120 -80Z" fill="#A4C4E0" opacity=".5"/>
          <path d="M1300 600 C1380 560,1500 580,1520 680 C1540 780,1480 880,1400 900 C1320 920,1220 860,1200 770 C1180 690,1230 632,1300 600Z" fill="#7AAFC8" opacity=".4"/>
          <path d="M600 -80 C680 -110,800 -80,840 0 C880 80,848 182,788 210 C728 238,640 198,600 118 C564 52,554 -54,600 -80Z" fill="#B8D4EC" opacity=".35"/>
        </svg>
      )}
      {variant === 'events' && (
        <svg width="100%" height="100%" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice">
          <path d="M1180 -80 C1300 -60,1445 40,1462 162 C1480 282,1420 382,1320 410 C1220 438,1100 380,1080 278 C1060 188,1110 80,1180 -80Z" fill="#C8E0F2" opacity=".5"/>
          <path d="M-60 480 C20 440,140 450,180 520 C220 590,200 680,130 710 C60 740,-40 700,-70 630 C-100 570,-100 510,-60 480Z" fill="#BDD0EC" opacity=".45"/>
        </svg>
      )}
      {variant === 'testi' && (
        <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <path d="M-100 100 C-20 40,120 40,180 120 C240 200,220 320,140 380 C60 440,-60 400,-100 310 C-140 230,-160 150,-100 100Z" fill={'rgba(255,255,255,0.07)'}/>
          <path d="M1260 500 C1340 460,1460 480,1490 580 C1520 680,1470 780,1390 800 C1310 820,1210 760,1190 670 C1170 590,1200 530,1260 500Z" fill={'rgba(255,255,255,0.06)'}/>
        </svg>
      )}
      {variant === 'faq' && (
        /* xMidYMin + tall viewBox: scale always driven by width (1×), anchored to top.
           As accordion opens and section grows, more of the SVG is revealed from the
           bottom — no jump/reposition. */
        <svg width="100%" height="100%" viewBox="0 0 1440 1800" preserveAspectRatio="xMidYMin slice">
          <path d="M-100 200 C-20 130,120 110,200 170 C280 230,300 345,260 435 C220 522,110 560,30 522 C-50 482,-100 382,-110 302 C-120 240,-148 250,-100 200Z" fill="#D0E8F5" opacity=".55"/>
          <path d="M1320 500 C1400 460,1500 480,1520 562 C1540 642,1500 740,1430 758 C1360 778,1270 732,1250 650 C1232 580,1262 530,1320 500Z" fill="#C0D8F0" opacity=".45"/>
          <path d="M700 -60 C780 -90,900 -60,940 20 C980 100,950 202,880 230 C810 258,720 210,690 130 C660 58,648 -36,700 -60Z" fill="#C8DDF2" opacity=".35"/>
        </svg>
      )}
      {variant === 'gs' && (
        <svg width="100%" height="100%" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice">
          <path d="M-120 -80 C0 -140,200 -80,280 60 C360 200,320 380,180 460 C40 540,-100 480,-160 340 C-220 210,-220 30,-120 -80Z" fill="#A4C4E0" opacity=".55"/>
          <path d="M1300 -60 C1400 -82,1522 0,1542 120 C1562 242,1500 362,1400 400 C1300 440,1180 378,1160 268 C1140 170,1200 38,1300 -60Z" fill="#7AAFC8" opacity=".45"/>
          <path d="M580 520 C660 490,780 500,820 570 C860 640,840 730,770 760 C700 790,600 750,565 680 C535 620,530 545,580 520Z" fill="#B8D4EC" opacity=".4"/>
          <path d="M-60 490 C22 452,142 462,182 535 C222 608,200 700,130 730 C60 758,-40 720,-70 650 C-100 588,-100 525,-60 490Z" fill="#A4C4E0" opacity=".4"/>
        </svg>
      )}
      {variant === 'gallery' && (
        <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <path d="M-100 100 C20 40,200 60,280 180 C360 300,340 460,200 520 C60 580,-80 520,-120 390 C-160 270,-170 130,-100 100Z" fill="#C8E0F2" opacity=".5"/>
          <path d="M1280 560 C1360 520,1480 540,1500 640 C1520 740,1470 840,1390 860 C1310 880,1210 820,1190 730 C1170 650,1210 590,1280 560Z" fill="#B8D0E8" opacity=".45"/>
          <path d="M640 -60 C720 -90,840 -60,880 20 C920 100,890 202,820 230 C750 258,660 210,630 130 C600 58,588 -36,640 -60Z" fill="#D0E8F5" opacity=".4"/>
          <path d="M700 760 C780 730,900 750,940 830 C980 910,950 980,880 1000 C810 1020,720 975,690 900 C660 835,648 782,700 760Z" fill="#A4C4E0" opacity=".35"/>
        </svg>
      )}
    </div>
  )
}
