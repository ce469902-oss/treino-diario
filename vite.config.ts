import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ mode }) => {
  const githubBase = process.env.GITHUB_ACTIONS ? '/treino-diario/' : '/'
  const base = mode === 'standalone' ? './' : githubBase
  return ({
  plugins: [
    react(),
    ...(mode === 'standalone' ? [viteSingleFile()] : []),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'EVOLVE — Sua evolução começa hoje',
        short_name: 'EVOLVE',
        description: 'Treino, corrida, alimentação e recuperação em uma rotina inteligente.',
        theme_color: '#b8f53a',
        background_color: '#0b0d0c',
        display: 'standalone',
        orientation: 'portrait-primary',
        lang: 'pt-BR',
        start_url: githubBase,
        scope: githubBase,
        icons: [
          { src: `${githubBase}icons/evolve-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: `${githubBase}icons/evolve-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: `${githubBase}icons/evolve-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        navigateFallback: `${githubBase}index.html`
      }
    })
  ],
  base,
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true
  }
  })
})
