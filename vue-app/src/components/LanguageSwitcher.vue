<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { SUPPORTED_LOCALES, LOCALE_SHORT, LOCALE_LABELS, switchLocalePath, useI18n } from '../i18n'

defineProps({
  variant: { type: String, default: 'desktop' },
})

const route = useRoute()
const { locale } = useI18n()

const items = computed(() =>
  SUPPORTED_LOCALES.map((code) => ({
    code,
    short: LOCALE_SHORT[code],
    label: LOCALE_LABELS[code],
    to: switchLocalePath(route.path, code),
    active: code === locale.value,
  }))
)
</script>

<template>
  <div class="flex items-center gap-1.5" :class="variant === 'mobile' ? 'py-2.5 px-3' : ''">
    <template v-for="(item, i) in items" :key="item.code">
      <span v-if="i > 0" class="text-gray-300 select-none" aria-hidden="true">/</span>
      <RouterLink
        :to="item.to"
        :aria-label="item.label"
        :aria-current="item.active ? 'true' : undefined"
        class="rounded px-1 py-0.5 transition-colors"
        :class="item.active
          ? 'text-[#FF6B00] font-semibold'
          : 'text-gray-500 hover:text-[#C2410C]'"
      >{{ item.short }}</RouterLink>
    </template>
  </div>
</template>
