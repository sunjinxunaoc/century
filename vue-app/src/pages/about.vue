<script setup>
import PageHero from '../components/PageHero.vue'
import CtaSection from '../components/CtaSection.vue'
import { categories } from '../data/products'
import { useHead } from '@unhead/vue'
import { ref, onMounted, onUnmounted } from 'vue'

useHead(() => ({
  title: 'About Us | Century Auto Parts',
  meta: [
    { name: 'description', content: 'Hebei Century Auto Parts Co., Ltd. - wheel weights, tyre valves, TPMS, seal strings, patches and mushroom plugs manufactured in Hebei, China since 2010 and exported to 50+ countries.' },
    { property: 'og:title', content: 'About Us | Century Auto Parts' },
    { property: 'og:description', content: 'Wheel weights, tyre valves, TPMS and tyre repair products manufactured in Hebei, China since 2010. Factory-direct supply to 50+ countries.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://centurymanufacture.com/about/' },
    { property: 'og:image', content: 'https://centurymanufacture.com/images/cards-v2/cat-wheel-balancing-weights.webp' },
    { property: 'og:image:alt', content: 'Century Auto Parts product categories' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: 'https://centurymanufacture.com/images/cards-v2/cat-wheel-balancing-weights.webp' },
  ],
  link: [
    { rel: 'canonical', href: 'https://centurymanufacture.com/about/' },
  ],
}))

const catImages = {
  'wheel-balancing-weights': '/images/cards-v2/cat-wheel-balancing-weights.webp',
  'tyre-valves': '/images/cards-v2/cat-tyre-valves.webp',
  'tpms': '/images/cards-v2/cat-tpms.webp',
  'tyre-seal-string': '/images/cards-v2/cat-tyre-seal-string.webp',
  'tyre-patch': '/images/cards-v2/cat-tyre-patch.webp',
  'mushroom-patch-plug': '/images/cards-v2/cat-mushroom-patch-plug.webp',
}

const slides = categories.map((cat) => ({
  img: catImages[cat.slug],
  title: cat.name,
  caption: cat.tagline,
  href: `/products/${cat.slug}/`,
}))

const current = ref(0)
let timer = null

function restart() {
  if (timer) clearInterval(timer)
  timer = setInterval(next, 5000)
}
function goTo(i) {
  current.value = i
  restart()
}
function next() {
  current.value = (current.value + 1) % slides.length
}
function prev() {
  current.value = (current.value - 1 + slides.length) % slides.length
}

onMounted(restart)
onUnmounted(() => { if (timer) clearInterval(timer) })

const facts = [
  { value: '2010', label: 'Founded in Hebei' },
  { value: '50+', label: 'Export countries' },
  { value: '2000+', label: 'Product SKUs' },
  { value: '6', label: 'Product families' },
]

const capabilities = [
  {
    title: 'In-house stamping',
    desc: 'Fe and Pb wheel weights are stamped, formed and finished in our own workshop, not outsourced to trading agents.',
  },
  {
    title: 'Coating & finishing',
    desc: 'Zinc plating, epoxy, black coating and colour film options, with 3M, Norton or generic tape applied in-house.',
  },
  {
    title: 'Assembly & packing',
    desc: 'Valves, TPMS stems, patches and seal strings are assembled, labelled and packed to your market requirements.',
  },
  {
    title: 'OEM / private label',
    desc: 'Your logo, artwork, barcodes, inner boxes and master cartons - built around your brand and order quantity.',
  },
]

const qualitySteps = [
  {
    step: '01',
    title: 'Incoming materials',
    desc: 'Steel, lead, rubber, brass, tape and packaging are checked against the approved sample before production.',
  },
  {
    step: '02',
    title: 'In-process checks',
    desc: 'Weight, dimensions, fit and surface finish are monitored during stamping, coating and assembly.',
  },
  {
    step: '03',
    title: 'Finished goods',
    desc: 'Sampled batches are checked for appearance, dimensional accuracy and function before they reach packing.',
  },
  {
    step: '04',
    title: 'Packing & shipment',
    desc: 'Labels, carton marks, quantities and loading photos are checked before the container is sealed.',
  },
]

const markets = ['North America', 'Europe', 'Middle East', 'Africa', 'Asia', 'South America']

const exportSteps = [
  'Send your product list and target market',
  'Confirm samples, packing and quotation',
  'Production with in-process quality checks',
  'Consolidated shipment with export documents',
]

