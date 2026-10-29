import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './i18n'
import { buildStaticPaths, buildAllStaticPaths } from './paths'

export { buildStaticPaths, buildAllStaticPaths }

const baseRoutes = [
  { path: '/', name: 'home', component: () => import('./pages/index.vue') },
  { path: '/about', name: 'about', component: () => import('./pages/about.vue') },
  { path: '/contact', name: 'contact', component: () => import('./pages/contact.vue') },
  { path: '/privacy', name: 'privacy', component: () => import('./pages/privacy.vue') },
  { path: '/products', name: 'products', component: () => import('./pages/products.vue') },
  { path: '/catalog', name: 'catalog', component: () => import('./pages/catalog.vue') },
  { path: '/news', name: 'news', component: () => import('./pages/news.vue') },
  { path: '/news/page/:page', name: 'news-page', component: () => import('./pages/news.vue') },
  { path: '/news/tag/:slug', name: 'tag', component: () => import('./pages/TagPage.vue') },
  { path: '/news/:slug', name: 'article', component: () => import('./pages/ArticlePage.vue') },
  { path: '/products/:category/:slug?', name: 'product', component: () => import('./pages/ProductPage.vue') },
  { path: '/products/:category/:slug/page/:page', name: 'product-page', component: () => import('./pages/ProductPage.vue') },
]

/**
 * Same routes under every non-default locale prefix.
 * "/" becomes "/es/", "/products" becomes "/es/products", and so on.
 */
function routesForLocale(locale) {
  if (locale === DEFAULT_LOCALE) return baseRoutes
  return baseRoutes.map((route) => {
    const path = route.path === '/' ? `/${locale}/` : `/${locale}${route.path}`
    const next = { ...route, path, name: `${route.name}-${locale}` }
    if (route.path === '/') next.alias = `/${locale}`
    return next
  })
}

export const routes = SUPPORTED_LOCALES.flatMap(routesForLocale)
