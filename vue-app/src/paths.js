// Static-path builders live outside router.js so that vite.config.js can import
// them without pulling in the .vue page components.
import { categories, PAGE_SIZE } from './data/products'
import { articles, hubTags, NEWS_PER_PAGE } from './data/articles'
import { SUPPORTED_LOCALES, localePath } from './i18n'

/** Locale-independent paths of every page that exists in the site. */
export function buildStaticPaths() {
  const paths = ['/', '/about', '/contact', '/privacy', '/products', '/catalog', '/news']
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
  for (const a of articles) {
    paths.push(`/news/${a.slug}`)
  }
  for (let p = 2; p <= Math.ceil(articles.length / NEWS_PER_PAGE); p++) {
    paths.push(`/news/page/${p}`)
  }
  for (const t of hubTags) {
    paths.push(`/news/tag/${t.slug}`)
  }
  return paths
}

/** Every static path in every locale (en at root, others prefixed). */
export function buildAllStaticPaths() {
  const base = buildStaticPaths()
  return SUPPORTED_LOCALES.flatMap((locale) => base.map((path) => localePath(path, locale)))
}
