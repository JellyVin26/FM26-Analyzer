import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { topIpRoles, topOopRoles } from "../engine/ratingEngine";
import type { Player } from "../data/types";

// ── Formation definitions ───────────────────────────────────────────────────
type FormationRow = { label: string; match: string[] };
type FormationDef  = { name: string; rows: FormationRow[][] };

const FORMATIONS: FormationDef[] = [
  {
    name: "4-3-3",
    rows: [
      [{ label: "AML", match: ["AML","ML"] }, { label: "ST", match: ["ST"] }, { label: "AMR", match: ["AMR","MR"] }],
      [{ label: "MCL", match: ["MC","DM"] }, { label: "MC", match: ["MC","AMC"] }, { label: "MCR", match: ["MC","DM"] }],
      [{ label: "DL", match: ["DL","WBL"] }, { label: "DCL", match: ["DC"] }, { label: "DCR", match: ["DC"] }, { label: "DR", match: ["DR","WBR"] }],
      [{ label: "GK", match: ["GK"] }],
    ],
  },
  {
    name: "4-4-2",
    rows: [
      [{ label: "STL", match: ["ST"] }, { label: "STR", match: ["ST"] }],
      [{ label: "ML", match: ["ML","AML"] }, { label: "MCL", match: ["MC","DM"] }, { label: "MCR", match: ["MC","DM"] }, { label: "MR", match: ["MR","AMR"] }],
      [{ label: "DL", match: ["DL","WBL"] }, { label: "DCL", match: ["DC"] }, { label: "DCR", match: ["DC"] }, { label: "DR", match: ["DR","WBR"] }],
      [{ label: "GK", match: ["GK"] }],
    ],
  },
  {
    name: "4-2-3-1",
    rows: [
      [{ label: "ST", match: ["ST"] }],
      [{ label: "AML", match: ["AML","ML"] }, { label: "AMC", match: ["AMC","MC"] }, { label: "AMR", match: ["AMR","MR"] }],
      [{ label: "DML", match: ["DM","MC"] }, { label: "DMR", match: ["DM","MC"] }],
      [{ label: "DL", match: ["DL","WBL"] }, { label: "DCL", match: ["DC"] }, { label: "DCR", match: ["DC"] }, { label: "DR", match: ["DR","WBR"] }],
      [{ label: "GK", match: ["GK"] }],
    ],
  },
  {
    name: "4-1-4-1",
    rows: [
      [{ label: "ST", match: ["ST"] }],
      [{ label: "AML", match: ["AML","ML"] }, { label: "MCL", match: ["MC"] }, { label: "MCR", match: ["MC"] }, { label: "AMR", match: ["AMR","MR"] }],
      [{ label: "DM", match: ["DM","MC"] }],
      [{ label: "DL", match: ["DL","WBL"] }, { label: "DCL", match: ["DC"] }, { label: "DCR", match: ["DC"] }, { label: "DR", match: ["DR","WBR"] }],
      [{ label: "GK", match: ["GK"] }],
    ],
  },
  {
    name: "4-5-1",
    rows: [
      [{ label: "ST", match: ["ST"] }],
      [{ label: "ML", match: ["ML","AML"] }, { label: "MCL", match: ["MC"] }, { label: "MC", match: ["MC","AMC"] }, { label: "MCR", match: ["MC"] }, { label: "MR", match: ["MR","AMR"] }],
      [{ label: "DL", match: ["DL","WBL"] }, { label: "DCL", match: ["DC"] }, { label: "DCR", match: ["DC"] }, { label: "DR", match: ["DR","WBR"] }],
      [{ label: "GK", match: ["GK"] }],
    ],
  },
  {
    name: "3-5-2",
    rows: [
      [{ label: "STL", match: ["ST"] }, { label: "STR", match: ["ST"] }],
      [{ label: "WBL", match: ["WBL","DL"] }, { label: "MCL", match: ["MC","DM"] }, { label: "MC", match: ["MC","AMC"] }, { label: "MCR", match: ["MC","DM"] }, { label: "WBR", match: ["WBR","DR"] }],
      [{ label: "DCL", match: ["DC"] }, { label: "DC", match: ["DC"] }, { label: "DCR", match: ["DC"] }],
      [{ label: "GK", match: ["GK"] }],
    ],
  },
  {
    name: "3-4-3",
    rows: [
      [{ label: "AML", match: ["AML","ML"] }, { label: "ST", match: ["ST"] }, { label: "AMR", match: ["AMR","MR"] }],
      [{ label: "WBL", match: ["WBL","DL"] }, { label: "MCL", match: ["MC","DM"] }, { label: "MCR", match: ["MC","DM"] }, { label: "WBR", match: ["WBR","DR"] }],
      [{ label: "DCL", match: ["DC"] }, { label: "DC", match: ["DC"] }, { label: "DCR", match: ["DC"] }],
      [{ label: "GK", match: ["GK"] }],
    ],
  },
  {
    name: "5-3-2",
    rows: [
      [{ label: "STL", match: ["ST"] }, { label: "STR", match: ["ST"] }],
      [{ label: "MCL", match: ["MC","DM"] }, { label: "MC", match: ["MC","AMC"] }, { label: "MCR", match: ["MC","DM"] }],
      [{ label: "WBL", match: ["WBL","DL"] }, { label: "DCL", match: ["DC"] }, { label: "DC", match: ["DC"] }, { label: "DCR", match: ["DC"] }, { label: "WBR", match: ["WBR","DR"] }],
      [{ label: "GK", match: ["GK"] }],
    ],
  },
  {
    name: "5-4-1",
    rows: [
      [{ label: "ST", match: ["ST"] }],
      [{ label: "ML", match: ["ML","AML"] }, { label: "MCL", match: ["MC"] }, { label: "MCR", match: ["MC"] }, { label: "MR", match: ["MR","AMR"] }],
      [{ label: "WBL", match: ["WBL","DL"] }, { label: "DCL", match: ["DC"] }, { label: "DC", match: ["DC"] }, { label: "DCR", match: ["DC"] }, { label: "WBR", match: ["WBR","DR"] }],
      [{ label: "GK", match: ["GK"] }],
    ],
  },
];

