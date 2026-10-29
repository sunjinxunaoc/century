<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import PageHero from '../components/PageHero.vue'
import { trackEvent } from '../composables/useConversion'
import { useI18n, absoluteUrl } from '../i18n'

const { t, tm } = useI18n()

useHead(() => ({
  title: t('seo.contact.title'),
  meta: [
    { name: 'description', content: t('seo.contact.description') },
    { property: 'og:title', content: t('seo.contact.title') },
    { property: 'og:description', content: t('seo.contact.description') },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: absoluteUrl('/contact/') },
    { property: 'og:image', content: 'https://centurymanufacture.com/images/factory.webp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: 'https://centurymanufacture.com/images/factory.webp' },
  ],
  link: [
    { rel: 'canonical', href: absoluteUrl('/contact/') },
  ],
}))

const form = reactive({ name: '', email: '', mobile: '', product: 'Wheel Balancing Weights', message: '' })
const sending = ref(false)
const submitted = ref(false)
const error = ref('')

const productOptions = computed(() => tm('contact.productOptions'))

const info = computed(() => [
  { label: t('contact.labels.address'), value: t('contact.address') },
  { label: t('contact.labels.phone'), value: '+86 15633632668', href: 'tel:+8615633632668' },
  { label: t('contact.labels.email'), value: 'info@centurymanufacture.com', href: 'mailto:info@centurymanufacture.com' },
  { label: t('contact.labels.hours'), value: t('contact.hours') },
])

// GA4 事件。Ads 的「联系我们」转化由谷歌的网页加载规则自动上报
// （page_view + /contact/，标签 70b9CNzIzqkdEK769-FE），不要再手动发 conversion，
// 否则会和自动规则重复计数。
onMounted(() => {
  trackEvent('contact_view')
})

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
      trackEvent('generate_lead', {
        form: 'contact_inquiry',
        product: form.product,
      })
      form.name = ''
      form.email = ''
      form.mobile = ''
      form.message = ''
    } else {
      error.value = t('common.errorGeneric')
    }
  } catch (err) {
    error.value = t('common.errorNetwork')
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div>
    <PageHero :title="t('contact.heroTitle')" :subtitle="t('contact.heroSubtitle')" />
    <section class="py-20">
      <div class="container-app">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 class="text-2xl font-bold text-[#1A1A2E] mb-6">{{ t('contact.infoTitle') }}</h2>
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
              <h3 class="font-semibold text-[#1A1A2E] mb-2">{{ t('contact.inquiryTitle') }}</h3>
              <p class="text-sm text-gray-500 leading-relaxed">{{ t('contact.inquiryText') }}</p>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg shadow-card p-8">
            <h2 class="text-2xl font-bold text-[#1A1A2E] mb-6">{{ t('contact.formTitle') }}</h2>
            <form @submit.prevent="onSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">{{ t('contact.form.name') }}</label>
                <input v-model="form.name" type="text" required :placeholder="t('contact.form.namePh')"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">{{ t('contact.form.email') }}</label>
                <input v-model="form.email" type="email" required :placeholder="t('contact.form.emailPh')"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">{{ t('contact.form.mobile') }}</label>
                <input v-model="form.mobile" type="tel" :placeholder="t('contact.form.mobilePh')"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">{{ t('contact.form.product') }}</label>
                <select v-model="form.product" class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
                  <option v-for="o in productOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">{{ t('contact.form.message') }}</label>
                <textarea v-model="form.message" rows="4" required :placeholder="t('contact.form.messagePh')"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"></textarea>
              </div>
              <button type="submit" :disabled="sending" id="submitBtn"
                class="w-full btn btn-primary" :class="{ 'opacity-60': sending }">
                {{ sending ? t('common.sending') : t('contact.form.submit') }}
              </button>
              <p v-if="error" class="text-red-600 text-sm text-center">{{ error }}</p>
              <p v-if="submitted" class="text-green-600 text-sm text-center">{{ t('common.successContact') }}</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
