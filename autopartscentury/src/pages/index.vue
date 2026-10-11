<template>
  <div>
    <section class="relative bg-page">
      <div class="container-mi relative">
        <aside class="absolute left-4 top-0 z-20 hidden h-full w-[224px] bg-black/60 py-4 backdrop-blur-sm lg:block">
          <div class="px-5 pb-3 text-[13px] font-semibold uppercase tracking-wide text-white/60">Categories</div>
          <router-link
            v-for="sub in subcategories"
            :key="sub.slug"
            :to="`/products/${sub.slug}`"
            class="flex items-center justify-between px-5 py-3 text-[14px] text-white transition-colors hover:bg-brand"
          >
            {{ sub.name }}
            <svg class="h-4 w-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </router-link>
          <router-link
            to="/products"
            class="flex items-center justify-between px-5 py-3 text-[14px] text-white/80 transition-colors hover:bg-brand"
          >
            View All Products
          </router-link>
        </aside>
        <HeroSlider :slides="slides" />
      </div>
    </section>

    <section class="bg-page pb-2 pt-5">
      <div class="container-mi grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div v-for="q in quick" :key="q.title" class="mi-card flex flex-col items-center gap-2 py-5 text-center">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand" v-html="q.icon"></div>
          <div class="text-[13px] font-medium">{{ q.title }}</div>
          <div class="text-[11px] text-muted">{{ q.desc }}</div>
        </div>
      </div>
    </section>

    <section v-for="(sub, i) in subcategories" :key="sub.slug" class="bg-page py-5">
      <div class="container-mi">
        <div class="mb-3 flex items-end justify-between">
          <h2 class="text-[22px] font-semibold">{{ sub.name }}</h2>
          <router-link :to="`/products/${sub.slug}`" class="flex items-center gap-1 text-[13px] text-muted transition-colors hover:text-brand">
            View All
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </router-link>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <router-link
            :to="`/products/${sub.slug}`"
            class="mi-card relative row-span-2 flex min-h-[300px] flex-col justify-end overflow-hidden p-0 text-white"
          >
            <img :src="sub.products[0].image" :alt="sub.name" class="absolute inset-0 h-full w-full bg-white object-contain p-6 opacity-100" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"></div>
            <div class="relative p-5">
              <div class="text-[16px] font-semibold">{{ sub.name }}</div>
              <p class="mt-1 line-clamp-2 text-[12px] text-white/75">{{ sub.desc }}</p>
              <div class="mt-3 inline-block rounded-sm bg-brand px-4 py-1.5 text-[12px] font-medium">Explore</div>
            </div>
          </router-link>
          <ProductCard
            v-for="p in sub.products.slice(1, 9)"
            :key="p.slug"
            :product="p"
            :sub-slug="sub.slug"
          />
        </div>
      </div>
    </section>

    <section class="bg-white py-14">
      <div class="container-mi">
        <h2 class="mb-2 text-center text-[26px] font-semibold">Why Choose Century AutoParts</h2>
        <p class="mx-auto mb-10 max-w-2xl text-center text-[14px] text-muted">
          Specialized in tyre valves since 2010 — rubber snap-in and brass clamp-in valve stems trusted by distributors in 50+ countries.
        </p>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="w in why" :key="w.title" class="text-center">
            <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand" v-html="w.icon"></div>
            <div class="mb-1 text-[15px] font-semibold">{{ w.title }}</div>
            <p class="text-[13px] leading-relaxed text-muted">{{ w.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-page py-14">
      <div class="container-mi">
        <div class="mb-6 flex items-end justify-between">
          <div>
            <h2 class="text-[26px] font-semibold">News & Insights</h2>
            <p class="mt-1 text-[14px] text-muted">Buying guides and industry insights for tyre valve importers and distributors.</p>
          </div>
          <router-link to="/news" class="shrink-0 text-[13px] text-muted transition-colors hover:text-brand">View All &rarr;</router-link>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <router-link
            v-for="a in articles"
            :key="a.slug"
            :to="`/news/${a.slug}`"
            class="mi-card group flex flex-col overflow-hidden p-0"
          >
            <div class="h-32 overflow-hidden">
              <img :src="a.image" :alt="a.title" loading="lazy" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div class="flex flex-1 flex-col p-5">
              <div class="mb-2 text-[11px] text-muted">{{ a.date }}</div>
              <h3 class="mb-2 flex-1 text-[14px] font-semibold leading-snug text-ink transition-colors group-hover:text-brand">{{ a.title }}</h3>
              <div class="text-[12px] font-medium text-brand">Read More &rarr;</div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <section class="bg-page py-14">
      <div class="container-mi max-w-3xl">
        <h2 class="mb-8 text-center text-[26px] font-semibold">Frequently Asked Questions</h2>
        <FaqSection :faqs="category.faqs" />
      </div>
    </section>

    <CtaSection />
  </div>
</template>

<script setup>
import { useHead } from '@unhead/vue'
import { category, subcategories } from '../data/products'
import { articles } from '../data/news'
import HeroSlider from '../components/HeroSlider.vue'
import ProductCard from '../components/ProductCard.vue'
import FaqSection from '../components/FaqSection.vue'
import CtaSection from '../components/CtaSection.vue'

const slides = [
  {
    kicker: 'Tyre Valve Manufacturer',
    title: 'Rubber & Brass Tyre Valves for Every Vehicle',
    desc: 'Snap-in and clamp-in valve stems for passenger cars, trucks, buses and agricultural machinery. Factory-direct with OEM/ODM support.',
    image: '/images/hero-banner-valve-family.webp',
    cta: 'Browse Products',
    to: '/products',
  },
  {
    kicker: 'Factory Direct Since 2010',
    title: 'Tyre Valve Manufacturing You Can Trust',
    desc: 'One-stop supply of tyre valves, caps, cores and extensions, exported to 50+ countries with bulk and OEM/ODM options.',
    image: '/images/hero-banner-tyre-valve.webp',
    cta: 'About Us',
    to: '/about',
  },
  {
    kicker: 'Heavy Duty',
    title: 'Truck & Bus Brass Clamp-In Valves',
    desc: 'V3-20 series, TR571-TR575 and 58MS high-pressure metal valves for commercial fleets.',
    image: '/images/hero-banner-heavy-duty.webp',
    cta: 'Truck & Bus Valves',
    to: '/products/truck-bus-valves',
  },
]

const quick = [
  { title: 'OEM / ODM', desc: 'Custom branding', icon: '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7 21h10M12 3a4 4 0 014 4c0 2-1 3-2 4H10c-1-1-2-2-2-4a4 4 0 014-4zm-2 12h4v2a2 2 0 01-2 2 2 2 0 01-2-2v-2z"/></svg>' },
  { title: 'Bulk Supply', desc: 'Container loads', icon: '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 7l-8-4-8 4m16 0v10l-8 4m8-14l-8 4m-8-4v10l8 4m-8-14l8 4"/></svg>' },
  { title: 'Full Size Charts', desc: 'TR / PVR / V3 data', icon: '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 17v-6m4 6V7m4 10v-3M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>' },
  { title: 'Leak Tested', desc: '100% inspection', icon: '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
  { title: 'Fast Quote', desc: 'Reply in 24h', icon: '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>' },
  { title: 'Global Export', desc: '50+ countries', icon: '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
]

const why = [
  { title: 'Specialized Factory', desc: 'Focused on tyre valves and wheel service products since 2010, with mature production lines.', icon: '<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 21V8l7-5 7 5v13M3 21h18M10 21v-6h4v6"/></svg>' },
  { title: 'Complete Range', desc: 'TR412-TR415, TR414C, PVR40-70, V3-20, TR570 series, TR618A and TRJ650 large-bore valves.', icon: '<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>' },
  { title: 'Quality Materials', desc: 'High-grade vulcanized rubber and brass stems. Every valve shipped with core and cap.', icon: '<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v13m0-13V6a4 4 0 10-4 4h4zm0 0v13m0-13V6a4 4 0 114 4h-4z"/></svg>' },
  { title: 'Export Experience', desc: 'Serving importers, wholesalers and brands in 50+ countries with flexible packaging.', icon: '<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
]

useHead({
  title: 'Tyre Valves Manufacturer | Rubber Snap-In & Brass Clamp-In Valve Stems - Century AutoParts',
  meta: [
    { name: 'description', content: category.intro },
    { name: 'keywords', content: category.keywords },
    { property: 'og:title', content: 'Tyre Valves Manufacturer | Century AutoParts' },
    { property: 'og:description', content: category.tagline },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://autopartscentury.com/' },
  ],
  link: [
    { rel: 'canonical', href: 'https://autopartscentury.com/' },
    { rel: 'preload', as: 'image', href: slides[0].image, fetchpriority: 'high' },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Century AutoParts',
        url: 'https://autopartscentury.com/',
        logo: 'https://autopartscentury.com/images/logo/logo-icon-transparent.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+86-156-3363-2668',
          contactType: 'sales',
          areaServed: 'Worldwide',
        },
      }),
    },
  ],
})
</script>
