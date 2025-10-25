import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // 👈 Cho phép truy cập qua LAN
    port: 5173,       // 👈 Giữ nguyên hoặc đổi nếu muốn
  },
})
