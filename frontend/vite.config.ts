import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const devHost = process.env.HR_DEV_SERVER_HOST || '0.0.0.0'
const devPort = Number(process.env.HR_DEV_SERVER_PORT || '5182')
const previewHost = process.env.HR_PREVIEW_HOST || devHost
const previewPort = Number(process.env.HR_PREVIEW_PORT || String(devPort))
const apiProxyTarget = process.env.HR_API_PROXY_TARGET || 'http://localhost:18082'
const allowedHostsSetting = process.env.HR_ALLOWED_HOSTS?.trim()
const allowedHosts = !allowedHostsSetting || allowedHostsSetting === '*'
  ? true
  : allowedHostsSetting
    .split(',')
    .map(host => host.trim())
    .filter(Boolean)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: ['e2e/**', 'node_modules/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: devHost,
    port: devPort,
    strictPort: true,
    allowedHosts,
    proxy: {
      '/app/hr/api': {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: previewHost,
    port: previewPort,
    strictPort: true,
    allowedHosts,
  },
})
