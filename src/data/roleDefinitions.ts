// FM26 Role Definitions
// Source: FM26 in-game UI role attribute highlights (key=green, preferred=blue)
// Formula: key × 2, preferred × 1 — averaged over total weight sum → 0–100 score
// IP and OOP roles are scored independently per player.

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

export type Phase = "IP" | "OOP";

export interface RoleWeights {
  key: Attribute[];       // green in UI — weight 2
  preferred: Attribute[]; // blue in UI  — weight 1
}

export interface Role {
  id: string;
  name: string;
  positions: string[];   // posArr values this role applies to
  ip: RoleWeights;
  oop: RoleWeights;
}

// ─────────────────────────────────────────────────────────────
// GOALKEEPERS
// ─────────────────────────────────────────────────────────────
const GK_ROLES: Role[] = [
  {
    id: "sweeper_keeper_ip",
    name: "Sweeper Keeper",
    positions: ["GK"],
    ip: {
      key:       ["Kicking", "Reflexes", "Composure", "Decisions"],
      preferred: ["Handling", "Communication", "FirstTouch", "Passing", "Anticipation"],
    },
    oop: {
      key:       ["AerialReach", "CommandOfArea", "Positioning", "RushingOut"],
      preferred: ["Anticipation", "Concentration", "Reflexes", "Bravery", "OneOnOnes"],
    },
  },
  {
    id: "distribution_goalkeeper",
    name: "Distribution Goalkeeper",
    positions: ["GK"],
    ip: {
      key:       ["Kicking", "Throwing", "Passing", "Communication"],
      preferred: ["Handling", "FirstTouch", "Composure", "Decisions", "Vision"],
    },
    oop: {
      key:       ["Reflexes", "Handling", "OneOnOnes", "Positioning"],
      preferred: ["AerialReach", "CommandOfArea", "Concentration", "Anticipation"],
    },
  },
  {
    id: "line_holding_goalkeeper",
    name: "Line-Holding Goalkeeper",
    positions: ["GK"],
    ip: {
      key:       ["Handling", "Kicking", "Communication"],
      preferred: ["Composure", "Decisions", "Reflexes", "Throwing"],
    },
    oop: {
      key:       ["Reflexes", "OneOnOnes", "Positioning", "Concentration"],
      preferred: ["AerialReach", "CommandOfArea", "Anticipation", "Bravery"],
    },
  },
];

// ─────────────────────────────────────────────────────────────
// CENTRAL DEFENDERS
// ─────────────────────────────────────────────────────────────
const CB_ROLES: Role[] = [
  {
    id: "ball_playing_defender",
    name: "Ball-Playing Defender",
    positions: ["DC", "DCR", "DCL"],
    ip: {
      key:       ["Passing", "FirstTouch", "Composure", "Technique"],
      preferred: ["Vision", "Decisions", "Dribbling", "Marking", "Anticipation"],
    },
    oop: {
      key:       ["Marking", "Tackling", "Positioning", "Concentration"],
      preferred: ["Heading", "Strength", "Anticipation", "JumpingReach", "Bravery"],
    },
  },
  {
    id: "libero",
    name: "Libero",
    positions: ["DC", "DCR", "DCL"],
    ip: {
      key:       ["Passing", "Dribbling", "Vision", "FirstTouch"],
      preferred: ["Composure", "Decisions", "Technique", "Anticipation", "Flair"],
    },
    oop: {
      key:       ["Marking", "Tackling", "Positioning", "Anticipation"],
      preferred: ["Heading", "Concentration", "Strength", "Decisions", "Bravery"],
    },
  },
  {
    id: "wide_centreback_attack",
    name: "Wide Centre-Back (Attacking)",
    positions: ["DC", "DCR", "DCL"],
    ip: {
      key:       ["Crossing", "Dribbling", "Stamina", "Pace"],
      preferred: ["Passing", "Technique", "Acceleration", "Agility", "FirstTouch"],
    },
    oop: {
      key:       ["Marking", "Tackling", "Positioning", "Concentration"],
      preferred: ["Heading", "Strength", "Anticipation", "JumpingReach"],
    },
  },
  {
    id: "stopping_centreback",
    name: "Stopping Centre-Back",
    positions: ["DC", "DCR", "DCL"],
    ip: {
      key:       ["Heading", "Marking", "Strength"],
      preferred: ["Passing", "Tackling", "Bravery", "Composure", "Anticipation"],
    },
    oop: {
      key:       ["Marking", "Tackling", "Heading", "Strength", "Positioning"],
      preferred: ["Concentration", "JumpingReach", "Bravery", "Anticipation", "Aggression"],
    },
  },
  {
    id: "covering_centreback",
    name: "Covering Centre-Back",
    positions: ["DC", "DCR", "DCL"],
    ip: {
      key:       ["Anticipation", "Marking", "Positioning"],
      preferred: ["Concentration", "Decisions", "Tackling", "Heading", "Composure"],
    },
    oop: {
      key:       ["Anticipation", "Concentration", "Positioning", "Marking"],
      preferred: ["Tackling", "Decisions", "Heading", "Pace", "Acceleration"],
    },
  },
];

