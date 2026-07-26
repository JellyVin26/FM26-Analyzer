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
  const analyzerDir = path.join(localAppData, 'FMAnalyzer');
  const dumpPath = path.join(analyzerDir, 'data.json');

  if (fs.existsSync(dumpPath)) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    fs.createReadStream(dumpPath).pipe(res);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(404).json({ error: `data.json not found at ${dumpPath}` });
  }
});

app.get('/api/sync', async (req, res) => {
  try {
    const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
    const analyzerDir = path.join(localAppData, 'FMAnalyzer');
    const dumpPath = path.join(analyzerDir, 'data.json');
    const scannerPath = path.join(path.dirname(process.execPath), 'FMAnalyzerScanner.exe');
    if (fs.existsSync(scannerPath)) {
      const { execFileSync } = require('child_process');
      execFileSync(scannerPath, ['--now'], { stdio: 'inherit' });
    } else {
      // Fallback for development if scanner is not bundled
      const devScannerPath = path.join(__dirname, 'plugin', 'bin', 'Release', 'win-x64', 'publish', 'FMAnalyzerScanner.exe');
      if (fs.existsSync(devScannerPath)) {
        const { execFileSync } = require('child_process');
        execFileSync(devScannerPath, ['--now'], { stdio: 'inherit' });
      } else {
        throw new Error('FMAnalyzerScanner.exe not found! Make sure it is bundled with the application.');
      }
    }

    if (fs.existsSync(dumpPath)) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      fs.createReadStream(dumpPath).pipe(res);
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(504).json({ error: 'Timeout waiting for game to dump data. Is FM26 running?' });
    }
  } catch (err) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: `Server error during sync: ${err.message}` });
  }
});

// Fallback to index.html for single-page app routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server and launch the browser
app.listen(PORT, '0.0.0.0', () => {
  console.log(`FMAnalyzer Desktop Backend running on port ${PORT}`);
  console.log(`Opening browser automatically...`);
  
  const url = `http://localhost:${PORT}`;
  const { exec } = require('child_process');
  
  try {
    const platform = os.platform();
    if (platform === 'win32') {
      exec(`start "" "${url}"`);
    } else if (platform === 'darwin') {
      exec(`open "${url}"`);
    } else {
      exec(`xdg-open "${url}"`);
    }
  } catch (err) {
    console.error(`Failed to automatically open browser. Please navigate to ${url}`);
  }
});
