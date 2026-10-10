<template>
  <router-link :to="`/products/${subSlug}/${product.slug}`" class="mi-card group block p-6">
    <div class="mb-4 flex h-40 items-center justify-center overflow-hidden">
      <img
        :src="product.image"
        :alt="product.name"
        loading="lazy"
        class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <h3 class="mb-1 line-clamp-2 text-center text-[14px] font-medium text-ink transition-colors group-hover:text-brand">
      {{ product.name }}
    </h3>
    <p class="mb-3 line-clamp-1 text-center text-[12px] text-muted">{{ product.tagline }}</p>
    <div class="text-center text-[13px] font-medium text-brand">View Details</div>
  </router-link>
</template>

<script setup>
defineProps({
  product: { type: Object, required: true },
  subSlug: { type: String, required: true },
})
</script>
