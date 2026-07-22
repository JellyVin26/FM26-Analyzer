import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { topIpRoles, topOopRoles } from "../engine/ratingEngine";

const POS_GROUPS = [
  { id: "GK", name: "Goalkeepers", match: ["GK"] },
  { id: "DC", name: "Central Defenders", match: ["DC"] },
  { id: "FB", name: "Full-Backs & Wing-Backs", match: ["DR", "DL", "WBR", "WBL"] },
  { id: "MID", name: "Central & Defensive Midfielders", match: ["DM", "MC"] },
  { id: "WING", name: "Wingers & Attacking Midfielders", match: ["AML", "AMR", "AMC", "ML", "MR"] },
  { id: "ST", name: "Strikers & Forwards", match: ["ST"] },
];

function gradeGroup(avgCA: number): { grade: string; color: string } {
  if (avgCA >= 155) return { grade: "A+", color: "var(--green)" };
  if (avgCA >= 145) return { grade: "A", color: "var(--green)" };
  if (avgCA >= 135) return { grade: "B+", color: "var(--accent)" };
  if (avgCA >= 125) return { grade: "B", color: "var(--accent)" };
  if (avgCA >= 115) return { grade: "C", color: "var(--amber)" };
  return { grade: "D", color: "var(--red)" };
}

export function SquadGapAnalysis() {
  const { dump, hiddenMode } = useApp();
  const [selectedClub, setSelectedClub] = useState<string>("");

  const clubs = useMemo(
    () => (dump ? [...new Set(dump.players.map((p) => p.club).filter(Boolean))].sort() : []),
    [dump]
  );

  const activeClub = selectedClub || dump?.meta.myClub || clubs[0] || "";

  const squadPlayers = useMemo(
    () => (dump ? dump.players.filter((p) => p.club === activeClub) : []),
    [dump, activeClub]
  );

  return (
    <div className="squad-gaps-pane" style={{ padding: 24, width: "100%", height: "100%", overflowY: "auto", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, margin: 0, color: "var(--text-primary)" }}>Squad Gap Analysis</h2>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
            Evaluating positional starter quality, depth, and FM26 tactical risk (IP vs OOP rating imbalances).
          </div>
        </div>

        {/* Club Selector */}
        <select
          className="filter-select"
          value={activeClub}
          onChange={(e) => setSelectedClub(e.target.value)}
          style={{ minWidth: 220 }}
        >
          {clubs.map((c) => (
            <option key={c} value={c}>
              {c} {c === dump?.meta.myClub ? "(Your Club)" : ""}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
        {POS_GROUPS.map((group) => {
          const groupPlayers = squadPlayers.filter((p) =>
            group.match.some((m) => (p.posArr && p.posArr.some((pa) => pa === m || pa.startsWith(m))) || p.pos?.includes(m))
          ).sort((a, b) => b.ca - a.ca);

          const starter = groupPlayers[0];
          const backup = groupPlayers[1];

          const avgCA = groupPlayers.length
            ? Math.round(groupPlayers.reduce((acc, p) => acc + p.ca, 0) / groupPlayers.length)
            : 0;

          const { grade, color } = gradeGroup(starter ? starter.ca : avgCA);

          // Find players with tactical imbalance (high IP score but low OOP score)
          const risks = groupPlayers.filter((p) => {
            const topIP = topIpRoles(p, 1)[0]?.ipScore ?? 0;
            const topOOP = topOopRoles(p, 1)[0]?.oopScore ?? 0;
            return topIP >= 70 && topOOP <= 55;
          });

          return (
            <div
              key={group.id}
              className="card"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-color)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{group.name}</span>
                <span style={{ fontSize: 18, fontWeight: 900, color, background: "rgba(255,255,255,0.05)", padding: "2px 10px", borderRadius: 6 }}>
                  {grade}
                </span>
              </div>

              {groupPlayers.length === 0 ? (
                <div style={{ fontSize: 12, color: "var(--red)", background: "var(--red-dim)", padding: 8, borderRadius: 6 }}>
                  ⚠️ No players in squad for this position!
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {/* Starter */}
                  <div style={{ fontSize: 12, background: "var(--bg-card)", padding: 8, borderRadius: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 600 }}>⭐ Starter: {starter.name} ({starter.age})</span>
                      {!hiddenMode && <span style={{ color: "var(--green)", fontWeight: 700 }}>CA {starter.ca}</span>}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                      Top IP: {topIpRoles(starter, 1)[0]?.roleName} ({topIpRoles(starter, 1)[0]?.ipScore}%) · Top OOP: {topOopRoles(starter, 1)[0]?.roleName} ({topOopRoles(starter, 1)[0]?.oopScore}%)
                    </div>
                  </div>

                  {/* Backup */}
                  {backup && (
                    <div style={{ fontSize: 12, background: "var(--bg-card)", padding: 8, borderRadius: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 500 }}>🛡️ Depth: {backup.name} ({backup.age})</span>
                        {!hiddenMode && <span style={{ color: "var(--text-secondary)" }}>CA {backup.ca}</span>}
                      </div>
                    </div>
                  )}

                  {/* Tactical Risk Warnings */}
                  {risks.map((r) => (
                    <div key={r.id} style={{ fontSize: 11, color: "var(--amber)", background: "rgba(245, 158, 11, 0.1)", padding: "6px 8px", borderRadius: 6, border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                      ⚠️ <strong>{r.name}</strong> has a strong IP score but low defensive OOP rating (tactical risk).
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
