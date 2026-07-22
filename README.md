# ⚽ FM Analyzer (FM26)

FM Analyzer is an independent, lightning-fast web application built for Football Manager 2026. It allows you to extract live scouting data directly from your active FM26 save file and instantly sort tens of thousands of players by In-Possession (IP) and Out-Of-Possession (OOP) tactical role suitability scores.

**☕ Support the Developer:** [ko-fi.com/jellyvin](https://ko-fi.com/jellyvin)

## 🚀 Features
- **Live Sync Engine:** No need to constantly save your game. Clicking "Sync Live Save" triggers the FMAnalyzer background plugin to immediately dump the latest memory data into the app.
- **Advanced Role Scoring:** Calculates positional scores for all 26 FM tactical roles (IP and OOP) instantly.
- **Schwartzian Transform Sorting:** Instantly sort 100,000+ players by CA, PA, Value, or Role Score without browser freezing.
- **1-Click Standalone Desktop App:** Runs completely locally as a fast `.exe` file—no terminal or Node.js installation required for gamers.

## 📥 How to Download and Play
You do not need to be a developer to run this app!

1. **[Click Here to Download FMAnalyzer-Setup.exe](https://github.com/JellyVin26/FM26-Analyzer/releases/download/v1.0.1/FMAnalyzer-Setup.exe)** (or go to the [Releases](https://github.com/JellyVin26/FM26-Analyzer/releases) tab for older versions).
2. Double-click the downloaded installer. It will automatically ask you to select your Football Manager 2026 directory so it can securely install the memory-reading plugin.
4. The installer will place a shortcut to `FMAnalyzer` directly on your Desktop!
5. Open the app from your Desktop and click **⚡ Sync Live Save** to pull your data!

## 💻 Developer Setup
If you want to modify the React frontend or the Express backend:

### Installation
```bash
npm install
```

### Run Web App Locally
```bash
npm run dev
```

### Build 1-Click `.exe` Distribution
To bundle the frontend and backend into a single executable using `pkg`:
```bash
npm run build:exe
```
This outputs `FMAnalyzer.exe` in the project root.
