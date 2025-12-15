
export interface UserProfile {
  name: string;
  birthDate: string; // ISO string YYYY-MM-DD
  notificationTime: string; // HH:mm
}

export enum Mood {
  EXCELLENT = 'EXCELLENT', // Green (Best)
  GOOD = 'GOOD',           // Yellow (Good)
  FUSSY = 'FUSSY',         // Orange (Fussy)
  BAD = 'BAD',             // Red (Bad)
  SICK = 'SICK'            // Blue (Sick)
}

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  images: string[]; // Base64 strings
  mood: Mood;
  skills: string[]; // Stores Milestone Titles (legacy support)
  height?: number; // cm
  weight?: number; // kg
}

export interface CompletedVaccination {
  id: string;
  date: string; // YYYY-MM-DD
}

export interface CompletedMilestone {
  id: string;
  date: string | null; // YYYY-MM-DD or null if unknown/onboarding
}

export interface AppState {
  profile: UserProfile | null;
  entries: Record<string, DiaryEntry>; // Keyed by YYYY-MM-DD
  completedVaccinations: CompletedVaccination[]; // List of completed vaccinations with dates
  pastMilestones: CompletedMilestone[]; // List of manually checked milestones with dates
}

export interface Vaccination {
  id: string;
  disease: string;
  doseNumber: number;
  recommendedMonth: number; // Month index (e.g., 0 for birth, 1 for 1 month)
  description: string;
}

export interface SkillRecommendation {
  skill: string;
  category: string;
}

export type MilestoneCategory = 'gross_motor' | 'fine_motor' | 'cognitive' | 'language' | 'social' | 'self_help';

export interface Milestone {
  id: string;
  title: string;
  detail: string;
  monthFrom: number;
  monthTo: number;
  category: MilestoneCategory;
  isCore: boolean;
  prerequisiteId?: string; // ID of the milestone that must be completed first
}
