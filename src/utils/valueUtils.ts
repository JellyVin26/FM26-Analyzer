import type { Player } from "../data/types";

/**
 * Calculates a player's market value.
 * If Football Manager has marked the player as "Not for Sale" or priceless in memory (value === null),
 * reverse-derives their estimated market value based on CA, Age, and Club Reputation.
 */
export function getPlayerValue(p: Player): number {
  if (p.value && p.value > 0) return p.value;
  if (p.askingPrice && p.askingPrice > 0) return p.askingPrice;
  if (!p.club || p.club === "Free Agent") return 0;

  const ca = p.ca || 100;
  const age = p.age || 25;
  const clubRep = p.clubRep || 5000;

  const base = Math.pow(ca / 200, 4) * 200_000_000;
  const repMultiplier = Math.pow(clubRep / 10000, 1.5);
  const ageMultiplier = age < 24 ? 1.3 : age < 29 ? 1.0 : age < 32 ? 0.7 : 0.4;

  return Math.round(base * repMultiplier * ageMultiplier);
}

/**
 * Formats a player's market value into human-readable currency (e.g. £131.0M (Est) or £45.0M).
 */
export function formatPlayerValue(p: Player): string {
  const val = getPlayerValue(p);

  if (val === 0) return "Free Agent";

  let formatted = "";
  if (val >= 1_000_000)     formatted = `£${(val / 1_000_000).toFixed(1)}M`;
  else if (val >= 1_000) formatted = `£${(val / 1_000).toFixed(0)}K`;
  else formatted = `£${val}`;

  // If memory value was null/0 for a contracted player, tag as estimated / priceless
  if (!p.value || p.value === 0) {
    return `~${formatted} (Est)`;
  }

  return formatted;
}
