// FM26 Player types — mirrors the FM Analyzer data.json schema (v0.1.33, game 26.3.2)

export interface PlayerAttrs {
  Crossing: number; Dribbling: number; Finishing: number; Heading: number;
  LongShots: number; Marking: number; OffTheBall: number; Passing: number;
  PenaltyTaking: number; Tackling: number; Vision: number;
  // GK only
  Handling: number; AerialReach: number; CommandOfArea: number;
  Communication: number; Kicking: number; Throwing: number;
  Anticipation: number; Decisions: number; OneOnOnes: number;
  Positioning: number; Reflexes: number;
  // Technical
  FirstTouch: number; Technique: number; Flair: number; Corners: number;
  Teamwork: number; WorkRate: number; LongThrows: number;
  // GK special
  Eccentricity: number; RushingOut: number; Punching: number;
  // Physical
  Acceleration: number; FreeKicks: number; Strength: number; Stamina: number;
  Pace: number; JumpingReach: number; Leadership: number; Balance: number;
  Bravery: number; Aggression: number; Agility: number; NaturalFitness: number;
  // Mental
  Determination: number; Composure: number; Concentration: number;
  // Hidden (shown with CA/PA toggle off)
  Dirtiness: number; Consistency: number; ImportantMatches: number;
  InjuryProneness: number; Versatility: number;
}

export interface Player {
  id: number;
  name: string;
  searchName: string;
  age: number;
  dob: string;
  birthYear: number;
  nat: string[];
  club: string;
  div: string;
  ca: number;
  pa: number;
  wage: number;
  expires: string;
  pos: string;
  posArr: string[];
  teamType: number;
  foot: string;
  height: number;
  value: number;
  askingPrice: number;
  wageDemand: number | null;
  listed: boolean;
  loanListed: boolean;
  notForSale: boolean;
  setForRelease: boolean;
  clubRep: number;
  worldRep: number;
  // Hidden personality
  ambition: number;
  loyalty: number;
  professionalism: number;
  adaptability: number;
  pressure: number;
  sportsmanship: number;
  temperament: number;
  controversy: number;
  attrs: PlayerAttrs;
}

export interface DumpMeta {
  generated: string;
  gameDate: string;
  gameVersion: string;
  manager: string;
  myClub: string;
  currency: string;
  source: string;
}

export interface Dump {
  meta: DumpMeta;
  players: Player[];
}

export interface RoleScore {
  roleId: string;
  roleName: string;
  ipScore: number;  // 0–100
  oopScore: number; // 0–100
}
