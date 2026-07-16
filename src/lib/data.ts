import type {
  Stat, PastEvent, Testimonial, TeamMember,
  FAQItem, AboutCard, Pillar,
} from './types'

export const LINKS = {
  linktree:  'https://linktr.ee/PSSUBC',
  instagram: 'https://www.instagram.com/ubc_pss/',
  amsSignup: 'https://docs.google.com/forms/d/e/1FAIpQLScf5hQmJ5BKwbeeHQupnHS-51tXgEBQfu-_mitP3zmwET37xA/viewform',
} as const

// Contact address. Clicking "Email" copies it to the clipboard (see lib/clipboard.ts)
export const EMAIL = 'pssubc@gmail.com'

// Permalink for one of our Instagram posts
export const igPost = (id: string) => `https://www.instagram.com/ubc_pss/p/${id}/`

// Lead with the number that backs the hero promise
export const STATS: Stat[] = [
  { value: 30, suffix: '+', label: 'Research placements', emphasis: true, caption: 'since 2024' },
  { value: 15, suffix: '+', label: 'Professors connected' },
  { value: 50, suffix: '+', label: 'Members' },
]

// Short, verifiable facts shown under the hero copy
export const TRUST_POINTS: string[] = [
  'AMS-registered club',
  'Free to join',
  'No research experience needed',
  'Open to every year and faculty',
]

// All past events — listed most-recent-first
export const EVENTS: PastEvent[] = [
  {
    month: 'MAR', day: '20', year: '2026',
    tag: 'Speaker Panel', tagColor: 'gold',
    name: 'Researcher Speaker Panel — Dr. Joy Richman',
    instagram: igPost('DWALWo5Ad5E'),
    department: 'Faculty of Dentistry (Oral Health Sciences), UBC',
    collab: 'Operation Smile Canada',
    location: 'NEST 2314',
    time: '7:00 PM',
  },
  {
    month: 'JAN', day: '30', year: '2026',
    tag: 'Professor Spotlight', tagColor: 'teal',
    name: 'Prof Panel — Dr. Alice Mui',
    instagram: igPost('DUB1syfEhFm'),
    department: 'Department of Biochemistry & Molecular Biology, UBC',
    location: 'Online (Zoom)',
    time: '6:00 PM',
  },
  {
    month: 'DEC', day: '5', year: '2025',
    tag: 'Professor Spotlight', tagColor: 'teal',
    name: 'Prof Panel — Dr. Kayla King',
    instagram: igPost('DRnUhafkn71'),
    department: 'Department of Zoology, UBC',
    location: 'Buchanan A203',
    time: '6:00 PM · Food provided',
  },
  {
    month: 'NOV', day: '21', year: '2025',
    tag: 'Professor Spotlight', tagColor: 'teal',
    name: 'Prof Panel — Dr. Kevin Wei',
    // Recap post with the photos; the Nov 14 announcement was DRD0TZSCSrz
    instagram: igPost('DRnXvIxEuRd'),
    department: 'Department of Zoology, UBC',
    location: 'Buchanan A203',
    time: '6:00 PM',
  },
  {
    // Announced on Instagram 2025-03-01 for "March 6th" — the event was 2025,
    // not 2026 as previously listed here.
    month: 'MAR', day: '6', year: '2025',
    tag: 'Professor Spotlight', tagColor: 'teal',
    name: 'The Ultimate Professor Panel Night',
    instagram: igPost('DGrCU37Shda'),
    speakers: ['Dr. Leluo Guan', 'Dr. Thibault Mayor', 'Dr. Amrit Singh'],
    collab: 'Canadian Wheelchair Club',
    location: 'SWNG 205',
    time: '6:00 PM · Food & drinks provided',
  },
  {
    month: 'NOV', day: '1', year: '2024',
    tag: 'Workshop', tagColor: 'blue',
    // No permalink on file for this one; the card falls back to the profile
    name: 'Interview Prep Workshop',
    location: 'Buchanan A104',
    time: '5:30 PM',
  },
]

