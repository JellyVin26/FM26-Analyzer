import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import type { Player } from "../data/types";
import { scorePlayer, scoreSingleRole } from "../engine/ratingEngine";
import { ROLE_BY_ID } from "../data/roleDefinitions";

const PAGE_SIZE = 50;

function fmt(v: number) {
  if (v >= 1_000_000) return `£${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `£${(v / 1_000).toFixed(0)}K`;
  return `£${v}`;
}

function scoreClass(n: number) {
  if (n >= 80) return "score-s";
  if (n >= 65) return "score-a";
  if (n >= 50) return "score-b";
  if (n >= 35) return "score-c";
  return "score-d";
}

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <span style={{ opacity: 0.3 }}> ↕</span>;
  return <span> {dir === "desc" ? "↓" : "↑"}</span>;
}

interface Row {
  player: Player;
  topIpScore: number;
  topIpRoleName: string;
  topOopScore: number;
  topOopRoleName: string;
}

export function PlayerTable() {
  const { filteredPlayers, setSelectedId, selectedId, sortKey, sortDir, setSort, hiddenMode, filters } = useApp();
  const [page, setPage] = useState(0);

  const selectedRoleName = filters.role ? ROLE_BY_ID[filters.role]?.name || filters.role : null;

  // Reset to page 0 when filters change
  const totalPages = Math.ceil(filteredPlayers.length / PAGE_SIZE);
  const safeePage = Math.min(page, Math.max(0, totalPages - 1));

  // Only score the current page slice — not all 36k players
  const pageSlice = filteredPlayers.slice(safeePage * PAGE_SIZE, (safeePage + 1) * PAGE_SIZE);

  const rows: Row[] = useMemo(() => {
    return pageSlice.map((p) => {
      if (filters.role) {
        const sr = scoreSingleRole(p, filters.role);
        return {
          player: p,
          topIpScore:    sr?.ipScore   ?? 0,
          topIpRoleName: sr?.roleName  ?? selectedRoleName ?? "—",
          topOopScore:   sr?.oopScore  ?? 0,
          topOopRoleName: sr?.roleName ?? selectedRoleName ?? "—",
        };
      }
      const scores = scorePlayer(p);
      const topIP  = scores[0];
      const topOOP = [...scores].sort((a, b) => b.oopScore - a.oopScore)[0];
      return {
        player: p,
        topIpScore:    topIP?.ipScore   ?? 0,
        topIpRoleName: topIP?.roleName  ?? "—",
        topOopScore:   topOOP?.oopScore ?? 0,
        topOopRoleName: topOOP?.roleName ?? "—",
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeePage, filteredPlayers, filters.role]);

  const Th = ({ label, k }: { label: string; k: typeof sortKey }) => (
    <th onClick={() => { setPage(0); setSort(k); }} className={sortKey === k ? "sorted" : ""}>
      {label}<SortIcon active={sortKey === k} dir={sortDir} />
    </th>
  );

  const exportCSV = () => {
    const header = ["Name","Age","Club","Div","Pos","CA","PA","Value","Expires"];
    const lines = filteredPlayers.map((p) => [
      `"${p.name || ""}"`, p.age, `"${p.club || "Free Agent"}"`, `"${p.div || ""}"`,
      `"${p.pos || ""}"`,
      hiddenMode ? "" : p.ca, hiddenMode ? "" : p.pa,
      p.value, `"${p.expires || ""}"`,
    ].join(","));
    const blob = new Blob([header.join(",") + "\n" + lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "fm26_shortlist.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="table-pane">
      <div className="table-toolbar">
        <span className="table-count">{filteredPlayers.length.toLocaleString()} players</span>
        <div style={{ flex: 1 }} />
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-secondary)" }}>
            <button className="btn" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={safeePage === 0}>‹</button>
            <span>{safeePage + 1} / {totalPages}</span>
            <button className="btn" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={safeePage >= totalPages - 1}>›</button>
          </div>
        )}
        <button className="btn" onClick={exportCSV}>⬇ Export CSV</button>
      </div>

      <div className="table-scroll">
        {filteredPlayers.length === 0 ? (
          <div className="empty-state" style={{ height: "80%" }}>
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No players match</div>
            <div className="empty-state-sub">Adjust the filters in the sidebar.</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <Th label="Name"  k="name" />
                <Th label="Pos"   k="pos" />
                <Th label="Age"   k="age" />
                <Th label="Club"  k="club" />
                {!hiddenMode && <Th label="CA" k="ca" />}
                {!hiddenMode && <Th label="PA" k="pa" />}
                <Th label="Value" k="value" />
                <th>{selectedRoleName ? `Role: ${selectedRoleName}` : "Best IP Role"}</th>
                <th>IP</th>
                <th>OOP</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ player: p, topIpScore, topIpRoleName, topOopScore }) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
                  className={selectedId === p.id ? "selected" : ""}
                >
                  <td style={{ fontWeight: 600, color: "var(--text-primary)", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.name}
                  </td>
                  <td>
                    <span className="pos-pill">{(p.pos || "—").split(",")[0]?.trim()}</span>
                  </td>
                  <td>{p.age}</td>
                  <td style={{ color: "var(--text-secondary)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.club || "Free Agent"}
                  </td>
                  {!hiddenMode && (
                    <td>
                      <div className="ca-bar-wrap">
                        <div className="ca-bar">
                          <div className="ca-bar-fill" style={{ width: `${(p.ca / 200) * 100}%` }} />
                        </div>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: p.ca >= 150 ? "var(--green)" : p.ca >= 120 ? "var(--accent)" : "var(--text-secondary)" }}>
                          {p.ca}
                        </span>
                      </div>
                    </td>
                  )}
                  {!hiddenMode && (
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
                      {p.pa}
                    </td>
                  )}
                  <td className="value-text">{fmt(p.value)}</td>
                  <td style={{ color: "var(--text-secondary)", fontSize: 11 }}>{topIpRoleName}</td>
                  <td>
                    <span className={`score-chip ${scoreClass(topIpScore)}`}>{topIpScore}</span>
                  </td>
                  <td>
                    <span className={`score-chip ${scoreClass(topOopScore)}`}>{topOopScore}</span>
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: 11 }}>{p.expires ? p.expires.slice(0, 7) : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

