import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { subcategories } from './src/data/products'

function buildStaticPaths() {
  const paths = ['/products', '/about', '/contact']
  for (const sub of subcategories) {
    paths.push(`/products/${sub.slug}`)
    for (const p of sub.products) {
      paths.push(`/products/${sub.slug}/${p.slug}`)
    }
  }
  return paths
}

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5174,
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