// ─────────────────────────────────────────────────────────────
// FULL-BACKS & WING-BACKS
// ─────────────────────────────────────────────────────────────
const FB_ROLES: Role[] = [
  {
    id: "inverted_fullback",
    name: "Inverted Full-Back",
    positions: ["DR", "DL"],
    ip: {
      key:       ["Passing", "Technique", "FirstTouch", "Vision"],
      preferred: ["Composure", "Decisions", "Dribbling", "Agility", "Anticipation"],
    },
    oop: {
      key:       ["Marking", "Tackling", "Positioning", "Concentration"],
      preferred: ["Anticipation", "Decisions", "Stamina", "Strength"],
    },
  },
  {
    id: "false_fullback",
    name: "False Full-Back / Midfield Inverter",
    positions: ["DR", "DL"],
    ip: {
      key:       ["Passing", "Vision", "Composure", "Positioning"],
      preferred: ["FirstTouch", "Technique", "Decisions", "Anticipation", "Stamina"],
    },
    oop: {
      key:       ["Marking", "Tackling", "Concentration", "Positioning"],
      preferred: ["Anticipation", "WorkRate", "Stamina", "Decisions"],
    },
  },
  {
    id: "complete_wingback",
    name: "Complete Wing-Back",
    positions: ["DR", "DL", "WBR", "WBL"],
    ip: {
      key:       ["Crossing", "Stamina", "Acceleration", "Pace", "Dribbling"],
      preferred: ["Passing", "Technique", "Agility", "Flair", "OffTheBall"],
    },
    oop: {
      key:       ["Stamina", "WorkRate", "Marking", "Tackling"],
      preferred: ["Positioning", "Concentration", "Anticipation", "Pace"],
    },
  },
  {
    id: "wingback",
    name: "Wing-Back",
    positions: ["DR", "DL", "WBR", "WBL"],
    ip: {
      key:       ["Crossing", "Stamina", "Pace", "Acceleration"],
      preferred: ["Passing", "Dribbling", "Agility", "WorkRate", "Technique"],
    },
    oop: {
      key:       ["Stamina", "WorkRate", "Tackling", "Positioning"],
      preferred: ["Marking", "Concentration", "Anticipation", "Pace"],
    },
  },
  {
    id: "pressing_fullback",
    name: "Pressing Full-Back",
    positions: ["DR", "DL"],
    ip: {
      key:       ["Crossing", "Stamina", "WorkRate"],
      preferred: ["Pace", "Passing", "Tackling", "Marking", "Acceleration"],
    },
    oop: {
      key:       ["WorkRate", "Stamina", "Tackling", "Marking", "Aggression"],
      preferred: ["Positioning", "Concentration", "Anticipation", "Pace"],
    },
  },
  {
    id: "holding_fullback",
    name: "Holding Full-Back",
    positions: ["DR", "DL"],
    ip: {
      key:       ["Marking", "Tackling", "Positioning"],
      preferred: ["Concentration", "Anticipation", "Stamina", "Strength", "WorkRate"],
    },
    oop: {
      key:       ["Marking", "Tackling", "Positioning", "Concentration"],
      preferred: ["Anticipation", "Strength", "WorkRate", "Stamina", "Heading"],
    },
  },
  {
    id: "defensive_fullback",
    name: "Defensive Full-Back",
    positions: ["DR", "DL"],
    ip: {
      key:       ["Marking", "Tackling", "Positioning", "Concentration"],
      preferred: ["Stamina", "Heading", "Strength", "WorkRate", "Anticipation"],
    },
    oop: {
      key:       ["Marking", "Tackling", "Positioning", "Concentration", "Anticipation"],
      preferred: ["Heading", "Strength", "WorkRate", "Stamina", "Bravery"],
    },
  },
];