// Member testimonials — research placements first, then Project Thunderbird.
// Entries with `description` are third-person placement blurbs (from the club's
// poster-info doc), rendered without quote styling.
export const TESTIMONIALS: Testimonial[] = [
  {
    initials: 'NI',
    name:     'Nicole',
    photo:    '/people/nicole.webp',
    year:     '3rd year',
    program:  'Biochemistry',
    position: 'WL Lab Assistant (S25) · YIP Lab (W25)',
    quote:    'By being part of Project STEM Search, I was able to practice many soft skills like leadership, time management, and organization. Also, I was able to demonstrate my passion for research.',
  },
  {
    initials: 'RO',
    name:     'Roger',
    photo:    '/people/roger.webp',
    year:     '4th year',
    program:  'CAPS',
    position: 'INSPIRE Research Assistant — BC Children\'s Hospital',
    quote:    'Through my involvement in this club, I was able to secure 4 research positions (Co-op and INSPIRE at BCCHR, Honours Thesis and Directed Studies) several months in advance. My goal is now to share how I was able to capture these opportunities with the rest of the PSS Community.',
  },
  {
    initials: 'PA',
    name:     'Patrick',
    photo:    '/people/patrick.webp',
    year:     '4th year',
    program:  'Nutritional Sciences',
    position: 'Research Study Coordinator — Ovcare / AIM Lab',
    quote:    'Talking with professors at the professor panel event gave me valuable insight into what researchers look for when hiring students. On top of that, having my resume reviewed at the Interview Prep Workshop helped me optimize it for landing a co-op position.',
  },
  {
    initials: 'OL',
    name:     'Oliver',
    photo:    '/people/oliver.webp',
    year:     '4th year',
    program:  'Combined Major in Science',
    position: 'Lecturer & Drone Trainer — Integem',
    quote:    'PSS built a bridge between professors and me. I was able to get connected with science professors and invited to their labs so that I have a better idea what I am going to do in the future.',
  },
  {
    initials: 'KY',
    name:     'Kyle',
    photo:    '/people/kyle.webp',
    year:     '3rd year',
    program:  'Food & Nutritional Sciences',
    position: 'Research Assistant — LFS EURO',
    quote:    'Going to the resume building and emailing workshop really helped me structure my approach to contacting professors for any open positions, which truly helped me find research. These workshops outlined what professors might be looking for in an application and how to stand out in contacting them.',
  },
  {
    initials: 'JA',
    name:     'Jackson',
    photo:    '/people/jackson.webp',
    year:     '3rd year',
    program:  'Nutritional Sciences',
    position: 'Research Assistant — Arthritis Research Canada',
    quote:    'The resume workshop provided me with the skills to refine my resume and, through their workshops, I was able to secure my co-op position.',
  },
  {
    initials: 'CL',
    name:     'Cliff',
    photo:    '/people/cliff.webp',
    year:     '3rd year',
    program:  'Honours Biotechnology (MBIM)',
    position: 'Lung Disease Researcher — McGill University Health Centre',
    quote:    'The club enabled me to interact with the profs comfortably through the panel, and through their advice, I was able to receive a position in Montreal.',
  },
  {
    initials: 'EL',
    name:     'Elaine',
    photo:    '/people/elaine.webp',
    position: 'Research Assistant — King Lab',
    description: 'Elaine is a research assistant in the King Lab, studying host–pathogen interactions and virulence evolution using C. elegans as a model organism. Connecting with professors at the PSS speaker panels and getting resume advice through the club helped her better articulate her passion for research.',
  },
  {
    initials: 'AS',
    name:     'Ahsaas',
    photo:    '/people/ahsaas.webp',
    position: 'Directed Studies — Cardiovascular Biomarkers Lab',
    description: 'Ahsaas is doing a directed studies in the Cardiovascular Biomarkers Lab, researching multimodal biomarkers for sudden cardiac death: imaging, molecular, and electro-physiological indicators that may improve early risk detection. Connecting with researchers through PSS led him to the opportunity.',
  },
  {
    initials: 'SM',
    name:     'Samuel',
    photo:    '/people/samuel.webp',
    position: 'Cystic Fibrosis RA — Centre for Heart Lung Innovation, St. Paul\'s',
    description: 'Samuel assists with a study investigating the long-term effects of Trikafta, a medication used to treat individuals with cystic fibrosis.',
  },
  {
    initials: 'MA',
    name:     'Maddy',
    photo:    '/people/maddy.webp',
    year:     'Year 3',
    program:  'Food Science',
    position: 'Respiratory Fit Test Coordinator — Vancouver Coastal Health',
    description: 'Maddy provides N95 respirator fit testing for hospital staff, supporting workplace safety and infection control.',
  },
  // Project Thunderbird volunteers
  {
    initials: 'IV',
    name:     'Ivan',
    photo:    '/people/ivan.webp',
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
    photo:    '/people/aisha.webp',
    year:     'Year 2',
    program:  'Pharmacology',
    quote:    'Volunteering at Thunderbird was an amazing experience overall. I gained hands-on experience in a classroom setting, connected with diverse students and staff, and played a role in helping the community and making classrooms a better place.',
  },
  {
    initials: 'JE',
    name:     'Jessica',
    photo:    '/people/jessica.webp',
    year:     'Year 3',
    program:  'Medical Laboratory Science',
    quote:    'Although I realized through the Thunderbird volunteer project that elementary education might not be the right path for me, the experience still gave me the chance to practice patience and communication, both of which are essential skills for research and life.',
  },
  {
    initials: 'MA',
    name:     'Maddy',
    photo:    '/people/maddy.webp',
    year:     'Year 3',
    program:  'Food Science',
    quote:    'Volunteering at Thunderbird was a wonderful experience! Not only did I gain valuable leadership skills, but it was plenty fun. The experience gave me the chance to take initiative, work directly with students, and further explore my interest in the education career path!',
  },
  {
    initials: 'NA',
    name:     'Nathan',
    photo:    '/people/nathan.webp',
    year:     'Year 3',
    program:  'ISCI',
    quote:    'As an individual who didn\'t have that much volunteering experience specifically working with kids, I was truly grateful to be a volunteer! I truly appreciated working there as I was exposed to working with kids with different personalities. Eventually, it inspired me to go into teaching one day as I find it very fulfilling working with kids in the education sector. I find it truly inspiring to see how much each kid has grown in their education compared to when they started off. I would highly recommend volunteering since this is an opportunity you don\'t want to miss out on. On top of that, I was able to make a lot of genuine connections with the teachers, and they helped solidify a career path for me.',
  },
  {
    initials: 'JN',
    name:     'Jenica',
    photo:    '/people/jenica.webp',
    year:     'Alumni',
    program:  'Biology',
    quote:    'Volunteering with Thunderbird Elementary School allowed me to make genuine connections with my community and with the kids. I was able to see them grow and form friendships. The kids wholeheartedly embrace you as a leader and a friend, and it\'s heartwarming to return and have them run up to you because you mean a lot to them as a role model. If you\'re looking to go into early childhood education or teaching in the future, this is a great way to get hands-on experience and determine if those career paths are right for you. It has helped me solidify plans for my own career.',
  },
]

