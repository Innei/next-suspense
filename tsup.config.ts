import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  sourcemap: true,
  clean: true,
  format: ['cjs', 'esm'],
  external: ['react', 'react-dom', 'next'],
})
