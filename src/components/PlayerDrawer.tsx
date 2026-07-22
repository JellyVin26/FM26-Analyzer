import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { topIpRoles, topOopRoles } from "../engine/ratingEngine";
import type { Player } from "../data/types";
import { formatPlayerValue } from "../utils/valueUtils";

function fmt(v: number) {
  if (v >= 1_000_000) return `£${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `£${(v / 1_000).toFixed(0)}K`;
  return `£${v}`;
}

function attrColor(v: number) {
  if (v >= 15) return "hi";
  if (v >= 10) return "mid";
  return "lo";
}

function scoreColor(n: number) {
  if (n >= 80) return "score-green";
  if (n >= 65) return "score-blue";
  if (n >= 50) return "score-amber";
  return "score-gray";
}

const TECHNICAL_ATTRS: Array<[string, keyof Player["attrs"]]> = [
  ["Corners", "Corners"], ["Crossing", "Crossing"], ["Dribbling", "Dribbling"],
  ["Finishing", "Finishing"], ["First Touch", "FirstTouch"], ["Free Kicks", "FreeKicks"],
  ["Heading", "Heading"], ["Long Shots", "LongShots"], ["Long Throws", "LongThrows"],
  ["Marking", "Marking"], ["Passing", "Passing"], ["Penalty Taking", "PenaltyTaking"],
  ["Tackling", "Tackling"], ["Technique", "Technique"],
];

const MENTAL_ATTRS: Array<[string, keyof Player["attrs"]]> = [
  ["Aggression", "Aggression"], ["Anticipation", "Anticipation"], ["Bravery", "Bravery"],
  ["Composure", "Composure"], ["Concentration", "Concentration"], ["Decisions", "Decisions"],
  ["Determination", "Determination"], ["Flair", "Flair"], ["Leadership", "Leadership"],
  ["Off the Ball", "OffTheBall"], ["Positioning", "Positioning"], ["Teamwork", "Teamwork"],
  ["Vision", "Vision"], ["Work Rate", "WorkRate"],
];

const PHYSICAL_ATTRS: Array<[string, keyof Player["attrs"]]> = [
  ["Acceleration", "Acceleration"], ["Agility", "Agility"], ["Balance", "Balance"],
  ["Jumping Reach", "JumpingReach"], ["Natural Fitness", "NaturalFitness"],
  ["Pace", "Pace"], ["Stamina", "Stamina"], ["Strength", "Strength"],
];

const HIDDEN_ATTRS: Array<[string, keyof Player]> = [
  ["Ambition", "ambition"], ["Loyalty", "loyalty"],
  ["Professionalism", "professionalism"], ["Adaptability", "adaptability"],
  ["Pressure", "pressure"], ["Sportsmanship", "sportsmanship"],
  ["Temperament", "temperament"], ["Controversy", "controversy"],
];

export function PlayerDrawer() {
  const { dump, selectedId, setSelectedId, hiddenMode, addComparePlayer, comparedIds } = useApp();

  const player = useMemo(
    () => dump?.players.find((p) => p.id === selectedId),
    [dump, selectedId]
  );

  if (!player) return null;

  const ipList = topIpRoles(player, 5);
  const oopList = topOopRoles(player, 5);

  const close = () => setSelectedId(null);

  return (
    <>
      <div className="drawer-overlay" onClick={close} />
      <div className="drawer">
        {/* Header */}
        <div className="drawer-header">
          <div>
            <div className="drawer-name">{player.name}</div>
            <div className="drawer-meta">
              {player.pos} · {player.nat?.join(", ") || "N/A"} · Age {player.age} · {player.club || "Free Agent"}
            </div>
            {player.div && (
              <div className="drawer-meta" style={{ marginTop: 2, fontSize: 11, opacity: 0.6 }}>
                {player.div}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              className={`btn ${comparedIds.includes(player.id) ? "primary" : ""}`}
              style={{ fontSize: 11 }}
              onClick={() => addComparePlayer(player.id, true)}
            >
              {comparedIds.includes(player.id) ? "✓ Compared" : "⚖️ Compare"}
            </button>
            <button className="drawer-close" onClick={close}>✕</button>
          </div>
        </div>

        <div className="drawer-body">
          {/* Key Stats */}
          <div>
            <div className="drawer-section-title">Key Stats</div>
            <div className="stat-grid">
              {!hiddenMode && (
                <>
                  <div className="stat-cell">
                    <div className="stat-cell-label">CA</div>
                    <div className="stat-cell-val" style={{ color: player.ca >= 150 ? "var(--green)" : player.ca >= 120 ? "var(--accent)" : "inherit" }}>
                      {player.ca}
                    </div>
                  </div>
                  <div className="stat-cell">
                    <div className="stat-cell-label">PA</div>
                    <div className="stat-cell-val">{player.pa}</div>
                  </div>
                </>
              )}
              <div className="stat-cell">
                <div className="stat-cell-label">Value</div>
                <div className="stat-cell-val" style={{ fontSize: 13 }}>{formatPlayerValue(player)}</div>
              </div>
              <div className="stat-cell">
                <div className="stat-cell-label">Wage</div>
                <div className="stat-cell-val" style={{ fontSize: 13 }}>{fmt(player.wage)}/wk</div>
              </div>
              <div className="stat-cell">
                <div className="stat-cell-label">Expires</div>
                <div className="stat-cell-val" style={{ fontSize: 12 }}>{player.expires ? player.expires.slice(0, 7) : "N/A"}</div>
              </div>
              <div className="stat-cell">
                <div className="stat-cell-label">Height</div>
                <div className="stat-cell-val" style={{ fontSize: 13 }}>{player.height}cm</div>
              </div>
              <div className="stat-cell">
                <div className="stat-cell-label">Foot</div>
                <div className="stat-cell-val" style={{ fontSize: 12 }}>{player.foot}</div>
              </div>
            </div>
          </div>

          {/* In-Possession (IP) Roles */}
          <div>
            <div className="drawer-section-title">
              In-Possession Roles <span className="pos-pill" style={{ marginLeft: 6 }}>FM26 IP</span>
            </div>
            <div className="role-score-grid">
              {ipList.length === 0 ? (
                <div style={{ fontSize: 11, color: "var(--text-muted)", padding: 8 }}>No matching IP roles for position</div>
              ) : (
                ipList.map((rs) => (
                  <div key={rs.roleId} className="role-score-row" style={{ gridTemplateColumns: "1fr 80px" }}>
                    <span className="role-score-name">{rs.roleName}</span>
                    <div className="role-score-val">
                      <span className="role-score-label">IP SCORE</span>
                      <span className={`role-score-num ${scoreColor(rs.ipScore)}`}>{rs.ipScore}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Out-of-Possession (OOP) Roles */}
          <div>
            <div className="drawer-section-title">
              Out-of-Possession Roles <span className="pos-pill" style={{ marginLeft: 6 }}>FM26 OOP</span>
            </div>
            <div className="role-score-grid">
              {oopList.length === 0 ? (
                <div style={{ fontSize: 11, color: "var(--text-muted)", padding: 8 }}>No matching OOP roles for position</div>
              ) : (
                oopList.map((rs) => (
                  <div key={rs.roleId} className="role-score-row" style={{ gridTemplateColumns: "1fr 80px" }}>
                    <span className="role-score-name">{rs.roleName}</span>
                    <div className="role-score-val">
                      <span className="role-score-label">OOP SCORE</span>
                      <span className={`role-score-num ${scoreColor(rs.oopScore)}`}>{rs.oopScore}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Technical Attributes */}
          <div>
            <div className="drawer-section-title">Technical Attributes</div>
            <div className="attr-grid">
              {TECHNICAL_ATTRS.map(([label, key]) => {
                const v = player.attrs[key as keyof typeof player.attrs] ?? 0;
                return (
                  <div key={key} className="attr-row">
                    <span className="attr-name">{label}</span>
                    <span className={`attr-val ${attrColor(v)}`}>{v}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mental Attributes */}
          <div>
            <div className="drawer-section-title">Mental Attributes</div>
            <div className="attr-grid">
              {MENTAL_ATTRS.map(([label, key]) => {
                const v = player.attrs[key as keyof typeof player.attrs] ?? 0;
                return (
                  <div key={key} className="attr-row">
                    <span className="attr-name">{label}</span>
                    <span className={`attr-val ${attrColor(v)}`}>{v}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Physical Attributes */}
          <div>
            <div className="drawer-section-title">Physical Attributes</div>
            <div className="attr-grid">
              {PHYSICAL_ATTRS.map(([label, key]) => {
                const v = player.attrs[key as keyof typeof player.attrs] ?? 0;
                return (
                  <div key={key} className="attr-row">
                    <span className="attr-name">{label}</span>
                    <span className={`attr-val ${attrColor(v)}`}>{v}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hidden Personality (only shown when not in hidden mode) */}
          {!hiddenMode && (
            <div>
              <div className="drawer-section-title">
                Personality{" "}
                <span className="hidden-badge">hidden in-game</span>
              </div>
              <div className="attr-grid">
                {HIDDEN_ATTRS.map(([label, key]) => {
                  const v = player[key as keyof Player] as number ?? 0;
                  return (
                    <div key={key} className="attr-row">
                      <span className="attr-name">{label}</span>
                      <span className={`attr-val ${attrColor(v)}`}>{v}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
