import { categories, PAGE_SIZE } from './data/products'
import { articles as articleData } from './data/articles'

export const routes = [
  { path: '/', name: 'home', component: () => import('./pages/index.vue') },
  { path: '/about', name: 'about', component: () => import('./pages/about.vue') },
  { path: '/contact', name: 'contact', component: () => import('./pages/contact.vue') },
  { path: '/products', name: 'products', component: () => import('./pages/products.vue') },
  { path: '/project', name: 'project', component: () => import('./pages/project.vue') },
  { path: '/news', name: 'news', component: () => import('./pages/news.vue') },
  { path: '/news/:slug', name: 'article', component: () => import('./pages/ArticlePage.vue') },
  { path: '/products/:category/:slug?', name: 'product', component: () => import('./pages/ProductPage.vue') },
  { path: '/products/:category/:slug/page/:page', name: 'product-page', component: () => import('./pages/ProductPage.vue') },
]

export function buildStaticPaths() {
  const paths = ['/', '/about', '/contact', '/products', '/project', '/news']
  for (const cat of categories) {
    paths.push(`/products/${cat.slug}`)
    for (const sub of cat.subcategories || []) {
      paths.push(`/products/${cat.slug}/${sub.slug}`)
      const count = (sub.products || []).length
      const totalPages = Math.ceil(count / PAGE_SIZE)
      for (let page = 2; page <= totalPages; page++) {
        paths.push(`/products/${cat.slug}/${sub.slug}/page/${page}`)
      }
      for (const p of sub.products || []) {
        paths.push(`/products/${cat.slug}/${p.slug}`)
      }
    }
  }
  for (const a of articleData) {
    paths.push(`/news/${a.slug}`)
  }
  return paths
}
