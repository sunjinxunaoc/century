// Build a WeCom (企业微信) group-bot markdown payload from form data.
// Sent same-origin to /api/inquiry, which Nginx reverse-proxies to the
// WeCom webhook. The webhook key stays in the server Nginx config.

function truncateBytes(str, maxBytes) {
  if (typeof TextEncoder === 'undefined') return str.slice(0, Math.floor(maxBytes / 3))
  const enc = new TextEncoder()
  if (enc.encode(str).length <= maxBytes) return str
  let lo = 0
  let hi = str.length
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2)
    if (enc.encode(str.slice(0, mid)).length <= maxBytes) lo = mid
    else hi = mid - 1
  }
  return str.slice(0, lo) + '…'
}

export function buildInquiryMarkdown(data) {
  const isCatalog = data.type === 'catalog'
  const title = isCatalog ? '新报价请求' : '新询盘'
  const lines = [`## 🔔 ${title}（centurymanufacture.com）`]
  const add = (label, value) => {
    const v = value == null ? '' : String(value).trim()
    if (v) lines.push(`> **${label}：** ${v.replace(/\n/g, ' ')}`)
  }
  add('姓名', data.name)
  add('邮箱', data.email)
  add('电话/WhatsApp', data.mobile || data.whatsapp)
  add('公司', data.company)
  add('国家', data.country)
  add('产品', data.product)
  if (data.message && String(data.message).trim()) {
    lines.push('> **留言：**')
    lines.push(`> ${String(data.message).trim().replace(/\n/g, '\n> ')}`)
  }
  // WeCom markdown content limit is 4096 bytes; keep a small buffer.
  return truncateBytes(lines.join('\n'), 4000)
}

export function buildWecomPayload(data) {
  return { msgtype: 'markdown', markdown: { content: buildInquiryMarkdown(data) } }
}
