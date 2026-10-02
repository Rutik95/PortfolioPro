// Real projects only. Add `link` / `image` when you have them.
// image: path under public/, e.g. '/work/scoreboard.jpg' (16:10, at least 1600x1000)

export interface Project {
  id: string
  title: string
  context: string
  summary: string
  highlights: string[]
  stack: string[]
  link?: string
  image?: string
}

export const projects: Project[] = [
  {
    id: 'flight-search',
    title: 'Flight search and booking',
    context: 'Thomas Cook / SOTC travel platform',
    summary:
      'Front-end and integration work on a live travel booking platform used by real customers.',
    highlights: [
      'Migrated legacy Knockout.js and jQuery screens to a Vue component architecture',
      'Built one-way, round-trip and multi-city flight search',
      'Vuex / Pinia state for complex booking workflows and fare calculation logic',
      'REST API integration with Java services, released through DEV, SIT, UAT and production',
    ],
    stack: ['Vue.js', 'Vuex / Pinia', 'JavaScript', 'REST APIs', 'Java', 'GitLab'],
  },
  {
    id: 'cricket-scoreboard',
    title: 'Live cricket scoreboard',
    context: 'Overlay system for local match streaming',
    summary:
      'A scoreboard and broadcast overlay for streaming local cricket matches, with animated, reusable UI components.',
    highlights: [
      'Animated scoreboard UI with real-time score updates',
      'Sponsor modules built into the overlay',
      'Exploring AI-assisted commentary, captions and match summaries',
    ],
    stack: ['Vue.js', 'CSS animation', 'AI tools'],
    link: '[PROJECT_LINK]',
    image: '[PROJECT_SCREENSHOT]',
  },
  {
    id: 'helmet-detection',
    title: 'Helmet and number plate detection',
    context: 'Machine learning project',
    summary:
      'Detects whether a rider is wearing a helmet and reads the number plate of riders who are not.',
    highlights: ['Helmet detection on riders', 'Number plate extraction for rule violations'],
    stack: ['Python', 'Machine learning', 'Computer vision'],
    link: '[PROJECT_LINK]',
  },
]
