import "./index.css";
import { useRef } from "react";
import { useApp } from "./context/AppContext";
import { Sidebar } from "./components/Sidebar";
import { PlayerTable } from "./components/PlayerTable";
import { PlayerDrawer } from "./components/PlayerDrawer";
import { FileDrop } from "./components/FileDrop";
import { useLoadDump } from "./hooks/useLoadDump";

function TopBar() {
  const { dump } = useApp();
  const { loadFile } = useLoadDump();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="topbar">
      <div className="topbar-logo">
        <span>⚽</span>
        <span>FM<span className="accent">Analyzer</span></span>
        <span className="topbar-badge">v1.0</span>
      </div>

      {dump && (
        <span className="topbar-meta">
          {dump.meta.gameVersion} · {dump.meta.myClub} · {dump.players.length.toLocaleString()} players
        </span>
      )}

      <div className="topbar-spacer" />

      <input
        ref={inputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); }}
      />

      {dump && (
        <button className="btn" onClick={() => inputRef.current?.click()}>
          📂 Load new dump
        </button>
      )}
    </header>
  );
}

export function App() {
  const { dump, loading } = useApp();

  return (
    <div className="app-shell">
      {loading && <div className="loading-bar" />}
      <TopBar />
      <div className="main-content">
        {dump ? (
          <>
            <Sidebar />
            <PlayerTable />
            <PlayerDrawer />
          </>
        ) : (
          <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileDrop />
          </div>
        )}
      </div>
    </div>
  );
}
