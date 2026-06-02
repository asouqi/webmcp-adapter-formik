import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'webmcp-adapter', replacement: resolve(__dirname, '../../webmcp-adapter/src/index.ts') },
      { find: 'webmcp-forms', replacement: resolve(__dirname, '../../webmcp-forms/src/index.ts') },
      { find: 'webmcp-adapter-formik', replacement: resolve(__dirname, '../src/index.ts') },
    ],
  },
})
