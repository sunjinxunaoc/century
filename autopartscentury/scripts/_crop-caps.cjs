const sharp = require('sharp')
const src = 'szd-images/caps-grid.png'
const cols = [[4, 166], [194, 356], [384, 548], [574, 738], [766, 930], [958, 1122]]
const rows = { r1: [6, 218], r2: [326, 538] }
const names = {
  r1: ['VT', 'AT', 'ANT', 'APT', 'ET', 'FT'],
  r2: ['FZT', 'CTT', 'CT', 'DT', 'GT', 'TST'],
}
;(async () => {
  for (const [rk, [top, bottom]] of Object.entries(rows)) {
    for (let c = 0; c < 6; c++) {
      const [left, right] = cols[c]
      await sharp(src)
        .extract({ left, top, width: right - left, height: bottom - top })
        .png()
        .toFile(`szd-images/cap-${names[rk][c]}.png`)
      console.log('OK', names[rk][c])
    }
  }
})()
