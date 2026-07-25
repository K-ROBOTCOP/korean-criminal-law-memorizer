import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/korean-criminal-law-memorizer/',
  plugins: [react()],
})