// ── Position filter groups ──────────────────────────────────────────────────
const POS_FILTERS = [
  { label: "All",        match: null },
  { label: "🧤 GK",      match: ["GK"] },
  { label: "🛡️ Defenders", match: ["DC","DL","DR","WBL","WBR"] },
  { label: "⚙️ Midfielders", match: ["DM","MC","ML","MR","AMC","AML","AMR"] },
  { label: "⚡ Attackers", match: ["ST"] },
];

// ── Team type filter groups ────────────────────────────────────────────────
const TEAM_FILTERS = [
  { label: "All Teams",   type: null },
  { label: "🏆 First Team", type: 0 },
  { label: "🔵 Reserves",  type: 1 },
  { label: "🌱 Youth",     type: 2 },
];

function matchesFilter(p: Player, filterMatch: string[] | null): boolean {
  if (!filterMatch) return true;
  return filterMatch.some((m) =>
    (p.posArr && p.posArr.some((pa) => pa === m || pa.startsWith(m))) ||
    p.pos?.includes(m)
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────
const getCaColor = (ca: number) => {
  if (ca >= 150) return "var(--green)";
  if (ca >= 130) return "var(--amber)";
  return "var(--red)";
};

const getCaBar = (ca: number) => {
  const pct = Math.min(100, Math.max(0, (ca / 200) * 100));
  return (
    <div className="squad-ca-bar-wrap">
      <div className="squad-ca-bar">
        <div className="squad-ca-bar-fill" style={{ width: `${pct}%`, background: getCaColor(ca) }} />
      </div>
      <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: getCaColor(ca) }}>{ca}</span>
    </div>
  );
};

