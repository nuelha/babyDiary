
import { useState, useEffect, useRef } from "react";
import { Onboarding } from "./components/Onboarding";
import { CalendarView } from "./components/CalendarView";
import { DiaryEntry } from "./components/DiaryEntry";
import { MilestoneView } from "./components/MilestoneChecklist";
import { VaccinationView } from "./components/VaccinationList";
import { DailyView } from "./components/DailyView";
import { SettingsView } from "./components/SettingsView";
import { BottomNavigation, Tab } from "./components/BottomNavigation";
import {
  AppState,
  DiaryEntry as DiaryEntryType,
  UserProfile,
  CompletedVaccination,
  CompletedMilestone,
  Mood,
} from "./types";
import { loadData, saveData } from "./services/storageService";
import { getAgeString, getDDay, getMonthDifference } from "./utils/dateUtils";
import { Baby } from "lucide-react";
import { format } from "date-fns";
import { MILESTONES } from "./constants";

const initialAppState: AppState = {
  profile: null,
  entries: {},
  completedVaccinations: [],
  pastMilestones: [],
};

export default function App() {
  const [appState, setAppState] = useState<AppState>(initialAppState);
  const [activeTab, setActiveTab] = useState<Tab>("calendar");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 로딩 완료 플래그
  const [isLoaded, setIsLoaded] = useState(false);

  // 저장 디바운스용
  const saveTimerRef = useRef<number | null>(null);

  // 1) 앱 시작 시 Dexie에서 로드
  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await loadData();
      if (!mounted) return;
      setAppState(data);
      setIsLoaded(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 2) appState 바뀔 때마다 저장 (로딩 완료 후, 디바운스)
  useEffect(() => {
    if (!isLoaded) return;

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(() => {
      saveData(appState);
    }, 500); // 0.5초 정도가 적당함

    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [appState, isLoaded]);

  const handleOnboardingComplete = (
    profile: UserProfile,
    initialPastMilestones: CompletedMilestone[],
    initialCompletedVaccinations: CompletedVaccination[]
  ) => {
    setAppState((prev) => ({
      ...prev,
      profile,
      pastMilestones: [...(prev.pastMilestones || []), ...initialPastMilestones],
      completedVaccinations: [
        ...(prev.completedVaccinations || []),
        ...initialCompletedVaccinations,
      ],
    }));
  };

  const handleSaveEntry = (entry: DiaryEntryType) => {
    setAppState((prev) => ({
      ...prev,
      entries: {
        ...prev.entries,
        [entry.date]: entry,
      },
    }));
    setSelectedDate(null);
  };

  const toggleVaccination = (id: string, date?: string) => {
    setAppState((prev) => {
      const current = prev.completedVaccinations || [];
      const exists = current.some((v) => v.id === id);

      let updated;
      if (exists) updated = current.filter((v) => v.id !== id);
      else updated = [...current, { id, date: date || format(new Date(), "yyyy-MM-dd") }];

      return { ...prev, completedVaccinations: updated };
    });
  };

  const updateMilestone = (milestoneId: string, date: string | null) => {
    const milestoneDef = MILESTONES.find((m) => m.id === milestoneId);
    if (!milestoneDef) return;

    setAppState((prev) => {
      let nextEntries = { ...prev.entries };
      const prevMilestoneRecord = prev.pastMilestones.find((m) => m.id === milestoneId);

      if (prevMilestoneRecord?.date) {
        const oldDate = prevMilestoneRecord.date;
        if (nextEntries[oldDate]) {
          nextEntries[oldDate] = {
            ...nextEntries[oldDate],
            skills: nextEntries[oldDate].skills.filter((s) => s !== milestoneDef.title),
          };
        }
      }

      if (date) {
        const existingEntry = nextEntries[date];
        if (existingEntry) {
          if (!existingEntry.skills.includes(milestoneDef.title)) {
            nextEntries[date] = {
              ...existingEntry,
              skills: [...existingEntry.skills, milestoneDef.title],
            };
          }
        } else {
          nextEntries[date] = {
            id: Date.now().toString(),
            date,
            content: "",
            images: [],
            mood: Mood.EXCELLENT,
            skills: [milestoneDef.title],
          };
        }
      }

      let nextPastMilestones = prev.pastMilestones.filter((m) => m.id !== milestoneId);
      if (date !== null) nextPastMilestones.push({ id: milestoneId, date });

      return { ...prev, entries: nextEntries, pastMilestones: nextPastMilestones };
    });
  };

  const updateProfile = (profile: UserProfile) => {
    setAppState((prev) => ({ ...prev, profile }));
  };

  // 로딩 전에는 깜빡임 방지용으로 간단 로더(혹은 스플래시)
  if (!isLoaded) {
    return <div className="h-screen flex items-center justify-center text-gray-400">로딩중…</div>;
  }

  if (!appState.profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Helper to get all unique skills from history for DiaryEntry (still uses titles)
  const getAllRecordedSkills = (excludeDate?: string): string[] => {
    const skillsSet = new Set<string>();
    
    // Add diary skills
    Object.values(appState.entries).forEach((entry: DiaryEntryType) => {
      if (excludeDate && entry.date === excludeDate) return;
      if (entry.skills) {
        entry.skills.forEach(skill => skillsSet.add(skill));
      }
    });

    // Add past milestones (Titles)
    if (appState.pastMilestones) {
        appState.pastMilestones.forEach(m => {
            const milestone = MILESTONES.find(def => def.id === m.id);
            if (milestone) skillsSet.add(milestone.title);
        });
    }

    return Array.from(skillsSet);
  };

  // Helper to generate a unified map of Achieved Skills [ID -> { date, source }]
  const getAchievedSkillsMap = (): Record<string, { date: string | null, source: 'diary' | 'manual' }> => {
    const map: Record<string, { date: string | null, source: 'diary' | 'manual' }> = {};
    
    // 1. Process Diary Entries (Dates take precedence as they are context-rich)
    // Convert Title -> ID
    const sortedDates = Object.keys(appState.entries).sort();
    sortedDates.forEach(date => {
      const entry = appState.entries[date];
      if (entry.skills) {
        entry.skills.forEach(skillTitle => {
          const milestone = MILESTONES.find(m => m.title === skillTitle);
          if (milestone && !map[milestone.id]) {
            map[milestone.id] = { date: date, source: 'diary' };
          }
        });
      }
    });

    // 2. Process Past Milestones (Manually checked or Onboarding)
    // Only add if not already present from a diary entry
    if (appState.pastMilestones) {
        appState.pastMilestones.forEach(m => {
            if (!map[m.id]) {
                map[m.id] = { date: m.date, source: 'manual' };
            }
        });
    }

    return map;
  };

  if (!appState.profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return <CalendarView appState={appState} onDateClick={setSelectedDate} />;
      case 'daily':
        return <DailyView entries={appState.entries} onEntryClick={setSelectedDate} />;
      case 'milestone':
        return (
          <MilestoneView
            currentMonthAge={getMonthDifference(appState.profile!.birthDate)}
            birthDate={appState.profile!.birthDate}
            achievedSkills={getAchievedSkillsMap()}
            onUpdateMilestone={updateMilestone}
          />
        );
      case 'vaccination':
        return (
          <VaccinationView
            birthDate={appState.profile!.birthDate}
            completedVaccinations={appState.completedVaccinations || []}
            onToggleVaccination={toggleVaccination}
          />
        );
      case 'settings':
        return <SettingsView profile={appState.profile!} onUpdateProfile={updateProfile} />;
      default:
        return <CalendarView appState={appState} onDateClick={setSelectedDate} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 relative">
      {/* Top Bar - Show mostly everywhere except maybe full screen modal contexts, but good for context */}
      <header className="bg-white px-6 pt-12 pb-4 flex items-center justify-between shadow-sm z-30">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {appState.profile.name} <span className="text-primary text-xs bg-primary/10 px-2 py-1 rounded-full">{getDDay(appState.profile.birthDate)}</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">{getAgeString(appState.profile.birthDate)}</p>
        </div>
        <div className="bg-gray-100 p-2 rounded-full text-gray-400">
           <Baby size={24} />
        </div>
      </header>

      {/* Main Content Area */}
      {renderContent()}

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Diary Entry Modal (Global) */}
      {selectedDate && (
        <DiaryEntry
          date={selectedDate}
          profile={appState.profile}
          initialData={appState.entries[selectedDate]}
          existingSkills={getAllRecordedSkills(selectedDate)}
          onSave={handleSaveEntry}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
