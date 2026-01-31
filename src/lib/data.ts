import type {
  Stat, PastEvent, Testimonial, TeamMember,
  FAQItem, AboutCard, Pillar,
} from './types'

export const LINKS = {
  linktree:  'https://linktr.ee/PSSUBC',
  instagram: 'https://www.instagram.com/ubc_pss/',
  email:     'mailto:pssubc@gmail.com',
  amsSignup: 'https://docs.google.com/forms/d/e/1FAIpQLScf5hQmJ5BKwbeeHQupnHS-51tXgEBQfu-_mitP3zmwET37xA/viewform',
} as const

export const STATS: Stat[] = [
  { value: 20, suffix: '+', label: 'Members'              },
  { value: 10, suffix: '+', label: 'Professors connected' },
  { value: 10, suffix: '+', label: 'Events held'          },
  { value: 10, suffix: '+', label: 'Research placements'  },
]

// All past events — listed most-recent-first
export const EVENTS: PastEvent[] = [
  {
    month: 'JAN', day: '30', year: '2026',
    tag: 'Professor Spotlight', tagColor: 'teal',
    name: 'Prof Panel — Dr. Mui',
    speakerTitle: 'Assistant Professor',
    department: 'Biochemistry & Molecular Biology',
    location: 'Online (Zoom)',
    time: '6:00 PM',
  },
  {
    month: 'DEC', day: '5', year: '2025',
    tag: 'Professor Spotlight', tagColor: 'teal',
    name: 'Prof Panel — Dr. Kayla King',
    speakerTitle: 'Assistant Professor',
    department: 'Zoology',
    location: 'Buchanan A203',
    time: '6:00 PM · Food provided',
  },
  {
    month: 'NOV', day: '21', year: '2025',
    tag: 'Professor Spotlight', tagColor: 'teal',
    name: 'Prof Panel — Dr. Kevin Wei',
    speakerTitle: 'Assistant Professor',
    department: 'Zoology',
    location: 'Buchanan A203',
    time: '6:00 PM',
  },
]

// 7 real member testimonials — Nicole is featured (full-width card)
export const TESTIMONIALS: Testimonial[] = [
  {
    initials: 'NI',
    name:     'Nicole',
    year:     '3rd year',
    program:  'Biochemistry',
    position: 'WL Lab Assistant (S25) · YIP Lab (W25)',
    quote:    'By being part of Project STEM Search, I was able to practice many soft skills like leadership, time management, and organization. Also, I was able to demonstrate my passion for research.',
    featured: true,
  },
  {
    initials: 'RO',
    name:     'Roger',
    year:     '4th year',
    program:  'CAPS',
    position: 'Research Assistant — BC Children\'s Hospital',
    quote:    'Through my involvement in this club, I was able to secure 4 research positions (Co-op and INSPIRE at BCCHR, Honours Thesis and Directed Studies) several months in advance.',
  },
  {
    initials: 'PA',
    name:     'Patrick',
    year:     '4th year',
    program:  'Nutritional Sciences',
    position: 'Research Study Coordinator — Ovcare / AIM Lab',
    quote:    'Talking with professors at the professor panel gave me valuable insight into what researchers look for when hiring students. Having my resume reviewed at the Interview Prep Workshop helped me optimize it for landing a co-op position.',
  },
  {
    initials: 'OL',
    name:     'Oliver',
    year:     '4th year',
    program:  'Combined Major in Science',
    position: 'Lecturer & Drone Trainer — Integem',
    quote:    'PSS built a bridge between professors and me. I was able to get connected with science professors and invited to their labs so that I have a better idea what I am going to do in the future.',
  },
  {
    initials: 'KY',
    name:     'Kyle',
    year:     '3rd year',
    program:  'Food & Nutritional Sciences',
    position: 'Research Assistant — LFS EURO',
    quote:    'Going to the resume building and emailing workshop really helped me structure my approach to contacting professors for any open positions, which truly helped me find research.',
  },
  {
    initials: 'JA',
    name:     'Jackson',
    year:     '3rd year',
    program:  'Nutritional Sciences',
    position: 'Research Assistant — Arthritis Research Canada',
    quote:    'The resume workshop provided me with the skills to refine my resume and, through their workshops, I was able to secure my co-op position.',
  },
  {
    initials: 'CL',
    name:     'Cliff',
    year:     '3rd year',
    program:  'Honours Biotechnology (MBIM)',
    position: 'Lung Disease Researcher — McGill University Health Centre',
    quote:    'The club enabled me to interact with the profs comfortably through the panel, and through their advice, I was able to receive a position in Montreal.',
  },
]

