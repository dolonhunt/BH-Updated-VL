import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

// Pin the timezone so date-formatting tests are deterministic across machines.
// Date-only ISO strings (e.g. '2024-01-01') parse as UTC midnight, while
// formatDate reads local calendar fields; without this, tests fail in
// timezones behind UTC (e.g. the Americas).
process.env.TZ = 'UTC'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    postcss: { plugins: [] },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/lib/**/*.ts', 'src/shared/**/*.ts'],
    },
  },
})
