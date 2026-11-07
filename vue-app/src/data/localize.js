// Localised accessors for catalogue + article data.
//
// English is the source of truth; other locales only override the fields they
// have translated. Anything missing falls back to English, so a partially
// translated locale never breaks a page.

import { categories as enCategories, PAGE_SIZE } from './products'
import {
  articles as enArticles,
  hubTags as enHubTags,
  NEWS_PER_PAGE,
  tagSlug,
} from './articles'
import esCategories from './es/categories'
import esProducts from './es/products'
import esArticles from './es/articles'

export { PAGE_SIZE, NEWS_PER_PAGE, tagSlug }

const CATEGORY_TRANSLATIONS = { es: esCategories }
const PRODUCT_TRANSLATIONS = { es: esProducts }
const ARTICLE_TRANSLATIONS = { es: esArticles }

const cache = new Map()

function cached(key, factory) {
  if (!cache.has(key)) cache.set(key, factory())
  return cache.get(key)
}

export function localizeProduct(product, locale = 'en') {
  if (!product || locale === 'en' || !PRODUCT_TRANSLATIONS[locale]) return product
  const t = (PRODUCT_TRANSLATIONS[locale].products || {})[product.slug]
  if (!t) return product
  return {
    ...product,
    name: t.name || product.name,
    tagline: t.tagline || product.tagline,
    desc: t.desc || product.desc,
    keywords: t.keywords || product.keywords,
    seoTitle: t.seoTitle || (product.seoTitle || product.name),
    // Specs, model numbers and SKU codes stay in English.
  }
}

export function getCategories(locale = 'en') {
  if (locale === 'en' || !CATEGORY_TRANSLATIONS[locale]) return enCategories
  return cached(`categories:${locale}`, () => {
    const catT = CATEGORY_TRANSLATIONS[locale].categories || {}
    const subT = CATEGORY_TRANSLATIONS[locale].subcategories || {}
    const subDetailT = CATEGORY_TRANSLATIONS[locale].subcategoryDetails || {}
    return enCategories.map((cat) => {
      const t = catT[cat.slug] || {}
      return {
        ...cat,
        name: t.name || cat.name,
        tagline: t.tagline || cat.tagline,
        // Keep SEO copy in English until a translated version exists.
        seoTitle: t.seoTitle || cat.seoTitle,
        intro: t.intro || cat.intro,
        highlights: t.highlights || cat.highlights,
        faqs: t.faqs || cat.faqs,
        keywords: t.keywords || cat.keywords,
        wholesaleInfo: t.wholesaleInfo || cat.wholesaleInfo,
        cards: t.cards || cat.cards,
        subcategories: (cat.subcategories || []).map((sub) => {
          const dt = subDetailT[sub.slug] || {}
          return {
            ...sub,
            name: subT[sub.slug] || sub.name,
            desc: dt.desc || sub.desc,
            keywords: dt.keywords || sub.keywords,
            seoTitle: dt.seoTitle || sub.seoTitle,
            highlights: dt.highlights || sub.highlights,
            faqs: dt.faqs || sub.faqs,
            products: (sub.products || []).map((product) => localizeProduct(product, locale)),
          }
        }),
      }
    })
  })
}

export function findCategory(slug, locale = 'en') {
  return getCategories(locale).find((cat) => cat.slug === slug)
}

export function findSubcategory(categorySlug, subSlug, locale = 'en') {
  const cat = findCategory(categorySlug, locale)
  return (cat && (cat.subcategories || []).find((sub) => sub.slug === subSlug)) || null
}

/** Flat list of products of one category (or one subcategory). */
export function getProducts(categorySlug, subSlug, locale = 'en') {
  const cat = findCategory(categorySlug, locale)
  if (!cat) return []
  const subs = subSlug
    ? (cat.subcategories || []).filter((s) => s.slug === subSlug)
    : cat.subcategories || []
  return subs.flatMap((sub) => sub.products || [])
}

