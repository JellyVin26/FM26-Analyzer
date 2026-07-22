import { useState } from "react";
import { useApp } from "../context/AppContext";
import type { Player } from "../data/types";
import { topIpRoles, topOopRoles } from "../engine/ratingEngine";

function fmt(v: number) {
  if (v >= 1_000_000) return `£${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `£${(v / 1_000).toFixed(0)}K`;
  return `£${v}`;
}

const ATTR_GROUPS = [
  {
    name: "Physical",
    attrs: ["Acceleration", "Agility", "Balance", "JumpingReach", "NaturalFitness", "Pace", "Stamina", "Strength"] as const,
  },
  {
    name: "Mental",
    attrs: ["Aggression", "Anticipation", "Bravery", "Composure", "Concentration", "Decisions", "Determination", "Flair", "Leadership", "OffTheBall", "Positioning", "Teamwork", "Vision", "WorkRate"] as const,
  },
  {
    name: "Technical",
    attrs: ["Corners", "Crossing", "Dribbling", "Finishing", "FirstTouch", "FreeKicks", "Heading", "LongShots", "LongThrows", "Marking", "Passing", "PenaltyTaking", "Tackling", "Technique"] as const,
  },
];

export function PlayerComparison() {
  const { dump, hiddenMode, comparedIds, addComparePlayer, removeComparePlayer } = useApp();
  const [search, setSearch] = useState("");

  const allPlayers = dump?.players || [];

  const searchResults = search.trim()
    ? allPlayers
        .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.club.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 8)
    : [];

  const comparedPlayers = comparedIds
    .map((id) => allPlayers.find((p) => p.id === id))
    .filter((p): p is Player => Boolean(p));

  const addPlayer = (p: Player) => {
    addComparePlayer(p.id, false);
    setSearch("");
  };

  return (
    <div className="comparison-pane" style={{ padding: 24, width: "100%", height: "100%", overflowY: "auto", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, margin: 0, color: "var(--text-primary)" }}>Player Comparison</h2>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
            Compare up to 3 players side-by-side across attributes, IP roles, and OOP roles.
          </div>
        </div>

        {/* Add Player Search Input */}
        {comparedIds.length < 3 && (
          <div style={{ position: "relative", width: 280 }}>
            <input
              className="search-input"
              placeholder="Search player to add…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%" }}
            />
            {searchResults.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 8,
                  marginTop: 4,
                  zIndex: 50,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                }}
              >
                {searchResults.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => addPlayer(p)}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid var(--border-color)",
                      fontSize: 13,
                    }}
                  >
                    <span><strong>{p.name}</strong> ({p.pos})</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{p.club}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {comparedPlayers.length === 0 ? (
        <div className="empty-state" style={{ height: 400 }}>
          <div className="empty-state-icon">⚖️</div>
          <div className="empty-state-title">No players selected for comparison</div>
          <div className="empty-state-sub">Use the search box above to add up to 3 players to compare.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: `200px repeat(${comparedPlayers.length}, 1fr)`, gap: 16 }}>
          {/* Header row */}
          <div style={{ paddingTop: 16 }}>
            <span style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: 12 }}>METRIC</span>
          </div>

          {comparedPlayers.map((p) => (
            <div key={p.id} className="card" style={{ padding: 16, background: "var(--bg-elevated)", borderRadius: 12, border: "1px solid var(--border-color)", position: "relative" }}>
              <button
                onClick={() => removeComparePlayer(p.id)}
                style={{ position: "absolute", top: 12, right: 12, background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 16 }}
              >
                ✕
              </button>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{p.pos} · {p.club || "Free Agent"}</div>
              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                {!hiddenMode && (
                  <div>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>CA / PA</span>
                    <div style={{ fontWeight: 700, color: "var(--accent)" }}>{p.ca} / {p.pa}</div>
                  </div>
                )}
                <div>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Value</span>
                  <div style={{ fontWeight: 700 }}>{fmt(p.value)}</div>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Age</span>
                  <div style={{ fontWeight: 700 }}>{p.age}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Top IP Roles comparison */}
          <div style={{ gridColumn: "1 / -1", marginTop: 20 }}>
            <h3 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--accent)", margin: "0 0 12px 0" }}>
              Top FM26 In-Possession (IP) Roles
            </h3>
          </div>

          {comparedPlayers.map((p) => {
            const topIPs = topIpRoles(p, 3);
            return (
              <div key={`ip-${p.id}`} className="card" style={{ padding: 12, background: "var(--bg-card)", borderRadius: 8 }}>
                {topIPs.map((r) => (
                  <div key={r.roleId} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", borderBottom: "1px dashed var(--border-color)" }}>
                    <span>{r.roleName}</span>
                    <span style={{ fontWeight: 700, color: r.ipScore >= 75 ? "var(--green)" : "var(--accent)" }}>{r.ipScore}%</span>
                  </div>
                ))}
              </div>
            );
          })}

          {/* Top OOP Roles comparison */}
          <div style={{ gridColumn: "1 / -1", marginTop: 16 }}>
            <h3 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--accent)", margin: "0 0 12px 0" }}>
              Top FM26 Out-of-Possession (OOP) Roles
            </h3>
          </div>

          {comparedPlayers.map((p) => {
            const topOOPs = topOopRoles(p, 3);
            return (
              <div key={`oop-${p.id}`} className="card" style={{ padding: 12, background: "var(--bg-card)", borderRadius: 8 }}>
                {topOOPs.map((r) => (
                  <div key={r.roleId} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", borderBottom: "1px dashed var(--border-color)" }}>
                    <span>{r.roleName}</span>
                    <span style={{ fontWeight: 700, color: r.oopScore >= 75 ? "var(--green)" : "var(--accent)" }}>{r.oopScore}%</span>
                  </div>
                ))}
              </div>
            );
          })}

          {/* Attribute Breakdown */}
          {ATTR_GROUPS.map((group) => (
            <div key={group.name} style={{ gridColumn: "1 / -1", marginTop: 24 }}>
              <h3 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", margin: "0 0 12px 0" }}>
                {group.name} Attributes
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: `200px repeat(${comparedPlayers.length}, 1fr)`, gap: 16 }}>
                {group.attrs.map((attr) => {
                  const vals = comparedPlayers.map((p) => p.attrs[attr as keyof typeof p.attrs] ?? 0);
                  const maxVal = Math.max(...vals);

                  return (
                    <div key={attr} style={{ display: "contents" }}>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", padding: "6px 0" }}>{attr}</div>
                      {comparedPlayers.map((p) => {
                        const val = p.attrs[attr as keyof typeof p.attrs] ?? 0;
                        const isHighest = val === maxVal && comparedPlayers.length > 1 && val > 0;
                        return (
                          <div
                            key={p.id}
                            style={{
                              fontSize: 13,
                              fontWeight: isHighest ? 700 : 500,
                              color: isHighest ? "var(--green)" : val >= 14 ? "var(--text-primary)" : "var(--text-muted)",
                              background: isHighest ? "rgba(16, 185, 129, 0.08)" : "transparent",
                              padding: "6px 8px",
                              borderRadius: 4,
                            }}
                          >
                            {val}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
