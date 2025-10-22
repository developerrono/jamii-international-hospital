// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // ⬅️ You may need to add this import!

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // ⬅️ Add this block 
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ... rest of your config
});