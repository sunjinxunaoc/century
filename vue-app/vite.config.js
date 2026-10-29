import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { buildAllStaticPaths } from './src/paths'

function buildStaticPaths() {
  return buildAllStaticPaths()
}

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      // Agent/team state files, browser profiles and editor temp dirs are
      // written with transient locks on Windows; watching them crashes Vite
      // with EBUSY. Polling avoids fs.watch locks entirely.
      usePolling: true,
      interval: 300,
      ignored: [
        '**/.git/**',
        '**/node_modules/**',
        '**/team/**',
        '**/*.tmpdir/**',
        '**/*.tmp',
        '**/.*/**',
        '**/chrome-prof/**',
      ],
    },
  },
  ssgOptions: {
    dirStyle: 'nested',
    // The i18n store is module-level, so pages must render one at a time;
    // parallel renders would leak the active locale between routes.
    concurrency: 1,
    includedRoutes: (paths) => {
      const statics = paths.filter(p => !p.includes(':'))
      const set = new Set(statics)
      for (const p of buildStaticPaths()) set.add(p)
      return [...set]
    },
  },
})
