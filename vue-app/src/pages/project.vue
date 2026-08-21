<script setup>
import PageHero from '../components/PageHero.vue'
import CtaSection from '../components/CtaSection.vue'
import { projectRegions } from '../data/projects'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Our Projects | Century Auto Parts',
  meta: [
    { name: 'description', content: 'Explore Century Auto Parts export projects worldwide - wheel weights, tyre valves, TPMS, patches and repair materials supplied across Asia, Europe, Middle East, Africa and the Americas.' },
    { property: 'og:title', content: 'Our Projects | Century Auto Parts' },
    { property: 'og:description', content: 'Explore Century Auto Parts export projects worldwide - wheel weights, tyre valves, TPMS, patches and repair materials supplied across Asia, Europe, Middle East, Africa and the Americas.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://centurymanufacture.com/project/' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: 'https://centurymanufacture.com/project/' },
  ],
})
</script>

<template>
  <div>
    <PageHero title="Our Projects" subtitle="Export projects trusted by partners across 50+ countries" />
    <section class="py-16">
      <div class="container-app">
        <div class="section-header">
          <h2 class="section-title">Global Delivery Cases</h2>
          <p class="section-subtitle">Wheel balancing weights, tyre valves, TPMS, patches and repair materials supplied to OEMs, distributors and fleets worldwide</p>
        </div>

        <section v-for="region in projectRegions" :id="region.id" :key="region.id" class="py-10 scroll-mt-24">
          <div class="section-header">
            <h3 class="text-2xl font-bold text-[#1A1A2E] mb-2">{{ region.name }}</h3>
            <p class="text-gray-500">{{ region.subtitle }}</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="p in region.projects" :key="p.title" class="card reveal flex flex-col">
              <div class="aspect-[4/3] overflow-hidden bg-gray-100">
                <img :src="p.img" :alt="p.title" loading="lazy" class="w-full h-full object-cover">
              </div>
              <div class="p-5 flex flex-col flex-1">
                <div class="flex flex-wrap gap-1.5 mb-2">
                  <span v-for="t in p.tags" :key="t" class="tag">{{ t }}</span>
                </div>
                <h4 class="font-semibold text-[#1A1A2E] mb-2 leading-snug">{{ p.title }}</h4>
                <p class="text-sm text-gray-500 leading-relaxed mb-4">{{ p.desc }}</p>
                <div class="mt-auto pt-3 border-t border-dashed border-gray-200 text-xs text-gray-500 leading-relaxed">
                  <div v-for="[k, v] in p.meta" :key="k"><strong class="text-gray-600">{{ k }}:</strong> {{ v }}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
    <CtaSection heading="Start Your Project With Us" text="Tell us your requirements - our team will provide a factory-direct solution." />
  </div>
</template>
