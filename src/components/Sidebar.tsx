import { useApp } from "../context/AppContext";
import { getRolesForPosition } from "../data/roleDefinitions";

const POSITIONS = ["GK", "DC", "DR", "DL", "WBR", "WBL", "DM", "MC", "AML", "AMR", "AMC", "ML", "MR", "ST"];

export function Sidebar() {
  const { filters, setFilter, resetFilters, hiddenMode, setHiddenMode, dump } = useApp();

  const availableRoles = getRolesForPosition(filters.pos).sort((a, b) => a.name.localeCompare(b.name));

  const clubs = dump
    ? [...new Set(dump.players.map((p) => p.club))].sort()
    : [];
  const nations = dump
    ? [...new Set(dump.players.flatMap((p) => p.nat))].sort()
    : [];

  return (
    <aside className="sidebar">

      {/* Search */}
      <div className="filter-section">
        <div className="filter-label">Search</div>
        <input
          className="search-input"
          placeholder="Name or club…"
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
        />
      </div>

      {/* Position */}
      <div className="filter-section">
        <div className="filter-label">Position</div>
        <select
          className="filter-select"
          value={filters.pos}
          onChange={(e) => {
            setFilter("pos", e.target.value);
            setFilter("role", ""); // reset role selection when position changes
          }}
        >
          <option value="">All positions</option>
          {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Role */}
      <div className="filter-section">
        <div className="filter-label">Tactical Role</div>
        <select
          className="filter-select"
          value={filters.role}
          onChange={(e) => setFilter("role", e.target.value)}
        >
          <option value="">All roles</option>
          {availableRoles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>

      {/* Min Role Rating */}
      {filters.role && (
        <div className="filter-section">
          <div className="filter-label">Min Role Rating (%)</div>
          <input
            className="range-input"
            type="number"
            min={0}
            max={100}
            placeholder="Min score (e.g. 70)"
            value={filters.minRoleScore}
            onChange={(e) => setFilter("minRoleScore", e.target.value)}
          />
        </div>
      )}

      {/* Club */}
      <div className="filter-section">
        <div className="filter-label">Club</div>
        <select
          className="filter-select"
          value={filters.club}
          onChange={(e) => setFilter("club", e.target.value)}
        >
          <option value="">All clubs</option>
          {clubs.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Nationality */}
      <div className="filter-section">
        <div className="filter-label">Nationality</div>
        <select
          className="filter-select"
          value={filters.nationality}
          onChange={(e) => setFilter("nationality", e.target.value)}
        >
          <option value="">All nations</option>
          {nations.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div className="divider" />

      {/* Age */}
      <div className="filter-section">
        <div className="filter-label">Age</div>
        <div className="range-row">
          <input className="range-input" placeholder="Min" type="number" min={15} max={50}
            value={filters.ageMin} onChange={(e) => setFilter("ageMin", e.target.value)} />
          <input className="range-input" placeholder="Max" type="number" min={15} max={50}
            value={filters.ageMax} onChange={(e) => setFilter("ageMax", e.target.value)} />
        </div>
      </div>

      {/* CA */}
      <div className="filter-section">
        <div className="filter-label">Current Ability (CA)</div>
        <div className="range-row">
          <input className="range-input" placeholder="Min" type="number" min={1} max={200}
            value={filters.caMin} onChange={(e) => setFilter("caMin", e.target.value)} />
          <input className="range-input" placeholder="Max" type="number" min={1} max={200}
            value={filters.caMax} onChange={(e) => setFilter("caMax", e.target.value)} />
        </div>
      </div>

      {/* PA */}
      <div className="filter-section">
        <div className="filter-label">Potential Ability (PA)</div>
        <div className="range-row">
          <input className="range-input" placeholder="Min" type="number" min={1} max={200}
            value={filters.paMin} onChange={(e) => setFilter("paMin", e.target.value)} />
          <input className="range-input" placeholder="Max" type="number" min={1} max={200}
            value={filters.paMax} onChange={(e) => setFilter("paMax", e.target.value)} />
        </div>
      </div>

      <div className="divider" />

      {/* Hidden Mode Toggle */}
      <div className="filter-section">
        <div className="toggle-row">
          <span className="toggle-label">Hide CA / PA / hidden attrs</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={hiddenMode} onChange={(e) => setHiddenMode(e.target.checked)} />
            <span className="toggle-slider" />
          </label>
        </div>
        {hiddenMode && (
          <div style={{ marginTop: 6, fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
            CA, PA and personality traits are hidden. Role scores use visible attributes only.
          </div>
        )}
      </div>

      <div className="divider" />

      <button className="btn" onClick={resetFilters} style={{ width: "100%" }}>
        Reset filters
      </button>

      {dump && (
        <div className="footer-note">
          {dump.meta.gameVersion} · {dump.meta.gameDate}<br />
          {dump.meta.manager} @ {dump.meta.myClub}
        </div>
      )}
    </aside>
  );
}