// Team — real names and roles
export const TEAM_MEMBERS: TeamMember[] = [
  // VP Admin
  { initials: 'JZ', name: 'Jackson Zhou', photo: '/people/jackson.webp',  role: 'VP Admin',               avatarIndex: 0},
  { initials: 'NC', name: 'Nathan Chen', photo: '/people/nathan.webp',   role: 'VP Admin',               avatarIndex: 1},
  { initials: 'CY', name: 'Cliff Yang', photo: '/people/cliff.webp',    role: 'VP Admin',               avatarIndex: 2},
  { initials: 'ER', name: 'Eric',          role: 'VP Admin',               avatarIndex: 3},
  { initials: 'LW', name: 'Lucie Wang',    role: 'VP Admin',               avatarIndex: 0},
  { initials: 'CA', name: 'Catherina Y',   role: 'VP Admin',               avatarIndex: 1},
  { initials: 'ME', name: 'Maddy E', photo: '/people/maddy.webp',       role: 'VP Admin',               avatarIndex: 2},
  { initials: 'RO', name: 'Roger', photo: '/people/roger.webp',         role: 'VP Admin',               avatarIndex: 3},
  { initials: 'SH', name: 'Shamel',        role: 'VP Admin',               avatarIndex: 0},
  // Social Media
  { initials: 'VR', name: 'Vrinda',        role: 'Social Media Director',  avatarIndex: 1},
  { initials: 'AH', name: 'Aisha Hsu', photo: '/people/aisha.webp',     role: 'Social Media',           avatarIndex: 2},
  { initials: 'JE', name: 'Jessica', photo: '/people/jessica.webp',       role: 'Social Media',           avatarIndex: 3},
  // PR Committee
  { initials: 'HO', name: 'Howard',        role: 'PR Director',            avatarIndex: 0},
  { initials: 'JQ', name: 'Jacquline',     role: 'PR Committee',           avatarIndex: 1},
  { initials: 'JN', name: 'Jonathan',      role: 'PR Committee',           avatarIndex: 2},
  { initials: 'KI', name: 'Kiran',         role: 'PR Committee',           avatarIndex: 3},
  // Events Committee
  { initials: 'AS', name: 'Ashassavir', photo: '/people/ahsaas.webp',    role: 'Events Committee',       avatarIndex: 0},
  { initials: 'NS', name: 'Nicole Sia', photo: '/people/nicole.webp',    role: 'Events Committee',       avatarIndex: 1},
  { initials: 'CW', name: 'Clinton Wong',  role: 'Events Committee',       avatarIndex: 2},
  { initials: 'JM', name: 'Jasmeet',       role: 'Events Committee',       avatarIndex: 3},
  { initials: 'SM', name: 'Samuel', photo: '/people/samuel.webp',        role: 'Events Committee',       avatarIndex: 0},
  { initials: 'EL', name: 'Elaine', photo: '/people/elaine.webp',        role: 'Events Committee',       avatarIndex: 1},
  { initials: 'AO', name: 'Ashley Or',     role: 'Events Committee',       avatarIndex: 2},
  { initials: 'BI', name: 'Bernard Ip',    role: 'Events Committee',       avatarIndex: 3},
  // Software
  { initials: 'NL', name: 'Nam Le',        photo: '/people/nam.webp', role: 'Software Developer',     avatarIndex: 0},
]

