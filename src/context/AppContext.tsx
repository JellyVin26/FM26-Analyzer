import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Dump, Player } from "../data/types";
import { scoreSingleRole } from "../engine/ratingEngine";

interface Filters {
  search: string;
  pos: string;
  ipRole: string;
  minIpScore: string;
  oopRole: string;
  minOopScore: string;
  club: string;
  nationality: string;
  ageMin: string;
  ageMax: string;
  caMin: string;
  caMax: string;
  paMin: string;
  paMax: string;
  valueMax: string;
  contractExpiry: string;
}

interface AppState {
  dump: Dump | null;
  loading: boolean;
  hiddenMode: boolean;     // hide CA/PA/hidden attrs
  filters: Filters;
  sortKey: keyof Player | "value" | "role_ip" | "role_oop";
  sortDir: "asc" | "desc";
  selectedId: number | null;
  setDump: (d: Dump) => void;
  setLoading: (v: boolean) => void;
  setHiddenMode: (v: boolean) => void;
  setFilter: (k: keyof Filters, v: string) => void;
  resetFilters: () => void;
  setSort: (k: AppState["sortKey"]) => void;
  setSelectedId: (id: number | null) => void;
  filteredPlayers: Player[];
}

const DEFAULT_FILTERS: Filters = {
  search: "", pos: "", ipRole: "", minIpScore: "", oopRole: "", minOopScore: "", club: "", nationality: "",
  ageMin: "", ageMax: "", caMin: "", caMax: "",
  paMin: "", paMax: "", valueMax: "", contractExpiry: "",
};

const Ctx = createContext<AppState>(null!);

export function AppProvider({ children }: { children: ReactNode }) {
  const [dump, setDump_] = useState<Dump | null>(null);
  const [loading, setLoading] = useState(false);
  const [hiddenMode, setHiddenMode] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sortKey, setSortKey] = useState<AppState["sortKey"]>("ca");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const setDump = useCallback((d: Dump) => { setDump_(d); }, []);
  const setFilter = useCallback((k: keyof Filters, v: string) => {
    setFilters((f) => ({ ...f, [k]: v }));
  }, []);
  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const setSort = useCallback((k: AppState["sortKey"]) => {
    setSortKey((prev) => {
      if (prev === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      else { setSortDir("desc"); }
      return k;
    });
  }, []);

  const filteredPlayers: Player[] = React.useMemo(() => {
    if (!dump) return [];
    let list = dump.players;

    const s = filters.search.toLowerCase();
    if (s) list = list.filter((p) => (p.searchName || p.name || "").toLowerCase().includes(s) || (p.club || "").toLowerCase().includes(s));
    if (filters.pos) {
      const targetPos = filters.pos;
      list = list.filter((p) => {
        const inPosArr = p.posArr && p.posArr.some((pp) => pp === targetPos || pp.startsWith(targetPos));
        const inPosStr = p.pos && p.pos.split(",").some((sp) => sp.trim() === targetPos || sp.trim().startsWith(targetPos));
        return inPosArr || inPosStr;
      });
    }
    if (filters.club) list = list.filter((p) => p.club === filters.club);
    if (filters.nationality) list = list.filter((p) => p.nat && Array.isArray(p.nat) && p.nat.includes(filters.nationality));
    if (filters.ipRole) {
      const roleId = filters.ipRole;
      const minScore = filters.minIpScore ? +filters.minIpScore : 0;
      list = list.filter((p) => {
        const sr = scoreSingleRole(p, roleId);
        return sr ? sr.ipScore >= minScore : false;
      });
    }
    if (filters.oopRole) {
      const roleId = filters.oopRole;
      const minScore = filters.minOopScore ? +filters.minOopScore : 0;
      list = list.filter((p) => {
        const sr = scoreSingleRole(p, roleId);
        return sr ? sr.oopScore >= minScore : false;
      });
    }
    if (filters.ageMin) list = list.filter((p) => p.age >= +filters.ageMin);
    if (filters.ageMax) list = list.filter((p) => p.age <= +filters.ageMax);
    if (filters.caMin)  list = list.filter((p) => p.ca  >= +filters.caMin);
    if (filters.caMax)  list = list.filter((p) => p.ca  <= +filters.caMax);
    if (filters.paMin)  list = list.filter((p) => p.pa  >= +filters.paMin);
    if (filters.paMax)  list = list.filter((p) => p.pa  <= +filters.paMax);
    if (filters.valueMax) list = list.filter((p) => p.value <= +filters.valueMax);

    const key = sortKey as keyof Player;
    list = [...list].sort((a, b) => {
      const av = (a[key] as number) ?? 0;
      const bv = (b[key] as number) ?? 0;
      return sortDir === "desc" ? bv - av : av - bv;
    });

    return list;
  }, [dump, filters, sortKey, sortDir]);

  return (
    <Ctx.Provider value={{
      dump, loading, hiddenMode, filters, sortKey, sortDir, selectedId,
      setDump, setLoading, setHiddenMode, setFilter, resetFilters, setSort,
      setSelectedId, filteredPlayers,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => useContext(Ctx);