/** Mirrors the English helper: returns { product, subcategory } or null. */
export function findProduct(categorySlug, productSlug, locale = 'en') {
  const cat = findCategory(categorySlug, locale)
  if (!cat) return null
  for (const sub of cat.subcategories || []) {
    const product = (sub.products || []).find((x) => x.slug === productSlug)
    if (product) return { product, subcategory: sub }
  }
  return null
}

export function relatedProducts(categorySlug, currentSlug, count = 3, locale = 'en') {
  const cat = findCategory(categorySlug, locale)
  if (!cat) return []
  const all = []
  for (const sub of cat.subcategories || []) {
    for (const p of sub.products || []) {
      if (p.slug !== currentSlug) all.push({ ...p, subSlug: sub.slug })
    }
  }
  return all.slice(0, count)
}

// Editorial picks: which guides to surface on each product category page so the
// catalogue links back into the blog (and readers can jump from copy to specs).
const CATEGORY_GUIDES = {
  'wheel-balancing-weights': {
    tag: 'Wheel Weights',
    slugs: ['wheel-weight-guide', 'fe-vs-pb-wheel-weights', 'adhesive-stick-on-wheel-weights-guide'],
  },
  'tyre-valves': {
    tag: 'Tyre Valves',
    slugs: ['tyre-valve-guide', 'tr413-vs-tr414-tyre-valve', 'tyre-valve-sizes-dimensions'],
  },
  tpms: {
    tag: 'TPMS',
    slugs: ['tpms-valve-buying-guide', 'tpms-maintenance'],
  },
  'tyre-seal-string': {
    tag: null,
    slugs: ['seal-string-repair', 'mushroom-plug-vs-seal-string'],
  },
  'tyre-patch': {
    tag: 'Tyre Patch',
    slugs: ['tyre-patch-vs-plug', 'us-vs-eu-style-tire-patch', 'cold-patch-vs-hot-patch'],
  },
  'mushroom-patch-plug': {
    tag: null,
    slugs: ['mushroom-plug-vs-seal-string', 'tyre-patch-vs-plug'],
  },
}

/** Articles to show as "guides" on a category page, in editorial order. */
export function guidesForCategory(categorySlug, count = 3, locale = 'en') {
  const entry = CATEGORY_GUIDES[categorySlug]
  if (!entry) return []
  const all = getArticles(locale)
  return entry.slugs
    .map((slug) => all.find((a) => a.slug === slug))
    .filter(Boolean)
    .slice(0, count)
}

/** Hub tag for the "view all" link, or null when the category has no tag hub. */
export function guideTagSlug(categorySlug) {
  const entry = CATEGORY_GUIDES[categorySlug]
  return entry && entry.tag ? tagSlug(entry.tag) : null
}

export function getArticles(locale = 'en') {
  if (locale === 'en' || !ARTICLE_TRANSLATIONS[locale]) return enArticles
  return cached(`articles:${locale}`, () => {
    const dict = ARTICLE_TRANSLATIONS[locale].articles || {}
    return enArticles.map((article) => {
      const t = dict[article.slug]
      return t ? { ...article, ...t } : article
    })
  })
}

export function findArticle(slug, locale = 'en') {
  return getArticles(locale).find((a) => a.slug === slug)
}

export function getHubTags(locale = 'en') {
  const dict = (ARTICLE_TRANSLATIONS[locale] && ARTICLE_TRANSLATIONS[locale].tags) || {}
  return enHubTags.map((tag) => ({ ...tag, name: dict[tag.slug] || tag.name }))
}

/** Display name of an article tag in the active locale (slug stays English). */
export function getTagName(name, locale = 'en') {
  const dict = (ARTICLE_TRANSLATIONS[locale] && ARTICLE_TRANSLATIONS[locale].tags) || {}
  return dict[tagSlug(name)] || name
}

/** Mirrors the English helper but uses localised tag names. */
export function tagBySlug(slug, locale = 'en') {
  const dict = (ARTICLE_TRANSLATIONS[locale] && ARTICLE_TRANSLATIONS[locale].tags) || {}
  const tag = enHubTags.find((t) => t.slug === slug)
  if (!tag) return null
  return { ...tag, name: dict[tag.slug] || tag.name }
}
