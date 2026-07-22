import { useCallback, useState } from "react";
import { useApp } from "../context/AppContext";
import type { Dump } from "../data/types";

const DUMP_PATH_KEY = "fm26scout_dump_path";

export function useLoadDump() {
  const { setDump, setLoading } = useApp();
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const text = await file.text();
      const data: Dump = JSON.parse(text);
      if (!data.players || !Array.isArray(data.players)) {
        throw new Error("Not a valid FM Analyzer data.json — no players array found.");
      }
      setDump(data);
      localStorage.setItem(DUMP_PATH_KEY, file.name);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to parse file.");
    } finally {
      setLoading(false);
    }
  }, [setDump, setLoading]);

  const loadFromAutoDump = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/dump?t=${Date.now()}`, {
        cache: "no-store"
      });
      if (!res.ok) {
        throw new Error("No local FM26 dump found at AppData/Local/FM Analyzer/dump.json");
      }
      const data: Dump = await res.json();
      if (!data.players || !Array.isArray(data.players)) {
        throw new Error("Not a valid FM Analyzer data.json.");
      }
      setDump(data);
      localStorage.setItem(DUMP_PATH_KEY, "auto_dump.json");
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load local dump.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [setDump, setLoading]);

  const syncLiveSave = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/sync?t=${Date.now()}`, {
        cache: "no-store"
      });
      if (!res.ok) {
        if (res.status === 504) {
          throw new Error("Timeout waiting for game data. Is FM26 running?");
        }
        throw new Error("Failed to trigger live sync.");
      }
      const data: Dump = await res.json();
      if (!data.players || !Array.isArray(data.players)) {
        throw new Error("Not a valid FM Analyzer data.json.");
      }
      setDump(data);
      localStorage.setItem(DUMP_PATH_KEY, "live_sync.json");
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Live sync failed.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [setDump, setLoading]);

  return { loadFile, loadFromAutoDump, syncLiveSave, error };
}
