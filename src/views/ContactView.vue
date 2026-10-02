<template>
  <div class="pt-20">
    <!-- Contact Section -->
    <section class="section-padding page-section-bg">
      <div class="container-max">
        <div class="max-w-4xl mx-auto">
          <!-- Header -->
          <div class="text-center mb-16">
            <h1 class="text-4xl md:text-5xl font-bold gradient-text mb-6">Get In Touch</h1>
            <p class="text-xl page-description leading-relaxed">
              I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology.
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-12">
            <!-- Contact Form -->
            <div class="experience-card-bg rounded-lg p-8">
              <h2 class="text-2xl font-bold page-heading-secondary mb-6">Send a Message</h2>

              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div>
                  <label for="name" class="block text-sm font-medium page-body-secondary mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium page-body-secondary mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label for="subject" class="block text-sm font-medium page-body-secondary mb-2">
                    Subject
                  </label>
                  <input
                    id="subject"
                    v-model="form.subject"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label for="message" class="block text-sm font-medium page-body-secondary mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    rows="5"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell me about your project or opportunity..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="isSubmitting">Sending...</span>
                  <span v-else>Send Message</span>
                </button>
              </form>
            </div>

            <!-- Contact Info -->
            <div class="space-y-8">
              <div>
                <h2 class="text-2xl font-bold page-heading-secondary mb-6">Let's Connect</h2>
                <p class="page-description mb-8 leading-relaxed">
                  I'm currently available for freelance work and full-time opportunities.
                  Whether you have a project in mind or just want to chat about technology,
                  I'd love to hear from you.
                </p>
              </div>

              <!-- Contact Methods -->
              <div class="space-y-6">
                <div
                  v-for="contact in contactMethods"
                  :key="contact.type"
                  class="flex items-center space-x-4"
                >
                  <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <BaseIcon :name="contact.icon" class="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 class="font-semibold page-heading-secondary">{{ contact.type }}</h3>
                    <a
                      v-if="contact.href"
                      :href="contact.href"
                      :target="contact.external ? '_blank' : '_self'"
                      rel="noopener noreferrer"
                      class="text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      {{ contact.value }}
                    </a>
                    <p v-else class="page-description">{{ contact.value }}</p>
                  </div>
                </div>
              </div>

              <!-- Social Links -->
              <div>
                <h3 class="font-semibold page-heading-secondary mb-4">Follow Me</h3>
                <div class="flex space-x-4">
                  <a
                    v-for="social in socialLinks"
                    :key="social.name"
                    :href="social.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-10 h-10 social-link-bg rounded-lg flex items-center justify-center social-link-text hover:text-primary-600 transition-colors"
                    :title="social.name"
                  >
                    <BaseIcon :name="social.icon" class="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Success/Error Messages -->
    <div
      v-if="submitStatus"
      class="fixed bottom-4 right-4 z-50"
    >
      <div
        :class="[
          'px-6 py-4 rounded-lg shadow-lg text-white max-w-sm',
          submitStatus.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        ]"
      >
        {{ submitStatus.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseIcon, { type IconName } from '@/components/BaseIcon.vue'
import { site, isSet } from '@/config/site'
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo({
  title: 'Contact',
  description: 'Get in touch with Rutik Tarerkar about a website, landing page or redesign for your business.',
  path: '/contact'
})

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const submitStatus = ref<{ type: 'success' | 'error', message: string } | null>(null)

const contactMethods: { type: string; value: string; href: string | null; external: boolean; icon: IconName }[] = [
  {
    type: 'Email',
    value: site.email,
    href: `mailto:${site.email}`,
    external: false,
    icon: 'email'
  },
  {
    type: 'Phone',
    value: '+91 9892637250',
    href: 'tel:+919892637250',
    external: false,
    icon: 'phone'
  },
  {
    type: 'Location',
    value: 'Panvel, Maharashtra, India',
    href: null,
    external: false,
    icon: 'location'
  },
  {
    type: 'LinkedIn',
    value: 'linkedin.com/in/rutik-tarekar-r95',
    href: site.linkedin,
    external: true,
    icon: 'linkedin'
  }
]

const socialLinks = ([
  { name: 'GitHub', url: site.github, icon: 'github' },
  { name: 'LinkedIn', url: site.linkedin, icon: 'linkedin' },
  { name: 'Email', url: `mailto:${site.email}`, icon: 'email' }
] as { name: string; url: string; icon: IconName }[]).filter((l) => isSet(l.url))

const handleSubmit = async () => {
  isSubmitting.value = true
  submitStatus.value = null

  try {
    // Simulate API call - replace with actual form submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    // For now, just show success message
    submitStatus.value = {
      type: 'success',
      message: 'Message sent successfully! I\'ll get back to you soon.'
    }

    // Reset form
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }

    // Clear status after 5 seconds
    setTimeout(() => {
      submitStatus.value = null
    }, 5000)

  } catch (error) {
    submitStatus.value = {
      type: 'error',
      message: 'Failed to send message. Please try again.'
    }

    // Clear error after 5 seconds
    setTimeout(() => {
      submitStatus.value = null
    }, 5000)
  } finally {
    isSubmitting.value = false
  }
}
</script>
