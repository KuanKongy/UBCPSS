/**
 * Hand-drawn science line-art layer — the visual language of the club's
 * Instagram posts (outlined doodles, dotted connector lines with dot
 * terminals, dashed accents) brought onto the site as quiet decoration.
 *
 * Composition rules (v2 — no isolated glyphs):
 *  - every motif is a CLUSTER: main glyph + satellite detail + a dotted
 *    connector or sparkle tying it to the scene
 *  - clusters sit ON the cloud edges from BlobLayer (coordinates chosen to
 *    overlap each variant's blob silhouettes), not floating in empty space
 *  - dark sections (testi, team) draw in translucent white
 *  - the only motion is the slow .doodle-draw dash drift
 */

type DoodleVariant =
  | 'hero' | 'about' | 'what' | 'events' | 'testi' | 'gallery' | 'team' | 'gs' | 'faq'

interface SciDoodlesProps {
  variant: DoodleVariant
}

export default function SciDoodles({ variant }: SciDoodlesProps) {
  return (
    <div className="blob-layer" aria-hidden="true">
      {variant === 'hero' && (
        <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
          {/* Trajectory arc sweeping over the headline, feeding the hex pair */}
          <path
            className="doodle-draw"
            d="M-40 210 C 260 120, 620 96, 900 150 C 1120 192, 1330 288, 1480 400"
            stroke="#4A7A9B" strokeWidth="1.8" strokeLinecap="round" opacity=".28"
          />
          {/* Hex pair hangs off the arc via a short dotted spur */}
          <g opacity=".3" stroke="#4A7A9B" strokeWidth="1.8" strokeLinejoin="round">
            <path d="M782 124 v-16" strokeDasharray="1 6" strokeLinecap="round"/>
            <path d="M760 132 l14 8 v16 l-14 8 -14 -8 v-16 Z"/>
            <path d="M788 148 l14 8 v16 l-14 8 -14 -8 v-16 Z"/>
          </g>
          {/* Flask cluster on the bottom-left cloud edge: flask + rising dotted
              bubbles that become the swipe connector line */}
          <g opacity=".4" stroke="#2E5F82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M78 742 h20 M82 742 v22 l-20 34 a7 7 0 0 0 6 11 h40 a7 7 0 0 0 6-11 l-20-34 v-22"/>
            <path d="M70 786 h36" strokeWidth="1.6"/>
            <circle cx="83" cy="796" r="2.4" strokeWidth="1.4"/>
            <circle cx="93" cy="790" r="1.7" strokeWidth="1.4"/>
            <circle cx="104" cy="768" r="1.6" strokeWidth="1.3" opacity=".8"/>
            <circle cx="112" cy="750" r="1.3" strokeWidth="1.2" opacity=".6"/>
          </g>
          <g opacity=".45">
            <circle cx="120" cy="826" r="4" fill="#4A7A9B"/>
            <path
              d="M124 826 C 300 796, 520 840, 700 812"
              stroke="#4A7A9B" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 9"
            />
            <circle cx="704" cy="812" r="4" fill="#4A7A9B" opacity=".8"/>
          </g>
        </svg>
      )}

      {variant === 'about' && (
        <svg width="100%" height="100%" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" fill="none">
          {/* Magnifier cluster sitting on the top-right cloud edge: lens over a
              dotted "specimen trail" that runs along the cloud silhouette */}
          <g opacity=".32" stroke="#4A7A9B" strokeWidth="2" strokeLinecap="round">
            <circle cx="1216" cy="404" r="22"/>
            <circle cx="1216" cy="404" r="15" strokeWidth="1.2" opacity=".7"/>
            <path d="M1233 421 l16 16"/>
            <circle cx="1211" cy="400" r="2.6" strokeWidth="1.4"/>
            <circle cx="1222" cy="409" r="1.7" strokeWidth="1.2"/>
          </g>
          <g opacity=".34">
            <path d="M1190 428 C 1100 470, 990 480, 880 462" stroke="#4A7A9B" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 9"/>
            <circle cx="876" cy="461" r="3.6" fill="#4A7A9B"/>
          </g>
          {/* Notebook cluster on the bottom-left cloud: open book + pencil tick
              marks + connector dots rising off the page */}
          <g opacity=".32" stroke="#4A7A9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M96 636 q26 -12 52 0 v40 q-26 -12 -52 0 Z"/>
            <path d="M122 630 v40" strokeWidth="1.5"/>
            <path d="M104 646 h12 M104 654 h12 M132 646 h12 M132 654 h12" strokeWidth="1.4"/>
          </g>
          <g opacity=".3">
            <path d="M160 640 C 210 610, 260 604, 310 616" stroke="#4A7A9B" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1 8"/>
            <circle cx="314" cy="617" r="3.2" fill="#4A7A9B"/>
          </g>
        </svg>
      )}

      {variant === 'what' && (
        <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
          {/* Test-tube rack cluster on the bottom-right cloud: tubes in a stand,
              dotted vapour trail curling up the cloud edge */}
          <g opacity=".35" stroke="#2E5F82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1316 742 h14 M1319 742 v52 a4.5 4.5 0 0 0 9 0 v-52"/>
            <path d="M1319 772 h9" strokeWidth="1.5"/>
            <path d="M1344 726 h14 M1347 726 v68 a4.5 4.5 0 0 0 9 0 v-68"/>
            <path d="M1347 762 h9" strokeWidth="1.5"/>
            <circle cx="1352" cy="776" r="1.8" strokeWidth="1.3"/>
            <path d="M1306 806 h64" strokeWidth="1.8"/>
            <path d="M1310 806 v8 M1362 806 v8" strokeWidth="1.6"/>
          </g>
          <g opacity=".3">
            <path d="M1352 714 C 1340 680, 1360 650, 1344 618" stroke="#2E5F82" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1 8"/>
            <circle cx="1343" cy="613" r="2.8" fill="#2E5F82"/>
          </g>
          {/* Hex lattice growing off the top-left cloud edge, tied down with a
              dotted bond line */}
          <g opacity=".28" stroke="#4A7A9B" strokeWidth="1.8" strokeLinejoin="round">
            <path d="M96 116 l14 8 v16 l-14 8 -14 -8 v-16 Z"/>
            <path d="M124 132 l14 8 v16 l-14 8 -14 -8 v-16 Z"/>
            <path d="M110 148 v14" strokeDasharray="1 6" strokeLinecap="round"/>
            <circle cx="110" cy="167" r="2.6" fill="#4A7A9B" stroke="none"/>
          </g>
        </svg>
      )}

      {variant === 'events' && (
        <svg width="100%" height="100%" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice" fill="none">
          {/* Trajectory across the top, diving toward the timeline */}
          <path
            className="doodle-draw"
            d="M-40 96 C 300 40, 760 30, 1100 78 C 1280 104, 1400 150, 1480 190"
            stroke="#4A7A9B" strokeWidth="1.6" strokeLinecap="round" opacity=".22"
          />
          {/* Calendar cluster on the bottom-left cloud: calendar + pencil +
              dotted check trail pointing into the list */}
          <g opacity=".32" stroke="#2E5F82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="72" y="596" width="46" height="40" rx="7"/>
            <path d="M72 610 h46 M84 596 v-7 M106 596 v-7"/>
            <path d="M84 622 h8 M100 622 h8 M84 630 h8" strokeWidth="1.5"/>
            <path d="M128 640 l14 -18 M136 636 l3 3" strokeWidth="1.8"/>
          </g>
          <g opacity=".3">
            <path d="M126 590 C 170 560, 220 556, 268 566" stroke="#2E5F82" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1 8"/>
            <circle cx="272" cy="567" r="3" fill="#2E5F82"/>
          </g>
        </svg>
      )}

      {variant === 'testi' && (
        <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
          {/* Speech-mark cluster top-right: two rounded speech dots linked by a
              dotted thread — hear-from-members motif, white on dark */}
          <g opacity=".3">
            <circle cx="1180" cy="112" r="3.6" fill="#fff"/>
            <path d="M1184 112 C 1260 140, 1330 96, 1404 122" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 9"/>
            <circle cx="1408" cy="122" r="3.6" fill="#fff" opacity=".8"/>
          </g>
          <g opacity=".24" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1358 74 h30 a8 8 0 0 1 8 8 v16 a8 8 0 0 1 -8 8 h-16 l-10 9 v-9 h-4 a8 8 0 0 1 -8 -8 v-16 a8 8 0 0 1 8 -8 Z"/>
            <path d="M1366 88 h22 M1366 96 h14" strokeWidth="1.4"/>
          </g>
          {/* Atom cluster on the bottom-left cloud: atom + electron trail dots */}
          <g opacity=".22" stroke="#fff" strokeWidth="1.6">
            <ellipse cx="110" cy="790" rx="34" ry="13" transform="rotate(-24 110 790)"/>
            <ellipse cx="110" cy="790" rx="34" ry="13" transform="rotate(52 110 790)"/>
            <circle cx="110" cy="790" r="4" fill="#fff" stroke="none"/>
          </g>
          <g opacity=".2">
            <path d="M148 770 C 200 748, 252 750, 300 764" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="1 8"/>
            <circle cx="304" cy="765" r="2.8" fill="#fff"/>
          </g>
        </svg>
      )}

      {variant === 'gallery' && (
          /* Same width-driven, top-anchored box as the gallery BlobLayer, so the
             clusters stay registered to the blob edges down the whole section.
             Everything sits at x ≤ 130 or ≥ 1310: outside the content column
             down to 1280px viewports. */
          <svg width="100%" height="100%" viewBox="0 0 1440 2000" preserveAspectRatio="xMidYMin slice" fill="none">
            {/* A. Camera on the top-left blob: camera + flash sparks, dotted
                thread running down the margin */}
            <g transform="translate(-24 0)">
              <g opacity=".32" stroke="#2E5F82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="70" y="110" width="58" height="42" rx="9"/>
                <path d="M88 110 l5-8 h14 l5 8"/>
                <circle cx="99" cy="131" r="12"/>
                <circle cx="99" cy="131" r="5" strokeWidth="1.5"/>
                <circle cx="118" cy="120" r="1.8" strokeWidth="1.4"/>
                <path d="M136 96 l7 -7 M142 106 l9 -3 M130 90 l3 -9" strokeWidth="1.7"/>
              </g>
              <g opacity=".3">
                <path d="M100 160 C 84 220, 118 280, 96 340" stroke="#2E5F82" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1 8"/>
                <circle cx="95" cy="345" r="3" fill="#2E5F82"/>
              </g>
            </g>
            {/* B. Film strip on the right blob's lower edge, one loose frame beside it */}
            <g opacity=".32" stroke="#4A7A9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(8 1360 748)">
              <rect x="1338" y="700" width="44" height="96" rx="4"/>
              <rect x="1348" y="712" width="24" height="30" rx="2" strokeWidth="1.5"/>
              <rect x="1348" y="752" width="24" height="30" rx="2" strokeWidth="1.5"/>
              <path d="M1342 708 h3 M1342 720 h3 M1342 732 h3 M1342 744 h3 M1342 756 h3 M1342 768 h3 M1342 780 h3 M1375 708 h3 M1375 720 h3 M1375 732 h3 M1375 744 h3 M1375 756 h3 M1375 768 h3 M1375 780 h3" strokeWidth="1.6"/>
              <rect x="1394" y="814" width="14" height="12" rx="2" strokeWidth="1.5" transform="rotate(-14 1401 820)"/>
            </g>
            <g opacity=".3">
              <path d="M1362 802 C 1382 852, 1348 900, 1370 950" stroke="#4A7A9B" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1 8"/>
              <circle cx="1371" cy="955" r="3" fill="#4A7A9B"/>
            </g>
            {/* C. Polaroid stack with a paper clip on the lower-left blob */}
            <g opacity=".32" stroke="#2E5F82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <g transform="rotate(-9 86 1330)">
                <rect x="60" y="1300" width="52" height="60" rx="3"/>
                <rect x="66" y="1306" width="40" height="38" rx="1.5" strokeWidth="1.3"/>
              </g>
              <g transform="rotate(6 100 1352)">
                <rect x="74" y="1322" width="52" height="60" rx="3" fill="rgba(208,232,245,.5)"/>
                <rect x="80" y="1328" width="40" height="38" rx="1.5" strokeWidth="1.3"/>
                <path d="M84 1360 l10 -10 8 7 9 -9 9 12" strokeWidth="1.3"/>
                <circle cx="112" cy="1336" r="2.5" strokeWidth="1.3"/>
                <path d="M78 1318 v-14 a5 5 0 0 1 10 0 v22 a8 8 0 0 1 -16 0 v-18" strokeWidth="1.6"/>
              </g>
            </g>
            <g opacity=".3">
              <path d="M96 1392 C 70 1440, 110 1490, 84 1540" stroke="#2E5F82" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1 8"/>
              <circle cx="83" cy="1545" r="3" fill="#2E5F82"/>
            </g>
            {/* D. Compact camera + flash spark on the lower-right blob */}
            <g opacity=".32" stroke="#2E5F82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <g transform="rotate(-7 1359 1445)">
                <rect x="1334" y="1428" width="50" height="34" rx="7"/>
                <path d="M1342 1428 l4 -6 h10 l4 6"/>
                <circle cx="1359" cy="1445" r="9"/>
                <circle cx="1359" cy="1445" r="3.5" strokeWidth="1.4"/>
              </g>
              <circle cx="1398" cy="1418" r="2.5" strokeWidth="1.5"/>
              <path d="M1398 1408 v-7 M1398 1428 v7 M1388 1418 h-7 M1408 1418 h7 M1391 1411 l-5 -5 M1405 1411 l5 -5 M1391 1425 l-5 5 M1405 1425 l5 5" strokeWidth="1.5"/>
            </g>
            <g opacity=".3">
              <path d="M1360 1470 C 1380 1530, 1340 1590, 1370 1650" stroke="#2E5F82" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1 8"/>
              <circle cx="1371" cy="1655" r="3" fill="#2E5F82"/>
            </g>
          </svg>
        )}
        {variant === 'team' && (
        <svg width="100%" height="100%" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice" fill="none">
          {/* Atom cluster top-right with an electron flying off along a dotted
              orbit toward the heading */}
          <g opacity=".2" stroke="#fff" strokeWidth="1.6">
            <ellipse cx="1330" cy="104" rx="38" ry="14" transform="rotate(-28 1330 104)"/>
            <ellipse cx="1330" cy="104" rx="38" ry="14" transform="rotate(48 1330 104)"/>
            <circle cx="1330" cy="104" r="4.5" fill="#fff" stroke="none"/>
            <circle cx="1300" cy="88" r="2.5" fill="#fff" stroke="none" opacity=".8"/>
          </g>
          <g opacity=".2">
            <path d="M1288 116 C 1220 150, 1150 158, 1080 146" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="1 8"/>
            <circle cx="1076" cy="145" r="2.8" fill="#fff"/>
          </g>
          {/* Grad-cap cluster lower-left, tassel swinging into the dotted line */}
          <g opacity=".22" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M60 606 l36 -14 36 14 -36 14 Z"/>
            <path d="M78 613 v16 q18 10 36 0 v-16" strokeWidth="1.6"/>
            <path d="M132 606 v20" strokeWidth="1.5"/>
            <circle cx="132" cy="629" r="2" fill="#fff" stroke="none"/>
          </g>
          <g opacity=".22">
            <path d="M140 620 C 230 600, 320 636, 410 612" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1 9"/>
          </g>
        </svg>
      )}

      {variant === 'gs' && (
        <svg width="100%" height="100%" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice" fill="none">
          {/* Launch arc: dotted lift-off trail on the left cloud, drawing dash
              flight path, paper plane banking toward the CTA */}
          <g opacity=".34">
            <circle cx="80" cy="586" r="3.6" fill="#4A7A9B"/>
            <path d="M84 585 C 130 596, 180 604, 232 606" stroke="#4A7A9B" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 8"/>
          </g>
          <path
            className="doodle-draw"
            d="M232 606 C 460 640, 700 620, 900 560 C 1060 512, 1200 420, 1300 320"
            stroke="#4A7A9B" strokeWidth="1.8" strokeLinecap="round" opacity=".28"
          />
          <g opacity=".42" stroke="#2E5F82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Paper plane: nose up-right, two wings, centre crease */}
            <path d="M1344 286 L1300 300 L1318 306 L1322 330 Z"/>
            <path d="M1344 286 L1318 306" strokeWidth="1.5"/>
          </g>
          {/* Wind ticks behind the plane */}
          <g opacity=".3" stroke="#4A7A9B" strokeWidth="1.6" strokeLinecap="round">
            <path d="M1282 322 l14 -8 M1290 336 l12 -7"/>
          </g>
        </svg>
      )}

      {variant === 'faq' && (
        <svg width="100%" height="100%" viewBox="0 0 1440 1800" preserveAspectRatio="xMidYMin slice" fill="none">
          {/* Conversation cluster top-right: big question bubble + small answer
              bubble overlapping it, tied by dots */}
          <g opacity=".3" stroke="#4A7A9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1300 96 h64 a12 12 0 0 1 12 12 v34 a12 12 0 0 1 -12 12 h-40 l-14 14 v-14 h-10 a12 12 0 0 1 -12 -12 v-34 a12 12 0 0 1 12 -12 Z"/>
            <path d="M1324 116 a8 8 0 1 1 10 8 q-2 1 -2 5" strokeWidth="1.8"/>
            <circle cx="1332" cy="138" r="1.4" strokeWidth="1.6"/>
          </g>
          <g opacity=".26" stroke="#4A7A9B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1392 160 h26 a8 8 0 0 1 8 8 v14 a8 8 0 0 1 -8 8 h-8 l-8 8 v-8 h-2 a8 8 0 0 1 -8 -8 v-14 a8 8 0 0 1 8 -8 Z"/>
            <path d="M1398 172 h14 M1398 179 h9" strokeWidth="1.3"/>
          </g>
          {/* Dotted thread from the bubbles down the right cloud edge */}
          <g opacity=".3">
            <path d="M1348 200 C 1330 260, 1350 320, 1330 380" stroke="#4A7A9B" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1 9"/>
            <circle cx="1329" cy="385" r="3" fill="#4A7A9B"/>
          </g>
          {/* Lightbulb cluster mid-left ("answered") on the left cloud */}
          <g opacity=".3" stroke="#4A7A9B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M84 540 a18 18 0 1 1 24 17 v9 h-24 v-9 a18 18 0 0 1 0 -17 Z" transform="translate(8 0)"/>
            <path d="M96 572 h16 M98 578 h12" strokeWidth="1.5"/>
            <path d="M104 512 v-10 M84 520 l-8 -7 M124 520 l8 -7" strokeWidth="1.6"/>
          </g>
          <g opacity=".3">
            <path d="M132 560 C 200 542, 270 546, 340 556" stroke="#4A7A9B" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1 8"/>
            <circle cx="344" cy="557" r="3" fill="#4A7A9B"/>
          </g>
        </svg>
      )}
    </div>
  )
}
