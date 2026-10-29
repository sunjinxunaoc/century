<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import PageHero from '../components/PageHero.vue'
import CtaSection from '../components/CtaSection.vue'
import { getCategories } from '../data/localize'
import { trackAdsConversion, trackEvent } from '../composables/useConversion'
import { useI18n, absoluteUrl } from '../i18n'

const { t, tm, locale, p } = useI18n()

useHead(() => {
  const url = absoluteUrl('/catalog/')
  return {
    title: t('seo.catalog.title'),
    meta: [
      { name: 'description', content: t('seo.catalog.description') },
      { name: 'keywords', content: t('seo.catalog.keywords') },
      { property: 'og:title', content: t('seo.catalog.title') },
      { property: 'og:description', content: t('seo.catalog.ogDescription') },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: 'https://centurymanufacture.com/images/factory.webp' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://centurymanufacture.com/images/factory.webp' },
    ],
    link: [
      { rel: 'canonical', href: url },
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: t('catalog.heroTitle'),
          url,
          about: 'Tyre repair products catalog',
          publisher: { '@type': 'Organization', name: 'Hebei Century Auto Parts Co., Ltd.' },
        }),
      },
    ],
  }
})

const form = reactive({ name: '', company: '', country: '', whatsapp: '', email: '' })
const sending = ref(false)
const submitted = ref(false)
const error = ref('')

const categories = computed(() =>
  getCategories(locale.value).map((cat) => ({
    name: cat.name,
    path: p(`/products/${cat.slug}/`),
    desc: (tm('catalog.categoryDescs') || {})[cat.slug] || cat.tagline,
  }))
)

async function onSubmit() {
  if (sending.value) return
  sending.value = true
  error.value = ''

  const payload = new FormData()
  payload.append('name', form.name)
  payload.append('company', form.company)
  payload.append('country', form.country)
  payload.append('whatsapp', form.whatsapp)
  payload.append('email', form.email)
  payload.append('_subject', `Catalog Download Request - ${form.name || 'website'} - ${form.company || 'N/A'}`)
  payload.append('_replyto', form.email)
  payload.append('_template', 'table')

  try {
    const res = await fetch('https://formsubmit.co/ajax/info@centurymanufacture.com', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: payload,
    })
    if (res.ok) {
      submitted.value = true
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'catalog_download', { location: 'lead_form' })
        window.gtag('event', 'generate_lead', {
          form: 'catalog_quote',
        })
      }
      form.name = ''
      form.company = ''
      form.country = ''
      form.whatsapp = ''
      form.email = ''
    } else {
      error.value = t('common.errorGeneric')
    }
  } catch (err) {
    error.value = t('common.errorNetwork')
  } finally {
    sending.value = false
  }
}

const catalogUrl = '/downloads/century-auto-parts-catalog-2026.pdf'

function trackCatalogDownload() {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'catalog_download', { location: 'main_button' })
  }
}

// Catalog 浏览：Ads 转化需要单独建一条「网页加载 /catalog/」的转化操作，
// 建好后把 label 填进 useConversion.js 的 LABELS.catalog_pageview。
// label 为空时这里不会上报 Ads 转化，只发 GA4 事件。
onMounted(() => {
  trackAdsConversion('catalog_pageview')
  trackEvent('catalog_view')
})
</script>

<template>
  <div>
    <PageHero :title="t('catalog.heroTitle')" :subtitle="t('catalog.heroSubtitle')" />

    <section class="py-16">
      <div class="container-app">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 class="text-3xl font-bold text-[#1A1A2E] mb-4">{{ t('catalog.downloadTitle') }}</h2>
            <p class="text-gray-600 leading-relaxed mb-6">{{ t('catalog.downloadText') }}</p>
            <ul class="list-disc ml-5 space-y-2 text-gray-600 mb-8">
              <li v-for="b in tm('catalog.bullets')" :key="b">{{ b }}</li>
            </ul>
            <a
              :href="catalogUrl"
              download
              class="btn btn-primary btn-large inline-flex items-center gap-2"
              @click="trackCatalogDownload"
            >
              {{ t('catalog.downloadCta') }}
            </a>
            <p class="text-sm text-gray-500 mt-3">{{ t('catalog.freeNote') }}</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg shadow-card p-8">
            <h2 class="text-2xl font-bold text-[#1A1A2E] mb-4">{{ t('catalog.quoteTitle') }}</h2>
            <p class="text-gray-500 text-sm mb-6">{{ t('catalog.quoteText') }}</p>
            <form @submit.prevent="onSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">{{ t('catalog.form.name') }}</label>
                <input v-model="form.name" type="text" required :placeholder="t('catalog.form.namePh')"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">{{ t('catalog.form.company') }}</label>
                <input v-model="form.company" type="text" required :placeholder="t('catalog.form.companyPh')"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">{{ t('catalog.form.country') }}</label>
                <input v-model="form.country" type="text" required :placeholder="t('catalog.form.countryPh')"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">{{ t('catalog.form.whatsapp') }}</label>
                <input v-model="form.whatsapp" type="tel" required :placeholder="t('catalog.form.whatsappPh')"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">{{ t('catalog.form.email') }}</label>
                <input v-model="form.email" type="email" required :placeholder="t('catalog.form.emailPh')"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
              </div>
              <button type="submit" :disabled="sending" id="submitBtn"
                class="w-full btn btn-primary" :class="{ 'opacity-60': sending }">
                {{ sending ? t('common.sending') : t('catalog.form.submit') }}
              </button>
              <p v-if="error" class="text-red-600 text-sm text-center">{{ error }}</p>
              <p v-if="submitted" class="text-green-600 text-sm text-center">{{ t('common.successCatalog') }}</p>
            </form>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-gray-50">
      <div class="container-app">
        <div class="section-header">
          <h2 class="section-title">{{ t('catalog.insideTitle') }}</h2>
          <p class="section-subtitle">{{ t('catalog.insideSubtitle') }}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink v-for="cat in categories" :key="cat.name" :to="cat.path" class="card reveal p-5 block hover:shadow-card-lg transition-shadow">
            <h3 class="font-semibold text-[#1A1A2E] mb-2">{{ cat.name }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ cat.desc }}</p>
            <span class="text-[#FF6B00] text-sm font-medium mt-3 inline-block">{{ t('catalog.viewProducts') }} &rarr;</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <CtaSection :heading="t('catalog.ctaHeading')" :text="t('catalog.ctaText')" />
  </div>
</template>
