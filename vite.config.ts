import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import os from 'os';

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  plugins: [
    react(),
    {
      name: 'auto-load-dump',
      configureServer(server) {
        server.middlewares.use('/api/dump', (_req, res) => {
          const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
          const dumpPath = path.join(localAppData, 'FMSuperScout', 'dump.json');

          if (fs.existsSync(dumpPath)) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            fs.createReadStream(dumpPath).pipe(res);
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: `dump.json not found at ${dumpPath}` }));
          }
        });

        server.middlewares.use('/api/sync', async (_req, res) => {
          const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
          const fmscoutDir = path.join(localAppData, 'FMSuperScout');
          const dumpPath = path.join(fmscoutDir, 'dump.json');
          const flagPath = path.join(fmscoutDir, 'request.flag');
          
          if (!fs.existsSync(fmscoutDir)) {
            fs.mkdirSync(fmscoutDir, { recursive: true });
          }

          let initialMtime = 0;
          if (fs.existsSync(dumpPath)) {
            initialMtime = fs.statSync(dumpPath).mtimeMs;
          }

          // Trigger the plugin by creating request.flag
          fs.writeFileSync(flagPath, '1');

          const maxWaitMs = 15000;
          const pollIntervalMs = 500;
          let waited = 0;
          let dumpUpdated = false;

          while (waited < maxWaitMs) {
            await new Promise(r => setTimeout(r, pollIntervalMs));
            waited += pollIntervalMs;

            if (fs.existsSync(dumpPath)) {
              const currentMtime = fs.statSync(dumpPath).mtimeMs;
              if (currentMtime > initialMtime) {
                // Wait an extra 500ms to ensure the plugin has finished writing the 67MB file
                await new Promise(r => setTimeout(r, 500));
                dumpUpdated = true;
                break;
              }
            }
          }

          if (dumpUpdated && fs.existsSync(dumpPath)) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            fs.createReadStream(dumpPath).pipe(res);
          } else {
            res.statusCode = 504;
            res.end(JSON.stringify({ error: 'Timeout waiting for game to dump data. Is FM26 running?' }));
          }
        });
      },
    },
  ],
});
