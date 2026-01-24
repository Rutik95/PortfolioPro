<template>
  <div class="pt-20">
    <section class="section-padding page-section-bg">
      <div class="container-max">
        <!-- Header -->
        <div class="text-center mb-16">
          <h1 class="text-4xl md:text-5xl font-bold gradient-text mb-6">My Projects</h1>
          <p class="text-xl page-description max-w-2xl mx-auto">
            A showcase of my work, featuring Vue.js applications and modern web technologies
          </p>
        </div>

        <!-- Filter Buttons -->
        <div class="flex flex-wrap justify-center gap-4 mb-12">
          <button
            v-for="filter in filters"
            :key="filter.id"
            @click="activeFilter = filter.id"
            :class="[
              'px-6 py-2 rounded-full font-medium transition-colors duration-200',
              activeFilter === filter.id
                ? 'bg-primary-600 text-white'
                : 'filter-btn-bg filter-btn-text hover:bg-gray-200'
            ]"
          >
            {{ filter.name }}
          </button>
        </div>

        <!-- Projects Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="tech-tag-bg border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl hover:border-primary-300 transition-all duration-200 group"
          >
            <!-- Project Image/Placeholder -->
            <div class="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center group-hover:from-primary-200 group-hover:to-primary-300 transition-colors duration-200">
              <div class="text-6xl opacity-60 group-hover:opacity-80 transition-opacity">{{ project.icon }}</div>
            </div>

            <!-- Project Content -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-xl font-bold page-heading-secondary group-hover:text-primary-600 transition-colors">
                  {{ project.title }}
                </h3>
                <div class="flex space-x-2 ml-4">
                  <a
                    v-if="project.demo"
                    :href="project.demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-gray-400 hover:text-primary-600 transition-colors"
                    title="Live Demo"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>
                  <a
                    v-if="project.github"
                    :href="project.github"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-gray-400 hover:text-primary-600 transition-colors"
                    title="GitHub Repository"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>

              <p class="page-description mb-4 leading-relaxed">{{ project.description }}</p>

              <!-- Technologies -->
              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="tech in project.technologies"
                  :key="tech"
                  class="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                >
                  {{ tech }}
                </span>
              </div>

              <!-- Features -->
              <div v-if="project.features" class="mb-4">
                <h4 class="text-sm font-semibold page-body-secondary mb-2">Key Features:</h4>
                <ul class="text-sm page-description space-y-1">
                  <li v-for="feature in project.features" :key="feature" class="flex items-center">
                    <span class="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2 flex-shrink-0"></span>
                    {{ feature }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- No Projects Message -->
        <div v-if="filteredProjects.length === 0" class="text-center py-16">
          <div class="text-6xl mb-4">📝</div>
          <h3 class="text-xl font-semibold page-heading-secondary mb-2">No projects found</h3>
          <p class="page-description">Try adjusting your filter criteria.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeFilter = ref('all')

const filters = [
  { id: 'all', name: 'All Projects' },
  { id: 'enterprise', name: 'Enterprise' },
  { id: 'ai', name: 'AI & ML' },
  { id: 'vue', name: 'Vue.js' }
]

const projects = [
  {
    id: 1,
    title: 'Enterprise Flights Module - Thomas Cook',
    description: 'Production-scale flights booking system handling critical business flows including multicity search, date validation, and real-time pricing. Integrated within enterprise OpenCMS environment with CDN-based delivery.',
    technologies: ['Vue 3', 'JavaScript', 'OpenCMS', 'REST APIs', 'Java Backend', 'MySQL'],
    category: 'enterprise',
    icon: '✈️',
    demo: '#',
    github: '#',
    features: [
      'Multicity flight search & booking',
      'Real-time fare validation',
      'Date range handling & calendars',
      'Cross-team collaboration',
      'Production bug fixes & maintenance',
      'Enterprise CMS integration'
    ]
  },
  {
    id: 2,
    title: 'Live Cricket Scoreboard & Overlay System',
    description: 'Real-time cricket scoreboard with animated UI components, sponsor modules, and AI-assisted content generation. Features modular, reusable frontend components for live streaming.',
    technologies: ['Vue.js', 'AI Tools', 'Real-time Updates', 'WebSockets', 'CSS Animations'],
    category: 'ai',
    icon: '🏏',
    demo: '#',
    github: '#',
    features: [
      'Real-time score updates',
      'Animated UI components',
      'Sponsor module integration',
      'AI-generated commentary',
      'Match captions & summaries',
      'Modular component architecture'
    ]
  },
  {
    id: 3,
    title: 'ML Helmet & Number Plate Detection',
    description: 'Computer vision system using machine learning to detect helmet compliance on bikers and extract number plates from traffic violations. Python-based solution with OpenCV.',
    technologies: ['Python', 'OpenCV', 'Machine Learning', 'Computer Vision', 'TensorFlow'],
    category: 'ai',
    icon: '🚲',
    demo: '#',
    github: '#',
    features: [
      'Helmet detection algorithm',
      'Number plate extraction',
      'Traffic violation monitoring',
      'Real-time processing',
      'High accuracy ML models',
      'Automated enforcement support'
    ]
  },
  {
    id: 4,
    title: 'Vue.js E-Commerce Platform',
    description: 'Full-featured e-commerce solution with modern Vue.js architecture, state management, and scalable component design. Includes user authentication and payment integration.',
    technologies: ['Vue.js', 'Vuex', 'Pinia', 'Node.js', 'MongoDB', 'Stripe'],
    category: 'vue',
    icon: '🛒',
    demo: '#',
    github: '#',
    features: [
      'Modern Vue.js architecture',
      'State management (Vuex/Pinia)',
      'User authentication system',
      'Payment processing integration',
      'Scalable component design',
      'Responsive mobile-first UI'
    ]
  },
  {
    id: 5,
    title: 'Nuxt.js Blog Platform',
    description: 'Server-side rendered blog platform with markdown support, SEO optimization, and content management. Features social sharing and comment system integration.',
    technologies: ['Nuxt.js', 'Vue.js', 'Markdown', 'SEO', 'Social APIs'],
    category: 'vue',
    icon: '📝',
    demo: '#',
    github: '#',
    features: [
      'Server-side rendering',
      'Markdown content support',
      'SEO optimization',
      'Social sharing integration',
      'Comment system',
      'Content management'
    ]
  },
  {
    id: 6,
    title: 'Task Management Application',
    description: 'Collaborative task management app with real-time updates, team collaboration features, and project tracking. Built with Vue 3 and modern state management.',
    technologies: ['Vue 3', 'Pinia', 'Socket.io', 'Express', 'PostgreSQL'],
    category: 'vue',
    icon: '📋',
    demo: '#',
    github: '#',
    features: [
      'Real-time collaboration',
      'Project & task organization',
      'Team member assignments',
      'Progress tracking & analytics',
      'File attachments',
      'Notification system'
    ]
  }
]

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') {
    return projects
  }
  return projects.filter(project => project.category === activeFilter.value)
})
</script>