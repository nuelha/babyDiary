
import React, { useState, useMemo } from 'react';
import { UserProfile, CompletedVaccination, CompletedMilestone } from '../types';
import { MILESTONES, VACCINATIONS } from '../constants';
import { getMonthDifference } from '../utils/dateUtils';
import { ArrowRight, Check, ChevronRight, Bell, Calendar, User, Sparkles, Clock } from 'lucide-react';
import { addMonths, format, parseISO } from 'date-fns';

interface Props {
  onComplete: (profile: UserProfile, initialPastMilestones: CompletedMilestone[], initialCompletedVaccinations: CompletedVaccination[]) => void;
}

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  
  // Step 1: Info
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  // Step 2: Milestones (storing Titles for easier UI selection, will convert on complete)
  const [checkedMilestoneTitles, setCheckedMilestoneTitles] = useState<Set<string>>(new Set());

  // Step 3: Notifications
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState('20:00');

  // Calculated Values
  const currentMonthAge = useMemo(() => {
    if (!birthDate) return 0;
    return getMonthDifference(birthDate);
  }, [birthDate]);

  const { visibleMilestones, autoCompletedMilestones, autoCompletedVaccinations } = useMemo(() => {
    if (!birthDate) return { visibleMilestones: [], autoCompletedMilestones: [], autoCompletedVaccinations: [] };
    
    // Rule for Milestones: Hide where monthTo <= currentMonthAge - 2
    const cutoffMonth = Math.max(-1, currentMonthAge - 2);
    
    // Auto-completed (strictly past)
    const autoMilestones = MILESTONES.filter(m => m.monthTo <= cutoffMonth);
    
    // Visible for checking
    const visible = MILESTONES.filter(m => m.monthTo > cutoffMonth && m.monthFrom <= currentMonthAge + 2);

    // Rule for Vaccinations
    const autoVaccines = VACCINATIONS.filter(v => {
      if (v.recommendedMonth < 12) {
        return v.recommendedMonth < currentMonthAge;
      } else {
        return currentMonthAge >= v.recommendedMonth + 4;
      }
    }).map(v => ({
      id: v.id,
      date: format(addMonths(parseISO(birthDate), v.recommendedMonth), 'yyyy-MM-dd')
    }));

    return { 
        visibleMilestones: visible, 
        autoCompletedMilestones: autoMilestones,
        autoCompletedVaccinations: autoVaccines
    };
  }, [birthDate, currentMonthAge]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(prev => prev + 1);
  };

  const handleToggleMilestone = (title: string) => {
    const next = new Set(checkedMilestoneTitles);
    if (next.has(title)) {
      next.delete(title);
    } else {
      next.add(title);
    }
    setCheckedMilestoneTitles(next);
  };

  const handleComplete = () => {
    // 1. Auto-completed (Set date to null as we don't know the exact date)
    const autoList: CompletedMilestone[] = autoCompletedMilestones.map(m => ({
        id: m.id,
        date: null 
    }));

    // 2. Manually checked in onboarding (Set date to null as well, user just confirmed they can do it)
    const manualList: CompletedMilestone[] = [];
    checkedMilestoneTitles.forEach(title => {
        const milestone = MILESTONES.find(m => m.title === title);
        if (milestone) {
            manualList.push({
                id: milestone.id,
                date: null
            });
        }
    });

    const allPastMilestones = [...autoList, ...manualList];

    onComplete({
      name,
      birthDate,
      notificationTime: notificationEnabled ? notificationTime : '' 
    }, allPastMilestones, autoCompletedVaccinations);
  };

  const renderStep1 = () => (
    <form onSubmit={handleNextStep} className="w-full space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">아기 정보를 알려주세요</h2>
        <p className="text-gray-500 text-sm">맞춤형 발달 정보와 기록을 위해 필요해요.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700 ml-1">아기 이름 (태명)</label>
          <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition">
            <User size={20} className="text-gray-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 outline-none text-gray-800 font-medium bg-transparent appearance-none"
              placeholder="예: 튼튼이"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700 ml-1">생년월일</label>
          <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition">
            <Calendar size={20} className="text-gray-400" />
            <input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="flex-1 outline-none text-gray-800 font-medium bg-transparent"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!name || !birthDate}
        className="w-full bg-primary disabled:bg-gray-300 text-white p-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-red-400 transition flex items-center justify-center gap-2 mt-8"
      >
        다음으로 <ArrowRight size={20} />
      </button>
    </form>
  );

  const renderStep2 = () => (
    <div className="w-full flex flex-col h-full animate-fadeIn">
      <div className="text-center mb-6 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800 mb-2">현재 발달 상황 체크</h2>
        <p className="text-gray-500 text-sm">
          {name}이는 현재 <span className="text-primary font-bold">{currentMonthAge}개월</span>이에요.<br/>
          이미 할 수 있는 것들을 체크해주세요!
        </p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar -mx-4 px-4 pb-4 space-y-3">
        {visibleMilestones.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            체크할 발달 사항이 없습니다.<br/>다음으로 넘어가세요!
          </div>
        ) : (
          visibleMilestones.map((m) => {
            const isChecked = checkedMilestoneTitles.has(m.title);
            return (
              <div
                key={m.id}
                onClick={() => handleToggleMilestone(m.title)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isChecked ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-gray-100'
                }`}
              >
                <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isChecked ? 'bg-primary border-primary text-white' : 'border-gray-200'
                }`}>
                    {isChecked && <Check size={14} strokeWidth={3} />}
                </div>
                <div>
                    <h4 className={`font-bold text-sm ${isChecked ? 'text-gray-800' : 'text-gray-600'}`}>{m.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-snug">{m.detail}</p>
                    <span className="text-[10px] text-gray-400 mt-2 block bg-gray-50 inline-block px-2 py-0.5 rounded">
                        {m.monthFrom}~{m.monthTo}개월
                    </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      <button
        onClick={handleNextStep}
        className="w-full bg-primary text-white p-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-red-400 transition flex items-center justify-center gap-2 mt-4 flex-shrink-0"
      >
        다음으로 <ChevronRight size={20} />
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div className="w-full space-y-8 animate-fadeIn">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={40} className="text-teal-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">다이어리 알림 설정</h2>
        <p className="text-gray-500 text-sm">매일 잊지 않고 기록할 수 있도록<br/>알림을 보내드릴까요?</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
            <span className="font-bold text-gray-700">알림 받기</span>
            <button 
                onClick={() => setNotificationEnabled(!notificationEnabled)}
                className={`w-14 h-8 rounded-full transition-colors relative ${notificationEnabled ? 'bg-primary' : 'bg-gray-200'}`}
            >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${notificationEnabled ? 'left-7' : 'left-1'}`} />
            </button>
        </div>

        {notificationEnabled && (
            <div className="pt-4 border-t border-gray-50 animate-fadeIn">
                <label className="text-xs font-bold text-gray-400 mb-2 block">알림 시간</label>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <Clock size={20} className="text-gray-400" />
                  <input
                    type="time"
                    value={notificationTime}
                    onChange={(e) => setNotificationTime(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-800 font-bold text-lg"
                  />
                </div>
            </div>
        )}
      </div>

      <button
        onClick={handleComplete}
        className="w-full bg-primary text-white p-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-red-400 transition flex items-center justify-center gap-2 mt-8"
      >
        시작하기 <Sparkles size={20} />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
        {/* Progress Bar */}
        <div className="pt-12 px-8 pb-4">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-primary transition-all duration-500 ease-out" 
                    style={{ width: `${(step / 3) * 100}%` }} 
                />
            </div>
        </div>

        <div className="flex-1 flex flex-col p-8 pt-4 overflow-hidden">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </div>
    </div>
  );
};