// Team — real roles, placeholder names (replace before launch)
export const TEAM_MEMBERS: TeamMember[] = [
  { initials: '??', name: 'President',              role: 'President',              avatarIndex: 0 },
  { initials: '??', name: 'Vice President',         role: 'Vice President',         avatarIndex: 1 },
  { initials: '??', name: 'Social Media',           role: 'Social Media',           avatarIndex: 2 },
  { initials: '??', name: 'Social Media',           role: 'Social Media',           avatarIndex: 3 },
  { initials: '??', name: 'Social Media',           role: 'Social Media',           avatarIndex: 0 },
  { initials: '??', name: 'Events Committee',       role: 'Events Committee',       avatarIndex: 1 },
  { initials: '??', name: 'Events Committee',       role: 'Events Committee',       avatarIndex: 2 },
  { initials: '??', name: 'Events Committee',       role: 'Events Committee',       avatarIndex: 3 },
  { initials: '??', name: 'Communications',         role: 'Communications',         avatarIndex: 0 },
  { initials: '??', name: 'PR Committee',           role: 'PR Committee',           avatarIndex: 1 },
  { initials: '??', name: 'PR Committee',           role: 'PR Committee',           avatarIndex: 2 },
  { initials: '??', name: 'PR Committee',           role: 'PR Committee',           avatarIndex: 3 },
  { initials: '??', name: 'Outreach Coordinator',   role: 'Outreach Coordinator',   avatarIndex: 0 },
  { initials: '??', name: 'Outreach Coordinator',   role: 'Outreach Coordinator',   avatarIndex: 1 },
  { initials: '??', name: 'Project Coordinator',    role: 'Project Coordinator',    avatarIndex: 2 },
  { initials: '??', name: 'Project Coordinator',    role: 'Project Coordinator',    avatarIndex: 3 },
  { initials: '??', name: 'Project Coordinator',    role: 'Project Coordinator',    avatarIndex: 0 },
  { initials: '??', name: 'Software Developer',     role: 'Software Developer',     avatarIndex: 1 },
]

export const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Who can join Project STEM Search?',
    a: 'Any UBC undergraduate student — no prior research experience required. We\'re built for students at all stages, from first-years exploring to upper-years ready to apply.',
  },
  {
    q: 'Is there a membership fee?',
    a: 'A small AMS club fee applies when you sign up through the AMS portal. The vast majority of our events are free for all members once you\'ve joined.',
  },
  {
    q: 'What STEM fields does PSS cover?',
    a: 'All of them — biology, chemistry, computer science, physics, engineering, neuroscience, psychology, statistics, and more. We\'re interdisciplinary by design.',
  },
  {
    q: 'How often do events happen?',
    a: 'Roughly 2–3 events per month throughout the academic year (September through April), mixing professor panels, workshops, and socials.',
  },
  {
    q: 'How do I actually find a research position through PSS?',
    a: 'Through professor spotlight events where you can network directly, resume and cold-email workshops, and mentorship from upper-year members who\'ve been through the process.',
  },
  {
    q: 'Do I need to attend every event?',
    a: 'Not at all. Come to whatever fits your schedule. We just ask that you RSVP through our Linktree so we can plan capacity for each event.',
  },
]

export const ABOUT_CARDS: AboutCard[] = [
  {
    iconName: 'microscope',
    title:    'Unique research experience',
    body:     'Personalized guidance to help you land real research positions across all STEM fields.',
  },
  {
    iconName: 'people',
    title:    'Teamwork & community',
    body:     'Hands-on projects and community involvement that build real collaboration skills.',
  },
  {
    iconName: 'trophy',
    title:    'Co-op & career ready',
    body:     'Resume workshops, interview prep, and cold-email strategies that actually work.',
  },
  {
    iconName: 'leaf',
    title:    'Support local orgs',
    body:     'Meaningful semester projects that directly benefit Vancouver-area organizations.',
  },
]

export const PILLARS: Pillar[] = [
  {
    num: '01',
    title: 'Professor & Research Spotlights',
    desc:  'Get face time with UBC professors and researchers in an informal setting. Learn what real research looks like day-to-day.',
    bullets: [
      'Network directly with professors and grad students',
      'Learn about ongoing research and open positions',
      'Explore academic career paths across disciplines',
    ],
  },
  {
    num: '02',
    title: 'Resume & RA Application Workshops',
    desc:  'Hands-on help crafting research applications that stand out in a competitive applicant pool.',
    bullets: [
      'Build strong research-focused resumes',
      'Learn strategies for contacting professors cold',
      'Practice interview skills with peer feedback',
    ],
  },
  {
    num: '03',
    title: 'Group Social Events',
    desc:  'Build a genuine community of like-minded students all working toward the same goal.',
    bullets: [
      'Connect with peers across all STEM disciplines',
      'Network with upper-years who\'ve found research',
      'Low-pressure environment to meet your people',
    ],
  },
]
