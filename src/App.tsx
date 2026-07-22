import "./index.css";
import { useRef } from "react";
import { useApp } from "./context/AppContext";
import { Sidebar } from "./components/Sidebar";
import { PlayerTable } from "./components/PlayerTable";
import { PlayerDrawer } from "./components/PlayerDrawer";
import { FileDrop } from "./components/FileDrop";
import { PlayerComparison } from "./components/PlayerComparison";
import { SquadGapAnalysis } from "./components/SquadGapAnalysis";
import { BuySellLoanAdvisor } from "./components/BuySellLoanAdvisor";
import { useLoadDump } from "./hooks/useLoadDump";

function TopBar() {
  const { dump, activeTab, setActiveTab, comparedIds, unloadDump, setLoading } = useApp();
  const { loadFile, syncLiveSave } = useLoadDump();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSync = () => {
    syncLiveSave();
  };

  return (
    <header className="topbar">
      <div className="topbar-logo">
        <span>⚽</span>
        <span>FM<span className="accent">Analyzer</span></span>
        <span className="topbar-badge">v1.0</span>
      </div>

      {dump && (
        <nav style={{ display: "flex", gap: 8, marginLeft: 20 }}>
          <button
            className={`btn ${activeTab === "scout" ? "primary" : ""}`}
            onClick={() => setActiveTab("scout")}
          >
            📋 Scout Table
          </button>
          <button
            className={`btn ${activeTab === "compare" ? "primary" : ""}`}
            onClick={() => setActiveTab("compare")}
          >
            ⚖️ Comparison {comparedIds.length > 0 ? `(${comparedIds.length})` : ""}
          </button>
          <button
            className={`btn ${activeTab === "gaps" ? "primary" : ""}`}
            onClick={() => setActiveTab("gaps")}
          >
            🛡️ Squad Gaps
          </button>
          <button
            className={`btn ${activeTab === "advisor" ? "primary" : ""}`}
            onClick={() => setActiveTab("advisor")}
          >
            💡 Recruitment Advisor
          </button>
        </nav>
      )}

      <div className="topbar-spacer" />

      {dump && (
        <span className="topbar-meta" style={{ marginRight: 12 }}>
          <strong>{dump.meta.myClub || "Active Save"}</strong> {dump.meta.gameVersion ? `(FM v${dump.meta.gameVersion})` : ""} · {dump.players.length.toLocaleString()} players loaded
        </span>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); }}
      />

      {dump && (
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn primary" onClick={handleSync} title="Sync updated save state directly from FM26">
            ⚡ Sync Live Save
          </button>
          <button className="btn" onClick={() => inputRef.current?.click()} title="Load another dump file">
            📂 Load file
          </button>
          <button className="btn danger" onClick={() => unloadDump()} title="Clear current save data from view">
            ✕ Clear
          </button>
        </div>
      )}
    </header>
  );
}

export function App() {
  const { dump, loading, activeTab } = useApp();

  return (
    <div className="app-shell">
      {loading && <div className="loading-bar" />}
      <TopBar />
      <div className="main-content">
        {dump ? (
          activeTab === "scout" ? (
            <div className="scout-layout">
              <Sidebar />
              <PlayerTable />
              <PlayerDrawer />
            </div>
          ) : activeTab === "compare" ? (
            <PlayerComparison />
          ) : activeTab === "gaps" ? (
            <SquadGapAnalysis />
          ) : (
            <BuySellLoanAdvisor />
          )
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileDrop />
          </div>
        )}
      </div>
    </div>
  );
}
