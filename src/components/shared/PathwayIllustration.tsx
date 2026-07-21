import type { CSSProperties, ReactNode } from 'react'

/**
 * Hero illustration: the atom from the original hero is the hub. The PSS node
 * sits where the nucleus was, with the orbits and electrons circling it; the
 * member's path runs in from "You" at the bottom-left, through the club, out
 * to professors & labs and on to a research placement. The magnifier, DNA
 * helix and sparkles from the original illustration keep their places around
 * it. Motion: one-shot ink reveal of the path, slow dash drift, the 120 s
 * orbit spin, a one-shot fade per node; nothing inside the labels moves.
 */

const HUB = { x: 250, y: 262 }

// You → hub → professors & labs → research placement. The small kink at the
// hub is hidden under the node.
const PATH = 'M70 410 C130 385,190 325,250 262 C310 230,360 195,410 165 C440 145,490 100,520 54'

// Hand-drawn ring, radius ≈36, scaled per node
const BLOB = 'M-34 -6 C-32 -26,-12 -38,8 -36 C28 -34,38 -18,36 2 C34 22,18 36,-2 36 C-22 36,-36 20,-34 -6 Z'

interface PathNode {
  cx: number
  cy: number
  r: number
  title: string
  sub?: string
  /** The lead node: brighter fill and a dotted halo */
  emphasis?: boolean
  glyph: ReactNode
}

const NODES: PathNode[] = [
  {
    cx: 70, cy: 410, r: 34, title: 'YOU',
    glyph: (
      <>
        <circle cy="-9" r="7" fill="rgba(122,175,200,.45)" />
        <path d="M-14 14 a14 12 0 0 1 28 0" />
      </>
    ),
  },
  {
    cx: HUB.x, cy: HUB.y, r: 40, title: 'PSS', sub: 'PANELS & WORKSHOPS',
    glyph: (
      <>
        {/* two speech bubbles */}
        <path d="M-18 -20 h22 a5 5 0 0 1 5 5 v9 a5 5 0 0 1 -5 5 h-10 l-6 5 v-5 h-6 a5 5 0 0 1 -5 -5 v-9 a5 5 0 0 1 5 -5 Z" />
        <path d="M2 -8 h14 a4 4 0 0 1 4 4 v7 a4 4 0 0 1 -4 4 h-2 l-5 4 v-4 h-7 a4 4 0 0 1 -4 -4 v-7 a4 4 0 0 1 4 -4 Z" fill="rgba(122,175,200,.45)" />
        <path d="M-12 -13 h10 M-12 -8 h6" strokeWidth="1.3" />
        {/* spiral notebook */}
        <rect x="-20" y="8" width="22" height="16" rx="2" />
        <path d="M-20 12 h-3 M-20 16 h-3 M-20 20 h-3" strokeWidth="1.4" />
        <path d="M-15 13 h12 M-15 18 h8" strokeWidth="1.3" />
      </>
    ),
  },
  {
    cx: 410, cy: 165, r: 38, title: 'PROFESSORS & LABS',
    glyph: (
      <>
        {/* flask */}
        <g transform="translate(-11 2)">
          <path d="M-6 -20 h12 M-4 -20 v11 l-11 18 a4 4 0 0 0 3.5 6 h23 a4 4 0 0 0 3.5 -6 l-11 -18 v-11" />
          <path d="M-9 8 h18" strokeWidth="1.4" />
          <circle cx="-2" cy="12" r="1.8" strokeWidth="1.3" />
          <circle cx="4" cy="3" r="1.3" strokeWidth="1.3" />
        </g>
        {/* microscope */}
        <g transform="translate(10 0)">
          <path d="M0 -16 l8 -4 6 12 -8 4 Z M4 -4 q8 8 4 14" />
          <path d="M-6 10 h14 M-8 18 h22" />
          <circle cx="8" cy="0" r="2" fill="#4A7A9B" stroke="none" opacity=".7" />
        </g>
      </>
    ),
  },
  {
    cx: 520, cy: 54, r: 42, title: 'RESEARCH', sub: 'PLACEMENT', emphasis: true,
    glyph: (
      <>
        <circle cy="-6" r="14" />
        <path
          transform="translate(0 -6)"
          d="M0 -8 L2.1 -2.9 L7.6 -2.5 L3.4 1.1 L4.7 6.5 L0 3.6 L-4.7 6.5 L-3.4 1.1 L-7.6 -2.5 L-2.1 -2.9 Z"
          fill="#F0C060" opacity=".85" strokeWidth="1.4"
        />
        <path d="M-7 7 l-5 14 7 -4 5 5 1 -14" strokeWidth="1.8" />
        <path d="M7 7 l5 14 -7 -4 -5 5 -1 -14" strokeWidth="1.8" />
      </>
    ),
  },
]

