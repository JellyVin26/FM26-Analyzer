import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { topIpRoles, topOopRoles } from "../engine/ratingEngine";

function fmt(v: number) {
  if (v >= 1_000_000) return `£${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `£${(v / 1_000).toFixed(0)}K`;
  return `£${v}`;
}

const POS_GROUPS = [
  { id: "GK", name: "Goalkeeper", match: ["GK"] },
  { id: "DC", name: "Central Defender (DC)", match: ["DC"] },
  { id: "FB", name: "Full-Back / Wing-Back", match: ["DR", "DL", "WBR", "WBL"] },
  { id: "MID", name: "Central / Defensive Midfielder", match: ["DM", "MC"] },
  { id: "WING", name: "Winger / Attacking Midfielder", match: ["AML", "AMR", "AMC", "ML", "MR"] },
  { id: "ST", name: "Striker / Forward", match: ["ST"] },
];

export function BuySellLoanAdvisor() {
  const { dump, hiddenMode } = useApp();
  const [selectedClub, setSelectedClub] = useState<string>("");
  const [budgetM, setBudgetM] = useState<string>("40");

  const clubs = useMemo(
    () => (dump ? [...new Set(dump.players.map((p) => p.club).filter(Boolean))].sort() : []),
    [dump]
  );

  const activeClub = selectedClub || dump?.meta.myClub || clubs[0] || "";

  const mySquad = useMemo(
    () => (dump ? dump.players.filter((p) => p.club === activeClub) : []),
    [dump, activeClub]
  );

  // Analyze squad gaps by position group
  const squadGaps = useMemo(() => {
    return POS_GROUPS.map((g) => {
      const players = mySquad.filter((p) =>
        g.match.some((m) => (p.posArr && p.posArr.some((pa) => pa === m || pa.startsWith(m))) || p.pos?.includes(m))
      ).sort((a, b) => b.ca - a.ca);

      const starterCA = players[0]?.ca ?? 0;
      const count = players.length;
      // Gap if starter CA < 140 or count < 2
      const isWeak = starterCA < 140 || count < 2;

      return {
        group: g,
        players,
        starterCA,
        count,
        isWeak,
      };
    });
  }, [mySquad]);

  const weakGroupCodes = useMemo(
    () => squadGaps.filter((g) => g.isWeak).flatMap((g) => g.group.match),
    [squadGaps]
  );

  // Transfer budget in raw numeric GBP
  const maxBudgetGbp = (parseFloat(budgetM) || 40) * 1_000_000;

  // Buy Recommendations: Solves squad gap + fits within budget
  const buyTargets = useMemo(() => {
    if (!dump) return [];

    return dump.players
      .filter((p) => {
        if (p.club === activeClub) return false;
        if (p.age > 28) return false; // Focus on young/prime targets
        if (p.value > maxBudgetGbp * 1.15) return false; // Must fit budget
        // Must match a position
        const matchesPosition = weakGroupCodes.length > 0
          ? weakGroupCodes.some((m) => (p.posArr && p.posArr.some((pa) => pa === m || pa.startsWith(m))) || p.pos?.includes(m))
          : true;
        if (p.notForSale) return false; // ← exclude players not for sale
        return matchesPosition;
      })
      .map((p) => {
        const topIP = topIpRoles(p, 1)[0];
        const estValue = p.value || 5_000_000;
        const lowBand = fmt(Math.round(estValue * 0.75));
        const highBand = fmt(Math.round(estValue * 1.25));

        // Find corresponding position gap solved
        const gapSolved = POS_GROUPS.find((g) =>
          g.match.some((m) => (p.posArr && p.posArr.some((pa) => pa === m || pa.startsWith(m))) || p.pos?.includes(m))
        );

        const currentStarter = mySquad
          .filter((sp) => gapSolved?.match.some((m) => sp.pos?.includes(m)))
          .sort((a, b) => b.ca - a.ca)[0];

        const caDiff = currentStarter ? p.ca - currentStarter.ca : p.ca;
        const caDiffText = caDiff > 0 ? `+${caDiff} CA upgrade over ${currentStarter?.name}` : `Strong depth option (${p.ca} CA)`;

        return {
          player: p,
          bestRole: topIP?.roleName ?? "—",
          ipScore: topIP?.ipScore ?? 0,
          gapName: gapSolved?.name ?? p.pos,
          estValue,
          valueRange: `~${fmt(estValue)} (Range: ${lowBand} – ${highBand} ±25%)`,
          caDiffText,
        };
      })
      .sort((a, b) => (b.caDiffText.startsWith("+") ? 100 : 0) + b.ipScore - ((a.caDiffText.startsWith("+") ? 100 : 0) + a.ipScore))
      .slice(0, 10);
  }, [dump, activeClub, maxBudgetGbp, weakGroupCodes, mySquad]);

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
    <div className="advisor-pane" style={{ padding: 24, width: "100%", height: "100%", overflowY: "auto", boxSizing: "border-box" }}>
      {/* Top Header & Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, margin: 0, color: "var(--text-primary)" }}>Recruitment & Budget Advisor</h2>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
            Tailored transfer targets aligned with your club's transfer budget and positional squad gaps.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Transfer Budget Input */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-elevated)", padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border-color)" }}>
            <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>Transfer Budget (£M):</span>
            <input
              type="number"
              min={1}
              max={500}
              value={budgetM}
              onChange={(e) => setBudgetM(e.target.value)}
              style={{
                width: 70,
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 4,
                color: "var(--green)",
                fontWeight: 700,
                padding: "4px 8px",
                fontSize: 13,
                textAlign: "center",
              }}
            />
          </div>

          {/* Club Selector */}
          <select
            className="filter-select"
            value={activeClub}
            onChange={(e) => setSelectedClub(e.target.value)}
            style={{ minWidth: 200 }}
          >
            {clubs.map((c) => (
              <option key={c} value={c}>
                {c} {c === dump?.meta.myClub ? "(Your Club)" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Positional Squad Gap Summary Banner */}
      <div className="card" style={{ background: "var(--bg-elevated)", padding: 14, borderRadius: 10, marginBottom: 20, border: "1px solid var(--border-color)" }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--accent)", letterSpacing: "0.05em", marginBottom: 8 }}>
          🛡️ Positional Gap Analysis — {activeClub}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {squadGaps.map((g) => (
            <div
              key={g.group.id}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                background: g.isWeak ? "rgba(239, 68, 68, 0.12)" : "rgba(34, 197, 94, 0.12)",
                border: `1px solid ${g.isWeak ? "rgba(239, 68, 68, 0.3)" : "rgba(34, 197, 94, 0.3)"}`,
                color: g.isWeak ? "var(--red)" : "var(--green)",
                fontWeight: 600,
              }}
            >
              {g.group.name}: {g.isWeak ? `⚠️ Needs Reinforcement (Depth: ${g.count})` : `✅ Solid (Depth: ${g.count})`}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
        {/* BUY RECOMMENDATIONS */}
        <div className="card" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 16 }}>
          <h3 style={{ fontSize: 15, color: "var(--green)", marginTop: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>🟢 Top Buy Candidates</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)" }}>Budget: £{budgetM}M Max</span>
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {buyTargets.length === 0 ? (
              <div style={{ fontSize: 12, color: "var(--text-muted)", padding: 8 }}>No buy targets fit budget £{budgetM}M. Try increasing budget.</div>
            ) : (
              buyTargets.map(({ player: p, bestRole, ipScore, gapName, valueRange, caDiffText }) => (
                <div key={p.id} style={{ background: "var(--bg-card)", padding: 10, borderRadius: 8, fontSize: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                    <span>{p.name} ({p.pos})</span>
                    <span style={{ color: "var(--green)" }}>{ipScore}% {bestRole}</span>
                  </div>
                  <div style={{ color: "var(--accent)", fontSize: 11, fontWeight: 600, marginTop: 2 }}>
                    🎯 Solves: {gapName}
                  </div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 11, marginTop: 2 }}>
                    Club: {p.club} · Age {p.age} {!hiddenMode && `· CA ${p.ca} / PA ${p.pa}`}
                  </div>
                  <div style={{ color: "var(--green)", fontSize: 11, marginTop: 4, fontWeight: 600 }}>
                    💰 Est. Cost: {valueRange}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 2, fontStyle: "italic" }}>
                    📈 {caDiffText}
                  </div>
                </div>
              ))
            )}
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
