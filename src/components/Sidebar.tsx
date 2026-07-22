import { useApp } from "../context/AppContext";
import { getRolesForPosition } from "../data/roleDefinitions";

const POSITIONS = ["GK", "DC", "DR", "DL", "WBR", "WBL", "DM", "MC", "AML", "AMR", "AMC", "ML", "MR", "ST"];

export function Sidebar() {
  const { filters, setFilter, resetFilters, hiddenMode, setHiddenMode, dump } = useApp();

  const availableIpRoles = getRolesForPosition(filters.pos, "IP").sort((a, b) => a.name.localeCompare(b.name));
  const availableOopRoles = getRolesForPosition(filters.pos, "OOP").sort((a, b) => a.name.localeCompare(b.name));

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
            setFilter("ipRole", "");
            setFilter("oopRole", "");
          }}
        >
          <option value="">All positions</option>
          {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* In-Possession (IP) Role */}
      <div className="filter-section">
        <div className="filter-label">In-Possession Role (IP)</div>
        <select
          className="filter-select"
          value={filters.ipRole}
          onChange={(e) => setFilter("ipRole", e.target.value)}
        >
          <option value="">All IP roles</option>
          {availableIpRoles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>

      {filters.ipRole && (
        <div className="filter-section">
          <div className="filter-label">Min IP Rating (%)</div>
          <input
            className="range-input"
            type="number"
            min={0}
            max={100}
            placeholder="Min IP score (e.g. 70)"
            value={filters.minIpScore}
            onChange={(e) => setFilter("minIpScore", e.target.value)}
          />
        </div>
      )}

      {/* Out-of-Possession (OOP) Role */}
      <div className="filter-section">
        <div className="filter-label">Out-of-Possession Role (OOP)</div>
        <select
          className="filter-select"
          value={filters.oopRole}
          onChange={(e) => setFilter("oopRole", e.target.value)}
        >
          <option value="">All OOP roles</option>
          {availableOopRoles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>

      {filters.oopRole && (
        <div className="filter-section">
          <div className="filter-label">Min OOP Rating (%)</div>
          <input
            className="range-input"
            type="number"
            min={0}
            max={100}
            placeholder="Min OOP score (e.g. 70)"
            value={filters.minOopScore}
            onChange={(e) => setFilter("minOopScore", e.target.value)}
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

      {/* Contract & Transfer Status */}
      <div className="filter-section">
        <div className="filter-label">Contract & Transfer Status</div>
        <select
          className="filter-select"
          value={filters.transferStatus}
          onChange={(e) => setFilter("transferStatus", e.target.value)}
        >
          <option value="">Any status</option>
          <option value="transfer-listed">Transfer Listed</option>
          <option value="loan-listed">Loan Listed</option>
          <option value="expiring-6m">Expiring (6 Months)</option>
          <option value="expiring-1y">Expiring (1 Year)</option>
          <option value="free-agent">Free Agents</option>
          <option value="realistic">Realistic Targets (Likely to Join)</option>
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
