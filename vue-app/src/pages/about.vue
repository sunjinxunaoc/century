<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useHead } from '@unhead/vue'
import PageHero from '../components/PageHero.vue'
import CtaSection from '../components/CtaSection.vue'
import { getCategories } from '../data/localize'
import { useI18n, absoluteUrl } from '../i18n'

const { t, tm, locale, p } = useI18n()

const categories = computed(() => getCategories(locale.value))

useHead(() => ({
  title: t('seo.about.title'),
  meta: [
    { name: 'description', content: t('seo.about.description') },
    { property: 'og:title', content: t('seo.about.ogTitle') },
    { property: 'og:description', content: t('seo.about.ogDescription') },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: absoluteUrl('/about/') },
    { property: 'og:image', content: 'https://centurymanufacture.com/images/cards-v2/cat-wheel-balancing-weights.webp' },
    { property: 'og:image:alt', content: t('seo.about.imageAlt') },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: 'https://centurymanufacture.com/images/cards-v2/cat-wheel-balancing-weights.webp' },
  ],
  link: [
    { rel: 'canonical', href: absoluteUrl('/about/') },
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

const slides = computed(() =>
  categories.value.map((cat) => ({
    img: catImages[cat.slug],
    title: cat.name,
    caption: cat.tagline,
    href: p(`/products/${cat.slug}/`),
  }))
)

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
  current.value = (current.value + 1) % slides.value.length
}
function prev() {
  current.value = (current.value - 1 + slides.value.length) % slides.value.length
}

onMounted(restart)
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <div>
    <PageHero :title="t('about.hero.title')" :subtitle="t('about.hero.subtitle')" />

    <!-- Company intro + category carousel -->
    <section class="py-16 md:py-20">
      <div class="container-app">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="relative overflow-hidden rounded-lg shadow-card-lg bg-[#F6F2EC] min-w-0">
            <RouterLink v-for="(s, i) in slides" :key="s.href" :to="s.href"
              :aria-label="t('about.carousel.exploreLabel', { name: s.title })" :tabindex="i === current ? 0 : -1"
              class="block transition-opacity duration-700"
              :class="i === current ? 'relative z-10 opacity-100' : 'absolute inset-0 z-0 opacity-0 pointer-events-none'">
              <img :src="s.img" :alt="s.title" width="1200" height="900" decoding="async" class="w-full max-w-full aspect-[4/3] object-cover">
              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-5 pt-16">
                <p class="text-white text-lg font-semibold">{{ s.title }}</p>
                <p class="text-white/75 text-sm mt-1">{{ s.caption }}</p>
                <span class="inline-flex items-center gap-1 text-[#FFB27A] text-sm font-medium mt-2">{{ t('about.carousel.explore') }} <span aria-hidden="true">&rarr;</span></span>
              </div>
            </RouterLink>

            <button type="button" @click="prev" class="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/25 hover:bg-black/40 backdrop-blur-sm flex items-center justify-center text-white transition" :aria-label="t('about.carousel.prev')">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button type="button" @click="next" class="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/25 hover:bg-black/40 backdrop-blur-sm flex items-center justify-center text-white transition" :aria-label="t('about.carousel.next')">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            <div class="absolute top-3 right-3 z-20 flex gap-1.5 rounded-full bg-black/25 px-2.5 py-1.5 backdrop-blur-sm">
              <button v-for="(s, i) in slides" :key="s.href" type="button" @click="goTo(i)"
                class="h-1.5 rounded-full transition-all" :class="i === current ? 'w-5 bg-[#FF6B00]' : 'w-1.5 bg-white/60 hover:bg-white'"
                :aria-label="t('about.carousel.goTo', { name: s.title })"></button>
            </div>
          </div>

          <div class="min-w-0">
            <p class="text-sm font-semibold tracking-wide uppercase text-[#FF6B00] mb-3">{{ t('about.intro.eyebrow') }}</p>
            <h2 class="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-5">{{ t('about.intro.title') }}</h2>
            <div class="space-y-4 text-gray-600 leading-relaxed">
              <p>{{ t('about.intro.paragraph1') }}</p>
              <p>{{ t('about.intro.paragraph2') }}</p>
              <p>{{ t('about.intro.paragraph3') }}</p>
            </div>

            <div class="flex flex-wrap gap-2 mt-6">
              <RouterLink v-for="cat in categories" :key="cat.slug" :to="p(`/products/${cat.slug}/`)"
                class="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-[#FF6B00] hover:text-[#C2410C] transition">
                {{ cat.name }}
              </RouterLink>
            </div>

            <div class="flex flex-wrap gap-3 mt-8">
              <RouterLink :to="p('/catalog/')" class="btn btn-primary btn-large">{{ t('about.intro.downloadCatalog') }}</RouterLink>
              <RouterLink :to="p('/contact/')" class="btn btn-large border border-[#1A1A2E]/20 text-[#1A1A2E] hover:border-[#FF6B00] hover:text-[#C2410C]">{{ t('about.intro.talkToTeam') }}</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Facts -->
    <section class="border-y border-gray-100 bg-white">
      <div class="container-app grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
        <div v-for="f in tm('about.facts')" :key="f.label" class="text-center">
          <div class="text-3xl font-bold bg-gradient-to-r from-[#FF6B00] to-orange-500 bg-clip-text text-transparent">{{ f.value }}</div>
          <div class="text-sm text-gray-500 mt-2">{{ f.label }}</div>
        </div>
      </div>
    </section>

    <!-- Manufacturing capabilities -->
    <section class="py-16 md:py-20">
      <div class="container-app">
        <div class="section-header">
          <h2 class="section-title">{{ t('about.capabilities.title') }}</h2>
          <p class="section-subtitle">{{ t('about.capabilities.subtitle') }}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(c, i) in tm('about.capabilities.items')" :key="c.title" class="card reveal p-6">
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
            <p class="text-sm font-semibold tracking-wide uppercase text-[#FF6B00] mb-3">{{ t('about.quality.eyebrow') }}</p>
            <h2 class="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-5">{{ t('about.quality.title') }}</h2>
            <p class="text-gray-600 leading-relaxed mb-5">{{ t('about.quality.paragraph1') }}</p>
            <p class="text-gray-600 leading-relaxed">{{ t('about.quality.paragraph2') }}</p>
            <RouterLink :to="p('/contact/')" class="inline-flex items-center gap-1 text-[#C2410C] font-medium mt-6 hover:underline">{{ t('about.quality.link') }} <span aria-hidden="true">&rarr;</span></RouterLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div v-for="q in tm('about.quality.steps')" :key="q.step" class="bg-white rounded-lg p-5 shadow-sm">
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
            <p class="text-sm font-semibold tracking-wide uppercase text-[#FF6B00] mb-3">{{ t('about.markets.eyebrow') }}</p>
            <h2 class="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-5">{{ t('about.markets.title') }}</h2>
            <p class="text-gray-600 leading-relaxed mb-5">{{ t('about.markets.paragraph1') }}</p>
            <div class="flex flex-wrap gap-2 mb-6">
              <span v-for="m in tm('about.markets.names')" :key="m" class="inline-flex items-center rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-[#9A3412]">{{ m }}</span>
            </div>
            <p class="text-gray-600 leading-relaxed">{{ t('about.markets.paragraph2') }}</p>
          </div>
          <div class="rounded-lg border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
            <h3 class="font-semibold text-[#1A1A2E] mb-5">{{ t('about.markets.flowTitle') }}</h3>
            <ol class="space-y-4">
              <li v-for="(s, i) in tm('about.markets.flow')" :key="s" class="flex gap-4">
                <span class="w-7 h-7 shrink-0 rounded-full bg-[#1A1A2E] text-white text-xs font-semibold flex items-center justify-center">{{ i + 1 }}</span>
                <span class="text-sm text-gray-600 leading-relaxed pt-1">{{ s }}</span>
              </li>
            </ol>
            <RouterLink :to="p('/contact/')" class="btn btn-primary mt-7 w-full">{{ t('about.markets.cta') }}</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-16 md:py-20 bg-gray-50">
      <div class="container-app">
        <div class="section-header">
          <h2 class="section-title">{{ t('about.values.title') }}</h2>
          <p class="section-subtitle">{{ t('about.values.subtitle') }}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div v-for="v in tm('about.values.items')" :key="v.title" class="card reveal p-6 text-center">
            <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center text-xl">&#9733;</div>
            <h3 class="font-semibold text-[#1A1A2E] mb-2">{{ v.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <CtaSection :heading="t('about.cta.heading')" :text="t('about.cta.text')" />
  </div>
</template>
