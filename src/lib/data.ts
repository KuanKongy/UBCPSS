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
  { value: 25, suffix: '+', label: 'Members'              },
  { value: 15, suffix: '+', label: 'Professors connected' },
  //{ value: 10, suffix: '+', label: 'Events held'          },
  { value: 15, suffix: '+', label: 'Research placements'  },
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

// 13 member testimonials — research placements + Thunderbird volunteer project
export const TESTIMONIALS: Testimonial[] = [
  {
    initials: 'NI',
    name:     'Nicole',
    year:     '3rd year',
    program:  'Biochemistry',
    position: 'WL Lab Assistant (S25) · YIP Lab (W25)',
    quote:    'By being part of Project STEM Search, I was able to practice many soft skills like leadership, time management, and organization. Also, I was able to demonstrate my passion for research.',
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
  // Thunderbird volunteer project testimonials
  {
    initials: 'IV',
    name:     'Ivan',
    year:     'Year 3',
    program:  'Human Geography',
    quote:    'The Thunderbird project provided an opportunity to learn in an elementary school environment with other like minded people, an opportunity not seen anywhere else. I gained skills and friendships that have helped me in my pursuit in education, and helped me become the person I am now. I would encourage anyone looking to get into education to join this project, and I hope to see them soon!',
  },
  {
    initials: 'CA',
    name:     'Catherina',
    year:     'Year 4',
    program:  'Biology',
    quote:    'From forming meaningful connections with the children to seeing their bright smiles each day, every moment was truly rewarding. This experience helped me grow personally and professionally, strengthening my adaptability and communication skills in ways I\'ll carry with me for years to come.',
  },
  {
    initials: 'AI',
    name:     'Aisha',
    year:     'Year 2',
    program:  'Pharmacology',
    quote:    'Volunteering at Thunderbird was an amazing experience overall. I gained hands-on experience in a classroom setting, connected with diverse students and staff, and played a role in helping the community and making classrooms a better place.',
  },
  {
    initials: 'JE',
    name:     'Jessica',
    year:     'Year 3',
    program:  'Medical Laboratory Science',
    quote:    'Although I realized through the Thunderbird volunteer project that elementary education might not be the right path for me, the experience still gave me the chance to practice patience and communication, both of which are essential skills for research and life.',
  },
  {
    initials: 'MA',
    name:     'Maddy',
    year:     'Year 3',
    program:  'Food Science',
    quote:    'Volunteering at Thunderbird was a wonderful experience! Not only did I gain valuable leadership skills, but it was plenty fun. The experience gave me the chance to take initiative, work directly with students, and further explore my interest in the education career path!',
  },
  {
    initials: 'JN',
    name:     'Jenica',
    year:     'Alumni',
    program:  'Biology',
    quote:    'Volunteering with Thunderbird Elementary School allowed me to make genuine connections with my community and with the kids. I was able to see them grow and form friendships. The kids wholeheartedly embrace you as a leader and a friend, and it\'s heartwarming to return and have them run up to you because you mean a lot to them as a role model. If you\'re looking to go into early childhood education or teaching in the future, this is a great way to get hands-on experience and determine if those career paths are right for you.',
  },
]

// Team — real names and roles
export const TEAM_MEMBERS: TeamMember[] = [
  // VP Admin
  { initials: 'JZ', name: 'Jackson Zhou',  role: 'VP Admin',               avatarIndex: 0 },
  { initials: 'NC', name: 'Nathan Chen',   role: 'VP Admin',               avatarIndex: 1 },
  { initials: 'CY', name: 'Cliff Yang',    role: 'VP Admin',               avatarIndex: 2 },
  { initials: 'ER', name: 'Eric',          role: 'VP Admin',               avatarIndex: 3 },
  { initials: 'LW', name: 'Lucie Wang',    role: 'VP Admin',               avatarIndex: 0 },
  { initials: 'CA', name: 'Catherina Y',   role: 'VP Admin',               avatarIndex: 1 },
  { initials: 'ME', name: 'Maddy E',       role: 'VP Admin',               avatarIndex: 2 },
  { initials: 'RO', name: 'Roger',         role: 'VP Admin',               avatarIndex: 3 },
  { initials: 'SH', name: 'Shamel',        role: 'VP Admin',               avatarIndex: 0 },
  // Social Media
  { initials: 'VR', name: 'Vrinda',        role: 'Social Media Director',  avatarIndex: 1 },
  { initials: 'AH', name: 'Aisha Hsu',     role: 'Social Media',           avatarIndex: 2 },
  { initials: 'JE', name: 'Jessica',       role: 'Social Media',           avatarIndex: 3 },
  // PR Committee
  { initials: 'HO', name: 'Howard',        role: 'PR Director',            avatarIndex: 0 },
  { initials: 'JQ', name: 'Jacquline',     role: 'PR Committee',           avatarIndex: 1 },
  { initials: 'JN', name: 'Jonathan',      role: 'PR Committee',           avatarIndex: 2 },
  { initials: 'KI', name: 'Kiran',         role: 'PR Committee',           avatarIndex: 3 },
  // Events Committee
  { initials: 'AS', name: 'Ashassavir',    role: 'Events Committee',       avatarIndex: 0 },
  { initials: 'NS', name: 'Nicole Sia',    role: 'Events Committee',       avatarIndex: 1 },
  { initials: 'CW', name: 'Clinton Wong',  role: 'Events Committee',       avatarIndex: 2 },
  { initials: 'JM', name: 'Jasmeet',       role: 'Events Committee',       avatarIndex: 3 },
  { initials: 'SM', name: 'Samuel',        role: 'Events Committee',       avatarIndex: 0 },
  { initials: 'EL', name: 'Elaine',        role: 'Events Committee',       avatarIndex: 1 },
  { initials: 'AO', name: 'Ashley Or',     role: 'Events Committee',       avatarIndex: 2 },
  { initials: 'BI', name: 'Bernard Ip',    role: 'Events Committee',       avatarIndex: 3 },
  // Software
  { initials: 'NL', name: 'Nam Le',        role: 'Software Developer',     avatarIndex: 0 },
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
    title: 'Resume & Coop Application Workshops',
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
