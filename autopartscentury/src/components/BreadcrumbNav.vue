<template>
  <nav class="py-4 text-[13px] text-muted" aria-label="Breadcrumb">
    <div class="container-mi flex flex-wrap items-center gap-1">
      <template v-for="(item, i) in items" :key="i">
        <router-link v-if="item.to" :to="item.to" class="hover:text-brand">{{ item.label }}</router-link>
        <span v-else class="text-ink">{{ item.label }}</span>
        <span v-if="i < items.length - 1" class="mx-1">/</span>
      </template>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
})
</script>
