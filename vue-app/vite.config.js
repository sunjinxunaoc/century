import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { categories, PAGE_SIZE } from './src/data/products'
import { articles } from './src/data/articles'

function buildStaticPaths() {
  const paths = []
  for (const cat of categories) {
    paths.push(`/products/${cat.slug}`)
    for (const sub of cat.subcategories || []) {
      paths.push(`/products/${cat.slug}/${sub.slug}`)
      const totalPages = Math.ceil((sub.products || []).length / PAGE_SIZE)
      for (let page = 2; page <= totalPages; page++) {
        paths.push(`/products/${cat.slug}/${sub.slug}/page/${page}`)
      }
      for (const p of sub.products || []) {
        paths.push(`/products/${cat.slug}/${p.slug}`)
      }
    }
  }
  for (const a of articles) {
    paths.push(`/news/${a.slug}`)
  }
  return paths
}

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  ssgOptions: {
    dirStyle: 'nested',
    includedRoutes: (paths) => {
      const statics = paths.filter(p => !p.includes(':'))
      const set = new Set(statics)
      for (const p of buildStaticPaths()) set.add(p)
      return [...set]
    },
  },
})
