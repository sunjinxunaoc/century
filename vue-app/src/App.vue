<script setup>
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import WhatsAppFloat from './components/WhatsAppFloat.vue'
import { useHead } from '@unhead/vue'

useHead({
  meta: [
    { property: 'og:site_name', content: 'Century Auto Parts' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Hebei Century Auto Parts Co., Ltd.',
        alternateName: 'Century Auto Parts',
        url: 'https://centurymanufacture.com',
        description: 'Professional manufacturer of tire valves, wheel weights, TPMS, tire repair tools and patches since 2010.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'No.161, Qiantang Village, Qingyun Town, Yanshan County',
          addressLocality: 'Cangzhou City',
          addressRegion: 'Hebei Province',
          addressCountry: 'CN',
        },
        telephone: '+86-156-3363-2668',
        email: 'gracecenturyauto@gmail.com',
        foundingDate: '2010',
        areaServed: 'Worldwide',
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Century Auto Parts',
        url: 'https://centurymanufacture.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://centurymanufacture.com/products/?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      }),
    },
  ],
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <main class="flex-1">
      <RouterView />
    </main>
    <SiteFooter />
    <WhatsAppFloat />
  </div>
</template>
