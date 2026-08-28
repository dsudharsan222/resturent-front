import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendTarget = env.VITE_BACKEND_URL || 'http://localhost:3502'

  const proxyConfig = {
    '/api': {
      target: backendTarget,
      changeOrigin: true,
      secure: false,
    }
  }

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: proxyConfig
    },
    preview: {
      port: 5173,
      proxy: proxyConfig,
      allowedHosts: ["furlable-unhogged-toccara.ngrok-free.dev"]
    }
  }
})
