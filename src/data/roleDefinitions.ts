// FM26 Role Definitions
// Extracted from FM26 engine metadata & tactical system:
// Tactics are split into In-Possession (IP) and Out-of-Possession (OOP) phases.

export type Attribute =
  | "Acceleration" | "Agility" | "Balance" | "JumpingReach" | "NaturalFitness"
  | "Pace" | "Stamina" | "Strength"
  | "Aggression" | "Anticipation" | "Bravery" | "Composure" | "Concentration"
  | "Decisions" | "Determination" | "Flair" | "Leadership" | "OffTheBall"
  | "Positioning" | "Teamwork" | "Vision" | "WorkRate"
  | "Corners" | "Crossing" | "Dribbling" | "Finishing" | "FirstTouch"
  | "FreeKicks" | "Heading" | "LongShots" | "LongThrows" | "Marking"
  | "Passing" | "PenaltyTaking" | "Tackling" | "Technique"
  | "Handling" | "AerialReach" | "CommandOfArea" | "Communication"
  | "Eccentricity" | "Kicking" | "OneOnOnes" | "Reflexes" | "RushingOut"
  | "Throwing" | "Punching";

export type RolePhase = "IP" | "OOP";

export interface Role {
  id: string;
  name: string;
  phase: RolePhase;
  positions: string[]; // e.g. ["GK"], ["DC"], ["DR", "DL"], ["DM", "MC"], ["AML", "AMR"], ["ST"]
  key: Attribute[];       // Weight 2
  preferred: Attribute[]; // Weight 1
}

