import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 公開用に base を設定しています。
// リポジトリ名を変更した場合は base のパスも変更してください。
export default defineConfig({
  plugins: [react()],
  base: '/hearing-app/',
})
