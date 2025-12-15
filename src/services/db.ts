import Dexie, { Table } from "dexie";
import type { DiaryEntry, UserProfile, CompletedMilestone } from "../types";

export type CompletedVaccination = { id: string; date: string };

export type StoredPhoto = {
  id: string;         // uuid
  entryDate: string;  // YYYY-MM-DD
  blob: Blob;         // image/webp 등
  mime: string;
  width: number;
  height: number;
  createdAt: number;
};

export type SettingKV = { key: string; value: any };
export type ProfileRow = { key: "main"; profile: UserProfile };
export type EntryRow = { date: string; entry: DiaryEntry };

class BabyDiaryDB extends Dexie {
  profile!: Table<ProfileRow, "main">;
  entries!: Table<EntryRow, string>;
  vaccinations!: Table<CompletedVaccination, string>;
  milestones!: Table<CompletedMilestone, string>;
  photos!: Table<StoredPhoto, string>;
  settings!: Table<SettingKV, string>;
  meta!: Table<{ key: string; value: any }, string>;

  constructor() {
    super("baby_diary_db");

    this.version(1).stores({
      profile: "key",
      entries: "date",
      vaccinations: "id",
      milestones: "id",
      photos: "id, entryDate, createdAt",
      settings: "key",
      meta: "key",
    });
  }
}

export const db = new BabyDiaryDB();
