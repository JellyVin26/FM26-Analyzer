const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = 5173;

// Serve static files from the React dist build
app.use(express.static(path.join(__dirname, 'dist')));

// Endpoint for initial load
app.get('/api/dump', (req, res) => {
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
    res.status(404).json({ error: `dump.json not found at ${dumpPath}` });
  }
});

// Endpoint for triggering live sync
app.get('/api/sync', async (req, res) => {
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
    res.status(504).json({ error: 'Timeout waiting for game to dump data. Is FM26 running?' });
  }
});

// Fallback to index.html for single-page app routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server and launch the browser
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`FMAnalyzer Desktop Backend running on port ${PORT}`);
  console.log(`Opening browser automatically...`);
  
  try {
    const { default: open } = await import('open');
    await open(`http://localhost:${PORT}`);
  } catch (err) {
    console.error("Failed to automatically open browser. Please navigate to http://localhost:5173");
  }
});
