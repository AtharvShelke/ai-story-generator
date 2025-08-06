import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const isDebugFalse = env.VITE_DEBUG === "false"

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: isDebugFalse
            ? undefined // no proxy when debug is false
            : env.VITE_DEBUG === "true"
              ? "http://localhost:8000"
              : "https://ai-story-generator-9sp6.onrender.com",
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
