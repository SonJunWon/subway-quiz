import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/subway-quiz/', // 역슬래시(\)가 아닌 슬래시(/)를 사용하고 소문자로 시작하세요!
})