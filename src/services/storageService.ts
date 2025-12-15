import { Mood } from "../types";
import type { AppState, CompletedMilestone, DiaryEntry } from "../types";
import { MILESTONES } from "../constants";
import { db, type CompletedVaccination } from "./db";
import { fileToCompressedWebP, dataUrlToBlob } from "./imageService";

const LEGACY_KEY = "baby_log_data";

const initialData: AppState = {
  profile: null,
  entries: {},
  completedVaccinations: [],
  pastMilestones: [],
};

const MOOD_MAPPING: Record<string, Mood> = {
  HAPPY: Mood.EXCELLENT,
  CALM: Mood.GOOD,
  TIRED: Mood.FUSSY,
  SAD: Mood.BAD,
  SICK: Mood.SICK,
  EXCELLENT: Mood.EXCELLENT,
  GOOD: Mood.GOOD,
  FUSSY: Mood.FUSSY,
  BAD: Mood.BAD,
};

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function isDataUrlImage(s: unknown): s is string {
  return typeof s === "string" && s.startsWith("data:image/");
}

async function migrateLegacyLocalStorageOnce() {
  const meta = await db.meta.get("legacyMigrated");
  if (meta?.value) return;

  const raw = localStorage.getItem(LEGACY_KEY);
  if (!raw) {
    await db.meta.put({ key: "legacyMigrated", value: true });
    return;
  }

  try {
    const parsed = JSON.parse(raw);

    // 1) completedVaccinations: string[] -> {id,date}[]
    if (Array.isArray(parsed.completedVaccinations)) {
      if (parsed.completedVaccinations.length > 0 && typeof parsed.completedVaccinations[0] === "string") {
        parsed.completedVaccinations = parsed.completedVaccinations.map((id: string) => ({
          id,
          date: todayISO(),
        }));
      }
    }

    // 2) mood 문자열 -> enum 값으로 보정
    if (parsed.entries) {
      Object.keys(parsed.entries).forEach((dateKey) => {
        const entry = parsed.entries[dateKey];
        if (entry?.mood && typeof entry.mood === "string") {
          const key = entry.mood as string;
          entry.mood = MOOD_MAPPING[key] ?? Mood.GOOD;
        }
      });
    }

    // 3) pastMilestones: string[] (title) -> CompletedMilestone[]
    if (Array.isArray(parsed.pastMilestones)) {
      if (parsed.pastMilestones.length > 0 && typeof parsed.pastMilestones[0] === "string") {
        const t = todayISO();
        const next: CompletedMilestone[] = [];
        parsed.pastMilestones.forEach((title: string) => {
          const m = MILESTONES.find((x) => x.title === title);
          if (m) next.push({ id: m.id, date: t });
        });
        parsed.pastMilestones = next;
      }
    }

    // 4) entries 이미지: base64(dataUrl) -> photos 테이블 Blob 저장 + photoId 배열로 치환
    //    (용량 폭탄 방지: 최대 3장만 처리 / 실패 시 이미지는 버림)
    const entriesObj: Record<string, DiaryEntry> = parsed.entries ?? {};
    for (const date of Object.keys(entriesObj)) {
      const entry = entriesObj[date];
      if (!entry || !Array.isArray(entry.images) || entry.images.length === 0) continue;

      // legacy가 base64였던 케이스만 처리
      const legacyImages = entry.images.filter(isDataUrlImage).slice(0, 3);
      if (legacyImages.length === 0) continue;

      const newPhotoIds: string[] = [];
      for (const dataUrl of legacyImages) {
        try {
          const blob = await dataUrlToBlob(dataUrl);
          const id = crypto.randomUUID();

          // 레거시 이미지는 이미 인코딩된 상태라 width/height 모름 → 0 처리
          await db.photos.put({
            id,
            entryDate: date,
            blob,
            mime: blob.type || "image/*",
            width: 0,
            height: 0,
            createdAt: Date.now(),
          });

          newPhotoIds.push(id);
        } catch (e) {
          console.error("Legacy image migration failed for date:", date, e);
        }
      }

      // photoId 배열로 치환 (base64 제거)
      entry.images = newPhotoIds;
      entriesObj[date] = entry;
    }

    // 5) DB에 저장
    if (parsed.profile) {
      await db.profile.put({ key: "main", profile: parsed.profile });
    }

    if (entriesObj) {
      const rows = Object.keys(entriesObj).map((date) => ({ date, entry: entriesObj[date] }));
      await db.entries.bulkPut(rows);
    }

    if (Array.isArray(parsed.completedVaccinations)) {
      await db.vaccinations.bulkPut(parsed.completedVaccinations as CompletedVaccination[]);
    }

    if (Array.isArray(parsed.pastMilestones)) {
      await db.milestones.bulkPut(parsed.pastMilestones as CompletedMilestone[]);
    }

    await db.meta.put({ key: "legacyMigrated", value: true });

    // 원하면 레거시 삭제
    // localStorage.removeItem(LEGACY_KEY);
  } catch (e) {
    console.error("Legacy migration failed", e);
    await db.meta.put({ key: "legacyMigrated", value: true }); // 무한 반복 방지
  }
}