// ─────────────────────────────────────────────────────────────
// DEFENSIVE & CENTRAL MIDFIELDERS
// ─────────────────────────────────────────────────────────────
const DM_CM_ROLES: Role[] = [
  {
    id: "deep_lying_playmaker",
    name: "Deep-Lying Playmaker",
    positions: ["DM", "MC", "MCL", "MCR"],
    ip: {
      key:       ["Passing", "Vision", "Composure", "Technique"],
      preferred: ["FirstTouch", "Decisions", "Anticipation", "Stamina", "Flair"],
    },
    oop: {
      key:       ["Positioning", "Concentration", "Anticipation", "Decisions"],
      preferred: ["Tackling", "WorkRate", "Stamina", "Marking"],
    },
  },
  {
    id: "regista",
    name: "Regista",
    positions: ["DM", "MC", "MCL", "MCR"],
    ip: {
      key:       ["Passing", "Vision", "Flair", "Technique", "Composure"],
      preferred: ["FirstTouch", "Decisions", "Dribbling", "Anticipation", "Vision"],
    },
    oop: {
      key:       ["Anticipation", "Decisions", "Positioning"],
      preferred: ["Concentration", "Composure", "WorkRate", "Stamina"],
    },
  },
  {
    id: "halfback",
    name: "Half-Back",
    positions: ["DM"],
    ip: {
      key:       ["Passing", "Positioning", "Composure"],
      preferred: ["Tackling", "Marking", "Vision", "FirstTouch", "Anticipation"],
    },
    oop: {
      key:       ["Positioning", "Concentration", "Marking", "Tackling"],
      preferred: ["Anticipation", "Strength", "WorkRate", "Stamina"],
    },
  },
  {
    id: "anchor",
    name: "Anchor",
    positions: ["DM"],
    ip: {
      key:       ["Positioning", "Concentration", "Composure"],
      preferred: ["Marking", "Tackling", "Passing", "Decisions", "Anticipation"],
    },
    oop: {
      key:       ["Marking", "Tackling", "Positioning", "Concentration"],
      preferred: ["Strength", "Anticipation", "WorkRate", "Stamina", "Aggression"],
    },
  },
  {
    id: "ball_winning_midfielder",
    name: "Ball-Winning Midfielder",
    positions: ["DM", "MC", "MCL", "MCR"],
    ip: {
      key:       ["Tackling", "WorkRate", "Stamina"],
      preferred: ["Passing", "Marking", "Aggression", "Anticipation", "Strength"],
    },
    oop: {
      key:       ["Tackling", "Marking", "Aggression", "WorkRate", "Stamina"],
      preferred: ["Positioning", "Concentration", "Anticipation", "Strength", "Bravery"],
    },
  },
  {
    id: "pressing_cm",
    name: "Pressing Central Midfielder",
    positions: ["DM", "MC", "MCL", "MCR"],
    ip: {
      key:       ["Stamina", "WorkRate", "Passing"],
      preferred: ["Tackling", "Marking", "Anticipation", "Concentration", "Decisions"],
    },
    oop: {
      key:       ["WorkRate", "Stamina", "Aggression", "Anticipation"],
      preferred: ["Tackling", "Marking", "Concentration", "Positioning", "Decisions"],
    },
  },
  {
    id: "holding_dm",
    name: "Holding Defensive Midfielder",
    positions: ["DM"],
    ip: {
      key:       ["Marking", "Tackling", "Positioning", "Concentration"],
      preferred: ["Passing", "WorkRate", "Stamina", "Anticipation", "Decisions"],
    },
    oop: {
      key:       ["Marking", "Tackling", "Positioning", "Concentration", "Anticipation"],
      preferred: ["Strength", "WorkRate", "Stamina", "Aggression"],
    },
  },
  {
    id: "box_to_box",
    name: "Box-to-Box Midfielder",
    positions: ["MC", "MCL", "MCR"],
    ip: {
      key:       ["Stamina", "Passing", "OffTheBall"],
      preferred: ["Dribbling", "FirstTouch", "Technique", "Finishing", "WorkRate"],
    },
    oop: {
      key:       ["Stamina", "WorkRate", "Tackling"],
      preferred: ["Marking", "Positioning", "Concentration", "Anticipation", "Aggression"],
    },
  },
  {
    id: "carrilero",
    name: "Carrilero",
    positions: ["MC", "MCL", "MCR"],
    ip: {
      key:       ["Passing", "Composure", "Stamina"],
      preferred: ["FirstTouch", "Technique", "Decisions", "WorkRate", "Vision"],
    },
    oop: {
      key:       ["WorkRate", "Stamina", "Positioning"],
      preferred: ["Tackling", "Concentration", "Anticipation", "Marking"],
    },
  },
  {
    id: "mezzala",
    name: "Mezzala",
    positions: ["MC", "MCL", "MCR"],
    ip: {
      key:       ["Passing", "Dribbling", "OffTheBall", "Technique"],
      preferred: ["Vision", "Composure", "Flair", "Stamina", "Agility"],
    },
    oop: {
      key:       ["WorkRate", "Stamina", "Concentration"],
      preferred: ["Tackling", "Positioning", "Anticipation", "Marking"],
    },
  },
  {
    id: "advanced_playmaker",
    name: "Advanced Playmaker",
    positions: ["MC", "MCL", "MCR", "AMC"],
    ip: {
      key:       ["Passing", "Vision", "Composure", "Flair", "Technique"],
      preferred: ["Decisions", "FirstTouch", "Dribbling", "Anticipation", "OffTheBall"],
    },
    oop: {
      key:       ["Anticipation", "Decisions", "Concentration"],
      preferred: ["Positioning", "WorkRate", "Stamina"],
    },
  },
];