// ─────────────────────────────────────────────────────────────
// IN-POSSESSION (IP) ROLES — FM26
// ─────────────────────────────────────────────────────────────
export const IP_ROLES: Role[] = [
  // GOALKEEPERS
  {
    id: "ip_distribution_keeper",
    name: "Distribution Goalkeeper",
    phase: "IP",
    positions: ["GK"],
    key: ["Kicking", "Throwing", "Passing", "Communication"],
    preferred: ["Handling", "FirstTouch", "Composure", "Decisions", "Vision"],
  },
  {
    id: "ip_sweeper_keeper",
    name: "Sweeper Keeper",
    phase: "IP",
    positions: ["GK"],
    key: ["Kicking", "Passing", "FirstTouch", "Composure", "Decisions"],
    preferred: ["Handling", "Vision", "Throwing", "Anticipation", "Agility"],
  },

  // CENTRAL DEFENDERS
  {
    id: "ip_central_defender",
    name: "Central Defender (Build-Up)",
    phase: "IP",
    positions: ["DC"],
    key: ["Passing", "FirstTouch", "Composure", "Decisions"],
    preferred: ["Positioning", "Technique", "Vision", "Heading"],
  },
  {
    id: "ip_ball_playing_defender",
    name: "Ball-Playing Defender",
    phase: "IP",
    positions: ["DC"],
    key: ["Passing", "FirstTouch", "Composure", "Technique", "Vision"],
    preferred: ["Decisions", "Dribbling", "Anticipation", "Positioning"],
  },
  {
    id: "ip_wide_centreback",
    name: "Wide Centre-Back",
    phase: "IP",
    positions: ["DC"],
    key: ["Crossing", "Dribbling", "Passing", "Stamina", "Acceleration"],
    preferred: ["Technique", "Agility", "FirstTouch", "Vision", "Composure"],
  },
  {
    id: "ip_libero",
    name: "Libero",
    phase: "IP",
    positions: ["DC"],
    key: ["Passing", "Dribbling", "Vision", "FirstTouch", "Technique"],
    preferred: ["Composure", "Decisions", "Flair", "Anticipation"],
  },

  // FULL-BACKS & WING-BACKS
  {
    id: "ip_fullback",
    name: "Full-Back",
    phase: "IP",
    positions: ["DR", "DL"],
    key: ["Passing", "Crossing", "FirstTouch", "Stamina"],
    preferred: ["Composure", "Decisions", "Dribbling", "WorkRate"],
  },
  {
    id: "ip_inverted_fullback",
    name: "Inverted Full-Back",
    phase: "IP",
    positions: ["DR", "DL"],
    key: ["Passing", "Technique", "FirstTouch", "Vision", "Composure"],
    preferred: ["Decisions", "Positioning", "Anticipation", "Agility"],
  },
  {
    id: "ip_wingback",
    name: "Wing-Back",
    phase: "IP",
    positions: ["DR", "DL", "WBR", "WBL"],
    key: ["Crossing", "Stamina", "Acceleration", "Pace", "Dribbling"],
    preferred: ["Passing", "Technique", "Agility", "WorkRate", "OffTheBall"],
  },
  {
    id: "ip_inverted_wingback",
    name: "Inverted Wing-Back",
    phase: "IP",
    positions: ["DR", "DL", "WBR", "WBL"],
    key: ["Passing", "Vision", "Composure", "FirstTouch", "Technique"],
    preferred: ["Dribbling", "Decisions", "Agility", "Stamina", "OffTheBall"],
  },

  // MIDFIELDERS
  {
    id: "ip_defensive_midfielder",
    name: "Defensive Midfielder (Holding)",
    phase: "IP",
    positions: ["DM"],
    key: ["Passing", "Composure", "Positioning", "Decisions"],
    preferred: ["FirstTouch", "Vision", "Anticipation", "Teamwork"],
  },
  {
    id: "ip_deep_lying_playmaker",
    name: "Deep-Lying Playmaker",
    phase: "IP",
    positions: ["DM", "MC"],
    key: ["Passing", "Vision", "Composure", "Technique", "FirstTouch"],
    preferred: ["Decisions", "Anticipation", "Flair", "Teamwork"],
  },
  {
    id: "ip_midfield_playmaker",
    name: "Midfield Playmaker",
    phase: "IP",
    positions: ["DM", "MC"],
    key: ["Passing", "Vision", "Technique", "Composure", "Flair"],
    preferred: ["FirstTouch", "Decisions", "Anticipation", "OffTheBall"],
  },
  {
    id: "ip_central_midfielder",
    name: "Central Midfielder",
    phase: "IP",
    positions: ["MC"],
    key: ["Passing", "FirstTouch", "Decisions", "Stamina"],
    preferred: ["Vision", "Composure", "Technique", "OffTheBall", "WorkRate"],
  },
  {
    id: "ip_box_to_box_midfielder",
    name: "Box-to-Box Midfielder",
    phase: "IP",
    positions: ["MC"],
    key: ["Stamina", "Passing", "OffTheBall", "WorkRate"],
    preferred: ["Dribbling", "FirstTouch", "Technique", "Finishing", "Composure"],
  },
  {
    id: "ip_box_to_box_playmaker",
    name: "Box-to-Box Playmaker",
    phase: "IP",
    positions: ["MC"],
    key: ["Passing", "Vision", "OffTheBall", "Stamina", "Technique"],
    preferred: ["Dribbling", "Composure", "Decisions", "FirstTouch", "Agility"],
  },
  {
    id: "ip_ball_winning_midfielder",
    name: "Ball-Winning Midfielder",
    phase: "IP",
    positions: ["DM", "MC"],
    key: ["Tackling", "WorkRate", "Stamina", "Passing"],
    preferred: ["Aggression", "Anticipation", "Strength", "Decisions"],
  },
  {
    id: "ip_wide_central_midfielder",
    name: "Wide Central Midfielder",
    phase: "IP",
    positions: ["MC", "ML", "MR"],
    key: ["Passing", "Crossing", "Stamina", "OffTheBall"],
    preferred: ["FirstTouch", "Technique", "Decisions", "WorkRate"],
  },
  {
    id: "ip_channel_midfielder",
    name: "Channel Midfielder",
    phase: "IP",
    positions: ["MC", "AML", "AMR"],
    key: ["OffTheBall", "Dribbling", "Acceleration", "Passing"],
    preferred: ["Technique", "Vision", "Stamina", "Agility", "Composure"],
  },

  // WINGERS & ATTACKING MIDFIELDERS
  {
    id: "ip_wide_midfielder",
    name: "Wide Midfielder",
    phase: "IP",
    positions: ["ML", "MR"],
    key: ["Crossing", "Passing", "Stamina", "WorkRate"],
    preferred: ["FirstTouch", "Technique", "Decisions", "OffTheBall"],
  },
  {
    id: "ip_winger",
    name: "Winger",
    phase: "IP",
    positions: ["AML", "AMR", "ML", "MR"],
    key: ["Crossing", "Acceleration", "Pace", "Dribbling"],
    preferred: ["Technique", "Agility", "OffTheBall", "FirstTouch"],
  },
  {
    id: "ip_inside_forward",
    name: "Inside Forward",
    phase: "IP",
    positions: ["AML", "AMR"],
    key: ["Dribbling", "Finishing", "OffTheBall", "Acceleration"],
    preferred: ["Agility", "Technique", "Flair", "Composure", "LongShots"],
  },
  {
    id: "ip_inverted_winger",
    name: "Inverted Winger",
    phase: "IP",
    positions: ["AML", "AMR", "ML", "MR"],
    key: ["Dribbling", "Acceleration", "Pace", "Technique"],
    preferred: ["Agility", "Flair", "Crossing", "Vision", "OffTheBall"],
  },
  {
    id: "ip_defensive_winger",
    name: "Defensive Winger",
    phase: "IP",
    positions: ["AML", "AMR", "ML", "MR"],
    key: ["Crossing", "Stamina", "WorkRate", "Passing"],
    preferred: ["Pace", "Dribbling", "Acceleration", "Decisions"],
  },
  {
    id: "ip_wide_playmaker",
    name: "Wide Playmaker",
    phase: "IP",
    positions: ["AML", "AMR", "ML", "MR"],
    key: ["Passing", "Vision", "Composure", "FirstTouch", "Technique"],
    preferred: ["Flair", "Decisions", "OffTheBall", "Agility"],
  },
  {
    id: "ip_attacking_midfielder",
    name: "Attacking Midfielder",
    phase: "IP",
    positions: ["AMC"],
    key: ["Passing", "Dribbling", "OffTheBall", "Technique"],
    preferred: ["Vision", "Composure", "Flair", "FirstTouch", "Finishing"],
  },
  {
    id: "ip_advanced_playmaker",
    name: "Advanced Playmaker",
    phase: "IP",
    positions: ["AMC"],
    key: ["Passing", "Vision", "Composure", "Flair", "Technique"],
    preferred: ["Decisions", "FirstTouch", "Dribbling", "Anticipation", "OffTheBall"],
  },
  {
    id: "ip_shadow_striker",
    name: "Shadow Striker",
    phase: "IP",
    positions: ["AMC"],
    key: ["OffTheBall", "Finishing", "Anticipation", "Composure"],
    preferred: ["Agility", "Acceleration", "Decisions", "Dribbling", "Technique"],
  },
  {
    id: "ip_wide_forward",
    name: "Wide Forward",
    phase: "IP",
    positions: ["AML", "AMR"],
    key: ["OffTheBall", "Finishing", "Dribbling", "Acceleration", "Pace"],
    preferred: ["Composure", "Technique", "Agility", "FirstTouch"],
  },

  // STRIKERS
  {
    id: "ip_centre_forward",
    name: "Centre Forward",
    phase: "IP",
    positions: ["ST"],
    key: ["Finishing", "OffTheBall", "Composure", "FirstTouch"],
    preferred: ["Heading", "Strength", "Pace", "Decisions", "Technique"],
  },
  {
    id: "ip_advanced_forward",
    name: "Advanced Forward",
    phase: "IP",
    positions: ["ST"],
    key: ["Finishing", "OffTheBall", "Composure", "Acceleration", "Pace"],
    preferred: ["Dribbling", "Technique", "Agility", "FirstTouch"],
  },
  {
    id: "ip_channel_forward",
    name: "Channel Forward",
    phase: "IP",
    positions: ["ST"],
    key: ["OffTheBall", "Acceleration", "Pace", "Dribbling", "Finishing"],
    preferred: ["Stamina", "Composure", "Agility", "FirstTouch"],
  },
  {
    id: "ip_deep_lying_forward",
    name: "Deep-Lying Forward",
    phase: "IP",
    positions: ["ST"],
    key: ["Passing", "FirstTouch", "Composure", "Technique", "Vision"],
    preferred: ["Decisions", "Dribbling", "OffTheBall", "Flair"],
  },
  {
    id: "ip_complete_forward",
    name: "Complete Forward",
    phase: "IP",
    positions: ["ST"],
    key: ["Finishing", "Heading", "OffTheBall", "Dribbling", "Passing", "Strength"],
    preferred: ["Composure", "FirstTouch", "Technique", "Pace", "Agility"],
  },
];

