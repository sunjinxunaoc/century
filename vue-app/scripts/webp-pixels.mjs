import sharp from 'sharp'

const f = process.argv[2]
const meta = await sharp(f).metadata()
console.log('dims:', meta.width, 'x', meta.height, 'alpha:', meta.hasAlpha, 'channels:', meta.channels, 'format:', meta.format)

const { data, info } = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const w = info.width, h = info.height
// sample center row & several columns, plus corners
function px(x, y) {
  const i = (y * w + x) * info.channels
  return [data[i], data[i + 1], data[i + 2], info.channels > 3 ? data[i + 3] : 255]
}
console.log('top-left  ', px(10, 10))
console.log('top-center', px(w >> 1, 10))
console.log('center    ', px(w >> 1, h >> 1))
console.log('left  1/3 ', px(w / 3 | 0, h >> 1))
console.log('right 2/3 ', px(w * 2 / 3 | 0, h >> 1))
console.log('left-midbox', px(20, h >> 1))
console.log('bottom-center', px(w >> 1, h - 10))