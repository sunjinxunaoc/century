<script setup>
import { useHead } from '@unhead/vue'
import PageHero from '../components/PageHero.vue'
import { useI18n, absoluteUrl } from '../i18n'

const { t, tm } = useI18n()

useHead(() => ({
  title: t('seo.privacy.title'),
  meta: [
    { name: 'description', content: t('seo.privacy.description') },
    { name: 'robots', content: 'noindex, follow' },
    { property: 'og:title', content: t('seo.privacy.title') },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: absoluteUrl('/privacy/') },
  ],
  link: [
    { rel: 'canonical', href: absoluteUrl('/privacy/') },
  ],
}))
</script>

<template>
  <div>
    <PageHero :title="t('privacy.heroTitle')" :subtitle="t('privacy.heroSubtitle')" />
    <section class="py-16">
      <div class="container-app max-w-3xl">
        <p class="text-sm text-gray-500 mb-8">{{ t('privacy.updated') }}</p>
        <p class="text-gray-600 leading-relaxed mb-10">
          {{ t('privacy.introStart') }}
          <a href="https://centurymanufacture.com" class="text-[#FF6B00] hover:underline">centurymanufacture.com</a>.
          {{ t('privacy.introEnd') }}
        </p>
        <div v-for="s in tm('privacy.sections')" :key="s.title" class="mb-10">
          <h2 class="text-xl font-bold text-[#1A1A2E] mb-4">{{ s.title }}</h2>
          <ul class="space-y-3">
            <li v-for="(item, i) in s.items" :key="i" class="flex gap-3 text-gray-600 leading-relaxed">
              <span class="text-[#FF6B00] mt-1 shrink-0">&#9672;</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
        <div class="bg-gray-50 rounded-lg p-6">
          <h2 class="text-xl font-bold text-[#1A1A2E] mb-3">{{ t('privacy.contactTitle') }}</h2>
          <p class="text-gray-600 leading-relaxed">
            {{ t('privacy.contactStart') }}
            <a href="mailto:info@centurymanufacture.com" class="text-[#FF6B00] hover:underline">info@centurymanufacture.com</a>
            {{ t('privacy.contactEnd') }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
