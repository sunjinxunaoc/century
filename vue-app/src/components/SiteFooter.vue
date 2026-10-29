<script setup>
import { computed } from 'vue'
import { getCategories } from '../data/localize'
import { useI18n } from '../i18n'

const { t, locale, p } = useI18n()

const quickLinks = computed(() => [
  { label: t('nav.home'), path: p('/') },
  { label: t('nav.about'), path: p('/about/') },
  { label: t('nav.products'), path: p('/products/') },
  { label: t('nav.catalog'), path: p('/catalog/') },
  { label: t('nav.news'), path: p('/news/') },
  { label: t('nav.contact'), path: p('/contact/') },
  { label: t('nav.privacy'), path: p('/privacy/') },
])

const productLinks = computed(() =>
  getCategories(locale.value).map((cat) => ({
    label: cat.name,
    path: p(`/products/${cat.slug}/`),
  }))
)

const socials = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100075854564828' },
  { label: 'Instagram', href: 'https://www.instagram.com/gracezzling0723/' },
  { label: 'Skype', href: 'https://join.skype.com/invite/uSfQyI4aIVi2' },
  { label: 'WhatsApp', href: 'https://api.whatsapp.com/send?phone=8615633632668' },
]
</script>

<template>
  <footer class="bg-[#1A1A2E] text-gray-300 mt-auto">
    <div class="container-app py-14">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div class="flex items-center gap-2.5 mb-4">
            <img src="/images/logo/logo-icon-transparent.png" alt="Century Auto Parts" width="48" height="48" class="h-10 w-auto object-contain">
            <span class="text-lg font-bold tracking-wider text-white">CENTURY<span class="text-[#E8590C]">AUTO</span></span>
          </div>
          <p class="text-sm text-gray-400 leading-relaxed">{{ t('footer.tagline') }}</p>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">{{ t('footer.quickLinks') }}</h4>
          <ul class="flex flex-col gap-2.5 text-sm">
            <li v-for="l in quickLinks" :key="l.path"><RouterLink :to="l.path" class="hover:text-[#FF6B00]">{{ l.label }}</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">{{ t('footer.products') }}</h4>
          <ul class="flex flex-col gap-2.5 text-sm">
            <li v-for="l in productLinks" :key="l.path"><RouterLink :to="l.path" class="hover:text-[#FF6B00]">{{ l.label }}</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">{{ t('footer.contact') }}</h4>
          <ul class="flex flex-col gap-3 text-sm text-gray-400">
            <li><strong class="text-gray-300">{{ t('footer.addressLabel') }}</strong><br>{{ t('footer.address') }}</li>
            <li><strong class="text-gray-300">{{ t('footer.phoneLabel') }}</strong> {{ t('footer.phone') }}</li>
            <li><strong class="text-gray-300">{{ t('footer.emailLabel') }}</strong> {{ t('footer.email') }}</li>
            <li><strong class="text-gray-300">{{ t('footer.hoursLabel') }}</strong> {{ t('footer.hours') }}</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex gap-5 text-sm">
          <a v-for="s in socials" :key="s.label" :href="s.href" target="_blank" rel="noopener" class="hover:text-[#FF6B00]">{{ s.label }}</a>
        </div>
        <p class="text-sm text-gray-500">{{ t('footer.rights') }}</p>
      </div>
    </div>
  </footer>
</template>
