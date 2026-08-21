import { ref, onMounted, onUnmounted, nextTick } from 'vue'

export function useRevealAnimation() {
  const elements = ref([])

  onMounted(async () => {
    await nextTick()
    const els = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('revealed')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    )
    els.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(20px)'
      observer.observe(el)
    })
    elements.value = [...els]
    onUnmounted(() => observer.disconnect())
  })

  return { elements }
}
