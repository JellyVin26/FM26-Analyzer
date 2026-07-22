import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { scorePlayer } from "../engine/ratingEngine";
import type { Player } from "../data/types";

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

const VISIBLE_ATTRS: Array<[string, keyof Player["attrs"]]> = [
  ["Acceleration", "Acceleration"], ["Agility", "Agility"], ["Balance", "Balance"],
  ["Jumping Reach", "JumpingReach"], ["Natural Fitness", "NaturalFitness"],
  ["Pace", "Pace"], ["Stamina", "Stamina"], ["Strength", "Strength"],
  ["Aggression", "Aggression"], ["Anticipation", "Anticipation"],
  ["Bravery", "Bravery"], ["Composure", "Composure"],
  ["Concentration", "Concentration"], ["Decisions", "Decisions"],
  ["Determination", "Determination"], ["Flair", "Flair"],
  ["Leadership", "Leadership"], ["Off the Ball", "OffTheBall"],
  ["Positioning", "Positioning"], ["Teamwork", "Teamwork"],
  ["Vision", "Vision"], ["Work Rate", "WorkRate"],
  ["Corners", "Corners"], ["Crossing", "Crossing"],
  ["Dribbling", "Dribbling"], ["Finishing", "Finishing"],
  ["First Touch", "FirstTouch"], ["Free Kicks", "FreeKicks"],
  ["Heading", "Heading"], ["Long Shots", "LongShots"],
  ["Long Throws", "LongThrows"], ["Marking", "Marking"],
  ["Passing", "Passing"], ["Penalty Taking", "PenaltyTaking"],
  ["Tackling", "Tackling"], ["Technique", "Technique"],
];

const HIDDEN_ATTRS: Array<[string, keyof Player]> = [
  ["Ambition", "ambition"], ["Loyalty", "loyalty"],
  ["Professionalism", "professionalism"], ["Adaptability", "adaptability"],
  ["Pressure", "pressure"], ["Sportsmanship", "sportsmanship"],
  ["Temperament", "temperament"], ["Controversy", "controversy"],
];

export function PlayerDrawer() {
  const { dump, selectedId, setSelectedId, hiddenMode } = useApp();

  const player = useMemo(
    () => dump?.players.find((p) => p.id === selectedId),
    [dump, selectedId]
  );

  if (!player) return null;

  const scores = scorePlayer(player);
  const topScores = scores.slice(0, 12);

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
              {player.pos} · {player.nat.join(", ")} · Age {player.age} · {player.club}
            </div>
            {player.div && (
              <div className="drawer-meta" style={{ marginTop: 2, fontSize: 11, opacity: 0.6 }}>
                {player.div}
              </div>
            )}
          </div>
          <button className="drawer-close" onClick={close}>✕</button>
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
                <div className="stat-cell-val" style={{ fontSize: 13 }}>{fmt(player.value)}</div>
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

          {/* Top Role Scores (IP vs OOP) */}
          <div>
            <div className="drawer-section-title">Best Roles (IP vs OOP)</div>
            <div className="role-score-grid">
              {topScores.map((rs) => (
                <div key={rs.roleId} className="role-score-row">
                  <span className="role-score-name">{rs.roleName}</span>
                  <div className="role-score-val">
                    <span className="role-score-label">IP</span>
                    <span className={`role-score-num ${scoreColor(rs.ipScore)}`}>{rs.ipScore}</span>
                  </div>
                  <div className="role-score-val">
                    <span className="role-score-label">OOP</span>
                    <span className={`role-score-num ${scoreColor(rs.oopScore)}`}>{rs.oopScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attributes */}
          <div>
            <div className="drawer-section-title">Attributes</div>
            <div className="attr-grid">
              {VISIBLE_ATTRS.map(([label, key]) => {
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
