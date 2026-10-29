<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useHead } from '@unhead/vue'
import { getCategories } from '../data/localize'
import CtaSection from '../components/CtaSection.vue'
import { useI18n, absoluteUrl } from '../i18n'

const { t, tm, locale, p } = useI18n()

const categories = computed(() => getCategories(locale.value))

useHead(() => ({
  title: t('seo.home.title'),
  meta: [
    { name: 'description', content: t('seo.home.description') },
    { name: 'keywords', content: t('seo.home.keywords') },
    { property: 'og:title', content: t('seo.home.title') },
    { property: 'og:description', content: t('seo.home.description') },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: absoluteUrl('/') },
    { property: 'og:image', content: 'https://centurymanufacture.com/images/hero-banner-warm-640-v2.webp' },
    { property: 'og:image:width', content: '1920' },
    { property: 'og:image:height', content: '640' },
    { property: 'og:image:alt', content: t('seo.home.imageAlt') },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: 'https://centurymanufacture.com/images/hero-banner-warm-640-v2.webp' },
  ],
  link: [
    { rel: 'canonical', href: absoluteUrl('/') },
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

// Banner carousel
const banners = computed(() => [
  {
    src: '/images/hero-banner-warm-640-v2.webp',
    alt: tm('home.hero.bannerAlts')[0],
    href: p('/products/wheel-balancing-weights/'),
  },
  {
    src: '/images/hero-banner-tyre-valve.webp',
    alt: tm('home.hero.bannerAlts')[1],
    href: p('/products/tyre-valves/'),
  },
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
        <RouterLink v-for="(b, i) in banners" :key="b.src" :to="b.href" :aria-label="t('home.hero.shopBanner', { name: b.alt })" :tabindex="i === idx ? 0 : -1"
             class="absolute inset-0 block transition-opacity duration-1000 ease-in-out"
             :class="i === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'">
          <img :src="b.src" :alt="b.alt" class="w-full h-full object-cover object-center">
        </RouterLink>
      </div>
      <div class="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#1A1A2E]/70 via-[#1A1A2E]/40 to-[#1A1A2E]/15"></div>

      <!-- carousel nav -->
      <button @click="prev" class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition" :aria-label="t('home.hero.prevBanner')">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <button @click="next" class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition" :aria-label="t('home.hero.nextBanner')">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        <button v-for="(b, i) in banners" :key="i" @click="go(i)" class="h-1.5 rounded-full transition-all" :class="i === idx ? 'w-8 bg-white' : 'w-4 bg-white/40 hover:bg-white/60'" :aria-label="t('home.hero.goToSlide', { n: i + 1 })"></button>
      </div>
      <div class="container-app relative z-10 pt-32 pb-72 md:pt-36 md:pb-36 text-center">
        <span class="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 text-shadow-hero">&#9672; {{ t('home.hero.badge') }}</span>
        <h1 class="text-4xl md:text-6xl font-bold leading-tight mb-6 text-shadow-hero">{{ t('home.hero.titleStart') }} <span class="text-[#FF6B00]">{{ t('home.hero.titleHighlight') }}</span> {{ t('home.hero.titleEnd') }}</h1>
        <p class="text-lg text-gray-300 max-w-2xl mx-auto mb-8 text-shadow-hero">{{ t('home.hero.subtitle') }}</p>
        <div class="flex justify-center gap-4 flex-wrap">
          <RouterLink :to="p('/products/')" class="btn btn-primary btn-large">{{ t('common.exploreProducts') }}</RouterLink>
          <RouterLink :to="p('/contact/')" class="btn btn-outline btn-large">{{ t('common.getQuote') }}</RouterLink>
        </div>
        <p class="text-sm text-gray-300 mt-6 inline-block bg-[#1A1A2E]/35 backdrop-blur-sm px-4 py-1.5 rounded-full text-shadow-hero">{{ t('home.hero.newLabel') }} <RouterLink :to="p('/news/wheel-weight-manufacturers/')" class="text-[#FF6B00] hover:underline">{{ t('home.hero.newLink') }}</RouterLink></p>
      </div>
    </section>

    <section class="relative z-10 bg-white border-b border-gray-100">
      <div class="container-app -mt-5">
        <div class="bg-white rounded-lg shadow-card-lg p-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="s in tm('home.stats')" :key="s.label" class="text-center">
            <div class="text-3xl font-bold bg-gradient-to-r from-[#FF6B00] to-orange-500 bg-clip-text text-transparent">{{ s.value }}</div>
            <div class="text-sm text-gray-500 mt-2">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="container-app max-w-4xl">
        <h2 class="text-2xl md:text-3xl font-bold text-[#1A1A2E] mb-6 text-center">{{ t('home.intro.title') }}</h2>
        <div class="text-gray-600 leading-relaxed space-y-4">
          <p>{{ t('home.intro.paragraph1') }}</p>
          <p>{{ t('home.intro.paragraph2') }}</p>
        </div>
        <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div v-for="pillar in tm('home.intro.pillars')" :key="pillar.title" class="border border-gray-200 rounded-lg p-4">
            <div class="font-semibold text-[#1A1A2E]">{{ pillar.title }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ pillar.desc }}</div>
          </div>
        </div>
        <p class="text-center mt-8 text-sm text-gray-500">{{ t('home.intro.noteStart') }} <RouterLink :to="p('/news/wheel-weight-manufacturers/')" class="text-[#C2410C] hover:underline">{{ t('home.intro.noteGuide') }}</RouterLink> {{ t('home.intro.noteMiddle') }} <RouterLink :to="p('/contact/')" class="text-[#C2410C] hover:underline">{{ t('home.intro.noteQuote') }}</RouterLink>{{ t('home.intro.noteEnd') }}</p>
      </div>
    </section>

    <section class="py-20">
      <div class="container-app">
        <div class="section-header">
          <h2 class="section-title">{{ t('home.range.title') }}</h2>
          <p class="section-subtitle">{{ t('home.range.subtitle') }}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="cat in categories" :key="cat.slug" class="card reveal flex flex-col">
            <div class="aspect-[4/3] overflow-hidden bg-[#F6F2EC]">
              <img :src="catImages[cat.slug]" :alt="cat.name" width="1200" height="900" loading="lazy" decoding="async" class="w-full h-full object-cover">
            </div>
            <div class="p-5 flex flex-col flex-1">
              <h3 class="font-semibold text-[#1A1A2E] mb-2">{{ cat.name }}</h3>
              <p class="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{{ cat.tagline }}</p>
              <RouterLink :to="p(`/products/${cat.slug}/`)" class="text-[#C2410C] text-sm font-medium hover:underline">{{ t('home.range.explore') }} &rarr;</RouterLink>
            </div>
          </div>
        </div>
        <div class="text-center mt-10">
          <RouterLink :to="p('/catalog/')" class="btn btn-primary btn-large">{{ t('common.downloadCatalog') }}</RouterLink>
        </div>
      </div>
    </section>

    <section class="py-20 bg-gray-50">
      <div class="container-app">
        <div class="section-header">
          <h2 class="section-title">{{ t('home.why.title') }}</h2>
          <p class="section-subtitle">{{ t('home.why.subtitle') }}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="v in tm('home.why.values')" :key="v.title" class="card reveal p-6 text-center">
            <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center text-xl">&#9733;</div>
            <h3 class="font-semibold text-[#1A1A2E] mb-2">{{ v.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <CtaSection :heading="t('home.cta.heading')" :text="t('home.cta.text')" />
  </div>
</template>
