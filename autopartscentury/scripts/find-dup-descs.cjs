function shingles(text, n = 3) {
  const words = text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean)
  const set = new Set()
  for (let i = 0; i + n <= words.length; i++) set.add(words.slice(i, i + n).join(' '))
  return set
}
function jaccard(a, b) {
  let inter = 0
  for (const x of a) if (b.has(x)) inter++
  return inter / (a.size + b.size - inter)
}

async function main() {
  const m = await import('../src/data/products.js')
  const all = []
  for (const s of m.subcategories) {
    for (const p of s.products) {
      const text = `${p.name} ${p.tagline || ''} ${p.desc || ''} ${(p.features || []).join(' ')}`
      all.push({ sub: s.slug, slug: p.slug, name: p.name, model: p.name.split(' ')[0], sh: shingles(text), len: text.length })
    }
  }
  // union-find for groups of similarity >= 0.8
  const parent = all.map((_, i) => i)
  const find = i => parent[i] === i ? i : (parent[i] = find(parent[i]))
  const pairs = []
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      if (all[i].sub !== all[j].sub) continue
      const sim = jaccard(all[i].sh, all[j].sh)
      if (sim >= 0.8) {
        pairs.push([all[i].model, all[j].model, sim.toFixed(2)])
        parent[find(i)] = find(j)
      }
    }
  }
  const groups = new Map()
  all.forEach((p, i) => {
    const r = find(i)
    if (!groups.has(r)) groups.set(r, [])
    groups.get(r).push(p)
  })
  const dupGroups = [...groups.values()].filter(g => g.length > 1)
  const affected = dupGroups.reduce((n, g) => n + g.length, 0)
  console.log(`pairs>=0.8: ${pairs.length}, groups: ${dupGroups.length}, affected: ${affected}\n`)
  for (const g of dupGroups) {
    console.log(`== ${g.length}x [${g[0].sub}]: ${g.map(p => p.model).join(', ')}`)
  }
}
main()
