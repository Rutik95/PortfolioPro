<template>
  <div>
    <!-- Hero Section -->
    <section class="relative pt-20 pb-20 overflow-hidden">
      <!-- Background Elements -->
      <div v-if="animationsEnabled" class="absolute inset-0">
        <!-- Large floating elements -->
        <div class="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-60" :class="animationsEnabled ? 'floating-element' : ''"></div>
        <div class="absolute top-16 right-16 w-24 h-24 bg-accent-200 rounded-full opacity-50" :class="animationsEnabled ? 'floating-element-slow' : ''" style="animation-delay: -1s;"></div>
        <div class="absolute bottom-32 left-1/4 w-18 h-18 bg-primary-300 rounded-full opacity-55" :class="animationsEnabled ? 'floating-element-fast' : ''" style="animation-delay: -3s;"></div>
        <div class="absolute top-1/3 right-1/3 w-16 h-16 bg-accent-300 rounded-full opacity-65" :class="animationsEnabled ? 'floating-element' : ''" style="animation-delay: -5s;"></div>

        <!-- Medium floating elements -->
        <div class="absolute top-40 right-20 w-16 h-16 bg-accent-200 rounded-full opacity-70" :class="animationsEnabled ? 'floating-element' : ''" style="animation-delay: -2s;"></div>
        <div class="absolute bottom-20 left-1/4 w-12 h-12 bg-primary-300 rounded-full opacity-50" :class="animationsEnabled ? 'floating-element-fast' : ''" style="animation-delay: -4s;"></div>
        <div class="absolute top-2/3 left-16 w-14 h-14 bg-primary-400 rounded-full opacity-45" :class="animationsEnabled ? 'floating-element-slow' : ''" style="animation-delay: -6s;"></div>
        <div class="absolute bottom-40 right-32 w-10 h-10 bg-accent-400 rounded-full opacity-60" :class="animationsEnabled ? 'floating-element' : ''" style="animation-delay: -7s;"></div>

        <!-- Small floating elements -->
        <div class="absolute top-1/2 left-1/2 w-8 h-8 bg-primary-500 rounded-full opacity-40" :class="animationsEnabled ? 'floating-element-fast' : ''" style="animation-delay: -8s;"></div>
        <div class="absolute bottom-16 right-1/4 w-6 h-6 bg-accent-500 rounded-full opacity-50" :class="animationsEnabled ? 'floating-element-slow' : ''" style="animation-delay: -9s;"></div>
        <div class="absolute top-24 left-3/4 w-7 h-7 bg-primary-600 rounded-full opacity-35" :class="animationsEnabled ? 'floating-element' : ''" style="animation-delay: -10s;"></div>
        <div class="absolute bottom-1/3 right-12 w-9 h-9 bg-accent-600 rounded-full opacity-45" :class="animationsEnabled ? 'floating-element-fast' : ''" style="animation-delay: -11s;"></div>

        <!-- Extra decorative elements -->
        <div class="absolute top-8 left-1/3 w-4 h-4 bg-primary-700 rounded-full opacity-30" :class="animationsEnabled ? 'floating-element-slow' : ''" style="animation-delay: -12s;"></div>
        <div class="absolute bottom-8 right-1/2 w-5 h-5 bg-accent-700 rounded-full opacity-35" :class="animationsEnabled ? 'floating-element-fast' : ''" style="animation-delay: -13s;"></div>

        <!-- Even more floating elements -->
        <div class="absolute top-1/4 left-2/3 w-11 h-11 bg-primary-500 rounded-full opacity-40" :class="animationsEnabled ? 'floating-element-diagonal' : ''" style="animation-delay: -14s;"></div>
        <div class="absolute bottom-1/4 right-8 w-13 h-13 bg-accent-400 rounded-full opacity-45" :class="animationsEnabled ? 'floating-element-fast' : ''" style="animation-delay: -15s;"></div>
        <div class="absolute top-3/4 left-1/5 w-9 h-9 bg-primary-600 rounded-full opacity-50" :class="animationsEnabled ? 'floating-element-slow' : ''" style="animation-delay: -16s;"></div>
        <div class="absolute top-1/6 right-3/4 w-7 h-7 bg-accent-500 rounded-full opacity-55" :class="animationsEnabled ? 'floating-element-diagonal' : ''" style="animation-delay: -17s;"></div>
        <div class="absolute bottom-3/4 left-2/5 w-6 h-6 bg-primary-700 rounded-full opacity-35" :class="animationsEnabled ? 'floating-element-fast' : ''" style="animation-delay: -18s;"></div>
        <div class="absolute top-5/6 right-1/5 w-8 h-8 bg-accent-600 rounded-full opacity-40" :class="animationsEnabled ? 'floating-element-slow' : ''" style="animation-delay: -19s;"></div>
        <div class="absolute top-2/5 left-1/6 w-10 h-10 bg-primary-400 rounded-full opacity-45" :class="animationsEnabled ? 'floating-element' : ''" style="animation-delay: -20s;"></div>
        <div class="absolute bottom-2/5 right-2/5 w-5 h-5 bg-accent-700 rounded-full opacity-50" :class="animationsEnabled ? 'floating-element-diagonal' : ''" style="animation-delay: -21s;"></div>

        <!-- Tiny sparkle elements -->
        <div class="absolute top-12 right-1/3 w-3 h-3 bg-primary-800 rounded-full opacity-25" :class="animationsEnabled ? 'floating-element-fast' : ''" style="animation-delay: -22s;"></div>
        <div class="absolute bottom-12 left-3/5 w-3 h-3 bg-accent-800 rounded-full opacity-30" :class="animationsEnabled ? 'floating-element' : ''" style="animation-delay: -23s;"></div>
        <div class="absolute top-1/5 right-4 w-2 h-2 bg-primary-900 rounded-full opacity-20" :class="animationsEnabled ? 'floating-element-slow' : ''" style="animation-delay: -24s;"></div>
        <div class="absolute bottom-1/5 left-4/5 w-2 h-2 bg-accent-900 rounded-full opacity-25" :class="animationsEnabled ? 'floating-element-fast' : ''" style="animation-delay: -25s;"></div>
        <div class="absolute top-4/5 right-2/3 w-4 h-4 bg-primary-800 rounded-full opacity-30" :class="animationsEnabled ? 'floating-element' : ''" style="animation-delay: -26s;"></div>
        <div class="absolute bottom-4/5 left-1/3 w-4 h-4 bg-accent-800 rounded-full opacity-35" :class="animationsEnabled ? 'floating-element-slow' : ''" style="animation-delay: -27s;"></div>

        <!-- Additional medium elements -->
        <div class="absolute top-1/8 left-4/5 w-15 h-15 bg-primary-300 rounded-full opacity-50" :class="animationsEnabled ? 'floating-element-diagonal' : ''" style="animation-delay: -28s;"></div>
        <div class="absolute bottom-1/8 right-4/5 w-17 h-17 bg-accent-300 rounded-full opacity-45" :class="animationsEnabled ? 'floating-element-fast' : ''" style="animation-delay: -29s;"></div>
        <div class="absolute top-7/8 left-1/8 w-12 h-12 bg-primary-400 rounded-full opacity-55" :class="animationsEnabled ? 'floating-element-slow' : ''" style="animation-delay: -30s;"></div>
        <div class="absolute bottom-7/8 right-1/8 w-14 h-14 bg-accent-400 rounded-full opacity-50" :class="animationsEnabled ? 'floating-element-diagonal' : ''" style="animation-delay: -31s;"></div>

        <!-- Final sparkle additions -->
        <div class="absolute top-3/5 left-3/5 w-2 h-2 bg-primary-900 rounded-full opacity-15" :class="animationsEnabled ? 'floating-element-fast' : ''" style="animation-delay: -32s;"></div>
        <div class="absolute bottom-3/5 right-3/5 w-3 h-3 bg-accent-900 rounded-full opacity-20" :class="animationsEnabled ? 'floating-element-slow' : ''" style="animation-delay: -33s;"></div>
        <div class="absolute top-1/10 right-1/10 w-4 h-4 bg-primary-800 rounded-full opacity-25" :class="animationsEnabled ? 'floating-element-diagonal' : ''" style="animation-delay: -34s;"></div>
        <div class="absolute bottom-1/10 left-1/10 w-3 h-3 bg-accent-800 rounded-full opacity-30" :class="animationsEnabled ? 'floating-element' : ''" style="animation-delay: -35s;"></div>
        <div class="absolute top-9/10 right-9/10 w-2 h-2 bg-primary-700 rounded-full opacity-20" :class="animationsEnabled ? 'floating-element-fast' : ''" style="animation-delay: -36s;"></div>
        <div class="absolute bottom-9/10 left-9/10 w-3 h-3 bg-accent-700 rounded-full opacity-25" :class="animationsEnabled ? 'floating-element-diagonal' : ''" style="animation-delay: -37s;"></div>
      </div>

      <div class="container-max relative">
        <div class="text-center max-w-5xl mx-auto">
          <div class="animate-fade-in">
            <div class="inline-block px-6 py-2 bg-white/70 backdrop-blur-sm rounded-full text-primary-700 font-medium text-sm mb-6 shadow-lg">
              🎯 Frontend Engineer & Vue.js Specialist
            </div>
            <h1 class="text-5xl md:text-7xl font-bold gradient-text mb-6">
              Hi, I'm Rutik
            </h1>
            <p class="text-xl md:text-2xl hero-subtitle mb-8 font-medium">
              Building exceptional digital experiences in travel & aviation
            </p>
            <p class="text-lg hero-description mb-12 max-w-3xl mx-auto leading-relaxed">
              Frontend Engineer with 3+ years of experience owning critical modules for enterprise travel platforms.
              Expert in Vue.js, API-driven UI development, and modernizing legacy systems. Passionate about scalable solutions and leveraging AI tools for development excellence.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up">
            <router-link to="/projects" class="btn-primary glow-effect">
              🚀 View My Work
            </router-link>
            <router-link to="/contact" class="btn-secondary">
              💬 Get In Touch
            </router-link>
          </div>

          <!-- Quick Stats -->
          <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div class="card p-6 text-center animate-slide-in-left">
              <div class="text-2xl font-bold text-primary-600 mb-1">3+</div>
              <div class="text-sm text-gray-600">Years Experience</div>
            </div>
            <div class="card p-6 text-center animate-slide-in-left" style="animation-delay: 0.1s;">
              <div class="text-2xl font-bold text-primary-600 mb-1">Vue.js</div>
              <div class="text-sm text-gray-600">Primary Framework</div>
            </div>
            <div class="card p-6 text-center animate-slide-in-right" style="animation-delay: 0.2s;">
              <div class="text-2xl font-bold text-accent-600 mb-1">Travel</div>
              <div class="text-sm text-gray-600">Industry Focus</div>
            </div>
            <div class="card p-6 text-center animate-slide-in-right" style="animation-delay: 0.3s;">
              <div class="text-2xl font-bold text-accent-600 mb-1">AI</div>
              <div class="text-sm text-gray-600">Enhanced Workflow</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Preview -->
    <section class="section-padding">
      <div class="container-max">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold gradient-text mb-4">Core Expertise</h2>
          <p class="text-lg skills-description max-w-2xl mx-auto">
            Technologies and tools I use to build scalable, user-focused digital systems
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div
            v-for="skill in featuredSkills"
            :key="skill.name"
            class="card text-center p-8 hover:scale-105 transition-transform duration-300 animate-fade-in"
            :style="{ animationDelay: skill.delay }"
          >
            <div class="text-5xl mb-4">{{ skill.icon }}</div>
            <h3 class="font-bold text-gray-900 mb-2">{{ skill.name }}</h3>
            <p class="text-sm text-gray-600">{{ skill.description }}</p>
          </div>
        </div>

        <div class="text-center mt-16">
          <router-link to="/about" class="btn-secondary">
            📖 Learn More About Me
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Projects -->
    <section class="section-padding projects-section-bg">
      <div class="container-max">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold gradient-text mb-4">Featured Projects</h2>
          <p class="text-lg skills-description max-w-2xl mx-auto">
            Some of my recent work showcasing Vue.js development and modern web technologies
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="project in featuredProjects"
            :key="project.id"
            class="card overflow-hidden group animate-fade-in"
            :style="{ animationDelay: project.delay }"
          >
            <div class="h-48 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center relative">
              <div class="text-6xl opacity-70 group-hover:opacity-90 transition-opacity">{{ project.icon }}</div>
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-primary-700">
                {{ project.category }}
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{{ project.title }}</h3>
              <p class="text-gray-600 mb-4 leading-relaxed">{{ project.description }}</p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="tech in project.technologies"
                  :key="tech"
                  class="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full font-medium"
                >
                  {{ tech }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex space-x-4">
                  <a
                    v-if="project.demo"
                    :href="project.demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                  >
                    🌐 Demo
                  </a>
                  <a
                    v-if="project.github"
                    :href="project.github"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-gray-600 hover:text-gray-700 font-medium text-sm flex items-center"
                  >
                    💻 Code
                  </a>
                </div>
                <span class="text-xs text-gray-500">{{ project.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-12">
          <router-link to="/projects" class="btn-primary">
            View All Projects
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { usePageSeo } from '@/composables/usePageSeo'
import { site, isSet, absoluteUrl } from '@/config/site'

usePageSeo({ path: '/' })

const address = { '@type': 'PostalAddress', addressLocality: 'Panvel', addressRegion: 'Maharashtra', addressCountry: 'IN' }

// Structured data so search engines understand who this site is for
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Person',
            '@id': absoluteUrl('/#person'),
            name: site.name,
            jobTitle: 'Full Stack Developer',
            url: site.url,
            email: `mailto:${site.email}`,
            address,
            sameAs: [site.linkedin, site.github].filter(isSet),
            knowsAbout: ['Vue.js', 'Nuxt.js', 'JavaScript', 'Tailwind CSS', 'Java', 'Spring Boot', 'Web performance', 'SEO']
          },
          {
            '@type': 'ProfessionalService',
            '@id': absoluteUrl('/#service'),
            name: `${site.name} Web Development`,
            url: site.url,
            image: absoluteUrl(site.ogImage),
            description: site.description,
            founder: { '@id': absoluteUrl('/#person') },
            areaServed: 'Worldwide',
            address
          }
        ]
      })
    }
  ]
})

