const fs = require('node:fs')
const path = require('node:path')

const src = path.join(__dirname, '..', 'dist', '404', 'index.html')
const dest = path.join(__dirname, '..', 'dist', '404.html')
if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest)
  console.log('404.html generated')
} else {
  console.error('dist/404/index.html not found - was /404 prerendered?')
  process.exit(1)
}
