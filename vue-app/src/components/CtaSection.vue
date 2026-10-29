<script setup>
import { useI18n } from '../i18n'

defineProps({
  heading: { type: String, required: true },
  text: { type: String, default: '' },
})

const { t, p } = useI18n()
</script>

<template>
  <section class="bg-gradient-to-br from-[#FF6B00] to-orange-600 text-white">
    <div class="container-app py-16 text-center">
      <h2 class="text-3xl font-bold mb-3">{{ heading }}</h2>
      <p class="text-orange-100 mb-6">{{ text || t('common.ctaDefault') }}</p>
      <div class="flex justify-center gap-4 flex-wrap">
        <RouterLink :to="p('/contact/')" class="btn bg-white text-[#FF6B00] hover:bg-orange-100 btn-large">{{ t('common.requestQuote') }}</RouterLink>
        <a href="tel:+8615633632668" class="btn border border-white text-white hover:bg-white hover:text-[#1A1A2E] btn-large">{{ t('common.call') }} +86 15633632668</a>
      </div>
    </div>
  </section>
</template>