const values = [
  { title: 'Trusted Enterprise', desc: 'Buy with confidence - we are a professional tire repair products manufacturer serving partners worldwide.' },
  { title: 'Quality First', desc: 'Every product undergoes strict quality testing from raw materials to packaging.' },
  { title: 'Factory Direct', desc: 'Direct manufacturer pricing with optimized logistics to help you save on every order.' },
]
</script>

<template>
  <div>
    <PageHero title="About Us" subtitle="Trusted Enterprise - Buy with Confidence" />

    <!-- Company intro + category carousel -->
    <section class="py-16 md:py-20">
      <div class="container-app">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="relative overflow-hidden rounded-lg shadow-card-lg bg-[#F6F2EC] min-w-0">
            <RouterLink v-for="(s, i) in slides" :key="s.href" :to="s.href"
              :aria-label="`Explore ${s.title}`" :tabindex="i === current ? 0 : -1"
              class="block transition-opacity duration-700"
              :class="i === current ? 'relative z-10 opacity-100' : 'absolute inset-0 z-0 opacity-0 pointer-events-none'">
              <img :src="s.img" :alt="s.title" width="1200" height="900" decoding="async" class="w-full max-w-full aspect-[4/3] object-cover">
              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-5 pt-16">
                <p class="text-white text-lg font-semibold">{{ s.title }}</p>
                <p class="text-white/75 text-sm mt-1">{{ s.caption }}</p>
                <span class="inline-flex items-center gap-1 text-[#FFB27A] text-sm font-medium mt-2">Explore range <span aria-hidden="true">&rarr;</span></span>
              </div>
            </RouterLink>

            <button type="button" @click="prev" class="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/25 hover:bg-black/40 backdrop-blur-sm flex items-center justify-center text-white transition" aria-label="Previous category">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button type="button" @click="next" class="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/25 hover:bg-black/40 backdrop-blur-sm flex items-center justify-center text-white transition" aria-label="Next category">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            <div class="absolute top-3 right-3 z-20 flex gap-1.5 rounded-full bg-black/25 px-2.5 py-1.5 backdrop-blur-sm">
              <button v-for="(s, i) in slides" :key="s.href" type="button" @click="goTo(i)"
                class="h-1.5 rounded-full transition-all" :class="i === current ? 'w-5 bg-[#FF6B00]' : 'w-1.5 bg-white/60 hover:bg-white'"
                :aria-label="`Go to ${s.title}`"></button>
            </div>
          </div>

          <div class="min-w-0">
            <p class="text-sm font-semibold tracking-wide uppercase text-[#FF6B00] mb-3">Manufacturer &amp; exporter since 2010</p>
            <h2 class="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-5">Your Factory-Direct Source for Tyre Repair Products</h2>
            <div class="space-y-4 text-gray-600 leading-relaxed">
              <p>Century Auto Parts manufactures wheel balancing weights, tyre valves, TPMS stems, tyre seal strings, repair patches and mushroom patch plugs in Yanshan County, Cangzhou, Hebei Province.</p>
              <p>We are a manufacturer, not a trading company: stamping, coating, assembly, inspection and export packing are managed under one roof. That keeps the sample you approve and the goods you receive consistent from order to order.</p>
              <p>Distributors, wholesalers and OEM buyers use us for factory-direct pricing, private label packaging and mixed-category consolidation - one container can combine weights, valves, TPMS and repair materials.</p>
            </div>

            <div class="flex flex-wrap gap-2 mt-6">
              <RouterLink v-for="cat in categories" :key="cat.slug" :to="`/products/${cat.slug}/`"
                class="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-[#FF6B00] hover:text-[#C2410C] transition">
                {{ cat.name }}
              </RouterLink>
            </div>

            <div class="flex flex-wrap gap-3 mt-8">
              <RouterLink to="/catalog/" class="btn btn-primary btn-large">Download Our Catalog</RouterLink>
              <RouterLink to="/contact/" class="btn btn-large border border-[#1A1A2E]/20 text-[#1A1A2E] hover:border-[#FF6B00] hover:text-[#C2410C]">Talk to Our Team</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Facts -->
    <section class="border-y border-gray-100 bg-white">
      <div class="container-app grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
        <div v-for="f in facts" :key="f.label" class="text-center">
          <div class="text-3xl font-bold bg-gradient-to-r from-[#FF6B00] to-orange-500 bg-clip-text text-transparent">{{ f.value }}</div>
          <div class="text-sm text-gray-500 mt-2">{{ f.label }}</div>
        </div>
      </div>
    </section>

    <!-- Manufacturing capabilities -->
    <section class="py-16 md:py-20">
      <div class="container-app">
        <div class="section-header">
          <h2 class="section-title">From Stamping to Shipment</h2>
          <p class="section-subtitle">The work we keep in-house, so quality does not depend on a third party</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(c, i) in capabilities" :key="c.title" class="card reveal p-6">
            <div class="w-10 h-10 rounded-full bg-orange-50 text-[#C2410C] flex items-center justify-center text-sm font-bold mb-4">0{{ i + 1 }}</div>
            <h3 class="font-semibold text-[#1A1A2E] mb-2">{{ c.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ c.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Quality control -->
    <section class="py-16 md:py-20 bg-[#F6F2EC]">
      <div class="container-app">
        <div class="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">
          <div>
            <p class="text-sm font-semibold tracking-wide uppercase text-[#FF6B00] mb-3">Quality control</p>
            <h2 class="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-5">Checked before it becomes your problem.</h2>
            <p class="text-gray-600 leading-relaxed mb-5">Our QC routine follows the product from incoming material to the sealed carton. The goal is simple: catch a deviation while it is still in our factory, not after it reaches your warehouse.</p>
            <p class="text-gray-600 leading-relaxed">For OEM orders, we keep approved samples, packaging artwork and carton marks on file so repeat orders stay consistent.</p>
            <RouterLink to="/contact/" class="inline-flex items-center gap-1 text-[#C2410C] font-medium mt-6 hover:underline">Ask about our QC process <span aria-hidden="true">&rarr;</span></RouterLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div v-for="q in qualitySteps" :key="q.step" class="bg-white rounded-lg p-5 shadow-sm">
              <div class="text-xs font-bold tracking-widest text-[#FF6B00] mb-2">{{ q.step }}</div>
              <h3 class="font-semibold text-[#1A1A2E] mb-2">{{ q.title }}</h3>
              <p class="text-sm text-gray-500 leading-relaxed">{{ q.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Global markets -->
    <section class="py-16 md:py-20">
      <div class="container-app">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <p class="text-sm font-semibold tracking-wide uppercase text-[#FF6B00] mb-3">Global supply</p>
            <h2 class="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-5">Built for importers, not one-off buyers.</h2>
            <p class="text-gray-600 leading-relaxed mb-5">We export to distributors, wholesalers and workshop suppliers in more than 50 countries. Orders can combine several product families, with private label packing and market-specific carton marks.</p>
            <div class="flex flex-wrap gap-2 mb-6">
              <span v-for="m in markets" :key="m" class="inline-flex items-center rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-[#9A3412]">{{ m }}</span>
            </div>
            <p class="text-gray-600 leading-relaxed">Sea, air and express shipping are quoted against your destination and order size. We can also supply the export documents your customs broker needs.</p>
          </div>
          <div class="rounded-lg border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
            <h3 class="font-semibold text-[#1A1A2E] mb-5">Typical export flow</h3>
            <ol class="space-y-4">
              <li v-for="(s, i) in exportSteps" :key="s" class="flex gap-4">
                <span class="w-7 h-7 shrink-0 rounded-full bg-[#1A1A2E] text-white text-xs font-semibold flex items-center justify-center">{{ i + 1 }}</span>
                <span class="text-sm text-gray-600 leading-relaxed pt-1">{{ s }}</span>
              </li>
            </ol>
            <RouterLink to="/contact/" class="btn btn-primary mt-7 w-full">Send Your Requirements</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-16 md:py-20 bg-gray-50">
      <div class="container-app">
        <div class="section-header">
          <h2 class="section-title">Our Values</h2>
          <p class="section-subtitle">What makes Century Auto Parts a trusted partner</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div v-for="v in values" :key="v.title" class="card reveal p-6 text-center">
            <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center text-xl">&#9733;</div>
            <h3 class="font-semibold text-[#1A1A2E] mb-2">{{ v.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <CtaSection heading="Partner With Us" text="Tell us your requirements - our team will provide a factory-direct solution." />
  </div>
</template>
