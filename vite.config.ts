import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    host:"127.0.0.1",
    port:3000,
  },
  plugins: [react()],
})
