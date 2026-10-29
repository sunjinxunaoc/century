// Tracking helpers.
//
// Contact page conversions are handled by Google Ads itself: the account has a
// page-load rule (page_view on /contact/, label 70b9CNzIzqkdEK769-FE) that runs
// inside the Google tag configured in index.html. Do NOT send an extra
// `conversion` event for contact - that double counts.
//
// The Ads conversion helper below is only for sources that still need their own
// conversion action. An empty label means "do not report": Google Ads actions
// are tied to one trigger each, so never reuse another action's label.
//
// Where to find a label: 目标 -> 转化操作 -> open the action ->
// the send_to value shown in its setup instructions, e.g.
//   AW-18459000110/FHNYCMGQ3KgdEK769-FE

const LABELS = {
  // TODO: 新建"网页加载 /catalog/"转化操作后，把标签填到这里
  catalog_pageview: '',
  // TODO: 新建"WhatsApp 点击"转化操作后，把标签填到这里
  whatsapp_click: '',
}

const SESSION_KEY = 'century_ads_conversion_sent'

function canTrack() {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

function conversionKey(source) {
  return `${SESSION_KEY}:${source}`
}

function alreadySent(key) {
  try {
    return window.sessionStorage.getItem(key) === '1'
  } catch (e) {
    // sessionStorage can throw in private mode / sandboxed frames.
    return false
  }
}

function markSent(key) {
  try {
    window.sessionStorage.setItem(key, '1')
  } catch (e) {
    /* ignore */
  }
}

/**
 * Fire a Google Ads conversion for `source`, at most once per session.
 * Returns true when the conversion was actually sent.
 */
export function trackAdsConversion(source) {
  const label = LABELS[source]
  if (!label || !canTrack()) return false

  const key = conversionKey(source)
  if (alreadySent(key)) return false
  markSent(key)

  window.gtag('event', 'conversion', {
    send_to: label,
    event_label: source,
  })
  return true
}

/** Plain GA4 event, no dedupe. */
export function trackEvent(name, params = {}) {
  if (!canTrack()) return false
  window.gtag('event', name, params)
  return true
}
