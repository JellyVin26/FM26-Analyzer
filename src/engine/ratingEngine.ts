import { ALL_ROLES, IP_ROLES, OOP_ROLES, ROLE_BY_ID, type Attribute } from "../data/roleDefinitions";
import type { Player, PlayerAttrs, RoleScore } from "../data/types";

function getAttr(attrs: PlayerAttrs, name: Attribute): number {
  return (attrs as unknown as Record<string, number>)[name] ?? 0;
}

function scoreRoleWeights(attrs: PlayerAttrs, key: Attribute[], preferred: Attribute[]): number {
  if (key.length === 0 && preferred.length === 0) return 0;
  const maxScore = key.length * 2 * 20 + preferred.length * 1 * 20;
  if (maxScore === 0) return 0;

  let raw = 0;
  for (const attr of key)       raw += getAttr(attrs, attr) * 2;
  for (const attr of preferred)  raw += getAttr(attrs, attr) * 1;

  return Math.round((raw / maxScore) * 100);
}

/** Score a player for a specific single role by ID. */
export function scoreSingleRole(player: Player, roleId: string): RoleScore | null {
  const role = ROLE_BY_ID[roleId] || ALL_ROLES.find((r) => r.id === roleId || r.name === roleId);
  if (!role) return null;
  const score = scoreRoleWeights(player.attrs, role.key, role.preferred);
  return {
    roleId: role.id,
    roleName: role.name,
    ipScore: role.phase === "IP" ? score : 0,
    oopScore: role.phase === "OOP" ? score : 0,
  };
}

/** Top N In-Possession (IP) roles for a player. */
export function topIpRoles(player: Player, limit = 5): RoleScore[] {
  const list: RoleScore[] = [];
  for (const role of IP_ROLES) {
    const applies = role.positions.some((rp) =>
      player.posArr ? player.posArr.some((pp) => pp === rp || pp.startsWith(rp)) : (player.pos && player.pos.includes(rp))
    );
    if (!applies) continue;
    const score = scoreRoleWeights(player.attrs, role.key, role.preferred);
    list.push({ roleId: role.id, roleName: role.name, ipScore: score, oopScore: 0 });
  }
  return list.sort((a, b) => b.ipScore - a.ipScore).slice(0, limit);
}

/** Top N Out-of-Possession (OOP) roles for a player. */
export function topOopRoles(player: Player, limit = 5): RoleScore[] {
  const list: RoleScore[] = [];
  for (const role of OOP_ROLES) {
    const applies = role.positions.some((rp) =>
      player.posArr ? player.posArr.some((pp) => pp === rp || pp.startsWith(rp)) : (player.pos && player.pos.includes(rp))
    );
    if (!applies) continue;
    const score = scoreRoleWeights(player.attrs, role.key, role.preferred);
    list.push({ roleId: role.id, roleName: role.name, ipScore: 0, oopScore: score });
  }
  return list.sort((a, b) => b.oopScore - a.oopScore).slice(0, limit);
}

/** Score all applicable roles for a player and return best IP and best OOP role. */
export function scorePlayer(player: Player): RoleScore[] {
  const topIP = topIpRoles(player, 1)[0];
  const topOOP = topOopRoles(player, 1)[0];
  const res: RoleScore[] = [];
  if (topIP) res.push(topIP);
  if (topOOP) res.push(topOOP);
  return res;
}
