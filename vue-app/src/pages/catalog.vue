<script setup>
import PageHero from '../components/PageHero.vue'
import CtaSection from '../components/CtaSection.vue'
import { useHead } from '@unhead/vue'
import { reactive, ref } from 'vue'

useHead({
  title: 'Product Catalog | Century Auto Parts',
  meta: [
    { name: 'description', content: 'Download the complete Century Auto Parts product catalog 2026 - wheel balancing weights, tyre valves, TPMS, tyre seal strings, tyre patches and mushroom patch plugs. Full specs, sizes and packing details.' },
    { name: 'keywords', content: 'tire repair catalog, tyre products catalog, wheel weight catalog, TPMS valve catalog, tyre patch catalog PDF' },
    { property: 'og:title', content: 'Product Catalog | Century Auto Parts' },
    { property: 'og:description', content: 'Download the complete Century Auto Parts product catalog 2026 - wheel balancing weights, tyre valves, TPMS, tyre seal strings, tyre patches and mushroom patch plugs.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://centurymanufacture.com/catalog/' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: 'https://centurymanufacture.com/catalog/' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Product Catalog 2026',
        url: 'https://centurymanufacture.com/catalog/',
        about: 'Tyre repair products catalog',
        publisher: { '@type': 'Organization', name: 'Hebei Century Auto Parts Co., Ltd.' },
      }),
    },
  ],
})

const form = reactive({ name: '', company: '', country: '', whatsapp: '', email: '' })
const sending = ref(false)
const submitted = ref(false)
const error = ref('')

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
      error.value = 'Something went wrong. Please try again or email us directly at info@centurymanufacture.com.'
    }
  } catch (err) {
    error.value = 'Network error. Please try again or email us directly at info@centurymanufacture.com.'
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

const categories = [
  { name: 'Wheel Balancing Weights', path: '/products/wheel-balancing-weights/', desc: 'Fe & Pb clip-on and adhesive weights for steel and alloy rims.' },
  { name: 'Tyre Valves', path: '/products/tyre-valves/', desc: 'Passenger car, truck & bus, agricultural & off-road valve stems.' },
  { name: 'TPMS', path: '/products/tpms/', desc: 'TPMS valve stems covering 47 vehicle applications.' },
  { name: 'Tyre Seal String', path: '/products/tyre-seal-string/', desc: 'Rubber repair strings for quick emergency puncture repairs.' },
  { name: 'Tyre Patch', path: '/products/tyre-patch/', desc: 'US-style and EU-style radial & bias ply repair patches.' },
  { name: 'Mushroom Patch Plug', path: '/products/mushroom-patch-plug/', desc: 'Combination plug & patch for permanent tyre repairs.' },
]
</script>

<template>
  <div>
    <PageHero title="Product Catalog 2026" subtitle="Complete tyre repair product range - specs, sizes and packing details" />

    <section class="py-16">
      <div class="container-app">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 class="text-3xl font-bold text-[#1A1A2E] mb-4">Download the Full Product Catalog</h2>
            <p class="text-gray-600 leading-relaxed mb-6">
              Get the complete Century Auto Parts product catalog 2026 in PDF. Includes full specifications,
              dimensions, packing details and model references for our entire tyre repair product range.
            </p>
            <ul class="list-disc ml-5 space-y-2 text-gray-600 mb-8">
              <li>Complete specs, sizes and packing details</li>
              <li>All product categories in one document</li>
              <li>High-quality reference for quotes and orders</li>
            </ul>
            <a
              :href="catalogUrl"
              download
              class="btn btn-primary btn-large inline-flex items-center gap-2"
              @click="trackCatalogDownload"
            >
              Download Catalog (PDF)
            </a>
            <p class="text-sm text-gray-500 mt-3">Free instant download. No email required.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg shadow-card p-8">
            <h2 class="text-2xl font-bold text-[#1A1A2E] mb-4">Get a Quote / Updates</h2>
            <p class="text-gray-500 text-sm mb-6">
              Leave your details and our team will reach out with pricing, samples and the latest product updates.
            </p>
            <form @submit.prevent="onSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Your Name</label>
                <input v-model="form.name" type="text" required placeholder="Your name"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Company</label>
                <input v-model="form.company" type="text" required placeholder="Your company name"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Country</label>
                <input v-model="form.country" type="text" required placeholder="Your country"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">WhatsApp</label>
                <input v-model="form.whatsapp" type="tel" required placeholder="+86 138 0000 0000"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input v-model="form.email" type="email" required placeholder="you@company.com"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
              </div>
              <button type="submit" :disabled="sending" id="submitBtn"
                class="w-full btn btn-primary" :class="{ 'opacity-60': sending }">
                {{ sending ? 'Sending...' : 'Request a Quote' }}
              </button>
              <p v-if="error" class="text-red-600 text-sm text-center">{{ error }}</p>
              <p v-if="submitted" class="text-green-600 text-sm text-center">Thank you! We have received your details and will get back to you within 24 hours.</p>
            </form>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-gray-50">
      <div class="container-app">
        <div class="section-header">
          <h2 class="section-title">What's Inside the Catalog</h2>
          <p class="section-subtitle">Six product categories covering complete tyre repair solutions</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink v-for="cat in categories" :key="cat.name" :to="cat.path" class="card reveal p-5 block hover:shadow-card-lg transition-shadow">
            <h3 class="font-semibold text-[#1A1A2E] mb-2">{{ cat.name }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ cat.desc }}</p>
            <span class="text-[#FF6B00] text-sm font-medium mt-3 inline-block">View Products &rarr;</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <CtaSection heading="Need a Custom Solution?" text="Contact us for OEM/ODM services and custom product development." />
  </div>
</template>
