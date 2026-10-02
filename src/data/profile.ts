// Everything factual on the site lives here, and all of it comes from the CV
// (Rutik_Tarerkar_CV in the repo root). Nothing on this page is invented:
// if a fact is not in the CV, it is not in this file.

export const summary =
  'Frontend engineer building production web applications for travel and aviation since 2022. ' +
  'I currently own the Flights frontend on a large enterprise travel platform, work across several teams, ' +
  'and mentor interns. Most of my work is Vue: state-heavy, API-driven interfaces, often inside enterprise ' +
  'and legacy environments. I use generative AI tools every day to prototype, debug and refactor faster.'

export interface Role {
  id: string
  title: string
  company: string
  detail: string
  place: string
  start: string
  end: string
  points: string[]
  stack: string[]
}

export const roles: Role[] = [
  {
    id: 'thomas-cook',
    title: 'Software Developer (T3)',
    company: 'Thomas Cook',
    detail: 'Client engagement. Payroll: Risosu Consulting LLP',
    place: 'Mumbai',
    start: '10/2025',
    end: 'Present',
    points: [
      'Own frontend development for the Flights domain: multicity search, date handling, validations and production bug fixes.',
      'Primary frontend point of contact for Flights changes and releases, across several cross-functional teams.',
      'Mentor and guide interns: code review, clarifying requirements, explaining the architecture.',
      'Build UI in Vue 3 delivered by CDN inside an enterprise OpenCMS environment, bringing component patterns into legacy constraints.',
      'Integrate REST APIs from distributed backend services, with correct data flow, error handling and UI consistency.',
      'Work with backend teams on Java services (NetBeans) that are moving to Spring Boot, with exposure to MySQL data models.',
      'Use GitHub Copilot and Claude for faster prototyping, debugging, refactoring and code quality.',
    ],
    stack: ['Vue 3 (CDN)', 'JavaScript', 'HTML', 'CSS', 'OpenCMS', 'REST APIs', 'Java (backend collaboration)', 'MySQL', 'GlassFish / Crux', 'GitLab'],
  },
  {
    id: 'swegon-bluebox',
    title: 'Web Developer',
    company: 'Swegon BlueBox Pvt. Ltd',
    detail: '',
    place: 'Navi Mumbai',
    start: '09/2022',
    end: '10/2025',
    points: [
      'Built and optimised responsive web applications in Vue.js (Vue 2 and Vue 3), managing complex state across modules with Vuex and Pinia.',
      'Built server-rendered and static applications with Nuxt.js (Nuxt 2 and Nuxt 3).',
      'Integrated RESTful APIs with Axios: CRUD operations and faster asynchronous data flows.',
      'Worked on legacy modernisation: framework migrations and UI refactoring.',
      'Delivered features end to end with designers and backend teams, from requirements to deployment.',
    ],
    stack: ['Vue 2', 'Vue 3', 'Vuex', 'Pinia', 'Nuxt 2', 'Nuxt 3', 'Axios', 'REST APIs'],
  },
]

export interface Fix {
  /** What the flight-path label shows as the fix name. */
  ident: string
  date: string
  title: string
  line: string
}

/** The career, as fixes along the route. Oldest first; the last one is "now". */
export const fixes: Fix[] = [
  { ident: '2019', date: '05/2019', title: 'Diploma, Information Technology', line: 'Where it started.' },
  { ident: '2022', date: '05/2022', title: 'B.E., Information Technology', line: '8.68 CGPA.' },
  { ident: 'BLUEBOX', date: '09/2022', title: 'Web Developer, Swegon BlueBox', line: 'Vue 2 and 3, Nuxt 2 and 3, Vuex and Pinia, three years of shipping.' },
  { ident: 'TCOOK', date: '10/2025', title: 'Software Developer, Thomas Cook', line: 'Handed the Flights frontend of an enterprise travel platform.' },
  { ident: 'NOW', date: 'Today', title: 'Owning Flights', line: 'Multicity search, dates, validations, releases. Mentoring interns.' },
]

export interface Destination {
  id: 'flights' | 'scoreboard' | 'detection'
  name: string
  kind: string
  what: string
  part: string
  stack: string[]
}

export const destinations: Destination[] = [
  {
    id: 'flights',
    name: 'Flights',
    kind: 'Enterprise travel platform, Thomas Cook',
    what: 'The flight search and booking frontend of a large travel platform.',
    part: 'I own it: multicity search, date handling, validations, production fixes, and the releases that ship them.',
    stack: ['Vue 3 via CDN', 'OpenCMS', 'REST APIs', 'Java services', 'GitLab'],
  },
  {
    id: 'scoreboard',
    name: 'Live Cricket Scoreboard',
    kind: 'Overlay system for local match streaming',
    what: 'A live scoreboard and broadcast overlay for local cricket streams: animated UI, real-time updates, sponsor modules.',
    part: 'Designing and building it, as modular reusable components. Exploring AI-assisted commentary, captions and match summaries.',
    stack: ['Vue.js', 'Real-time updates', 'CSS animation', 'AI tools'],
  },
  {
    id: 'detection',
    name: 'Helmet & Number Plate Detection',
    kind: 'Machine learning, computer vision',
    what: 'Detects whether a rider is wearing a helmet, and reads the number plate of a rider who is not.',
    part: 'Built the helmet detection, and the plate extraction for riders without one.',
    stack: ['Python', 'OpenCV', 'Machine learning'],
  },
]

/** The approach checklist: how the work actually gets done. Challenge, then response. */
export const checklist: { item: string; response: string }[] = [
  { item: 'Requirements', response: 'Clarified with design and backend' },
  { item: 'State', response: 'Pinia or Vuex, across modules' },
  { item: 'Data', response: 'REST APIs, Axios, error handling' },
  { item: 'Constraints', response: 'Vue 3 by CDN inside OpenCMS' },
  { item: 'Rendering', response: 'Nuxt 2 and 3, SSR and static' },
  { item: 'Version control', response: 'Git, GitLab, Bitbucket, JIRA' },
  { item: 'AI assist', response: 'Copilot, Claude: prototype, debug, refactor' },
  { item: 'Review', response: 'Code review, mentoring interns' },
]

export const skillGroups: { title: string; items: string[] }[] = [
  { title: 'Frontend', items: ['Vue.js 2 and 3', 'Nuxt.js 2 and 3', 'JavaScript (ES6+)', 'HTML5', 'CSS3'] },
  { title: 'State', items: ['Pinia', 'Vuex', 'Redux Toolkit'] },
  { title: 'Data and backend', items: ['REST APIs', 'Axios', 'Java services', 'MySQL', 'Service-oriented architecture'] },
  { title: 'Enterprise', items: ['OpenCMS', 'CDN-delivered Vue', 'Legacy modernisation', 'Performance and component architecture'] },
  { title: 'Tools', items: ['Git', 'GitLab', 'Bitbucket', 'JIRA'] },
  { title: 'AI', items: ['GitHub Copilot', 'Claude', 'GPT-5', 'Grok', 'Prompt engineering'] },
]

export const education: { title: string; date: string; note: string }[] = [
  { title: 'B.E., Information Technology', date: '05/2022', note: '8.68 CGPA' },
  { title: 'Diploma, Information Technology', date: '05/2019', note: '71.82%' },
  { title: 'SSC', date: '03/2016', note: '76.40%' },
]
