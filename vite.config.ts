import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [dts()],
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'WebMCP Formik Adapter',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`
        },
        rollupOptions: {
            external: ['formik', 'react', 'react-dom', 'webmcp-adapter'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'webmcp-adapter': 'webmcpAdapter'
                }
            }
        }
    }
})