/** ✅ 앱 시작 시 한번 호출 (App.tsx에서 await loadData()) */
export const loadData = async (): Promise<AppState> => {
  await migrateLegacyLocalStorageOnce();

  try {
    const profileRow = await db.profile.get("main");
    const entryRows = await db.entries.toArray();
    const vaccinations = await db.vaccinations.toArray();
    const milestones = await db.milestones.toArray();

    const entries: Record<string, DiaryEntry> = {};
    entryRows.forEach((r) => (entries[r.date] = r.entry));

    return {
      ...initialData,
      profile: profileRow?.profile ?? null,
      entries,
      completedVaccinations: vaccinations,
      pastMilestones: milestones,
    };
  } catch (e) {
    console.error("Failed to load data from Dexie", e);
    return initialData;
  }
};

/** ✅ 상태 바뀔 때 저장 (App.tsx에서 debounce로 호출 추천) */
export const saveData = async (data: AppState) => {
  try {
    // profile
    if (data.profile) await db.profile.put({ key: "main", profile: data.profile });
    else await db.profile.delete("main");

    // entries (전체 덮어쓰기)
    const entryRows = Object.keys(data.entries || {}).map((date) => ({
      date,
      entry: data.entries[date],
    }));
    await db.entries.clear();
    if (entryRows.length) await db.entries.bulkPut(entryRows);

    // vaccinations
    await db.vaccinations.clear();
    if (data.completedVaccinations?.length) {
      await db.vaccinations.bulkPut(data.completedVaccinations as any);
    }

    // milestones
    await db.milestones.clear();
    if (data.pastMilestones?.length) {
      await db.milestones.bulkPut(data.pastMilestones as any);
    }
  } catch (e) {
    console.error("Failed to save data to Dexie", e);
    alert("저장 중 오류가 발생했어요. 저장 공간이 부족할 수 있습니다.");
  }
};

/** ✅ 사진 추가: File -> WebP 압축 Blob -> DB 저장, photoId 반환 */
export const addPhotoForDate = async (entryDate: string, file: File) => {
  const { blob, width, height, mime } = await fileToCompressedWebP(file, {
    maxLongSide: 1600,
    quality: 0.82,
  });

  const id = crypto.randomUUID();

  await db.photos.put({
    id,
    entryDate,
    blob,
    mime,
    width,
    height,
    createdAt: Date.now(),
  });

  return id;
};

export const getPhotosForDate = async (entryDate: string) => {
  return await db.photos.where("entryDate").equals(entryDate).sortBy("createdAt");
};

export const deletePhoto = async (photoId: string) => {
  await db.photos.delete(photoId);
};

/** ✅ 설정 저장/불러오기 (예: 알림 시간, 알림 ON/OFF) */
export const setSetting = async <T = any>(key: string, value: T) => {
  await db.settings.put({ key, value });
};

export const getSetting = async <T = any>(key: string, fallback: T): Promise<T> => {
  const row = await db.settings.get(key);
  return (row?.value ?? fallback) as T;
};
