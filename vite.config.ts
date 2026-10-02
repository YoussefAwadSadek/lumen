import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative asset URLs, so the build works from any sub-path (GitHub Pages, a folder on a host, …).
  base: './',
  plugins: [react()],
  // Only crawl the app entry — the Claude Design export folder next to it has its own HTML.
  optimizeDeps: { entries: ['index.html'] },
});