// ─────────────────────────────────────────────────────────────
// ATTACKING MIDFIELDERS & WINGERS
// ─────────────────────────────────────────────────────────────
const AM_WINGER_ROLES: Role[] = [
  {
    id: "inside_forward",
    name: "Inside Forward",
    positions: ["AML", "AMR", "ML", "MR"],
    ip: {
      key:       ["Dribbling", "Finishing", "OffTheBall", "Acceleration"],
      preferred: ["Agility", "Technique", "Flair", "Composure", "LongShots"],
    },
    oop: {
      key:       ["WorkRate", "Concentration", "Stamina"],
      preferred: ["Anticipation", "Positioning", "Tackling", "Decisions"],
    },
  },
  {
    id: "inverted_winger",
    name: "Inverted Winger",
    positions: ["AML", "AMR", "ML", "MR"],
    ip: {
      key:       ["Dribbling", "Acceleration", "Pace", "Technique"],
      preferred: ["Agility", "Flair", "Crossing", "LongShots", "OffTheBall"],
    },
    oop: {
      key:       ["WorkRate", "Stamina", "Concentration"],
      preferred: ["Anticipation", "Positioning", "Decisions", "Marking"],
    },
  },
  {
    id: "traditional_winger",
    name: "Traditional Winger",
    positions: ["AML", "AMR", "ML", "MR"],
    ip: {
      key:       ["Crossing", "Acceleration", "Pace", "Dribbling"],
      preferred: ["Agility", "Technique", "OffTheBall", "Stamina", "FirstTouch"],
    },
    oop: {
      key:       ["Stamina", "WorkRate"],
      preferred: ["Concentration", "Anticipation", "Decisions", "Positioning"],
    },
  },
  {
    id: "raumdeuter",
    name: "Raumdeuter",
    positions: ["AML", "AMR"],
    ip: {
      key:       ["OffTheBall", "Anticipation", "Finishing"],
      preferred: ["Composure", "Concentration", "Acceleration", "Agility", "Decisions"],
    },
    oop: {
      key:       ["Concentration", "Positioning", "Anticipation"],
      preferred: ["WorkRate", "Decisions", "Stamina"],
    },
  },
  {
    id: "shadow_striker",
    name: "Shadow Striker",
    positions: ["AMC"],
    ip: {
      key:       ["OffTheBall", "Finishing", "Anticipation", "Composure"],
      preferred: ["Agility", "Acceleration", "Decisions", "Dribbling", "Technique"],
    },
    oop: {
      key:       ["WorkRate", "Stamina", "Concentration"],
      preferred: ["Anticipation", "Positioning", "Decisions"],
    },
  },
  {
    id: "enganche",
    name: "Enganche",
    positions: ["AMC"],
    ip: {
      key:       ["Passing", "Vision", "Flair", "Composure", "Technique"],
      preferred: ["FirstTouch", "Decisions", "Dribbling", "Anticipation"],
    },
    oop: {
      key:       ["Concentration", "Anticipation"],
      preferred: ["Decisions", "Positioning", "WorkRate"],
    },
  },
  {
    id: "attacking_midfielder",
    name: "Attacking Midfielder",
    positions: ["AMC"],
    ip: {
      key:       ["Passing", "Dribbling", "OffTheBall", "Technique"],
      preferred: ["Vision", "Composure", "Flair", "FirstTouch", "Finishing"],
    },
    oop: {
      key:       ["WorkRate", "Stamina", "Concentration"],
      preferred: ["Anticipation", "Positioning", "Decisions"],
    },
  },
  {
    id: "pressing_wide_midfielder",
    name: "Pressing Wide Midfielder",
    positions: ["AML", "AMR", "ML", "MR"],
    ip: {
      key:       ["Stamina", "WorkRate", "Crossing"],
      preferred: ["Passing", "Pace", "Acceleration", "Dribbling", "Concentration"],
    },
    oop: {
      key:       ["WorkRate", "Stamina", "Aggression", "Concentration"],
      preferred: ["Tackling", "Anticipation", "Positioning", "Marking"],
    },
  },
  {
    id: "defensive_winger",
    name: "Defensive Winger",
    positions: ["AML", "AMR", "ML", "MR"],
    ip: {
      key:       ["Crossing", "Stamina", "WorkRate"],
      preferred: ["Pace", "Passing", "Dribbling", "Agility", "Acceleration"],
    },
    oop: {
      key:       ["WorkRate", "Stamina", "Marking", "Concentration"],
      preferred: ["Tackling", "Positioning", "Anticipation", "Aggression"],
    },
  },
];

