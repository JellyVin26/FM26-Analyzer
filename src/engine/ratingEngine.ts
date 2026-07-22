// FM26 Role Rating Engine
// Formula: key × 2, preferred × 1 — normalized to 0–100
// Each player gets independent IP and OOP scores per role.

import { ALL_ROLES, type Attribute } from "../data/roleDefinitions";
import type { Player, PlayerAttrs, RoleScore } from "../data/types";

function getAttr(attrs: PlayerAttrs, name: Attribute): number {
  return (attrs as unknown as Record<string, number>)[name] ?? 0;
}

function scoreWeights(attrs: PlayerAttrs, key: Attribute[], preferred: Attribute[]): number {
  if (key.length === 0 && preferred.length === 0) return 0;

  const maxScore = key.length * 2 * 20 + preferred.length * 1 * 20;
  if (maxScore === 0) return 0;

  let raw = 0;
  for (const attr of key)       raw += getAttr(attrs, attr) * 2;
  for (const attr of preferred)  raw += getAttr(attrs, attr) * 1;

  return Math.round((raw / maxScore) * 100);
}

/** Returns applicable role scores for a player based on their posArr. */
export function scorePlayer(player: Player): RoleScore[] {
  const results: RoleScore[] = [];

  for (const role of ALL_ROLES) {
    // Only score roles applicable to at least one of the player's positions
    const applies = role.positions.some((rp) =>
      player.posArr.some((pp) => pp === rp || pp.startsWith(rp))
    );
    if (!applies) continue;

    const ipScore  = scoreWeights(player.attrs, role.ip.key,  role.ip.preferred);
    const oopScore = scoreWeights(player.attrs, role.oop.key, role.oop.preferred);

    results.push({ roleId: role.id, roleName: role.name, ipScore, oopScore });
  }

  return results.sort((a, b) => b.ipScore - a.ipScore);
}

/** Score a single player against all roles (for the comparison view). */
export function scoreAllRoles(player: Player): RoleScore[] {
  return ALL_ROLES.map((role) => ({
    roleId:   role.id,
    roleName: role.name,
    ipScore:  scoreWeights(player.attrs, role.ip.key,  role.ip.preferred),
    oopScore: scoreWeights(player.attrs, role.oop.key, role.oop.preferred),
  }));
}

/** Top N roles for a player (by IP score, for summary cards). */
export function topRoles(player: Player, n = 3): RoleScore[] {
  return scorePlayer(player).slice(0, n);
}
