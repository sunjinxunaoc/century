<script setup>
import { categories } from '../data/products'
import CtaSection from '../components/CtaSection.vue'
import { useHead } from '@unhead/vue'
import { ref, onMounted, onUnmounted } from 'vue'

useHead({
  title: 'Wheel Weight Manufacturer | Wheel Balancing Weights Factory - Century Auto Parts',
  meta: [
    { name: 'description', content: 'Wheel weight manufacturer since 2010. Clip-on and adhesive wheel balancing weights in Fe, Zn & Pb, gram & OZ series, plus tyre valves, TPMS and repair products. Factory direct to 50+ countries.' },
    { name: 'keywords', content: 'wheel weight manufacturer, wheel weight manufacturers, wheel weight factory, wheel balancing weight manufacturer, wheel balancing weights, tyre valves, TPMS, tyre patch, tyre seal string, mushroom patch plug' },
    { property: 'og:title', content: 'Wheel Weight Manufacturer | Wheel Balancing Weights Factory - Century Auto Parts' },
    { property: 'og:description', content: 'Wheel weight manufacturer since 2010. Clip-on and adhesive wheel balancing weights in Fe, Zn & Pb, gram & OZ series, plus tyre valves, TPMS and repair products. Factory direct to 50+ countries.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://centurymanufacture.com/' },
    { property: 'og:image', content: 'https://centurymanufacture.com/images/hero-banner-warm-640-v2.webp' },
    { property: 'og:image:width', content: '1920' },
    { property: 'og:image:height', content: '640' },
    { property: 'og:image:alt', content: 'Century Auto Parts - Wheel Weight Manufacturer' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: 'https://centurymanufacture.com/images/hero-banner-warm-640-v2.webp' },
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
  'wheel-balancing-weights': '/images/cards-v2/cat-wheel-balancing-weights.webp',
  'tyre-valves': '/images/cards-v2/cat-tyre-valves.webp',
  'tpms': '/images/cards-v2/cat-tpms.webp',
  'tyre-seal-string': '/images/cards-v2/cat-tyre-seal-string.webp',
  'tyre-patch': '/images/cards-v2/cat-tyre-patch.webp',
  'mushroom-patch-plug': '/images/cards-v2/cat-mushroom-patch-plug.webp',
}

// Banner carousel
const banners = ref([
  { src: '/images/hero-banner-warm-640-v2.webp', alt: 'Clip-on and adhesive wheel balancing weights', href: '/products/wheel-balancing-weights/' },
  { src: '/images/hero-banner-tyre-valve.webp', alt: 'Rubber and metal tyre valves', href: '/products/tyre-valves/' },
])
const idx = ref(0)
let timer = null

function next() {
  idx.value = (idx.value + 1) % banners.value.length
  restart()
}
function prev() {
  idx.value = (idx.value - 1 + banners.value.length) % banners.value.length
  restart()
}
function go(i) {
  idx.value = i
  restart()
}
function restart() {
  if (timer) clearInterval(timer)
  timer = setInterval(next, 5000)
}
onMounted(restart)
onUnmounted(() => { clearInterval(timer) })
</script>

<template>
  <div>
    <section class="relative bg-gradient-to-br from-[#1A1A2E] via-[#2B2B45] to-[#4A2B1A] text-white overflow-hidden">
      <!-- bg carousel: wheel weight + tyre valve -->
      <div class="absolute inset-0">
        <RouterLink v-for="(b, i) in banners" :key="b.src" :to="b.href" :aria-label="`Shop ${b.alt}`" :tabindex="i === idx ? 0 : -1"
             class="absolute inset-0 block transition-opacity duration-1000 ease-in-out"
             :class="i === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'">
          <img :src="b.src" :alt="b.alt" class="w-full h-full object-cover object-center">
        </RouterLink>
      </div>
      <div class="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#1A1A2E]/70 via-[#1A1A2E]/40 to-[#1A1A2E]/15"></div>

      <!-- carousel nav -->
      <button @click="prev" class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition" aria-label="Previous banner">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <button @click="next" class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition" aria-label="Next banner">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        <button v-for="(b, i) in banners" :key="i" @click="go(i)" class="h-1.5 rounded-full transition-all" :class="i === idx ? 'w-8 bg-white' : 'w-4 bg-white/40 hover:bg-white/60'" :aria-label="`Go to slide ${i + 1}`"></button>
      </div>
      <div class="container-app relative z-10 pt-32 pb-72 md:pt-36 md:pb-36 text-center">
        <span class="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 text-shadow-hero">&#9672; Since 2010 &nbsp;&middot;&nbsp; Exported to 50+ Countries</span>
        <h1 class="text-4xl md:text-6xl font-bold leading-tight mb-6 text-shadow-hero">Wheel Weight <span class="text-[#FF6B00]">Manufacturer</span> for Global Markets</h1>
        <p class="text-lg text-gray-300 max-w-2xl mx-auto mb-8 text-shadow-hero">Wheel balancing weights, tyre valves, TPMS, patches and repair materials - manufactured and exported worldwide with factory-direct quality and pricing.</p>
        <div class="flex justify-center gap-4 flex-wrap">
          <RouterLink to="/products/" class="btn btn-primary btn-large">Explore Products</RouterLink>
          <RouterLink to="/contact/" class="btn btn-outline btn-large">Get a Quote</RouterLink>
        </div>
        <p class="text-sm text-gray-300 mt-6 inline-block bg-[#1A1A2E]/35 backdrop-blur-sm px-4 py-1.5 rounded-full text-shadow-hero">New: <RouterLink to="/news/wheel-weight-manufacturers/" class="text-[#FF6B00] hover:underline">Wheel Weight Manufacturers - Global Guide for Buyers</RouterLink></p>
      </div>
    </section>

    <section class="relative z-10 bg-white border-b border-gray-100">
      <div class="container-app -mt-5">
        <div class="bg-white rounded-lg shadow-card-lg p-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="s in stats" :key="s.label" class="text-center">
            <div class="text-3xl font-bold bg-gradient-to-r from-[#FF6B00] to-orange-500 bg-clip-text text-transparent">{{ s.value }}</div>
            <div class="text-sm text-gray-500 mt-2">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="container-app max-w-4xl">
        <h2 class="text-2xl md:text-3xl font-bold text-[#1A1A2E] mb-6 text-center">A Wheel Weight Manufacturer You Can Audit</h2>
        <div class="text-gray-600 leading-relaxed space-y-4">
          <p>Hebei Century Auto Parts Co., Ltd. has manufactured wheel balancing weights since 2010 in Yanshan County, Hebei Province - one of China's main tyre-repair product clusters. Unlike trading companies, we stamp, coat and pack every weight in our own factory, so the samples you approve are the goods you receive.</p>
          <p>Our range covers clip-on and adhesive (stick-on) wheel weights in Fe (steel) and Pb (lead), gram and OZ series from 5 g up to 500 g for truck wheels, plus tyre valves, TPMS stems and tyre repair materials for consolidated shipping. We export directly to distributors in 50+ countries across North America, the Middle East, Europe and Africa, with OEM and private label programs for importers building their own brand.</p>
        </div>
        <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="font-semibold text-[#1A1A2E]">Own Factory</div>
            <div class="text-xs text-gray-500 mt-1">Stamping, coating & packing in-house</div>
          </div>
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="font-semibold text-[#1A1A2E]">OEM / ODM</div>
            <div class="text-xs text-gray-500 mt-1">Private label cartons &amp; tape liner</div>
          </div>
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="font-semibold text-[#1A1A2E]">Mixed Containers</div>
            <div class="text-xs text-gray-500 mt-1">Weights + valves + patches in one shipment</div>
          </div>
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="font-semibold text-[#1A1A2E]">Lead-Free Range</div>
            <div class="text-xs text-gray-500 mt-1">Fe series for EPA &amp; EU markets</div>
          </div>
        </div>
        <p class="text-center mt-8 text-sm text-gray-500">Sourcing for distribution? Read our <RouterLink to="/news/wheel-weight-manufacturers/" class="text-[#C2410C] hover:underline">global wheel weight manufacturers guide</RouterLink> or <RouterLink to="/contact/" class="text-[#C2410C] hover:underline">request a factory quote</RouterLink>.</p>
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
            <div class="aspect-[4/3] overflow-hidden bg-[#F6F2EC]">
              <img :src="catImages[cat.slug]" :alt="cat.name" width="1200" height="900" loading="lazy" decoding="async" class="w-full h-full object-cover">
            </div>
            <div class="p-5 flex flex-col flex-1">
              <h3 class="font-semibold text-[#1A1A2E] mb-2">{{ cat.name }}</h3>
              <p class="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{{ cat.tagline }}</p>
              <RouterLink :to="`/products/${cat.slug}/`" class="text-[#C2410C] text-sm font-medium hover:underline">Explore Range &rarr;</RouterLink>
            </div>
          </div>
        </div>
        <div class="text-center mt-10">
          <RouterLink to="/catalog/" class="btn btn-primary btn-large">Download Full Product Catalog</RouterLink>
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