export const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Who can join Project STEM Search?',
    a: 'Any UBC undergraduate student, no prior research experience required. We\'re built for students at all stages, from first-years exploring to upper-years ready to apply.',
  },
  {
    q: 'Is there a membership fee?',
    a: 'No, membership is free. Just fill in the sign-up form and you\'re in. Our events are free for members too.',
  },
  {
    q: 'What STEM fields does PSS cover?',
    a: 'All of them: biology, chemistry, computer science, physics, engineering, neuroscience, psychology, statistics, and more. We\'re interdisciplinary by design.',
  },
  {
    q: 'How often do events happen?',
    a: 'About one or two events a month from September to April: professor panels, workshops, and the occasional social. Dates go up on Instagram and Linktree first.',
  },
  {
    q: 'How do I actually find a research position through PSS?',
    a: 'Through professor spotlight events where you can network directly, resume and cold-email workshops, and mentorship from upper-year members who\'ve been through the process.',
  },
  {
    q: 'Do I need to attend every event?',
    a: 'Not at all. Come to whatever fits your schedule. We just ask that you RSVP through our Linktree so we can plan capacity for each event.',
  },
  {
    q: 'Is PSS a welcoming space?',
    a: 'Yes. We\'re an AMS-registered club open to every year and faculty, with no experience required. Events are free, most are on campus in the evening or online, and you can come to as many or as few as you like.',
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
    body:     'Semester projects like Project Thunderbird, where members volunteer with local elementary students.',
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
    title: 'Resume & Co-op Application Workshops',
    desc:  'Hands-on help crafting research applications that stand out in a competitive applicant pool.',
    bullets: [
      'Build strong research-focused resumes',
      'Learn strategies for contacting professors cold',
      'Practice interview skills with peer feedback',
    ],
  },
  {
    num: '03',
    title: 'Community Projects & Socials',
    desc:  'Every semester we run a project that gives back beyond campus, plus the socials that hold the community together.',
    bullets: [
      'Project Thunderbird: volunteer with elementary students',
      'Collaborations with local non-profits and health orgs',
      'Low-pressure socials to meet people across every STEM discipline',
    ],
  },
]

// Organizations we've run events or projects with
export const PARTNERS: string[] = [
  'Thunderbird Elementary School',
  'Operation Smile Canada',
  'Canadian Wheelchair Club',
]
