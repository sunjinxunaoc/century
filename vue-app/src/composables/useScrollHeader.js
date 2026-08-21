import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollHeader() {
  const shadowed = ref(false)
  let handler

  onMounted(() => {
    handler = () => {
      shadowed.value = window.scrollY > 100
    }
    window.addEventListener('scroll', handler, { passive: true })
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', handler)
  })

  return { shadowed }
}
