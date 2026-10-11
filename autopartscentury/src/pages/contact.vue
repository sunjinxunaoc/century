<template>
  <div class="bg-page pb-14">
    <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'Contact' }]" />

    <section class="container-mi">
      <div class="grid gap-6 lg:grid-cols-5">
        <div class="lg:col-span-2">
          <div class="mi-card p-8">
            <h1 class="mb-2 text-3xl font-bold">Contact Us</h1>
            <p class="mb-8 text-[14px] text-muted">Tell us your requirements — we reply within 24 hours on working days.</p>

            <div class="space-y-5">
              <div v-for="c in contacts" :key="c.label" class="flex items-start gap-4">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand" v-html="c.icon"></div>
                <div>
                  <div class="text-[13px] font-semibold">{{ c.label }}</div>
                  <a v-if="c.href" :href="c.href" class="text-[13px] text-muted transition-colors hover:text-brand" :target="c.external ? '_blank' : undefined" :rel="c.external ? 'noopener' : undefined">{{ c.value }}</a>
                  <div v-else class="whitespace-pre-line text-[13px] text-muted">{{ c.value }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-3">
          <form class="mi-card p-8" @submit.prevent="submit">
            <h2 class="mb-6 text-[20px] font-semibold">Send an Inquiry</h2>

            <div v-if="status === 'success'" class="mb-6 rounded-sm border border-green-200 bg-green-50 px-4 py-3 text-[14px] text-green-700">
              Thank you! Your inquiry has been sent. We will reply within 24 hours.
            </div>
            <div v-if="status === 'error'" class="mb-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-600">
              Something went wrong. Please email us directly at info@centurymanufacture.com.
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1 block text-[13px] font-medium">Name *</label>
                <input v-model="form.name" required class="field" placeholder="Your name" />
              </div>
              <div>
                <label class="mb-1 block text-[13px] font-medium">Email *</label>
                <input v-model="form.email" type="email" required class="field" placeholder="you@company.com" />
              </div>
              <div>
                <label class="mb-1 block text-[13px] font-medium">Company</label>
                <input v-model="form.company" class="field" placeholder="Company name" />
              </div>
              <div>
                <label class="mb-1 block text-[13px] font-medium">Country</label>
                <input v-model="form.country" class="field" placeholder="Destination country" />
              </div>
              <div class="sm:col-span-2">
                <label class="mb-1 block text-[13px] font-medium">Interested Product</label>
                <select v-model="form.product" class="field">
                  <option value="">Select a category (optional)</option>
                  <option v-for="sub in subcategories" :key="sub.slug" :value="sub.name">{{ sub.name }}</option>
                </select>
              </div>
              <div class="sm:col-span-2">
                <label class="mb-1 block text-[13px] font-medium">Message *</label>
                <textarea v-model="form.message" required rows="5" class="field resize-none" placeholder="Please include model numbers (e.g. TR414), quantities and any packaging requirements."></textarea>
              </div>
            </div>

            <button
              type="submit"
              :disabled="status === 'sending'"
              class="mt-6 rounded-sm bg-brand px-10 py-3 text-[14px] font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
            >
              {{ status === 'sending' ? 'Sending...' : 'Send Inquiry' }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHead } from '@unhead/vue'
import { subcategories } from '../data/products'
import BreadcrumbNav from '../components/BreadcrumbNav.vue'

const form = ref({ name: '', email: '', company: '', country: '', product: '', message: '' })
const status = ref('idle')

async function submit() {
  status.value = 'sending'
  try {
    const res = await fetch('https://formsubmit.co/ajax/info@centurymanufacture.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `New inquiry from ${form.value.name} - autopartscentury.com`,
        ...form.value,
      }),
    })
    if (!res.ok) throw new Error('failed')
    status.value = 'success'
    form.value = { name: '', email: '', company: '', country: '', product: '', message: '' }
  } catch {
    status.value = 'error'
  }
}

const contacts = [
  { label: 'Phone / WhatsApp', value: '+86 156 3363 2668', href: 'tel:+8615633632668', icon: '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>' },
  { label: 'Email', value: 'info@centurymanufacture.com', href: 'mailto:info@centurymanufacture.com', icon: '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>' },
  { label: 'Address', value: 'No.161, Qiantang Village, Qingyun Town,\nYanshan County, Cangzhou City, Hebei Province, China', icon: '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
  { label: 'Working Hours', value: 'Mon-Sat: 8am - 6pm (GMT+8)', icon: '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
]

useHead({
  title: 'Contact Us | Request Tyre Valve Quote - AutoParts Century',
  meta: [
    { name: 'description', content: 'Contact AutoParts Century for factory-direct tyre valve quotes. Phone, WhatsApp and email support. Reply within 24 hours.' },
    { property: 'og:title', content: 'Contact AutoParts Century' },
    { property: 'og:description', content: 'Request a factory-direct tyre valve quote. Reply within 24 hours.' },
  ],
  link: [{ rel: 'canonical', href: 'https://autopartscentury.com/contact/' }],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact AutoParts Century',
        url: 'https://autopartscentury.com/contact/',
        mainEntity: {
          '@type': 'Organization',
          name: 'AutoParts Century',
          url: 'https://autopartscentury.com/',
          contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: 'info@centurymanufacture.com', telephone: '+86-156-3363-2668', availableLanguage: ['English', 'Chinese'], hoursAvailable: 'Mo-Sa 08:00-18:00 GMT+8' },
        },
      }),
    },
  ],
})
</script>

<style scoped>
.field {
  @apply w-full rounded-sm border border-black/10 bg-white px-4 py-2.5 text-[14px] outline-none transition-colors placeholder:text-black/30 focus:border-brand;
}
</style>
