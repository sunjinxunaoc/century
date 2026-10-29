import { computed, reactive } from 'vue'
import en from './en'
import es from './es'

// URL prefix per locale. English lives at the site root, Spanish under /es.
export const SUPPORTED_LOCALES = ['en', 'es']
export const DEFAULT_LOCALE = 'en'

export const LOCALE_LABELS = { en: 'English', es: 'Español' }
export const LOCALE_SHORT = { en: 'EN', es: 'ES' }
export const LOCALE_HTML_LANG = { en: 'en', es: 'es' }
export const LOCALE_OG = { en: 'en_US', es: 'es_ES' }
export const LOCALE_DIR = { en: 'ltr', es: 'ltr' }

export const SITE_URL = 'https://centurymanufacture.com'

const messages = { en, es }
const state = reactive({ locale: DEFAULT_LOCALE })

/** Locale implied by a route path ("/es/about/" -> "es"). */
export function localeFromPath(path) {
  const clean = String(path || '/').split('?')[0].split('#')[0]
  const first = clean.split('/')[1] || ''
  return SUPPORTED_LOCALES.includes(first) && first !== DEFAULT_LOCALE ? first : DEFAULT_LOCALE
}

/** "/es/about/" -> "/about/" (always returns a rooted path). */
export function stripLocale(path) {
  const clean = String(path || '/')
  const rooted = clean.startsWith('/') ? clean : `/${clean}`
  for (const l of SUPPORTED_LOCALES) {
    if (l === DEFAULT_LOCALE) continue
    if (rooted === `/${l}`) return '/'
    if (rooted === `/${l}/`) return '/'
    if (rooted.startsWith(`/${l}/`)) return rooted.slice(l.length + 1)
  }
  return rooted
}

/** Prefix a locale-independent path: localePath("/about/", "es") -> "/es/about/". */
export function localePath(path, locale = state.locale) {
  const base = stripLocale(path)
  if (!locale || locale === DEFAULT_LOCALE) return base
  return base === '/' ? `/${locale}/` : `/${locale}${base}`
}

/** Build the same page in another locale (for the language switcher). */
export function switchLocalePath(path, target) {
  return localePath(path, target)
}

export function absoluteUrl(path, locale = state.locale) {
  return SITE_URL + localePath(path, locale)
}

export function setLocale(locale) {
  state.locale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE
  return state.locale
}

export function currentLocale() {
  return state.locale
}

function lookup(dict, key) {
  return String(key)
    .split('.')
    .reduce((acc, part) => (acc && typeof acc === 'object' ? acc[part] : undefined), dict)
}

/**
 * Translate `key`. Falls back to English, then to the key itself, so a missing
 * string never breaks a page.
 */
export function t(key, params) {
  let value = lookup(messages[state.locale], key)
  if (value === undefined) value = lookup(messages[DEFAULT_LOCALE], key)
  if (value === undefined) return key
  if (typeof value === 'string' && params) {
    value = value.replace(/\{(\w+)\}/g, (match, name) =>
      params[name] === undefined ? match : String(params[name])
    )
  }
  return value
}

/** Raw value (array / object) for lists kept in the dictionary. */
export function tm(key) {
  const value = lookup(messages[state.locale], key)
  return value !== undefined ? value : lookup(messages[DEFAULT_LOCALE], key)
}

export function useI18n() {
  const locale = computed(() => state.locale)
  return {
    locale,
    t,
    tm,
    dir: computed(() => LOCALE_DIR[state.locale] || 'ltr'),
    htmlLang: computed(() => LOCALE_HTML_LANG[state.locale] || 'en'),
    ogLocale: computed(() => LOCALE_OG[state.locale] || 'en_US'),
    /** Locale-aware path builder bound to the active locale. */
    p: (path) => localePath(path, state.locale),
    /** Path of the current page in another locale. */
    alt: (path, target) => switchLocalePath(path, target),
  }
}

/** hreflang <link> entries for a locale-independent path. */
export function hreflangLinks(path) {
  const base = stripLocale(path)
  const links = SUPPORTED_LOCALES.map((l) => ({
    rel: 'alternate',
    hreflang: LOCALE_HTML_LANG[l],
    href: SITE_URL + localePath(base, l),
  }))
  links.push({ rel: 'alternate', hreflang: 'x-default', href: SITE_URL + localePath(base, DEFAULT_LOCALE) })
  return links
}
