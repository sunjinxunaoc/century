<script setup>
import { useI18n } from '../i18n'

defineProps({
  items: { type: Array, required: true },
})

const { t } = useI18n()
</script>

<template>
  <nav class="breadcrumb" :aria-label="t('common.breadcrumb')">
    <template v-for="(item, i) in items" :key="i">
      <RouterLink v-if="item.path" :to="item.path">{{ item.label }}</RouterLink>
      <span v-else>{{ item.label }}</span>
      <span v-if="i < items.length - 1">&#8250;</span>
    </template>
  </nav>
</template>
