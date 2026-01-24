<template>
  <div>
    <!-- Hero Section -->
    <section class="relative pt-20 pb-20 overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0">
        <div class="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-60 floating-element"></div>
        <div class="absolute top-40 right-20 w-16 h-16 bg-accent-200 rounded-full opacity-70 floating-element" style="animation-delay: -2s;"></div>
        <div class="absolute bottom-20 left-1/4 w-12 h-12 bg-primary-300 rounded-full opacity-50 floating-element" style="animation-delay: -4s;"></div>
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
            <p class="text-xl md:text-2xl text-gray-700 mb-8 font-medium">
              Building exceptional digital experiences in travel & aviation
            </p>
            <p class="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
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
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
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
    <section class="section-padding bg-gray-50">
      <div class="container-max">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
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
</script>