<script setup>
import PageHero from '../components/PageHero.vue'
import { useHead } from '@unhead/vue'
import { reactive, ref } from 'vue'

useHead({
  title: 'Contact Us | Century Auto Parts',
  meta: [
    { name: 'description', content: 'Contact Hebei Century Auto Parts Co., Ltd. for factory-direct pricing on wheel balancing weights, tyre valves, TPMS and tyre repair products.' },
    { property: 'og:title', content: 'Contact Us | Century Auto Parts' },
    { property: 'og:description', content: 'Contact Hebei Century Auto Parts Co., Ltd. for factory-direct pricing on wheel balancing weights, tyre valves, TPMS and tyre repair products.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://centurymanufacture.com/contact/' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: 'https://centurymanufacture.com/contact/' },
  ],
})

const form = reactive({ name: '', email: '', mobile: '', product: 'Wheel Balancing Weights', message: '' })
const sending = ref(false)
const submitted = ref(false)
const error = ref('')

const productOptions = [
  'Wheel Balancing Weights', 'Tyre Valves', 'TPMS', 'Tyre Seal String', 'Tyre Patch', 'Mushroom Patch Plug', 'Other',
]

async function onSubmit() {
  if (sending.value) return
  sending.value = true
  error.value = ''

  const payload = new FormData()
  payload.append('name', form.name)
  payload.append('email', form.email)
  payload.append('mobile', form.mobile)
  payload.append('product', form.product)
  payload.append('message', form.message)
  payload.append('_subject', `New Inquiry from ${form.name || 'website'} - ${form.product}`)
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
        window.gtag('event', 'generate_lead', {
          form: 'contact_inquiry',
          product: form.product,
        })
      }
      form.name = ''
      form.email = ''
      form.mobile = ''
      form.message = ''
    } else {
      error.value = 'Something went wrong. Please try again or email us directly at info@centurymanufacture.com.'
    }
  } catch (err) {
    error.value = 'Network error. Please try again or email us directly at info@centurymanufacture.com.'
  } finally {
    sending.value = false
  }
}

const info = [
  { label: 'Address', value: 'No.161, Qiantang Village, Qingyun Town, Yanshan County, Cangzhou City, Hebei Province, China' },
  { label: 'Phone', value: '+86 15633632668', href: 'tel:+8615633632668' },
  { label: 'Email', value: 'info@centurymanufacture.com', href: 'mailto:info@centurymanufacture.com' },
  { label: 'Hours', value: 'Mon-Sat: 8am - 6pm' },
]
</script>

<template>
  <div>
    <PageHero title="Contact Us" subtitle="Get a factory-direct quote from our sales team" />
    <section class="py-20">
      <div class="container-app">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 class="text-2xl font-bold text-[#1A1A2E] mb-6">Get in Touch</h2>
            <div class="space-y-4">
              <div v-for="i in info" :key="i.label" class="flex gap-3">
                <div class="w-10 h-10 shrink-0 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center">&#9672;</div>
                <div>
                  <div class="text-sm text-gray-500">{{ i.label }}</div>
                  <a v-if="i.href" :href="i.href" class="font-medium text-[#1A1A2E] hover:text-[#FF6B00]">{{ i.value }}</a>
                  <div v-else class="font-medium text-[#1A1A2E]">{{ i.value }}</div>
                </div>
              </div>
            </div>
            <div class="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 class="font-semibold text-[#1A1A2E] mb-2">Send an Inquiry</h3>
              <p class="text-sm text-gray-500 leading-relaxed">Tell us the products you need and your target quantity. Our team will reply within 24 hours with a factory-direct quotation.</p>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg shadow-card p-8">
            <h2 class="text-2xl font-bold text-[#1A1A2E] mb-6">Request a Quote</h2>
            <form @submit.prevent="onSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Your Name</label>
                <input v-model="form.name" type="text" required placeholder="Your name"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input v-model="form.email" type="email" required placeholder="you@company.com"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Mobile / WhatsApp</label>
                <input v-model="form.mobile" type="tel" placeholder="+86 138 0000 0000"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Product</label>
                <select v-model="form.product" class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
                  <option v-for="p in productOptions" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Message</label>
                <textarea v-model="form.message" rows="4" required placeholder="Tell us your requirements..."
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"></textarea>
              </div>
              <button type="submit" :disabled="sending" id="submitBtn"
                class="w-full btn btn-primary" :class="{ 'opacity-60': sending }">
                {{ sending ? 'Sending...' : 'Send Inquiry' }}
              </button>
              <p v-if="error" class="text-red-600 text-sm text-center">{{ error }}</p>
              <p v-if="submitted" class="text-green-600 text-sm text-center">Thank you! Your inquiry has been sent successfully. We will reply within 24 hours.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
