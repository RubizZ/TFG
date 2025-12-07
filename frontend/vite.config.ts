import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        host: '0.0.0.0',
        open: false,
        watch: {
            usePolling: true,
            interval: 1000,
        },
        hmr: {
            host: 'localhost',
            port: 5173,
            protocol: 'ws',
        },
        middlewareMode: false,
    },
    build: {
        sourcemap: true,
    },
})