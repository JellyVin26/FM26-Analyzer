import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import os from 'os';

export default defineConfig({
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
            fs.createReadStream(dumpPath).pipe(res);
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: `dump.json not found at ${dumpPath}` }));
          }
        });
      },
    },
  ],
});
