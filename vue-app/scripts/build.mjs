import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// On Windows, esbuild's native service can fail to remove its temp dir under
// the system TEMP (Access is denied) in sandboxed / security-filtered
// environments. Pointing TMP into the project's own dir avoids the locked
// system-Temp path entirely, and is harmless on every platform.
const tmp = join(process.cwd(), '.esbtmp')
mkdirSync(tmp, { recursive: true })
process.env.TMP = tmp
process.env.TEMP = tmp
process.env.TMPDIR = tmp

// Spawn the vite-ssg CLI entry directly with the current Node binary. Spawning
// "npx.cmd" throws EINVAL on Windows with Node >= 20.12 (spawning .cmd/.bat
// without shell:true is blocked), so avoid the shell shim entirely.
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const viteSsgBin = join(root, 'node_modules', 'vite-ssg', 'bin', 'vite-ssg.js')

const child = spawn(process.execPath, [viteSsgBin, 'build'], {
  stdio: 'inherit',
  env: process.env,
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})
