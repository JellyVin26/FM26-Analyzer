import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { topIpRoles, topOopRoles } from "../engine/ratingEngine";
import { formatPlayerValue } from "../utils/valueUtils";

function scoreClass(n: number) {
  if (n >= 80) return "score-s";
  if (n >= 65) return "score-a";
  if (n >= 50) return "score-b";
  if (n >= 35) return "score-c";
  return "score-d";
}

export function ShortlistBuilder() {
  const appCtx = useApp();
  const { dump, addComparePlayer, hiddenMode } = appCtx;
  const shortlistIds: number[] = (appCtx as any).shortlistIds || [];
  const removeFromShortlist: (id: number) => void = (appCtx as any).removeFromShortlist || (() => {});
  const clearShortlist: () => void = (appCtx as any).clearShortlist || (() => {});

  const shortlistedPlayers = useMemo(() => {
    if (!dump) return [];
    return dump.players.filter(p => shortlistIds.includes(p.id));
  }, [dump, shortlistIds]);

  const exportCSV = () => {
    const header = ["Name", "Age", "Club", "Position", "CA", "PA", "Top IP Role", "Top OOP Role", "Value"];
    const lines = shortlistedPlayers.map((p) => {
      const topIP = topIpRoles(p, 1)[0];
      const topOOP = topOopRoles(p, 1)[0];
      
      return [
        `"${p.name || ""}"`,
        p.age,
        `"${p.club || "Free Agent"}"`,
        `"${p.pos || ""}"`,
        hiddenMode ? "" : p.ca,
        hiddenMode ? "" : p.pa,
        `"${topIP ? `${topIP.roleName} (${topIP.ipScore})` : ""}"`,
        `"${topOOP ? `${topOOP.roleName} (${topOOP.oopScore})` : ""}"`,
        p.value
      ].join(",");
    });
    const blob = new Blob([header.join(",") + "\n" + lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shortlist.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (shortlistedPlayers.length === 0) {
    return (
      <div className="empty-state" style={{ height: "100%", width: "100%" }}>
        <div className="empty-state-icon">⭐</div>
        <div className="empty-state-title">No players shortlisted yet.</div>
        <div className="empty-state-sub">Click ⭐ on any player to add them here.</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", overflow: "hidden", background: "var(--bg-base)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <h2 style={{ fontSize: "16px", margin: 0, display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold" }}>
          ⭐ My Shortlist
          <span className="topbar-badge">{shortlistedPlayers.length}</span>
        </h2>
        <div style={{ flex: 1 }} />
        <button className="btn" onClick={exportCSV}>⬇ Export CSV</button>
        <button className="btn danger" onClick={() => clearShortlist()}>✕ Clear All</button>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
          {shortlistedPlayers.map(p => {
            const top3Ip = topIpRoles(p, 3);
            const top2Oop = topOopRoles(p, 2);

            return (
              <div key={p.id} style={{ 
                background: "var(--bg-elevated)", 
                border: "1px solid var(--border)", 
                borderRadius: "var(--radius-lg)", 
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                boxShadow: "var(--shadow-card)",
                transition: "transform 0.2s, box-shadow 0.2s",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--shadow-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-card)";
              }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>{p.name}</div>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                      {p.age} y/o • {(p.nat || []).join(", ")}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className="pos-pill" style={{ marginBottom: "6px", display: "inline-block", fontSize: "11px", padding: "4px 8px" }}>{(p.pos || "—").split(",")[0]?.trim()}</span>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>{p.club || "Free Agent"}</div>
                  </div>
                </div>

                {!hiddenMode && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px", fontWeight: 600 }}>CA ({p.ca})</div>
                      <div className="ca-bar-wrap">
                        <div className="ca-bar" style={{ width: "100%", height: "6px", background: "var(--bg-base)" }}>
                          <div className="ca-bar-fill" style={{ width: `${(p.ca / 200) * 100}%`, background: p.ca >= 150 ? "var(--green)" : p.ca >= 130 ? "var(--amber)" : "var(--red)" }} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px", fontWeight: 600 }}>PA ({p.pa})</div>
                      <div className="ca-bar-wrap">
                        <div className="ca-bar" style={{ width: "100%", height: "6px", background: "var(--bg-base)" }}>
                          <div className="ca-bar-fill" style={{ width: `${(p.pa / 200) * 100}%`, background: p.pa >= 150 ? "var(--green)" : p.pa >= 130 ? "var(--amber)" : "var(--red)" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{ background: "var(--bg-base)", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", letterSpacing: "0.5px" }}>TOP IP ROLES</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {top3Ip.map((r, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                          <span style={{ color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "85px" }} title={r.roleName}>{r.roleName}</span>
                          <span className={`score-chip ${scoreClass(r.ipScore)}`}>{r.ipScore}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: "var(--bg-base)", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", letterSpacing: "0.5px" }}>TOP OOP ROLES</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {top2Oop.map((r, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                          <span style={{ color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "85px" }} title={r.roleName}>{r.roleName}</span>
                          <span className={`score-chip ${scoreClass(r.oopScore)}`}>{r.oopScore}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "16px", borderTop: "1px solid var(--border-subtle)" }}>
                  <div className="value-text" style={{ fontSize: "15px", color: "var(--text-primary)", fontWeight: 600 }}>{formatPlayerValue(p)}</div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="btn" onClick={() => addComparePlayer(p.id, true)} style={{ padding: "6px 12px" }} title="Compare">⚖️ Compare</button>
                    <button className="btn danger" onClick={() => removeFromShortlist(p.id)} style={{ padding: "6px 10px" }} title="Remove">🗑️</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
