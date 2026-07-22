import type { Player } from "../data/types";

/**
 * Calculates a player's raw market value for sorting purposes.
 * If Football Manager has marked the player as "Not for Sale" (value === null), returns 0.
 */
export function getPlayerValue(p: Player): number {
  if (p.value && p.value > 0) return p.value;
  if (p.askingPrice && p.askingPrice > 0) return p.askingPrice;
  return 0;
}

/**
 * Formats a player's market value into human-readable currency (e.g. £45.0M).
 * If the value is null in the game's memory, displays "Not for Sale".
 */
export function formatPlayerValue(p: Player): string {
  if (!p.club || p.club === "Free Agent") {
    return "Free Agent";
  }

  const val = getPlayerValue(p);
  if (val === 0) {
    return "Not for Sale";
  }

  if (val >= 1_000_000) return `£${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `£${(val / 1_000).toFixed(0)}K`;
  return `£${val}`;
}
