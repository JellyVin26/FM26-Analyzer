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
        throw new Error("Not a valid FMSuperScout dump.json — no players array found.");
      }
      setDump(data);
      localStorage.setItem(DUMP_PATH_KEY, file.name);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to parse file.");
    } finally {
      setLoading(false);
    }
  }, [setDump, setLoading]);

  return { loadFile, error };
}
