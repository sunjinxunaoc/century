<script setup>
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import WhatsAppFloat from './components/WhatsAppFloat.vue'
import { useHead } from '@unhead/vue'

useHead({
  meta: [
    { property: 'og:site_name', content: 'Century Auto Parts' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': 'https://centurymanufacture.com/#organization',
        name: 'Hebei Century Auto Parts Co., Ltd.',
        alternateName: 'Century Auto Parts',
        url: 'https://centurymanufacture.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://centurymanufacture.com/android-chrome-512x512.png',
        },
        description: 'Professional manufacturer of wheel balancing weights, tire valves, TPMS, tire repair tools and patches since 2010.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'No.161, Qiantang Village, Qingyun Town, Yanshan County',
          addressLocality: 'Cangzhou City',
          addressRegion: 'Hebei Province',
          addressCountry: 'CN',
        },
        telephone: '+86-156-3363-2668',
        email: 'info@centurymanufacture.com',
        foundingDate: '2010',
        areaServed: 'Worldwide',
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://centurymanufacture.com/#website',
        name: 'Century Auto Parts',
        alternateName: 'centurymanufacture.com',
        url: 'https://centurymanufacture.com',
        inLanguage: 'en',
        publisher: { '@id': 'https://centurymanufacture.com/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://centurymanufacture.com/products/?q={search_term_string}',
          },
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
