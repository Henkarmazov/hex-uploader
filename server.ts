import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadHandler from './api/upload.js';
import configHandler from './api/config.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Server ini HANYA digunakan untuk development lokal (npm run dev).
 * Untuk deployment production di Vercel, Vercel secara otomatis
 * mengeksekusi Serverless Functions di direktori /api/upload.ts dan /api/config.ts
 * tanpa membutuhkan proses server persistent (Express) sama sekali.
 */
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware JSON untuk request berukuran hingga 35MB
  app.use(express.json({ limit: '35mb' }));
  app.use(express.urlencoded({ limit: '35mb', extended: true }));

  // Delegasikan route API ke Vercel Serverless Function handler
  app.all('/api/config', async (req, res) => {
    try {
      await configHandler(req as any, res as any);
    } catch (err: any) {
      console.error('Config API Error:', err);
      res.status(500).json({ success: false, error: err?.message || 'Server error' });
    }
  });

  app.all('/api/upload', async (req, res) => {
    try {
      await uploadHandler(req as any, res as any);
    } catch (err: any) {
      console.error('Upload API Error:', err);
      res.status(500).json({ success: false, error: err?.message || 'Server error' });
    }
  });

  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DEV SERVER] Running at http://0.0.0.0:${PORT}`);
    console.log(`[INFO] Production deployment on Vercel uses /api/* Serverless Functions.`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start dev server:', err);
  process.exit(1);
});
