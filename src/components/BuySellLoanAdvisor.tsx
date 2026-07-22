import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { topIpRoles, topOopRoles } from "../engine/ratingEngine";

function fmt(v: number) {
  if (v >= 1_000_000) return `£${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `£${(v / 1_000).toFixed(0)}K`;
  return `£${v}`;
}

export function BuySellLoanAdvisor() {
  const { dump, hiddenMode } = useApp();
  const [selectedClub, setSelectedClub] = useState<string>("");

  const clubs = useMemo(
    () => (dump ? [...new Set(dump.players.map((p) => p.club).filter(Boolean))].sort() : []),
    [dump]
  );

  const activeClub = selectedClub || dump?.meta.myClub || clubs[0] || "";

  const mySquad = useMemo(
    () => (dump ? dump.players.filter((p) => p.club === activeClub) : []),
    [dump, activeClub]
  );

  // Buy Recommendations: Players outside club with high CA/PA, age <= 26, high role score
  const buyTargets = useMemo(() => {
    if (!dump) return [];
    return dump.players
      .filter((p) => p.club !== activeClub && p.age <= 26 && p.ca >= 135)
      .map((p) => {
        const topIP = topIpRoles(p, 1)[0];
        const estValue = p.value || 10_000_000;
        const lowBand = fmt(Math.round(estValue * 0.75));
        const highBand = fmt(Math.round(estValue * 1.25));
        return {
          player: p,
          bestRole: topIP?.roleName ?? "—",
          ipScore: topIP?.ipScore ?? 0,
          valueRange: `~${fmt(estValue)} (Range: ${lowBand} – ${highBand} ±25%)`,
          reason: `High FM26 ${topIP?.roleName} fit (${topIP?.ipScore}%), peak age curve (${p.age} yrs)`,
        };
      })
      .sort((a, b) => b.ipScore - a.ipScore)
      .slice(0, 10);
  }, [dump, activeClub]);

  // Sell Recommendations: Squad players age >= 29 or expiring contract or low role fit
  const sellTargets = useMemo(() => {
    return mySquad
      .filter((p) => p.age >= 29 || (p.expires && p.expires.startsWith("2028")) || p.ca < 120)
      .map((p) => {
        const topIP = topIpRoles(p, 1)[0];
        const topOOP = topOopRoles(p, 1)[0];
        let reason = "";
        if (p.age >= 30) reason = `Aging asset (${p.age} yrs); decline risk ahead`;
        else if (p.expires && p.expires.startsWith("2028")) reason = `Contract expiring soon (${p.expires.slice(0, 7)})`;
        else reason = `Low tactical role fit (${topOOP?.roleName || "OOP"} ${topOOP?.oopScore || 0}%)`;

        return {
          player: p,
          bestRole: topIP?.roleName ?? "—",
          estValue: fmt(p.value),
          reason,
        };
      })
      .slice(0, 8);
  }, [mySquad]);

  // Loan Recommendations: High PA (>140), young (<21) squad members
  const loanTargets = useMemo(() => {
    return mySquad
      .filter((p) => p.age <= 21 && p.pa >= 140)
      .map((p) => ({
        player: p,
        reason: `High potential (PA ${p.pa}) needing first-team development minutes`,
      }))
      .slice(0, 8);
  }, [mySquad]);

  return (
    <div className="advisor-pane" style={{ padding: 24, flex: 1, overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, margin: 0, color: "var(--text-primary)" }}>Recruitment & Squad Advisor</h2>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
            Algorithmic Buy, Sell, and Loan recommendations with explicit numerical reasoning and value uncertainty ranges.
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
        {/* BUY RECOMMENDATIONS */}
        <div className="card" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 16 }}>
          <h3 style={{ fontSize: 15, color: "var(--green)", marginTop: 0, display: "flex", alignItems: "center", gap: 8 }}>
            🟢 Top Buy Candidates
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {buyTargets.map(({ player: p, bestRole, ipScore, valueRange, reason }) => (
              <div key={p.id} style={{ background: "var(--bg-card)", padding: 10, borderRadius: 8, fontSize: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                  <span>{p.name} ({p.pos})</span>
                  <span style={{ color: "var(--green)" }}>{ipScore}% {bestRole}</span>
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: 11, marginTop: 4 }}>
                  Club: {p.club} · Age {p.age} {!hiddenMode && `· CA ${p.ca} / PA ${p.pa}`}
                </div>
                <div style={{ color: "var(--accent)", fontSize: 11, marginTop: 4, fontWeight: 600 }}>
                  💰 Est. Value: {valueRange}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 2, fontStyle: "italic" }}>
                  💡 {reason}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SELL RECOMMENDATIONS */}
        <div className="card" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 16 }}>
          <h3 style={{ fontSize: 15, color: "var(--red)", marginTop: 0, display: "flex", alignItems: "center", gap: 8 }}>
            🔴 Sell / Trim Candidates
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sellTargets.length === 0 ? (
              <div style={{ fontSize: 12, color: "var(--text-muted)", padding: 8 }}>No obvious sell targets in squad</div>
            ) : (
              sellTargets.map(({ player: p, bestRole, estValue, reason }) => (
                <div key={p.id} style={{ background: "var(--bg-card)", padding: 10, borderRadius: 8, fontSize: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                    <span>{p.name} ({p.pos})</span>
                    <span style={{ color: "var(--amber)" }}>Val: {estValue}</span>
                  </div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 11, marginTop: 4 }}>
                    Age {p.age} {!hiddenMode && `· CA ${p.ca}`} · Best Role: {bestRole}
                  </div>
                  <div style={{ color: "var(--red)", fontSize: 11, marginTop: 4, fontWeight: 500 }}>
                    ⚠️ {reason}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* LOAN RECOMMENDATIONS */}
        <div className="card" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 16 }}>
          <h3 style={{ fontSize: 15, color: "var(--accent)", marginTop: 0, display: "flex", alignItems: "center", gap: 8 }}>
            🔵 Loan Out Candidates
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {loanTargets.length === 0 ? (
              <div style={{ fontSize: 12, color: "var(--text-muted)", padding: 8 }}>No youth loan prospects identified</div>
            ) : (
              loanTargets.map(({ player: p, reason }) => (
                <div key={p.id} style={{ background: "var(--bg-card)", padding: 10, borderRadius: 8, fontSize: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                    <span>{p.name} ({p.pos})</span>
                    {!hiddenMode && <span style={{ color: "var(--accent)" }}>PA {p.pa}</span>}
                  </div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 11, marginTop: 4 }}>
                    Age {p.age} {!hiddenMode && `· CA ${p.ca}`}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>
                    🌱 {reason}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
