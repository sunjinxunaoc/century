import { readFileSync } from 'node:fs'

// decode a lossy VP8 WebP frame to RGBA (simplified: parse header, then use
// the raw frame data only for dimension + sample the file size).
// For content analysis we need real decoding; instead do a heuristic:
// check VP8 frame header dims and print them accurately.

const buf = readFileSync(process.argv[2])
const fourcc = buf.toString('latin1', 12, 16)
console.log('chunk:', JSON.stringify(fourcc))
if (fourcc === 'VP8 ') {
  const w = (buf[22] | (buf[23] << 8)) & 0x3fff
  const h = (buf[24] | (buf[25] << 8)) & 0x3fff
  console.log('dimensions:', w, 'x', h)
}