const targets = {
  'truck-bus-valves': ['V3.18.2', 'V3.18.1', 'V3-20-6', 'V3-20-4', 'TR571C', 'TR572C', 'TR573C', '60MS', '40MS'],
  'agricultural-tractors-off-road-valves': ['TR623A', 'TR621A', 'TRJ650-03', 'TRJ657-03'],
  'valve-accessories': ['VC-8SJ', 'VC-8', 'VT', 'FZT', 'DT', 'AT', 'ANT', 'APT', 'ET', '9001', '7001', '9002', '7002', '6001', '8001', '6002', '8002'],
}

async function main() {
  const m = await import('../src/data/products.js')
  for (const [subSlug, models] of Object.entries(targets)) {
    const s = m.subcategories.find(x => x.slug === subSlug)
    for (const p of s.products) {
      const model = p.name.split(' ')[0]
      if (!models.includes(model)) continue
      console.log(`\n### ${p.name} (${p.slug})`)
      console.log('DESC:', p.desc)
      console.log('FEATURES:', JSON.stringify(p.features || []))
      if (p.spec) {
        console.log('SPEC HEADERS:', JSON.stringify(p.spec.headers))
        const row = p.spec.rows.find(r => String(r[0]).replace(/\s*\(.*?\)/g, '') === model)
        console.log('SPEC ROW:', JSON.stringify(row || p.spec.rows[0]))
      }
    }
  }
}
main()
