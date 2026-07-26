import type { Player } from "../data/types";

/**
 * Calculates a synthetic Interest Score (0-100) representing how likely 
 * the player is to join the user's club.
 * 
 * @param player The player to evaluate
 * @param myRep The reputation of the user's club
 * @returns A score from 0 to 100
 */
export function calculateInterest(player: Player, myRep: number): number {
  if (!player.club) return 100; // Free agents are highly interested
  if (player.notForSale) return 10;
  if (player.setForRelease) return 90;
  if (player.listed) return 80;

  // Base interest driven by reputation difference
  // FM rep is 0-10000. A difference of 1000 is significant (e.g. 1 tier).
  const repDiff = myRep - player.clubRep;
  let interest = 50 + (repDiff / 100);

  // Ambition makes them want to go to bigger clubs
  if (repDiff > 0) {
    interest += (player.ambition || 10) * 1; 
  } else {
    // If we are a smaller club, high ambition makes them LESS likely to join
    interest -= (player.ambition || 10) * 1.5;
  }

  // Loyalty makes them want to stay at their current club
  interest -= (player.loyalty || 10) * 1;

  // Clamp 0-100
  return Math.max(0, Math.min(100, Math.round(interest)));
}
