<template>
  <div class="bg-page pb-14">
    <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'About Us' }]" />

    <section class="container-mi">
      <div class="mi-card overflow-hidden">
        <div class="relative h-[280px]">
          <img src="/images/factory.webp" alt="AutoParts Century factory" class="absolute inset-0 h-full w-full object-cover" />
          <div class="absolute inset-0 bg-black/50"></div>
          <div class="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <h1 class="mb-2 text-3xl font-bold lg:text-4xl">About AutoParts Century</h1>
            <p class="max-w-2xl text-[15px] text-white/85">Professional tyre valve manufacturer trusted by distributors in 50+ countries.</p>
          </div>
        </div>

        <div class="grid gap-10 p-8 lg:grid-cols-2 lg:p-12">
          <div>
            <h2 class="mb-4 text-[22px] font-semibold">Who We Are</h2>
            <div class="space-y-4 text-[14px] leading-relaxed text-muted">
              <p>
                AutoParts Century is a specialized manufacturer of tyre valves based in Cangzhou, Hebei, China — one of the country's key automotive parts production hubs. Since 2010, we have focused on the design and production of rubber snap-in and brass clamp-in valve stems for the global aftermarket.
              </p>
              <p>
                Our range covers passenger car and light truck valves (TR412, TR413, TR414, TR415, TR414C, PVR40-70), truck and bus high-pressure valves (V3-20 series, TR570-TR574, MS70-7), and agricultural &amp; off-road valves (TR618A, TRJ650, TR1175A). Every valve ships complete with brass core and cap.
              </p>
              <p>
                We support OEM and ODM programs with custom packaging, private labeling and flexible order quantities, serving importers, wholesalers and tire service chains worldwide.
              </p>
            </div>
          </div>
          <div>
            <h2 class="mb-4 text-[22px] font-semibold">By the Numbers</h2>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="s in stats" :key="s.label" class="bg-page p-6 text-center">
                <div class="text-3xl font-bold text-brand">{{ s.value }}</div>
                <div class="mt-1 text-[13px] text-muted">{{ s.label }}</div>
              </div>
            </div>
            <h3 class="mb-3 mt-8 text-[16px] font-semibold">Our Commitment</h3>
            <ul class="space-y-2">
              <li v-for="(c, i) in commitments" :key="i" class="flex items-start gap-2 text-[13px] text-muted">
                <svg class="mt-0.5 h-4 w-4 shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                {{ c }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <CtaSection class="mt-14" title="Work With a Tyre Valve Specialist" desc="Tell us your target market and order volume — we will recommend the right valve range and quote within 24 hours." />
  </div>
</template>

<script setup>
import { useHead } from '@unhead/vue'
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import CtaSection from '../components/CtaSection.vue'

const stats = [
  { value: '15+', label: 'Years of Manufacturing' },
  { value: '50+', label: 'Countries Served' },
  { value: '17', label: 'Tyre Valve Product Lines' },
  { value: '100%', label: 'Leak Tested' },
]

const commitments = [
  'Consistent quality with high-grade vulcanized rubber and brass stems',
  'Full size charts with rim hole and effective length data',
  'OEM / ODM support with custom packaging and private labels',
  'Factory-direct pricing for bulk and wholesale orders',
  'Fast response — quotations within 24 hours on working days',
]

useHead({
  title: 'About Us | Tyre Valve Manufacturer Since 2010 - AutoParts Century',
  meta: [
    { name: 'description', content: 'AutoParts Century is a specialized tyre valve manufacturer in Cangzhou, Hebei, China. Rubber snap-in and brass clamp-in valve stems for 50+ countries with OEM/ODM support.' },
    { property: 'og:title', content: 'About AutoParts Century | Tyre Valve Manufacturer' },
    { property: 'og:description', content: 'Professional tyre valve manufacturer since 2010, trusted by distributors in 50+ countries.' },
  ],
  link: [{ rel: 'canonical', href: 'https://autopartscentury.com/about/' }],
})
</script>
