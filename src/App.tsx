import "./index.css";
import { useRef } from "react";
import { useApp } from "./context/AppContext";
import { Sidebar } from "./components/Sidebar";
import { PlayerTable } from "./components/PlayerTable";
import { PlayerDrawer } from "./components/PlayerDrawer";
import { FileDrop } from "./components/FileDrop";
import { PlayerComparison } from "./components/PlayerComparison";
import { SquadGapAnalysis } from "./components/SquadGapAnalysis";
import { SquadOverview } from "./components/SquadOverview";
import { BuySellLoanAdvisor } from "./components/BuySellLoanAdvisor";
import { ShortlistBuilder } from "./components/ShortlistBuilder";
import { useLoadDump } from "./hooks/useLoadDump";

function TopBar() {
  const { dump, activeTab, setActiveTab, comparedIds, shortlistIds, unloadDump } = useApp();
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
        <nav className="topbar-nav">
          <button
            className={`nav-btn ${activeTab === "scout" ? "active" : ""}`}
            onClick={() => setActiveTab("scout")}
          >
            📋 Scout
          </button>
          <button
            className={`nav-btn ${activeTab === "squad" ? "active" : ""}`}
            onClick={() => setActiveTab("squad")}
          >
            🏟️ Squad
          </button>
          <button
            className={`nav-btn ${activeTab === "shortlist" ? "active" : ""}`}
            onClick={() => setActiveTab("shortlist")}
          >
            ⭐ Shortlist {shortlistIds.length > 0 && <span style={{ background: "var(--accent)", color: "#fff", borderRadius: 99, padding: "0 5px", fontSize: 10, fontWeight: 700 }}>{shortlistIds.length}</span>}
          </button>
          <button
            className={`nav-btn ${activeTab === "compare" ? "active" : ""}`}
            onClick={() => setActiveTab("compare")}
          >
            ⚖️ Compare {comparedIds.length > 0 && <span style={{ background: "var(--accent)", color: "#fff", borderRadius: 99, padding: "0 5px", fontSize: 10, fontWeight: 700 }}>{comparedIds.length}</span>}
          </button>
          <button
            className={`nav-btn ${activeTab === "gaps" ? "active" : ""}`}
            onClick={() => setActiveTab("gaps")}
          >
            🛡️ Gaps
          </button>
          <button
            className={`nav-btn ${activeTab === "advisor" ? "active" : ""}`}
            onClick={() => setActiveTab("advisor")}
          >
            💡 Advisor
          </button>
        </nav>
      )}

      <div className="topbar-spacer" />

      {dump && (
        <span className="topbar-meta">
          <strong>{dump.meta.myClub || "Active Save"}</strong> · {dump.players.length.toLocaleString()} players
        </span>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); }}
      />

      <div className="topbar-divider" />

      <div className="topbar-actions">
        <a
          href="https://ko-fi.com/jellyvin"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          style={{ backgroundColor: "#13C3FF", color: "#fff", border: "none", fontWeight: 600, padding: "0 12px", fontSize: 12 }}
          title="Support the development of FM Analyzer on Ko-fi"
        >
          ☕ Support
        </a>

        {dump && (
          <>
            <button className="btn primary" onClick={handleSync} title="Sync updated save state directly from FM26" style={{ fontSize: 12, padding: "5px 12px" }}>
              ⚡ Sync
            </button>
            <button className="btn" onClick={() => inputRef.current?.click()} title="Load another dump file" style={{ fontSize: 12, padding: "5px 10px" }}>
              📂
            </button>
            <button className="btn danger" onClick={() => unloadDump()} title="Clear current save data" style={{ fontSize: 12, padding: "5px 10px" }}>
              ✕
            </button>
          </>
        )}
      </div>
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
          ) : activeTab === "squad" ? (
            <SquadOverview />
          ) : activeTab === "shortlist" ? (
            <ShortlistBuilder />
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
