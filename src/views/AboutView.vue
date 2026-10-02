<template>
  <div class="pt-20">
    <!-- About Section -->
    <section class="section-padding page-section-bg">
      <div class="container-max">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <h1 class="text-4xl md:text-5xl font-bold gradient-text mb-6">About Me</h1>
            <p class="text-xl page-description leading-relaxed max-w-3xl mx-auto">
              Frontend Engineer with 3+ years of experience building and maintaining production-grade web applications in travel and aviation domains
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-2xl font-bold gradient-text mb-6">My Journey</h2>
              <div class="space-y-4 page-body leading-relaxed">
                <p>
                  I've spent the last 3+ years building and maintaining production-grade web applications in the travel and aviation industry.
                  Currently, I own the Flights module for Thomas Cook's enterprise travel platform, working across multiple teams and mentoring junior developers.
                </p>
                <p>
                  My expertise spans Vue.js development within complex enterprise environments (CMS, CDN-based integrations), API-driven UI development,
                  and collaborating with backend teams on Java-based services. I'm passionate about modernizing legacy systems and leveraging Generative AI tools
                  to improve development velocity and code quality.
                </p>
                <p>
                  Beyond traditional development, I enjoy exploring AI/ML applications, as seen in my computer vision projects for helmet detection
                  and AI-assisted content generation for live cricket scoreboards. I'm always excited to tackle new challenges and contribute to innovative solutions.
                </p>
              </div>
            </div>

            <div class="card p-8">
              <h3 class="text-xl font-bold gradient-text mb-6">Quick Facts</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="page-label">📅 Experience</span>
                  <span class="font-semibold text-primary-600">3+ Years</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="page-label">🏢 Current Role</span>
                  <span class="font-semibold text-accent-600">Frontend Engineer</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="page-label">🎯 Industry</span>
                  <span class="font-semibold text-primary-600">Travel & Aviation</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="page-label">🤖 AI Tools</span>
                  <span class="font-semibold text-accent-600">Copilot, Claude, GPT</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="page-label">📍 Location</span>
                  <span class="font-semibold text-primary-600">Panvel, India</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="page-label">🎓 Education</span>
                  <span class="font-semibold text-accent-600">B.E. IT (8.68 CGPA)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="section-padding experience-card-bg">
      <div class="container-max">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold gradient-text mb-4">Technical Skills</h2>
          <p class="text-lg page-description max-w-2xl mx-auto">
            Technologies and tools I use to build modern, scalable applications
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div
            v-for="category in skillCategories"
            :key="category.title"
            class="tech-tag-bg rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <h3 class="text-xl font-bold page-heading-secondary mb-4 flex items-center">
              <span class="text-2xl mr-3">{{ category.icon }}</span>
              {{ category.title }}
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in category.skills"
                :key="skill"
                class="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience Timeline -->
    <section class="section-padding page-section-bg">
      <div class="container-max">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold gradient-text mb-4">Professional Experience</h2>
          <p class="text-lg page-description max-w-2xl mx-auto">
            My journey in software development and the roles I've taken
          </p>
        </div>

        <div class="max-w-4xl mx-auto">
          <div class="space-y-8">
            <div
              v-for="experience in experiences"
              :key="experience.id"
              class="relative flex items-start space-x-6"
            >
              <!-- Timeline line -->
              <div class="absolute left-6 top-12 bottom-0 w-0.5 bg-primary-200"></div>

              <!-- Timeline dot -->
              <div class="relative z-10 flex-shrink-0 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <span class="text-white text-lg">{{ experience.icon }}</span>
              </div>

              <!-- Content -->
              <div class="flex-grow experience-card-bg rounded-lg p-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 class="text-xl font-bold page-heading-secondary">{{ experience.position }}</h3>
                  <span class="text-primary-600 font-medium">{{ experience.period }}</span>
                </div>
                <p class="page-body-secondary font-medium mb-3">{{ experience.company }}</p>
                <p class="page-description leading-relaxed">{{ experience.description }}</p>
                <div class="flex flex-wrap gap-2 mt-4">
                  <span
                    v-for="tech in experience.technologies"
                    :key="tech"
                    class="px-3 py-1 tech-tag-bg page-body-secondary text-sm rounded-full border border-gray-300"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo({
  title: 'About',
  description: 'Rutik Tarerkar is a Full Stack Developer with close to 4 years of experience in Vue.js, Nuxt.js and Java, currently working on the Thomas Cook / SOTC travel booking platform.',
  path: '/about'
})

const skillCategories = [
  {
    title: 'Core Frameworks',
    icon: '🟢',
    skills: ['Vue.js (2 & 3)', 'Nuxt.js (2 & 3)', 'JavaScript (ES6+)', 'HTML5', 'CSS3']
  },
  {
    title: 'State Management',
    icon: '🧠',
    skills: ['Pinia', 'Vuex', 'Redux Toolkit']
  },
  {
    title: 'Backend & APIs',
    icon: '⚙️',
    skills: ['REST APIs', 'Java Services', 'Axios', 'MySQL', 'Service-oriented Architecture']
  },
  {
    title: 'AI & Development Tools',
    icon: '🤖',
    skills: ['GitHub Copilot', 'Claude', 'GPT-5', 'Grok', 'Prompt Engineering']
  },
  {
    title: 'Enterprise & CMS',
    icon: '🏢',
    skills: ['OpenCMS', 'CDN Integration', 'Legacy System Modernization', 'GitLab', 'JIRA']
  },
  {
    title: 'AI/ML Projects',
    icon: '🧪',
    skills: ['Python', 'OpenCV', 'Computer Vision', 'Machine Learning', 'Helmet Detection']
  }
]

const experiences = [
  {
    id: 1,
    position: 'Software Developer (T3)',
    company: 'Thomas Cook (Client) - Risosu Consulting LLP',
    period: 'Oct 2023 - Present',
    description: 'Own frontend development for the Flights domain, supporting critical business flows such as multicity search, date handling, validations, and production bug fixes. Work across multiple cross-functional teams, acting as the primary frontend point of contact for Flights-related changes and releases. Mentor and guide interns, reviewing code and clarifying requirements.',
    technologies: ['Vue 3', 'JavaScript', 'HTML', 'CSS', 'OpenCMS', 'REST APIs', 'Java', 'MySQL', 'GlassFish', 'GitLab'],
    icon: '✈️'
  },
  {
    id: 2,
    position: 'Web Developer',
    company: 'Swegon BlueBox Pvt. Ltd',
    period: 'Sep 2022 - Oct 2023',
    description: 'Developed and optimized responsive web applications using Vue.js (Vue 2 & 3) with Vuex/Pinia, managing complex application state. Built server-side rendered and static applications using Nuxt.js. Integrated RESTful APIs using Axios with CRUD operations and optimized asynchronous data flows.',
    technologies: ['Vue.js', 'Vue 3', 'Nuxt.js', 'Vuex', 'Pinia', 'JavaScript', 'REST APIs', 'Axios'],
    icon: '💻'
  },
  {
    id: 3,
    position: 'Web Developer',
    company: 'Swegon BlueBox Pvt. Ltd',
    period: 'Sep 2021 - Sep 2022',
    description: 'Continued development work with Vue.js frameworks, focusing on component architecture, performance optimization, and modern web development practices. Worked on legacy system modernization initiatives and collaborated with design and backend teams.',
    technologies: ['Vue.js', 'JavaScript', 'HTML5', 'CSS3', 'REST APIs'],
    icon: '🚀'
  }
]
</script>