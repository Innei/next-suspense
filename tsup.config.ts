import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  sourcemap: true,
  clean: true,
  format: ['esm', 'cjs'],

  external: ['react', 'react-dom', 'next'],
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? `.js` : `.${format}.js`,
    }
  },
})
