// FM26 Official Role Definitions
// Source: FMScout FM26 Role System Guide (IP/OOP Overhaul)
// https://www.fmscout.com/a-football-manager-2026-player-roles.html

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
  positions: string[]; // ["GK"], ["DC"], ["DR", "DL"], ["WBR", "WBL"], ["DM"], ["MC"], ["AML", "AMR"], ["AMC"], ["ML", "MR"], ["ST"]
  key: Attribute[];       // Weight 2
  preferred: Attribute[]; // Weight 1
}

// ─────────────────────────────────────────────────────────────
// IN-POSSESSION (IP) ROLES — FM26
// ─────────────────────────────────────────────────────────────
export const IP_ROLES: Role[] = [
  // GOALKEEPERS
  {
    id: "ip_ball_playing_goalkeeper",
    name: "Ball-Playing Goalkeeper",
    phase: "IP",
    positions: ["GK"],
    key: ["Kicking", "Passing", "FirstTouch", "Composure"],
    preferred: ["Vision", "Throwing", "Decisions", "Agility"],
  },
  {
    id: "ip_sweeper_keeper",
    name: "Sweeper Keeper",
    phase: "IP",
    positions: ["GK"],
    key: ["Kicking", "Passing", "FirstTouch", "Decisions"],
    preferred: ["Handling", "Vision", "Composure", "Throwing"],
  },
  {
    id: "ip_goalkeeper",
    name: "Goalkeeper (Buildup)",
    phase: "IP",
    positions: ["GK"],
    key: ["Kicking", "Throwing", "Passing"],
    preferred: ["Handling", "FirstTouch", "Composure"],
  },

  // CENTRE-BACKS
  {
    id: "ip_advanced_cb",
    name: "Advanced Centre-Back",
    phase: "IP",
    positions: ["DC"],
    key: ["Passing", "FirstTouch", "Vision", "Composure", "Technique"],
    preferred: ["Dribbling", "Decisions", "Stamina", "Positioning"],
  },
  {
    id: "ip_overlapping_cb",
    name: "Overlapping Centre-Back",
    phase: "IP",
    positions: ["DC"],
    key: ["Crossing", "Dribbling", "Pace", "Stamina", "Passing"],
    preferred: ["Technique", "Acceleration", "FirstTouch", "WorkRate"],
  },
  {
    id: "ip_ball_playing_cb",
    name: "Ball-Playing Centre-Back",
    phase: "IP",
    positions: ["DC"],
    key: ["Passing", "FirstTouch", "Composure", "Technique"],
    preferred: ["Vision", "Decisions", "Anticipation", "Heading"],
  },
  {
    id: "ip_centre_back",
    name: "Centre-Back",
    phase: "IP",
    positions: ["DC"],
    key: ["Passing", "FirstTouch", "Composure"],
    preferred: ["Heading", "Decisions", "Positioning"],
  },
  {
    id: "ip_no_nonsense_cb",
    name: "No-Nonsense Centre-Back",
    phase: "IP",
    positions: ["DC"],
    key: ["Heading", "Strength", "Passing"],
    preferred: ["Bravery", "JumpingReach", "Composure"],
  },

  // FULL-BACKS & WING-BACKS
  {
    id: "ip_inside_fullback",
    name: "Inside Full-Back",
    phase: "IP",
    positions: ["DR", "DL"],
    key: ["Passing", "Positioning", "Composure", "FirstTouch"],
    preferred: ["Technique", "Decisions", "Anticipation", "Strength"],
  },
  {
    id: "ip_inverted_fullback",
    name: "Inverted Full-Back",
    phase: "IP",
    positions: ["DR", "DL"],
    key: ["Passing", "Technique", "FirstTouch", "Vision", "Composure"],
    preferred: ["Decisions", "Positioning", "Agility", "Anticipation"],
  },
  {
    id: "ip_fullback",
    name: "Full-Back",
    phase: "IP",
    positions: ["DR", "DL"],
    key: ["Crossing", "Passing", "Stamina", "FirstTouch"],
    preferred: ["Dribbling", "WorkRate", "Decisions", "Composure"],
  },
  {
    id: "ip_wingback",
    name: "Wing-Back",
    phase: "IP",
    positions: ["DR", "DL", "WBR", "WBL"],
    key: ["Crossing", "Stamina", "Acceleration", "Pace", "Dribbling"],
    preferred: ["Passing", "Technique", "WorkRate", "OffTheBall"],
  },
  {
    id: "ip_playmaking_wingback",
    name: "Playmaking Wing-Back",
    phase: "IP",
    positions: ["DR", "DL", "WBR", "WBL"],
    key: ["Crossing", "Passing", "Vision", "Technique", "Composure"],
    preferred: ["FirstTouch", "Dribbling", "Stamina", "Decisions", "Flair"],
  },
  {
    id: "ip_advanced_wingback",
    name: "Advanced Wing-Back",
    phase: "IP",
    positions: ["DR", "DL", "WBR", "WBL"],
    key: ["Crossing", "Acceleration", "Pace", "OffTheBall", "Stamina"],
    preferred: ["Dribbling", "Technique", "Agility", "FirstTouch"],
  },

  // DEFENSIVE MIDFIELDERS
  {
    id: "ip_deep_lying_playmaker",
    name: "Deep-Lying Playmaker",
    phase: "IP",
    positions: ["DM", "MC"],
    key: ["Passing", "Vision", "Composure", "Technique", "FirstTouch"],
    preferred: ["Decisions", "Anticipation", "Flair", "Teamwork"],
  },
  {
    id: "ip_halfback",
    name: "Half-Back",
    phase: "IP",
    positions: ["DM"],
    key: ["Passing", "Positioning", "Composure", "Decisions"],
    preferred: ["FirstTouch", "Anticipation", "Vision", "Tackling"],
  },
  {
    id: "ip_defensive_midfielder",
    name: "Defensive Midfielder",
    phase: "IP",
    positions: ["DM"],
    key: ["Passing", "Composure", "Decisions", "FirstTouch"],
    preferred: ["Positioning", "Anticipation", "WorkRate", "Teamwork"],
  },

  // CENTRAL MIDFIELDERS
  {
    id: "ip_midfield_playmaker",
    name: "Midfield Playmaker",
    phase: "IP",
    positions: ["MC"],
    key: ["Passing", "Vision", "Technique", "Composure", "Flair"],
    preferred: ["FirstTouch", "Decisions", "Anticipation", "OffTheBall"],
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
    id: "ip_box_to_box_midfielder",
    name: "Box-to-Box Midfielder",
    phase: "IP",
    positions: ["MC"],
    key: ["Stamina", "Passing", "OffTheBall", "WorkRate"],
    preferred: ["Dribbling", "FirstTouch", "Technique", "Finishing", "Composure"],
  },
  {
    id: "ip_channel_midfielder",
    name: "Channel Midfielder",
    phase: "IP",
    positions: ["MC", "AML", "AMR"],
    key: ["OffTheBall", "Dribbling", "Acceleration", "Passing"],
    preferred: ["Technique", "Vision", "Stamina", "Agility", "Composure"],
  },
  {
    id: "ip_central_midfielder",
    name: "Central Midfielder",
    phase: "IP",
    positions: ["MC"],
    key: ["Passing", "FirstTouch", "Decisions", "Stamina"],
    preferred: ["Vision", "Composure", "Technique", "OffTheBall"],
  },

  // ATTACKING MIDFIELDERS
  {
    id: "ip_free_role",
    name: "Free Role AM",
    phase: "IP",
    positions: ["AMC"],
    key: ["Passing", "Vision", "Flair", "Dribbling", "Composure"],
    preferred: ["Technique", "FirstTouch", "OffTheBall", "Decisions", "Agility"],
  },
  {
    id: "ip_second_striker",
    name: "Second Striker",
    phase: "IP",
    positions: ["AMC", "ST"],
    key: ["Finishing", "OffTheBall", "Composure", "Acceleration"],
    preferred: ["Passing", "FirstTouch", "Technique", "Decisions", "Agility"],
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

  // WINGERS & WIDE FORWARDS
  {
    id: "ip_inside_winger",
    name: "Inside Winger",
    phase: "IP",
    positions: ["AML", "AMR", "ML", "MR"],
    key: ["Dribbling", "Acceleration", "Pace", "Technique", "Crossing"],
    preferred: ["Agility", "Flair", "Vision", "OffTheBall", "Finishing"],
  },
  {
    id: "ip_half_space_winger",
    name: "Half-Space Winger",
    phase: "IP",
    positions: ["AML", "AMR"],
    key: ["Dribbling", "Passing", "OffTheBall", "Technique", "Acceleration"],
    preferred: ["Vision", "Finishing", "Composure", "Agility", "Flair"],
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
    id: "ip_wide_forward",
    name: "Wide Forward",
    phase: "IP",
    positions: ["AML", "AMR"],
    key: ["OffTheBall", "Finishing", "Dribbling", "Acceleration", "Pace"],
    preferred: ["Composure", "Technique", "Agility", "FirstTouch"],
  },
  {
    id: "ip_playmaking_winger",
    name: "Playmaking Winger",
    phase: "IP",
    positions: ["AML", "AMR", "ML", "MR"],
    key: ["Crossing", "Passing", "Vision", "Technique", "Composure"],
    preferred: ["FirstTouch", "Dribbling", "Decisions", "Flair"],
  },
  {
    id: "ip_winger",
    name: "Winger",
    phase: "IP",
    positions: ["AML", "AMR", "ML", "MR"],
    key: ["Crossing", "Acceleration", "Pace", "Dribbling"],
    preferred: ["Technique", "Agility", "OffTheBall", "FirstTouch"],
  },

  // STRIKERS
  {
    id: "ip_channel_forward",
    name: "Channel Forward",
    phase: "IP",
    positions: ["ST"],
    key: ["OffTheBall", "Acceleration", "Pace", "Dribbling", "Finishing"],
    preferred: ["Stamina", "Composure", "Agility", "FirstTouch"],
  },
  {
    id: "ip_half_space_forward",
    name: "Half-Space Forward",
    phase: "IP",
    positions: ["ST"],
    key: ["OffTheBall", "Finishing", "Dribbling", "Acceleration", "Technique"],
    preferred: ["Composure", "Agility", "Passing", "FirstTouch"],
  },
  {
    id: "ip_centre_forward",
    name: "Centre Forward",
    phase: "IP",
    positions: ["ST"],
    key: ["Finishing", "OffTheBall", "Composure", "FirstTouch"],
    preferred: ["Heading", "Strength", "Pace", "Decisions", "Technique"],
  },
  {
    id: "ip_poacher",
    name: "Poacher",
    phase: "IP",
    positions: ["ST"],
    key: ["Finishing", "Anticipation", "Composure", "OffTheBall"],
    preferred: ["Acceleration", "Agility", "Decisions", "FirstTouch"],
  },
  {
    id: "ip_target_forward",
    name: "Target Forward",
    phase: "IP",
    positions: ["ST"],
    key: ["Heading", "Strength", "Bravery", "JumpingReach"],
    preferred: ["Finishing", "Composure", "OffTheBall", "FirstTouch"],
  },
  {
    id: "ip_false_nine",
    name: "False Nine",
    phase: "IP",
    positions: ["ST"],
    key: ["Passing", "Dribbling", "Vision", "Composure", "Technique"],
    preferred: ["FirstTouch", "Flair", "Decisions", "OffTheBall"],
  },
  {
    id: "ip_deep_lying_forward",
    name: "Deep-Lying Forward",
    phase: "IP",
    positions: ["ST"],
    key: ["Passing", "FirstTouch", "Composure", "Technique", "Vision"],
    preferred: ["Decisions", "Dribbling", "OffTheBall", "Flair"],
  },
];

// ─────────────────────────────────────────────────────────────
// OUT-OF-POSSESSION (OOP) ROLES — FM26
// ─────────────────────────────────────────────────────────────
export const OOP_ROLES: Role[] = [
  // GOALKEEPERS
  {
    id: "oop_line_holding_keeper",
    name: "Line-Holding Keeper",
    phase: "OOP",
    positions: ["GK"],
    key: ["Reflexes", "Handling", "CommandOfArea", "Positioning"],
    preferred: ["AerialReach", "Concentration", "Anticipation", "Bravery"],
  },
  {
    id: "oop_no_nonsense_keeper",
    name: "No-Nonsense Goalkeeper",
    phase: "OOP",
    positions: ["GK"],
    key: ["Handling", "Reflexes", "OneOnOnes", "CommandOfArea"],
    preferred: ["AerialReach", "Concentration", "Bravery"],
  },
  {
    id: "oop_sweeper_keeper",
    name: "Sweeper Keeper (OOP)",
    phase: "OOP",
    positions: ["GK"],
    key: ["RushingOut", "OneOnOnes", "AerialReach", "Positioning", "Anticipation"],
    preferred: ["Concentration", "Reflexes", "Bravery", "Agility"],
  },

  // CENTRE-BACKS
  {
    id: "oop_centre_back",
    name: "Centre-Back (Defend)",
    phase: "OOP",
    positions: ["DC"],
    key: ["Marking", "Tackling", "Positioning", "Concentration"],
    preferred: ["Heading", "Strength", "Anticipation", "JumpingReach"],
  },
  {
    id: "oop_covering_cb",
    name: "Covering Centre-Back",
    phase: "OOP",
    positions: ["DC"],
    key: ["Anticipation", "Concentration", "Positioning", "Marking", "Pace"],
    preferred: ["Tackling", "Decisions", "Heading", "Acceleration"],
  },
  {
    id: "oop_stopping_cb",
    name: "Stopping Centre-Back",
    phase: "OOP",
    positions: ["DC"],
    key: ["Heading", "Strength", "Marking", "Tackling", "Bravery"],
    preferred: ["Positioning", "JumpingReach", "Aggression", "Concentration"],
  },
  {
    id: "oop_no_nonsense_cb",
    name: "No-Nonsense Centre-Back",
    phase: "OOP",
    positions: ["DC"],
    key: ["Heading", "Strength", "Tackling", "Marking", "Bravery"],
    preferred: ["JumpingReach", "Positioning", "Concentration"],
  },

  // FULL-BACKS & WING-BACKS
  {
    id: "oop_fullback",
    name: "Full-Back (Defend)",
    phase: "OOP",
    positions: ["DR", "DL"],
    key: ["Marking", "Tackling", "Positioning", "Concentration"],
    preferred: ["Stamina", "WorkRate", "Anticipation", "Pace"],
  },
  {
    id: "oop_holding_fullback",
    name: "Holding Full-Back",
    phase: "OOP",
    positions: ["DR", "DL"],
    key: ["Marking", "Tackling", "Positioning", "Concentration"],
    preferred: ["Anticipation", "Strength", "Stamina", "WorkRate"],
  },
  {
    id: "oop_pressing_fullback",
    name: "Pressing Full-Back",
    phase: "OOP",
    positions: ["DR", "DL"],
    key: ["WorkRate", "Stamina", "Tackling", "Aggression", "Pace"],
    preferred: ["Positioning", "Concentration", "Anticipation", "Marking"],
  },
  {
    id: "oop_holding_wingback",
    name: "Holding Wing-Back",
    phase: "OOP",
    positions: ["DR", "DL", "WBR", "WBL"],
    key: ["Positioning", "Tackling", "Marking", "Concentration", "Stamina"],
    preferred: ["WorkRate", "Anticipation", "Pace", "Strength"],
  },
  {
    id: "oop_inside_wingback",
    name: "Inside Wing-Back (OOP)",
    phase: "OOP",
    positions: ["DR", "DL", "WBR", "WBL"],
    key: ["Positioning", "Tackling", "Concentration", "Anticipation"],
    preferred: ["WorkRate", "Stamina", "Marking", "Agility"],
  },

  // DEFENSIVE MIDFIELDERS
  {
    id: "oop_dropping_dm",
    name: "Dropping DM",
    phase: "OOP",
    positions: ["DM"],
    key: ["Positioning", "Concentration", "Marking", "Tackling"],
    preferred: ["Anticipation", "Strength", "WorkRate", "Heading"],
  },
  {
    id: "oop_screening_dm",
    name: "Screening DM",
    phase: "OOP",
    positions: ["DM"],
    key: ["Positioning", "Anticipation", "Concentration", "Tackling"],
    preferred: ["Decisions", "Marking", "WorkRate", "Stamina"],
  },
  {
    id: "oop_pressing_dm",
    name: "Pressing DM",
    phase: "OOP",
    positions: ["DM"],
    key: ["WorkRate", "Stamina", "Tackling", "Aggression", "Anticipation"],
    preferred: ["Positioning", "Concentration", "Strength", "Bravery"],
  },
  {
    id: "oop_wide_covering_dm",
    name: "Wide Covering DM",
    phase: "OOP",
    positions: ["DM"],
    key: ["WorkRate", "Stamina", "Positioning", "Tackling", "Pace"],
    preferred: ["Marking", "Concentration", "Anticipation", "Agility"],
  },

  // CENTRAL MIDFIELDERS
  {
    id: "oop_pressing_cm",
    name: "Pressing CM",
    phase: "OOP",
    positions: ["MC"],
    key: ["WorkRate", "Stamina", "Aggression", "Tackling", "Anticipation"],
    preferred: ["Concentration", "Positioning", "Decisions", "Pace"],
  },
  {
    id: "oop_screening_cm",
    name: "Screening CM",
    phase: "OOP",
    positions: ["MC"],
    key: ["Positioning", "Concentration", "Tackling", "Decisions"],
    preferred: ["Anticipation", "WorkRate", "Stamina", "Marking"],
  },
  {
    id: "oop_wide_covering_cm",
    name: "Wide Covering CM",
    phase: "OOP",
    positions: ["MC"],
    key: ["WorkRate", "Stamina", "Positioning", "Tackling", "Marking"],
    preferred: ["Concentration", "Anticipation", "Pace", "Agility"],
  },

  // ATTACKING MIDFIELDERS
  {
    id: "oop_tracking_am",
    name: "Tracking AM",
    phase: "OOP",
    positions: ["AMC"],
    key: ["WorkRate", "Stamina", "Concentration", "Positioning"],
    preferred: ["Anticipation", "Tackling", "Decisions"],
  },
  {
    id: "oop_central_outlet_am",
    name: "Central Outlet AM",
    phase: "OOP",
    positions: ["AMC"],
    key: ["OffTheBall", "Anticipation", "Pace", "Composure"],
    preferred: ["Acceleration", "Decisions", "Vision"],
  },
  {
    id: "oop_splitting_outlet_am",
    name: "Splitting Outlet AM",
    phase: "OOP",
    positions: ["AMC"],
    key: ["OffTheBall", "Acceleration", "Flair", "Decisions"],
    preferred: ["Pace", "Composure", "Agility"],
  },

  // WINGERS & WIDE MIDFIELDERS
  {
    id: "oop_tracking_winger",
    name: "Tracking Winger",
    phase: "OOP",
    positions: ["AML", "AMR", "ML", "MR"],
    key: ["WorkRate", "Stamina", "Concentration", "Tackling"],
    preferred: ["Positioning", "Anticipation", "Pace"],
  },
  {
    id: "oop_wide_outlet_winger",
    name: "Wide Outlet Winger",
    phase: "OOP",
    positions: ["AML", "AMR", "ML", "MR"],
    key: ["Pace", "Acceleration", "OffTheBall", "Flair"],
    preferred: ["Crossing", "Dribbling", "Agility"],
  },
  {
    id: "oop_inside_outlet_winger",
    name: "Inside Outlet Winger",
    phase: "OOP",
    positions: ["AML", "AMR"],
    key: ["OffTheBall", "Acceleration", "Dribbling", "Anticipation"],
    preferred: ["Finishing", "Composure", "Agility"],
  },

  // STRIKERS
  {
    id: "oop_tracking_cf",
    name: "Tracking CF",
    phase: "OOP",
    positions: ["ST"],
    key: ["WorkRate", "Stamina", "Aggression", "Concentration"],
    preferred: ["Anticipation", "Decisions", "Bravery"],
  },
  {
    id: "oop_central_outlet_cf",
    name: "Central Outlet CF",
    phase: "OOP",
    positions: ["ST"],
    key: ["OffTheBall", "Acceleration", "Composure", "Finishing"],
    preferred: ["Pace", "Anticipation", "FirstTouch"],
  },
  {
    id: "oop_splitting_outlet_cf",
    name: "Splitting Outlet CF",
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
