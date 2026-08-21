import { ref, onMounted, onUnmounted } from 'vue'

export function useCarousel(count) {
  const current = ref(0)
  let timer = null

  function goTo(index) {
    current.value = index
  }
  function next() {
    current.value = (current.value + 1) % count
  }

  onMounted(() => {
    timer = setInterval(next, 4000)
  })
  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { current, goTo }
}
