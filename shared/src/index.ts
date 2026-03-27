// Player types
export interface Player {
  id: string;
  name: string;
  level: number;
  rank: PlayerRank;
  title: string;
  xp: number;
  xpToEnter: number;   // XP needed to enter current level
  xpToPass: number;    // XP needed to pass current level
  skipPasses: number;   // guilt-free task skip passes
  stats: PlayerStats;
  createdAt: string;
  updatedAt: string;
}

// Stats are computed as percentages (0-100) from task history
export interface PlayerStats {
  intelligence: number;  // growth completed / total growth tasks
  charisma: number;      // self_care completed / total self_care tasks
  willPower: number;     // all completed / all tasks
}

// Level system — 10 levels, capped
export type PlayerRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'S2' | 'S3' | 'S4' | 'S5';

export const MAX_LEVEL = 10;
export const MIN_LEVEL = 1;

export interface LevelInfo {
  level: number;
  rank: PlayerRank;
  title: string;
  xpToEnter: number;  // XP required to enter this level
  xpToPass: number;   // Total XP required to pass this level (and enter the next)
}

export const LEVEL_MAP: LevelInfo[] = [
  { level: 1,  rank: 'E',  title: 'The Ordinary Human',                xpToEnter: 0,     xpToPass: 146 },
  { level: 2,  rank: 'D',  title: 'The Weakest Hunter of All Mankind', xpToEnter: 146,   xpToPass: 1022 },
  { level: 3,  rank: 'C',  title: 'The Forgotten One',                 xpToEnter: 1022,  xpToPass: 2555 },
  { level: 4,  rank: 'B',  title: 'The Survivor of Shadows',           xpToEnter: 2555,  xpToPass: 7373 },
  { level: 5,  rank: 'A',  title: 'The Hunter of the Abyss',           xpToEnter: 7373,  xpToPass: 13943 },
  { level: 6,  rank: 'S',  title: 'Sovereign Commander',               xpToEnter: 13943, xpToPass: 23141 },
  { level: 7,  rank: 'S2', title: 'The Ruler of Beasts',               xpToEnter: 23141, xpToPass: 38471 },
  { level: 8,  rank: 'S3', title: 'The King of the Dead',              xpToEnter: 38471, xpToPass: 55991 },
  { level: 9,  rank: 'S4', title: 'The Monarch of Darkness',           xpToEnter: 55991, xpToPass: 77015 },
  { level: 10, rank: 'S5', title: 'Absolute Ruler',                    xpToEnter: 77015, xpToPass: 100375 },
];

export function getLevelInfo(level: number): LevelInfo {
  const clamped = Math.max(MIN_LEVEL, Math.min(level, MAX_LEVEL));
  return LEVEL_MAP[clamped - 1];
}

// Determine level from total XP (supports both leveling up and down)
export function getLevelForXp(totalXp: number): number {
  // Walk backwards from max level to find the highest level the player qualifies for
  for (let i = LEVEL_MAP.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_MAP[i].xpToEnter) {
      return LEVEL_MAP[i].level;
    }
  }
  return MIN_LEVEL;
}

// --- Daily Task Requirements per Level ---

export interface DailyRequirements {
  total: number;
  growth: number;
  hobby: number;
  self_care: number;
}

export const DAILY_REQUIREMENTS: DailyRequirements[] = [
  { total: 1, growth: 1, hobby: 0, self_care: 0 }, // Level 1
  { total: 2, growth: 1, hobby: 1, self_care: 0 }, // Level 2
  { total: 3, growth: 1, hobby: 1, self_care: 1 }, // Level 3
  { total: 4, growth: 2, hobby: 1, self_care: 1 }, // Level 4
  { total: 5, growth: 2, hobby: 1, self_care: 2 }, // Level 5
  { total: 6, growth: 2, hobby: 2, self_care: 2 }, // Level 6
  { total: 7, growth: 2, hobby: 2, self_care: 3 }, // Level 7
  { total: 7, growth: 2, hobby: 2, self_care: 3 }, // Level 8
  { total: 8, growth: 2, hobby: 2, self_care: 4 }, // Level 9
  { total: 8, growth: 2, hobby: 2, self_care: 4 }, // Level 10
];

export function getDailyRequirements(level: number): DailyRequirements {
  const clamped = Math.max(MIN_LEVEL, Math.min(level, MAX_LEVEL));
  return DAILY_REQUIREMENTS[clamped - 1];
}

// Daily progress tracking
export interface DailyProgress {
  date: string; // YYYY-MM-DD
  required: DailyRequirements;
  completed: {
    total: number;
    growth: number;
    hobby: number;
    self_care: number;
  };
}

// --- Task & XP System ---

export type TaskCategory = 'growth' | 'hobby' | 'self_care';

export interface TaskCategoryInfo {
  category: TaskCategory;
  label: string;
  description: string;
  xpMultiplier: number;
}

// XP multipliers per task category
export const TASK_CATEGORIES: Record<TaskCategory, TaskCategoryInfo> = {
  growth: {
    category: 'growth',
    label: 'Growth',
    description: 'To make you grow',
    xpMultiplier: 14.6,
  },
  hobby: {
    category: 'hobby',
    label: 'Hobby',
    description: 'Things you like',
    xpMultiplier: 7.3,
  },
  self_care: {
    category: 'self_care',
    label: 'Self Care',
    description: 'Fitness, Diet, Medicinal / lifestyle / habit based changes',
    xpMultiplier: 3.65,
  },
};

// Base XP gain/loss per level (before category multiplier)
export interface LevelXpRates {
  baseGain: number;   // Base XP gained on task completion
  baseLoss: number;   // Base XP lost on task failure (positive number, applied as deduction)
}

export const LEVEL_XP_RATES: LevelXpRates[] = [
  { baseGain: 10,  baseLoss: 0 },    // Level 1
  { baseGain: 20,  baseLoss: 10 },   // Level 2
  { baseGain: 30,  baseLoss: 20 },   // Level 3
  { baseGain: 40,  baseLoss: 30 },   // Level 4
  { baseGain: 50,  baseLoss: 60 },   // Level 5
  { baseGain: 60,  baseLoss: 100 },  // Level 6
  { baseGain: 70,  baseLoss: 150 },  // Level 7
  { baseGain: 80,  baseLoss: 210 },  // Level 8
  { baseGain: 90,  baseLoss: 280 },  // Level 9
  { baseGain: 100, baseLoss: 360 },  // Level 10
];

export function getLevelXpRates(level: number): LevelXpRates {
  const clamped = Math.max(MIN_LEVEL, Math.min(level, MAX_LEVEL));
  return LEVEL_XP_RATES[clamped - 1];
}

// Calculate actual XP: base * category multiplier
export function calculateTaskXpGain(level: number, category: TaskCategory): number {
  const rates = getLevelXpRates(level);
  return Math.round(rates.baseGain * TASK_CATEGORIES[category].xpMultiplier);
}

export function calculateTaskXpLoss(level: number, category: TaskCategory): number {
  const rates = getLevelXpRates(level);
  return Math.round(rates.baseLoss * TASK_CATEGORIES[category].xpMultiplier);
}

export type TaskStatus = 'active' | 'completed' | 'failed';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  xpGain: number;   // XP gained on completion (locked at creation)
  xpLoss: number;   // XP lost on failure (locked at creation)
  playerId: string;
  createdAt: string;
  completedAt?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