// ─────────────────────────────────────────────────────────────
// OUT-OF-POSSESSION (OOP) ROLES — FM26
// ─────────────────────────────────────────────────────────────
export const OOP_ROLES: Role[] = [
  // GOALKEEPERS
  {
    id: "oop_sweeper_keeper",
    name: "Sweeper Keeper (OOP)",
    phase: "OOP",
    positions: ["GK"],
    key: ["RushingOut", "OneOnOnes", "AerialReach", "Positioning", "Anticipation"],
    preferred: ["Concentration", "Reflexes", "Bravery", "Agility"],
  },
  {
    id: "oop_line_keeper",
    name: "Line Keeper (OOP)",
    phase: "OOP",
    positions: ["GK"],
    key: ["Reflexes", "Handling", "CommandOfArea", "Positioning"],
    preferred: ["AerialReach", "Concentration", "Anticipation", "Bravery"],
  },

  // CENTRAL DEFENDERS
  {
    id: "oop_covering_centreback",
    name: "Covering Centre-Back (OOP)",
    phase: "OOP",
    positions: ["DC"],
    key: ["Anticipation", "Concentration", "Positioning", "Marking", "Pace"],
    preferred: ["Tackling", "Decisions", "Heading", "Acceleration"],
  },
  {
    id: "oop_stopping_centreback",
    name: "Stopping Centre-Back (OOP)",
    phase: "OOP",
    positions: ["DC"],
    key: ["Heading", "Strength", "Marking", "Tackling", "Bravery"],
    preferred: ["Positioning", "JumpingReach", "Aggression", "Concentration"],
  },
  {
    id: "oop_covering_wide_centreback",
    name: "Covering Wide Centre-Back (OOP)",
    phase: "OOP",
    positions: ["DC"],
    key: ["Positioning", "Anticipation", "Tackling", "Marking", "Pace"],
    preferred: ["Stamina", "Decisions", "Concentration", "Acceleration"],
  },
  {
    id: "oop_stopping_wide_centreback",
    name: "Stopping Wide Centre-Back (OOP)",
    phase: "OOP",
    positions: ["DC"],
    key: ["Tackling", "Marking", "Aggression", "Bravery", "Strength"],
    preferred: ["Heading", "JumpingReach", "Positioning", "Stamina"],
  },

  // FULL-BACKS & WING-BACKS
  {
    id: "oop_holding_fullback",
    name: "Holding Full-Back (OOP)",
    phase: "OOP",
    positions: ["DR", "DL"],
    key: ["Marking", "Tackling", "Positioning", "Concentration"],
    preferred: ["Anticipation", "Strength", "Stamina", "WorkRate"],
  },
  {
    id: "oop_pressing_fullback",
    name: "Pressing Full-Back (OOP)",
    phase: "OOP",
    positions: ["DR", "DL"],
    key: ["WorkRate", "Stamina", "Tackling", "Aggression", "Pace"],
    preferred: ["Positioning", "Concentration", "Anticipation", "Marking"],
  },
  {
    id: "oop_holding_wingback",
    name: "Holding Wing-Back (OOP)",
    phase: "OOP",
    positions: ["DR", "DL", "WBR", "WBL"],
    key: ["Positioning", "Tackling", "Marking", "Concentration", "Stamina"],
    preferred: ["WorkRate", "Anticipation", "Pace", "Strength"],
  },
  {
    id: "oop_pressing_wingback",
    name: "Pressing Wing-Back (OOP)",
    phase: "OOP",
    positions: ["DR", "DL", "WBR", "WBL"],
    key: ["WorkRate", "Stamina", "Tackling", "Marking", "Acceleration"],
    preferred: ["Positioning", "Concentration", "Anticipation", "Pace"],
  },

  // MIDFIELDERS
  {
    id: "oop_dropping_defensive_midfielder",
    name: "Dropping Defensive Midfielder (OOP)",
    phase: "OOP",
    positions: ["DM"],
    key: ["Positioning", "Concentration", "Marking", "Tackling"],
    preferred: ["Anticipation", "Strength", "WorkRate", "Heading"],
  },
  {
    id: "oop_screening_defensive_midfielder",
    name: "Screening Defensive Midfielder (OOP)",
    phase: "OOP",
    positions: ["DM"],
    key: ["Positioning", "Anticipation", "Concentration", "Tackling"],
    preferred: ["Decisions", "Marking", "WorkRate", "Stamina"],
  },
  {
    id: "oop_pressing_defensive_midfielder",
    name: "Pressing Defensive Midfielder (OOP)",
    phase: "OOP",
    positions: ["DM"],
    key: ["WorkRate", "Stamina", "Tackling", "Aggression", "Anticipation"],
    preferred: ["Positioning", "Concentration", "Strength", "Bravery"],
  },
  {
    id: "oop_wide_cover_defensive_midfielder",
    name: "Wide-Cover Defensive Midfielder (OOP)",
    phase: "OOP",
    positions: ["DM"],
    key: ["WorkRate", "Stamina", "Positioning", "Tackling", "Pace"],
    preferred: ["Marking", "Concentration", "Anticipation", "Agility"],
  },
  {
    id: "oop_pressing_central_midfielder",
    name: "Pressing Central Midfielder (OOP)",
    phase: "OOP",
    positions: ["MC"],
    key: ["WorkRate", "Stamina", "Aggression", "Tackling", "Anticipation"],
    preferred: ["Concentration", "Positioning", "Decisions", "Pace"],
  },
  {
    id: "oop_screening_central_midfielder",
    name: "Screening Central Midfielder (OOP)",
    phase: "OOP",
    positions: ["MC"],
    key: ["Positioning", "Concentration", "Tackling", "Decisions"],
    preferred: ["Anticipation", "WorkRate", "Stamina", "Marking"],
  },
  {
    id: "oop_wide_cover_central_midfielder",
    name: "Wide-Cover Central Midfielder (OOP)",
    phase: "OOP",
    positions: ["MC"],
    key: ["WorkRate", "Stamina", "Positioning", "Tackling", "Marking"],
    preferred: ["Concentration", "Anticipation", "Pace", "Agility"],
  },

  // WINGERS & ATTACKING MIDFIELDERS
  {
    id: "oop_tracking_attacking_midfielder",
    name: "Tracking Attacking Midfielder (OOP)",
    phase: "OOP",
    positions: ["AMC"],
    key: ["WorkRate", "Stamina", "Concentration", "Positioning"],
    preferred: ["Anticipation", "Tackling", "Decisions"],
  },
  {
    id: "oop_central_outlet_midfielder",
    name: "Central Outlet Midfielder (OOP)",
    phase: "OOP",
    positions: ["AMC"],
    key: ["OffTheBall", "Anticipation", "Pace", "Composure"],
    preferred: ["Acceleration", "Decisions", "Vision"],
  },
  {
    id: "oop_splitting_outlet_midfielder",
    name: "Splitting Outlet Midfielder (OOP)",
    phase: "OOP",
    positions: ["AMC"],
    key: ["OffTheBall", "Acceleration", "Flair", "Decisions"],
    preferred: ["Pace", "Composure", "Agility"],
  },
  {
    id: "oop_tracking_wide_midfielder",
    name: "Tracking Wide Midfielder (OOP)",
    phase: "OOP",
    positions: ["ML", "MR"],
    key: ["WorkRate", "Stamina", "Marking", "Concentration"],
    preferred: ["Tackling", "Positioning", "Anticipation"],
  },
  {
    id: "oop_wide_outlet_midfielder",
    name: "Wide Outlet Midfielder (OOP)",
    phase: "OOP",
    positions: ["ML", "MR"],
    key: ["Pace", "Acceleration", "OffTheBall", "Flair"],
    preferred: ["Dribbling", "Crossing", "Agility"],
  },
  {
    id: "oop_tracking_winger",
    name: "Tracking Winger (OOP)",
    phase: "OOP",
    positions: ["AML", "AMR"],
    key: ["WorkRate", "Stamina", "Concentration", "Tackling"],
    preferred: ["Positioning", "Anticipation", "Pace"],
  },
  {
    id: "oop_inverting_outlet_winger",
    name: "Inverting Outlet Winger (OOP)",
    phase: "OOP",
    positions: ["AML", "AMR"],
    key: ["OffTheBall", "Acceleration", "Dribbling", "Anticipation"],
    preferred: ["Finishing", "Composure", "Agility"],
  },
  {
    id: "oop_wide_outlet_winger",
    name: "Wide Outlet Winger (OOP)",
    phase: "OOP",
    positions: ["AML", "AMR"],
    key: ["Pace", "Acceleration", "OffTheBall", "Flair"],
    preferred: ["Crossing", "Dribbling", "Agility"],
  },

  // STRIKERS
  {
    id: "oop_tracking_centre_forward",
    name: "Pressing Centre Forward (OOP)",
    phase: "OOP",
    positions: ["ST"],
    key: ["WorkRate", "Stamina", "Aggression", "Concentration"],
    preferred: ["Anticipation", "Decisions", "Bravery"],
  },
  {
    id: "oop_central_outlet_forward",
    name: "Central Outlet Forward (OOP)",
    phase: "OOP",
    positions: ["ST"],
    key: ["OffTheBall", "Acceleration", "Composure", "Finishing"],
    preferred: ["Pace", "Anticipation", "FirstTouch"],
  },
  {
    id: "oop_splitting_outlet_forward",
    name: "Splitting Outlet Forward (OOP)",
    phase: "OOP",
    positions: ["ST"],
    key: ["OffTheBall", "Acceleration", "Pace", "Agility"],
    preferred: ["Dribbling", "Composure", "Finishing"],
  },
];

// ─────────────────────────────────────────────────────────────
// EXPORTS & HELPERS
// ─────────────────────────────────────────────────────────────
export const ALL_ROLES: Role[] = [...IP_ROLES, ...OOP_ROLES];

export const ROLE_BY_ID = Object.fromEntries(ALL_ROLES.map((r) => [r.id, r]));

export function getRolesForPosition(pos?: string, phase?: RolePhase | "ALL"): Role[] {
  let roles = ALL_ROLES;
  if (phase && phase !== "ALL") {
    roles = roles.filter((r) => r.phase === phase);
  }
  if (!pos) return roles;

  const clean = pos.trim().toUpperCase();
  return roles.filter((role) =>
    role.positions.some((rp) => rp === clean || clean.startsWith(rp) || rp.startsWith(clean))
  );
}
