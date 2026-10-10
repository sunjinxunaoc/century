export const routes = [
  { path: '/', component: () => import('./pages/index.vue') },
  { path: '/products', component: () => import('./pages/products.vue') },
  { path: '/products/:sub', component: () => import('./pages/CategoryPage.vue') },
  { path: '/products/:sub/:slug', component: () => import('./pages/ProductPage.vue') },
  { path: '/about', component: () => import('./pages/about.vue') },
  { path: '/contact', component: () => import('./pages/contact.vue') },
  { path: '/:pathMatch(.*)*', component: () => import('./pages/NotFound.vue') },
]
