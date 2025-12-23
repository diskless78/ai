import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  // server: {
  //   host: true, // or '0.0.0.0'
  //   port: 5173,
  //   proxy: {
  //     '/api/v1': {
  //       target: 'http://192.168.1.9:8000',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api\/v1/, '/api/v1'), // optional, keeps the same path
  //     },
  //   },
  // },

  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
});