// Four-point sparkle centred on (cx, cy) with reach r
const spark = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy - r} L${cx + r * 0.3} ${cy - r * 0.3} L${cx + r} ${cy} L${cx + r * 0.3} ${cy + r * 0.3} ` +
  `L${cx} ${cy + r} L${cx - r * 0.3} ${cy + r * 0.3} L${cx - r} ${cy} L${cx - r * 0.3} ${cy - r * 0.3} Z`

const ORBIT = { rx: 135, ry: 50 }

// DNA helix, bottom-right of the hub (same strands and rungs as the original
// illustration, offset to this hub)
const DNA_X = 350
const DNA_Y = 364

export default function PathwayIllustration() {
  return (
    <svg
      viewBox="0 0 580 480"
      className="w-full h-auto"
      role="img"
      aria-label="Your path: you, PSS panels and workshops, professors and labs, research placement"
    >
      <defs>
        {/* The visible path keeps the drifting dash pattern; this mask draws it
            in once (its own dasharray never conflicts with the dashes) and
            knocks it out under each node, so the line runs between the
            stages but never shows inside them. */}
        <mask id="pathwayInk" maskUnits="userSpaceOnUse" x="0" y="0" width="580" height="480">
          <path d={PATH} pathLength={1} className="ink-draw" stroke="#fff" strokeWidth="16" strokeLinecap="round" fill="none" />
          {NODES.map((n) => (
            <circle key={n.title} cx={n.cx} cy={n.cy} r={n.r + 3} fill="#000" />
          ))}
        </mask>
      </defs>

      {/* Atom: orbits + electrons turn together around the hub */}
      <g className="atom-spin">
        {[-30, 30, 90].map((deg) => (
          <ellipse
            key={deg}
            cx={HUB.x} cy={HUB.y} rx={ORBIT.rx} ry={ORBIT.ry}
            stroke="#7AAFC8" strokeWidth="1.5" strokeDasharray="6 4" opacity=".45" fill="none"
            transform={`rotate(${deg} ${HUB.x} ${HUB.y})`}
          />
        ))}
        <circle cx="132" cy="262" r="4.5" fill="#7DD4CC" opacity=".85" />
        <circle cx="368" cy="262" r="4" fill="#6BB8D4" opacity=".85" />
        <circle cx="250" cy="135" r="4" fill="#7AAFC8" opacity=".8" />
        <circle cx="358" cy="187" r="3.5" fill="#7DD4CC" opacity=".75" />
        <circle cx="142" cy="337" r="3.5" fill="#6BB8D4" opacity=".75" />
      </g>

      {/* Trajectory, under the nodes so dashes stop at the blob edges */}
      <path
        d={PATH}
        mask="url(#pathwayInk)"
        className="doodle-draw"
        stroke="#2E5F82" strokeWidth="2.2" strokeLinecap="round" opacity=".5" fill="none"
      />

      {/* Magnifying glass, top-left */}
      <g>
        <circle cx="120" cy="120" r="36" stroke="#2E5F82" strokeWidth="3.5" fill="rgba(184,212,236,.35)" />
        <circle cx="120" cy="120" r="27" stroke="#4A7A9B" strokeWidth="1.5" fill="rgba(208,232,245,.4)" />
        <line x1="147" y1="147" x2="172" y2="172" stroke="#2E5F82" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="114" cy="114" r="4.5" fill="#4A7A9B" opacity=".6" />
        <circle cx="127" cy="118" r="3.5" fill="#7AAFC8" opacity=".7" />
        <circle cx="118" cy="128" r="4" fill="#4A7A9B" opacity=".5" />
        <circle cx="130" cy="108" r="3" fill="#7DD4CC" opacity=".65" />
      </g>

      {/* DNA helix, bottom-right: two half-period-shifted strands with rungs */}
      <g transform={`translate(${DNA_X} ${DNA_Y})`}>
        {[6.4, 13.1, 25.9, 32.6, 45.4, 52.1].map((x) => (
          <line key={x} x1={x} y1="-7" x2={x} y2="7" stroke="#A4C4E0" strokeWidth="1.5" opacity=".5" />
        ))}
        <path d="M0 0 Q9.75 -18,19.5 0 Q29.25 18,39 0 Q48.75 -18,58.5 0" stroke="#4A7A9B" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".6" pathLength={1} className="ink-draw" />
        <path d="M0 0 Q9.75 18,19.5 0 Q29.25 -18,39 0 Q48.75 18,58.5 0" stroke="#7AAFC8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".6" pathLength={1} className="ink-draw" />
      </g>

      {/* Sparkles */}
      <path d={spark(330, 48, 9)} fill="#F0C060" opacity=".7" />
      <path d={spark(150, 432, 7)} fill="#6BB8D4" opacity=".6" />
      <path d={spark(430, 340, 8)} fill="#F0C060" opacity=".65" />
      <path d={spark(78, 200, 8)} fill="#6BB8D4" opacity=".6" />

      {/* Nodes: positioned by the outer group; the inner group carries the
          one-shot fade-in so the CSS transform never fights the placement */}
      {NODES.map((n, i) => (
        <g key={n.title} transform={`translate(${n.cx} ${n.cy})`}>
          <g className="node-in" style={{ '--d': `${0.5 + i * 0.4}s` } as CSSProperties}>
            {n.emphasis && (
              <circle r="50" stroke="#7AAFC8" strokeWidth="1.2" strokeDasharray="3 5" opacity=".5" fill="none" />
            )}
            <path
              d={BLOB}
              transform={`scale(${n.r / 36})`}
              vectorEffect="non-scaling-stroke"
              fill={n.emphasis ? 'rgba(184,212,236,.55)' : 'rgba(184,212,236,.35)'}
              stroke="#2E5F82"
              strokeWidth="2.5"
            />
            <g stroke="#2E5F82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
              {n.glyph}
            </g>
            <text
              y={n.r + 18}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              letterSpacing="1.2"
              fill="#2E5F82"
              className="font-syne"
            >
              {n.title}
            </text>
            {n.sub && (
              <text
                y={n.r + 30}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                letterSpacing="1.2"
                fill="#4A7A9B"
                className="font-sans"
              >
                {n.sub}
              </text>
            )}
          </g>
        </g>
      ))}
    </svg>
  )
}