// ─────────────────────────────────────────────────────────────
// FORWARDS / STRIKERS
// ─────────────────────────────────────────────────────────────
const ST_ROLES: Role[] = [
  {
    id: "advanced_forward",
    name: "Advanced Forward",
    positions: ["ST", "FC"],
    ip: {
      key:       ["Finishing", "OffTheBall", "Composure", "Acceleration"],
      preferred: ["Pace", "Agility", "Dribbling", "Technique", "FirstTouch"],
    },
    oop: {
      key:       ["WorkRate", "Stamina", "Concentration"],
      preferred: ["Anticipation", "Decisions", "Positioning"],
    },
  },
  {
    id: "deep_lying_forward",
    name: "Deep-Lying Forward",
    positions: ["ST", "FC"],
    ip: {
      key:       ["Passing", "FirstTouch", "Composure", "Technique"],
      preferred: ["Vision", "Decisions", "Dribbling", "OffTheBall", "Flair"],
    },
    oop: {
      key:       ["WorkRate", "Stamina", "Anticipation"],
      preferred: ["Positioning", "Concentration", "Decisions", "Marking"],
    },
  },
  {
    id: "target_forward",
    name: "Target Forward",
    positions: ["ST", "FC"],
    ip: {
      key:       ["Heading", "Strength", "Bravery", "JumpingReach"],
      preferred: ["Finishing", "Composure", "OffTheBall", "FirstTouch", "Technique"],
    },
    oop: {
      key:       ["Strength", "Bravery", "WorkRate"],
      preferred: ["Heading", "Concentration", "Stamina", "Aggression"],
    },
  },
  {
    id: "poacher",
    name: "Poacher",
    positions: ["ST", "FC"],
    ip: {
      key:       ["Finishing", "Anticipation", "Composure", "OffTheBall"],
      preferred: ["Acceleration", "Agility", "Concentration", "Decisions"],
    },
    oop: {
      key:       ["Concentration", "Anticipation", "Positioning"],
      preferred: ["Decisions", "WorkRate", "Composure"],
    },
  },
  {
    id: "complete_forward",
    name: "Complete Forward",
    positions: ["ST", "FC"],
    ip: {
      key:       ["Finishing", "Dribbling", "OffTheBall", "Technique", "FirstTouch"],
      preferred: ["Composure", "Heading", "Passing", "Agility", "Strength"],
    },
    oop: {
      key:       ["WorkRate", "Stamina", "Concentration"],
      preferred: ["Anticipation", "Decisions", "Positioning", "WorkRate"],
    },
  },
  {
    id: "false_nine",
    name: "False Nine",
    positions: ["ST", "FC"],
    ip: {
      key:       ["Passing", "Dribbling", "Vision", "Composure", "Technique"],
      preferred: ["FirstTouch", "Flair", "Decisions", "Agility", "OffTheBall"],
    },
    oop: {
      key:       ["WorkRate", "Concentration", "Stamina"],
      preferred: ["Anticipation", "Decisions", "Positioning"],
    },
  },
  {
    id: "pressing_forward",
    name: "Pressing Forward",
    positions: ["ST", "FC"],
    ip: {
      key:       ["WorkRate", "Stamina", "OffTheBall"],
      preferred: ["Finishing", "Pace", "Acceleration", "Concentration", "Bravery"],
    },
    oop: {
      key:       ["WorkRate", "Stamina", "Aggression", "Concentration"],
      preferred: ["Anticipation", "Decisions", "Bravery", "Positioning"],
    },
  },
  {
    id: "high_block_outlet_forward",
    name: "High-Block Outlet Forward",
    positions: ["ST", "FC"],
    ip: {
      key:       ["Pace", "Acceleration", "OffTheBall", "Stamina"],
      preferred: ["Finishing", "Composure", "Dribbling", "Agility"],
    },
    oop: {
      key:       ["WorkRate", "Stamina", "Concentration", "Positioning"],
      preferred: ["Anticipation", "Decisions", "Aggression", "Bravery"],
    },
  },
];

// ─────────────────────────────────────────────────────────────
// ALL ROLES EXPORT
// ─────────────────────────────────────────────────────────────
export const ALL_ROLES: Role[] = [
  ...GK_ROLES,
  ...CB_ROLES,
  ...FB_ROLES,
  ...DM_CM_ROLES,
  ...AM_WINGER_ROLES,
  ...ST_ROLES,
];

export const ROLE_BY_ID = Object.fromEntries(ALL_ROLES.map((r) => [r.id, r]));
