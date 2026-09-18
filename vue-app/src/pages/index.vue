<script setup>
import { categories } from '../data/products'
import CtaSection from '../components/CtaSection.vue'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Century Auto Parts | Tire Repair Products Manufacturer',
  meta: [
    { name: 'description', content: 'Professional manufacturer of wheel balancing weights, tyre valves, TPMS, tyre patches and mushroom plugs. Factory direct to 50+ countries since 2010.' },
    { name: 'keywords', content: 'tyre repair products, wheel balancing weights, tyre valves, TPMS, tyre patch, tyre seal string, mushroom patch plug' },
    { property: 'og:title', content: 'Century Auto Parts | Tire Repair Products Manufacturer' },
    { property: 'og:description', content: 'Professional manufacturer of wheel balancing weights, tyre valves, TPMS, tyre patches and mushroom plugs. Factory direct to 50+ countries since 2010.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://centurymanufacture.com/' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: 'https://centurymanufacture.com/' },
  ],
})

const stats = [
  { value: '12+', label: 'Years Experience' },
  { value: '50+', label: 'Export Countries' },
  { value: '2000+', label: 'Product SKUs' },
  { value: '24/7', label: 'Support' },
]

const values = [
  { icon: '\u2605', title: '12+ Years in Business', desc: 'Since 2010, we have built extensive export experience and deep industry expertise, serving partners worldwide with consistent quality.' },
  { icon: '\u2605', title: 'Quality Assured', desc: 'Every product undergoes strict quality testing from raw materials to packaging. Our multi-department inspection system ensures reliability.' },
  { icon: '\u2605', title: 'Competitive Pricing', desc: 'Direct manufacturer pricing with optimized logistics solutions, helping you save significantly on every order.' },
  { icon: '\u2605', title: 'Reliable After-Sales', desc: 'Dedicated support team ready to assist with any concerns. We stand behind our products and customer relationships.' },
]

const catImages = {
  'wheel-balancing-weights': '/images/wheel weight.webp',
  'tyre-valves': '/images/tire valve.webp',
  'tpms': '/images/TPMS Valve.webp',
  'tyre-seal-string': '/images/tire seal.webp',
  'tyre-patch': '/images/tire patch.webp',
  'mushroom-patch-plug': '/images/mushroom patch plug.webp',
}
</script>

<template>
  <div>
    <section class="relative bg-gradient-to-br from-[#1A1A2E] via-[#2B2B45] to-[#4A2B1A] text-white overflow-hidden">
      <div class="container-app pt-36 pb-24 md:pt-44 md:pb-32 text-center">
        <span class="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">&#9672; Since 2010 &nbsp;&middot;&nbsp; Exported to 50+ Countries</span>
        <h1 class="text-4xl md:text-6xl font-bold leading-tight mb-6">Tire Repair Products for <span class="text-[#FF6B00]">Global Markets</span></h1>
        <p class="text-lg text-gray-300 max-w-2xl mx-auto mb-8">Wheel balancing weights, tyre valves, TPMS, patches and repair materials - manufactured and exported worldwide with factory-direct quality and pricing.</p>
        <div class="flex justify-center gap-4 flex-wrap">
          <RouterLink to="/products/" class="btn btn-primary btn-large">Explore Products</RouterLink>
          <RouterLink to="/contact/" class="btn btn-outline btn-large">Get a Quote</RouterLink>
        </div>
      </div>
    </section>

    <section class="relative z-10 bg-white border-b border-gray-100">
      <div class="container-app -mt-[60px]">
        <div class="bg-white rounded-lg shadow-card-lg p-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="s in stats" :key="s.label" class="text-center">
            <div class="text-3xl font-bold bg-gradient-to-r from-[#FF6B00] to-orange-500 bg-clip-text text-transparent">{{ s.value }}</div>
            <div class="text-sm text-gray-500 mt-2">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20">
      <div class="container-app">
        <div class="section-header">
          <h2 class="section-title">Our Product Range</h2>
          <p class="section-subtitle">Six product categories covering complete tyre repair solutions</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="cat in categories" :key="cat.slug" class="card reveal flex flex-col">
            <div class="aspect-[4/3] overflow-hidden bg-gray-100">
              <img :src="catImages[cat.slug]" :alt="cat.name" loading="lazy" class="w-full h-full object-cover">
            </div>
            <div class="p-5 flex flex-col flex-1">
              <h3 class="font-semibold text-[#1A1A2E] mb-2">{{ cat.name }}</h3>
              <p class="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{{ cat.tagline }}</p>
              <RouterLink :to="`/products/${cat.slug}/`" class="text-[#FF6B00] text-sm font-medium hover:underline">Explore Range &rarr;</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-gray-50">
      <div class="container-app">
        <div class="section-header">
          <h2 class="section-title">Why Choose Century Auto Parts</h2>
          <p class="section-subtitle">Your trusted partner for professional tire repair solutions</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="v in values" :key="v.title" class="card reveal p-6 text-center">
            <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center text-xl">{{ v.icon }}</div>
            <h3 class="font-semibold text-[#1A1A2E] mb-2">{{ v.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <CtaSection heading="Need Tire Repair Products?" text="Contact us for factory-direct pricing and OEM/ODM services." />
  </div>
</template>
