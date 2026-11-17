// Reorder articles.js so the two new articles appear at the front (newest-first).
// Correct version: moves the two article objects from the end to the head, without duplicating.
import { readFileSync, writeFileSync } from 'node:fs'

const path = 'vue-app/src/data/articles.js'
let txt = readFileSync(path, 'utf8')
const hasBom = txt.charCodeAt(0) === 0xfeff
if (hasBom) txt = txt.slice(1)
const eol = txt.includes('\r\n') ? '\r\n' : '\n'
const lines = txt.split(/\r?\n/)

const headerIdx = lines.findIndex((l) => l.startsWith('export const articles'))
if (headerIdx < 0) { console.error('header not found'); process.exit(1) }
const header = lines.slice(0, headerIdx + 1) // includes 'export const articles = ['

const startIdx = lines.findIndex((l) => l.trim().startsWith("slug: 'tyre-patches-wholesale'"))
if (startIdx < 0) { console.error('start marker not found'); process.exit(1) }
const openBraceIdx = startIdx - 1
const closeIdx = lines.findIndex((l) => l.trim() === ']')
if (closeIdx < 0) { console.error('array close not found'); process.exit(1) }

const movedBlock = lines.slice(openBraceIdx, closeIdx) // the two article objects (ends with '  },')

// Everything between the header and the moved block (the original first article ... mushroom-plug article)
let middle = lines.slice(headerIdx + 1, openBraceIdx)
// Trim trailing blank line(s) that separated the old last-article from the moved block
while (middle.length && middle[middle.length - 1].trim() === '') middle.pop()

const tail = lines.slice(closeIdx) // starts with the ']'

const newLines = [
  ...header,
  '',
  ...movedBlock,
  '',
  ...middle,
  ...tail,
]

let out = newLines.join(eol)
if (hasBom) out = '\ufeff' + out
writeFileSync(path, out)
console.log('reordered OK. total lines', lines.length, '->', newLines.length)