const featuredSkills = [
  { name: 'Vue.js', icon: '🟢', description: 'Vue 2 & 3 Expert', delay: '0s' },
  { name: 'Nuxt.js', icon: '🌊', description: 'SSR & Static Sites', delay: '0.1s' },
  { name: 'AI Tools', icon: '🤖', description: 'Copilot, Claude, GPT', delay: '0.2s' },
  { name: 'Enterprise', icon: '🏢', description: 'Large Scale Systems', delay: '0.3s' }
]

const featuredProjects = [
  {
    id: 1,
    title: 'Flights Module - Thomas Cook',
    description: 'Enterprise-scale flights booking system handling critical business flows, multicity search, and production bug fixes',
    technologies: ['Vue 3', 'OpenCMS', 'REST APIs', 'Java'],
    category: 'Enterprise',
    icon: '✈️',
    demo: '#',
    github: '#',
    status: 'Production',
    delay: '0s'
  },
  {
    id: 2,
    title: 'Live Cricket Scoreboard',
    description: 'Real-time cricket scoreboard with animated UI, sponsor modules, and AI-assisted commentary generation',
    technologies: ['Vue.js', 'AI Tools', 'Real-time Updates'],
    category: 'AI-Powered',
    icon: '🏏',
    demo: '#',
    github: '#',
    status: 'Featured',
    delay: '0.1s'
  },
  {
    id: 3,
    title: 'ML Helmet Detection',
    description: 'Computer vision system to detect helmet compliance and extract number plates from traffic violations',
    technologies: ['Python', 'OpenCV', 'Machine Learning'],
    category: 'AI/ML',
    icon: '🚲',
    demo: '#',
    github: '#',
    status: 'Research',
    delay: '0.2s'
  }
]

// Animation toggle state
const animationsEnabled = ref(true)

// Load animation preference on mount
onMounted(() => {
  const saved = localStorage.getItem('floatingElementsEnabled')
  if (saved !== null) {
    animationsEnabled.value = saved === 'true'
  }

  // Listen for animation toggle events
  window.addEventListener('floatingElementsToggle', (event: any) => {
    animationsEnabled.value = event.detail.enabled
  })
})
</script>