// ── Component ────────────────────────────────────────────────────────────────
export function SquadOverview() {
  const { dump, hiddenMode, shortlistIds, addToShortlist, removeFromShortlist } = useApp();
  const [selectedFormation, setSelectedFormation] = useState<string>("4-3-3");
  const [posFilter, setPosFilter] = useState<string>("All");
  const [teamFilter, setTeamFilter] = useState<string>("All Teams");

  const activeClub = dump?.meta.myClub || "";

  const squadPlayers = useMemo(
    () => (dump ? dump.players.filter((p) => p.club === activeClub) : []),
    [dump, activeClub]
  );

  const activeFilter = POS_FILTERS.find((f) => f.label === posFilter) ?? POS_FILTERS[0];
  const activeTeamFilter = TEAM_FILTERS.find((f) => f.label === teamFilter) ?? TEAM_FILTERS[0];

  const filteredSquad = useMemo(
    () => squadPlayers
      .filter((p) => matchesFilter(p, activeFilter.match))
      .filter((p) => activeTeamFilter.type === null || p.teamType === activeTeamFilter.type),
    [squadPlayers, activeFilter, activeTeamFilter]
  );

  const formation = FORMATIONS.find((f) => f.name === selectedFormation) ?? FORMATIONS[0];

  const usedInFormation = new Set<number>();

  const getBestForPos = (posMatch: string[]) => {
    const candidates = squadPlayers
      .filter((p) => !usedInFormation.has(p.id))
      .filter((p) =>
        posMatch.some((m) =>
          (p.posArr && p.posArr.some((pa) => pa === m || pa.startsWith(m))) || p.pos?.includes(m)
        )
      )
      .sort((a, b) => {
        const sa = topIpRoles(a, 1)[0]?.ipScore ?? 0;
        const sb = topIpRoles(b, 1)[0]?.ipScore ?? 0;
        return sb - sa;
      });
    const best = candidates[0];
    if (best) usedInFormation.add(best.id);
    return best;
  };

  return (
    <div className="squad-overview-pane">
      {/* ── Header ── */}
      <div className="squad-header">
        <div>
          <h2 className="squad-title">Squad Overview</h2>
          <div className="squad-subtitle">Visual depth and complete player listing for the club.</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <strong style={{ color: "var(--accent)", fontSize: 13 }}>📋 {activeClub}</strong>
          <select
            className="filter-select"
            value={selectedFormation}
            onChange={(e) => setSelectedFormation(e.target.value)}
            style={{ minWidth: 110 }}
          >
            {FORMATIONS.map((f) => (
              <option key={f.name} value={f.name}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Pitch ── */}
      <div className="pitch-container">
        {formation.rows.map((row, i) => (
          <div key={i} className="pitch-row">
            {row.map((pos, j) => {
              const best = getBestForPos(pos.match);
              const bestRole = best ? topIpRoles(best, 1)[0] : null;
              return (
                <div key={j} className="pitch-pos">
                  <div className="pitch-pos-label">{pos.label}</div>
                  {best ? (
                    <div className="pitch-player">
                      <div className="pitch-player-name">{best.name}</div>
                      {!hiddenMode && (
                        <div className="pitch-player-ca" style={{ color: getCaColor(best.ca) }}>CA {best.ca}</div>
                      )}
                      {bestRole && (
                        <div className="pitch-player-role">
                          <span className="topbar-badge">{bestRole.ipScore}%</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="pitch-player empty">No Player</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Position + Team type filter pills ── */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
        <div className="squad-pos-filter" style={{ marginBottom: 0 }}>
          {POS_FILTERS.map((f) => (
            <button
              key={f.label}
              className={`nav-btn ${posFilter === f.label ? "active" : ""}`}
              onClick={() => setPosFilter(f.label)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="squad-pos-filter" style={{ marginBottom: 0 }}>
          {TEAM_FILTERS.map((f) => (
            <button
              key={f.label}
              className={`nav-btn ${teamFilter === f.label ? "active" : ""}`}
              onClick={() => setTeamFilter(f.label)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="squad-pos-count">{filteredSquad.length} players</span>
      </div>

      {/* ── Full Squad ── */}
      <div className="squad-grid-title">Full Squad</div>
      <div className="squad-grid">
        {filteredSquad.map((p) => {
          const topIp  = topIpRoles(p, 2);
          const topOop = topOopRoles(p, 1);
          const isShortlisted = shortlistIds.includes(p.id);

          return (
            <div key={p.id} className="squad-card">
              <div className="squad-card-header">
                <div>
                  <div className="squad-card-name">{p.name}</div>
                  <div className="squad-card-meta">{p.age} y/o · {p.pos}</div>
                </div>
                <button
                  className={`btn ${isShortlisted ? "active" : ""}`}
                  onClick={() => isShortlisted ? removeFromShortlist(p.id) : addToShortlist(p.id)}
                  style={{ padding: "4px 8px" }}
                  title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
                >
                  {isShortlisted ? "⭐" : "☆"}
                </button>
              </div>

              {!hiddenMode && (
                <div className="squad-card-ca">{getCaBar(p.ca)}</div>
              )}

              <div className="squad-card-roles">
                <div className="squad-role-col">
                  <div className="squad-role-title">In Possession</div>
                  {topIp.map((r, idx) => (
                    <div key={idx} className="squad-role-item">
                      <span>{r.roleName}</span>
                      <span className="score-num">{r.ipScore}%</span>
                    </div>
                  ))}
                </div>
                <div className="squad-role-col">
                  <div className="squad-role-title">Out of Possession</div>
                  {topOop.map((r, idx) => (
                    <div key={idx} className="squad-role-item">
                      <span>{r.roleName}</span>
                      <span className="score-num">{r.oopScore}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
