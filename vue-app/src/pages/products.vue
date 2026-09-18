<script setup>
import { categories } from '../data/products'
import PageHero from '../components/PageHero.vue'
import ProductSidebar from '../components/ProductSidebar.vue'
import CtaSection from '../components/CtaSection.vue'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Our Products | Century Auto Parts',
  meta: [
    { name: 'description', content: 'Browse our complete range of tyre repair products - wheel balancing weights, tyre valves, TPMS, tyre seal strings, tyre patches and mushroom patch plugs.' },
    { name: 'keywords', content: 'tyre repair products, wheel balancing weights, tyre valves, TPMS, tyre seal string, tyre patch, mushroom patch plug' },
    { property: 'og:title', content: 'Our Products | Century Auto Parts' },
    { property: 'og:description', content: 'Browse our complete range of tyre repair products - wheel balancing weights, tyre valves, TPMS, tyre seal strings, tyre patches and mushroom patch plugs.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://centurymanufacture.com/products/' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: 'https://centurymanufacture.com/products/' },
  ],
})

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
    <PageHero title="Our Products" subtitle="Complete Tire Repair Solutions for Global Markets" />
    <section class="py-16">
      <div class="container-app">
        <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
          <ProductSidebar />
          <div class="min-w-0">
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
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
        </div>
      </div>
    </section>
    <CtaSection heading="Need a Custom Solution?" text="Contact us for OEM/ODM services and custom product development." />
  </div>
</template>
