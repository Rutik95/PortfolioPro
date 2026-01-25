<template>
  <div id="app" class="min-h-screen transition-colors duration-300">
    <Navigation />
    <ThemeToggle />
    <AnimationToggle />
    <ParticleToggle />
    <ParticleBackground />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navigation from '@/components/Navigation.vue'
import Footer from '@/components/Footer.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import AnimationToggle from '@/components/AnimationToggle.vue'
import ParticleBackground from '@/components/ParticleBackground.vue'
import ParticleToggle from '@/components/ParticleToggle.vue'
</script>