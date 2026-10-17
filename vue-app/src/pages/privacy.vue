<script setup>
import PageHero from '../components/PageHero.vue'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Privacy Policy | Century Auto Parts',
  meta: [
    { name: 'description', content: 'Privacy Policy of Hebei Century Auto Parts Co., Ltd. Learn how we collect, use and protect your personal information.' },
    { name: 'robots', content: 'noindex, follow' },
    { property: 'og:title', content: 'Privacy Policy | Century Auto Parts' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://centurymanufacture.com/privacy/' },
  ],
  link: [
    { rel: 'canonical', href: 'https://centurymanufacture.com/privacy/' },
  ],
})

const sections = [
  {
    title: '1. Information We Collect',
    items: [
      'Contact details you submit through our inquiry forms, such as your name, email address, phone / WhatsApp number and message content.',
      'Business information related to your inquiry, such as the products and quantities you are interested in.',
      'Usage data collected automatically through analytics tools (Google Analytics / Google Ads), such as pages visited, device type and approximate location.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    items: [
      'To respond to your inquiries and provide quotations for our products.',
      'To communicate with you about orders, samples, shipping and after-sales support.',
      'To improve our website, products and marketing, including measuring the performance of our advertising campaigns.',
      'To comply with legal obligations and protect our legitimate business interests.',
    ],
  },
  {
    title: '3. Third-Party Services',
    items: [
      'We use Google Analytics and Google Ads to understand website traffic and ad performance. These services may use cookies and similar technologies. You can learn more or opt out via Google Ads Settings.',
      'Inquiry form submissions are processed through a third-party form service and delivered to our company email.',
      'If you contact us via WhatsApp, Skype or social platforms, your use of those services is governed by their own privacy policies.',
    ],
  },
  {
    title: '4. Data Retention & Security',
    items: [
      'We keep inquiry records only as long as necessary to handle your request and maintain our business relationship.',
      'We apply reasonable technical and organizational measures to protect your information against unauthorized access, loss or misuse.',
    ],
  },
  {
    title: '5. Your Rights',
    items: [
      'You may request access to, correction of, or deletion of your personal data at any time by contacting us at info@centurymanufacture.com.',
      'You can disable cookies in your browser settings. Some parts of the website may not function properly as a result.',
    ],
  },
]
</script>

<template>
  <div>
    <PageHero title="Privacy Policy" subtitle="How we collect, use and protect your information" />
    <section class="py-16">
      <div class="container-app max-w-3xl">
        <p class="text-sm text-gray-500 mb-8">Last updated: October 15, 2026</p>
        <p class="text-gray-600 leading-relaxed mb-10">
          Hebei Century Auto Parts Co., Ltd. ("we", "us", "our") operates
          <a href="https://centurymanufacture.com" class="text-[#FF6B00] hover:underline">centurymanufacture.com</a>.
          This Privacy Policy explains what information we collect when you visit our website or submit an inquiry,
          and how we use it.
        </p>
        <div v-for="s in sections" :key="s.title" class="mb-10">
          <h2 class="text-xl font-bold text-[#1A1A2E] mb-4">{{ s.title }}</h2>
          <ul class="space-y-3">
            <li v-for="(item, i) in s.items" :key="i" class="flex gap-3 text-gray-600 leading-relaxed">
              <span class="text-[#FF6B00] mt-1 shrink-0">&#9672;</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
        <div class="bg-gray-50 rounded-lg p-6">
          <h2 class="text-xl font-bold text-[#1A1A2E] mb-3">6. Contact Us</h2>
          <p class="text-gray-600 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at
            <a href="mailto:info@centurymanufacture.com" class="text-[#FF6B00] hover:underline">info@centurymanufacture.com</a>
            or call +86 15633632668.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
