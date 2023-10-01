import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    svelte({ preprocess: sveltePreprocess() }),
    dts({ insertTypesEntry: true })
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: './src/index.ts',
      name: 'AnnotoriousFormats',
      formats: ['es', 'umd'],
      fileName: (format) => 
        format === 'umd' ? `annotorious-formats.js` : `annotorious-formats.es.js`
    },
    rollupOptions: {
      output: {
        assetFileNames: 'annotorious-formats.[ext]'
      }
    }
  }
});