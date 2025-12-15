
import React, { useState, useMemo } from 'react';
import { Milestone, MilestoneCategory } from '../types';
import { MILESTONES } from '../constants';
import { 
  Sparkles, Footprints, MessageCircle, Smile, Star, Brain, 
  Check, Calendar, Lock, X, LayoutGrid, History, ChevronLeft, ChevronDown, ChevronUp, Trophy
} from 'lucide-react';
import { format, parseISO, differenceInYears, differenceInMonths } from 'date-fns';

interface Props {
  currentMonthAge: number;
  birthDate: string;
  achievedSkills: Record<string, { date: string | null, source: 'diary' | 'manual' }>; // Keyed by ID
  onUpdateMilestone: (milestoneId: string, date: string | null) => void;
}

const CATEGORY_ICONS: Record<MilestoneCategory, React.ElementType> = {
  gross_motor: Footprints,
  fine_motor: Sparkles,
  language: MessageCircle,
  social: Smile,
  self_help: Star,
  cognitive: Brain,
};

const CATEGORY_COLORS: Record<MilestoneCategory, string> = {
  gross_motor: 'text-orange-500 bg-orange-100 border-orange-200',
  fine_motor: 'text-purple-500 bg-purple-100 border-purple-200',
  language: 'text-blue-500 bg-blue-100 border-blue-200',
  social: 'text-pink-500 bg-pink-100 border-pink-200',
  self_help: 'text-green-500 bg-green-100 border-green-200',
  cognitive: 'text-teal-500 bg-teal-100 border-teal-200',
};

const CATEGORY_NAMES: Record<MilestoneCategory, string> = {
  gross_motor: '대근육',
  fine_motor: '소근육',
  language: '언어',
  social: '사회성',
  self_help: '자조',
  cognitive: '인지',
};

// Main Component
export const MilestoneView: React.FC<Props> = ({ birthDate, achievedSkills, onUpdateMilestone }) => {
  const [viewMode, setViewMode] = useState<'domains' | 'timeline'>('domains');
  const [selectedCategory, setSelectedCategory] = useState<MilestoneCategory | null>(null);

  // Modal State
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [isEditing, setIsEditing] = useState(false);

  // --- Calculations for Developmental Age ---
  const { categoryMaxLevels, overallAverageLevel } = useMemo(() => {
    const levels: Record<string, number> = {};
    const cats: MilestoneCategory[] = ['gross_motor', 'fine_motor', 'language', 'social', 'self_help', 'cognitive'];
    let totalMonths = 0;
    let activeCategories = 0;

    cats.forEach(cat => {
        const completedInCat = MILESTONES.filter(m => m.category === cat && achievedSkills[m.id]);
        if (completedInCat.length > 0) {
            // Level is determined by the highest monthTo of a completed milestone
            const max = Math.max(...completedInCat.map(m => m.monthTo));
            levels[cat] = max;
            totalMonths += max;
            activeCategories++;
        } else {
            levels[cat] = 0;
        }
    });

    const average = activeCategories > 0 ? (totalMonths / activeCategories).toFixed(1) : "0";
    
    return { categoryMaxLevels: levels, overallAverageLevel: average };
  }, [achievedSkills]);

  // Helper: Get Prerequisite Name
  const getPrerequisiteName = (id: string) => {
      return MILESTONES.find(m => m.id === id)?.title || '이전 단계';
  };

  // Handler: Click Milestone Item
  const handleMilestoneClick = (milestone: Milestone, status: { date: string | null, source: 'diary' | 'manual' } | undefined) => {
      if (milestone.prerequisiteId && !achievedSkills[milestone.prerequisiteId]) {
          const preName = getPrerequisiteName(milestone.prerequisiteId);
          alert(`이 발달 항목은 '${preName}'(을)를 먼저 완료해야 체크할 수 있습니다.`);
          return;
      }

      if (status) {
          if (status.source === 'diary') {
              alert(`이 기록은 ${status.date} 일기에 작성되었습니다.\n수정하려면 해당 날짜의 일기를 수정해주세요.`);
          } else {
              setSelectedMilestone(milestone);
              setSelectedDate(status.date || format(new Date(), 'yyyy-MM-dd'));
              setIsEditing(true);
          }
      } else {
          setSelectedMilestone(milestone);
          setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
          setIsEditing(false);
      }
  };

  const confirmUpdate = () => {
      if (selectedMilestone) {
          onUpdateMilestone(selectedMilestone.id, selectedDate);
          setSelectedMilestone(null);
      }
  };

  const confirmDelete = () => {
      if (selectedMilestone) {
          if (window.confirm('발달 완료 기록을 취소하시겠습니까?')) {
              onUpdateMilestone(selectedMilestone.id, null);
              setSelectedMilestone(null);
          }
      }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto no-scrollbar pb-24 relative flex flex-col">
      {/* Header & Tabs */}
      <div className="bg-white p-6 pb-0 shadow-sm sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="text-yellow-500" size={24} /> 발달 체크
            </h2>
        </div>
        
        {/* Main Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => { setViewMode('domains'); setSelectedCategory(null); }}
            className={`flex-1 py-3 text-sm font-bold transition-all flex items-center justify-center gap-2 border-b-2 ${
              viewMode === 'domains'
                ? 'border-primary text-gray-800' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <LayoutGrid size={18} /> 발달 영역
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex-1 py-3 text-sm font-bold transition-all flex items-center justify-center gap-2 border-b-2 ${
              viewMode === 'timeline'
                ? 'border-primary text-gray-800' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <History size={18} /> 타임라인
          </button>
        </div>
      </div>

      <div className="flex-1 p-4">
        {viewMode === 'domains' ? (
            !selectedCategory ? (
                <>
                    {/* Overall Summary Card */}
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-5 rounded-2xl mb-4 flex items-center justify-between border border-primary/10">
                        <div>
                            <p className="text-xs font-bold text-primary mb-1 flex items-center gap-1">
                                <Trophy size={12} /> 종합 발달 수준
                            </p>
                            <p className="text-2xl font-bold text-gray-800">
                                평균 <span className="text-primary">{overallAverageLevel}개월</span>
                            </p>
                            <p className="text-[10px] text-gray-500 mt-1">완료한 과업 기준 평균 발달 연령입니다.</p>
                        </div>
                        <div className="bg-white p-3 rounded-full shadow-sm text-primary">
                            <Brain size={24} />
                        </div>
                    </div>

                    {/* 1. Domain Grid View */}
                    <div className="grid grid-cols-2 gap-3">
                        {(Object.keys(CATEGORY_NAMES) as MilestoneCategory[]).map(cat => {
                            const Icon = CATEGORY_ICONS[cat];
                            const colorClass = CATEGORY_COLORS[cat]; // "text-X bg-X border-X"
                            const currentLevel = categoryMaxLevels[cat] || 0;

                            return (
                                <button 
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`flex flex-col items-start p-4 rounded-2xl border bg-white transition-transform active:scale-95 shadow-sm hover:shadow-md ${colorClass.split(' ')[2]}`}
                                >
                                    <div className={`p-2.5 rounded-xl mb-3 ${colorClass.split(' ')[1]}`}>
                                        <Icon size={24} className={colorClass.split(' ')[0]} />
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-0.5">{CATEGORY_NAMES[cat]}</h3>
                                    <p className="text-xs text-gray-500 font-medium">
                                        {currentLevel > 0 ? `${currentLevel}개월 수준` : '시작 전'}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </>
            ) : (
                // 2. Domain Detail List View
                <CategoryDetailList 
                    category={selectedCategory} 
                    achievedSkills={achievedSkills}
                    onBack={() => setSelectedCategory(null)}
                    onItemClick={handleMilestoneClick}
                />
            )
        ) : (
            // 3. Timeline View
            <TimelineList achievedSkills={achievedSkills} birthDate={birthDate} />
        )}
      </div>

      {/* Update Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-fadeIn mb-4 sm:mb-0">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{isEditing ? '기록 수정' : '발달 완료 기록'}</h3>
                        <p className="text-sm text-gray-500">{selectedMilestone.title}</p>
                    </div>
                    <button onClick={() => setSelectedMilestone(null)} className="p-1 rounded-full hover:bg-gray-100">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 flex items-center gap-3">
                    <Calendar className="text-gray-400" />
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent font-bold text-lg text-gray-800 outline-none w-full"
                    />
                </div>
                <p className="text-xs text-gray-500 mb-4 px-1">
                  * 날짜를 선택하면 해당 날짜의 다이어리에도 스킬이 자동으로 등록됩니다.
                </p>

                <div className="flex gap-3">
                    {isEditing ? (
                        <button 
                            onClick={confirmDelete}
                            className="flex-1 py-3 bg-red-100 text-red-500 rounded-xl font-bold hover:bg-red-200"
                        >
                            기록 삭제
                        </button>
                    ) : (
                        <button 
                            onClick={() => setSelectedMilestone(null)}
                            className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold"
                        >
                            취소
                        </button>
                    )}
                    <button 
                        onClick={confirmUpdate}
                        className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-red-400"
                    >
                        {isEditing ? '수정 완료' : '완료 체크'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// Sub-component: Category Detail List
const CategoryDetailList: React.FC<{
    category: MilestoneCategory;
    achievedSkills: Record<string, any>;
    onBack: () => void;
    onItemClick: (m: Milestone, status: any) => void;
}> = ({ category, achievedSkills, onBack, onItemClick }) => {
    const [isDoneExpanded, setIsDoneExpanded] = useState(false);

    // Filter milestones by category and sort strictly by order (monthFrom)
    const allItems = useMemo(() => {
        return MILESTONES
            .filter(m => m.category === category)
            .sort((a, b) => a.monthFrom - b.monthFrom);
    }, [category]);

    const todoItems = allItems.filter(m => !achievedSkills[m.id]);
    const doneItems = allItems.filter(m => achievedSkills[m.id]);

    const Icon = CATEGORY_ICONS[category];
    const colorClass = CATEGORY_COLORS[category];

    // Calculate current level in this category
    const maxMonth = doneItems.length > 0 ? Math.max(...doneItems.map(m => m.monthTo)) : 0;

    return (
        <div className="animate-fadeIn">
            <button onClick={onBack} className="flex items-center gap-1 text-gray-500 mb-4 hover:text-gray-800 font-medium text-sm">
                <ChevronLeft size={18} /> 전체 영역으로 돌아가기
            </button>

            <div className={`flex items-center gap-3 p-4 rounded-2xl mb-6 ${colorClass.split(' ')[1]}`}>
                <div className="bg-white p-2 rounded-xl">
                    <Icon size={24} className={colorClass.split(' ')[0]} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-800">{CATEGORY_NAMES[category]}</h2>
                    <p className="text-sm font-bold text-gray-600">
                        현재 <span className="text-gray-800 text-base">{maxMonth > 0 ? `${maxMonth}개월` : '시작'}</span> 수준
                    </p>
                </div>
            </div>

            {/* Todo Items */}
            <div className="space-y-3 mb-6">
                <h3 className="text-sm font-bold text-gray-400 px-1">진행 중인 발달</h3>
                {todoItems.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl text-gray-400 text-sm">
                        와우! 이 영역의 모든 발달 항목을 완료했어요. 🎉
                    </div>
                ) : (
                    todoItems.map(item => {
                        const isLocked = item.prerequisiteId && !achievedSkills[item.prerequisiteId];
                        return (
                            <MilestoneItem 
                                key={item.id} 
                                milestone={item} 
                                status={null} 
                                isLocked={!!isLocked}
                                onClick={() => onItemClick(item, undefined)} 
                            />
                        );
                    })
                )}
            </div>

            {/* Done Items (Collapsible) */}
            {doneItems.length > 0 && (
                <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
                    <button 
                        onClick={() => setIsDoneExpanded(!isDoneExpanded)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition"
                    >
                        <span className="text-sm font-bold text-gray-500">완료한 항목 ({doneItems.length})</span>
                        {isDoneExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </button>
                    {isDoneExpanded && (
                        <div className="p-3 space-y-3 border-t border-gray-100">
                            {doneItems.map(item => (
                                <MilestoneItem 
                                    key={item.id} 
                                    milestone={item} 
                                    status={achievedSkills[item.id]} 
                                    isLocked={false}
                                    onClick={() => onItemClick(item, achievedSkills[item.id])} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const MilestoneItem: React.FC<{
    milestone: Milestone;
    status: { date: string | null, source: 'diary' | 'manual' } | null;
    isLocked: boolean;
    onClick: () => void;
}> = ({ milestone, status, isLocked, onClick }) => {
    const isCompleted = !!status;

    return (
        <div 
            onClick={onClick}
            className={`p-4 flex items-start gap-3 rounded-2xl border transition cursor-pointer select-none
                ${isCompleted 
                    ? 'bg-white border-gray-100' 
                    : isLocked 
                        ? 'bg-gray-50 border-gray-100 opacity-60' 
                        : 'bg-white border-gray-100 shadow-sm hover:border-primary/30'}
            `}
        >
            <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition ${
                isCompleted
                    ? 'bg-green-500 text-white'
                    : isLocked 
                        ? 'bg-gray-200 text-gray-400' 
                        : 'bg-gray-100 text-gray-300 border border-gray-200'
            }`}>
                {isCompleted ? <Check size={14} strokeWidth={3} /> : isLocked ? <Lock size={12} /> : <div className="w-2 h-2 rounded-full bg-transparent" />}
            </div>

            <div className="flex-1">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                    <span className={`font-bold text-sm ${isCompleted ? 'text-gray-800' : 'text-gray-700'}`}>
                        {milestone.title}
                    </span>
                    {milestone.isCore && !isCompleted && <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded border border-red-100">핵심</span>}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-1">{milestone.detail}</p>
                
                {/* Level Tag instead of Age Range */}
                {!isCompleted && (
                     <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">
                        {milestone.monthTo}개월 수준
                     </span>
                )}

                {status && (
                    <div className="mt-2 inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md">
                        {status.source === 'diary' ? <BookIcon size={12} /> : <Calendar size={12} />}
                        <span>{status.date ? `${status.date} 완료` : '완료됨'}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// Sub-component: Timeline List
const TimelineList: React.FC<{
    achievedSkills: Record<string, { date: string | null }>;
    birthDate: string;
}> = ({ achievedSkills, birthDate }) => {
    // Filter out items without dates and sort newest first
    const timelineItems = useMemo(() => {
        return Object.keys(achievedSkills)
            .map(id => {
                const milestone = MILESTONES.find(m => m.id === id);
                return milestone ? { ...milestone, ...achievedSkills[id] } : null;
            })
            .filter((item): item is Milestone & { date: string } => {
                return item !== null && !!item.date; // Explicitly require a date
            })
            .sort((a, b) => {
                // Descending Sort (Newest Date First)
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
    }, [achievedSkills]);

    const getAgeAtDate = (dateStr: string) => {
        try {
            const date = parseISO(dateStr);
            const birth = parseISO(birthDate);
            const years = differenceInYears(date, birth);
            const months = differenceInMonths(date, birth) % 12;
            return `${years}Y ${months}M`;
        } catch (e) {
            return '';
        }
    };

    if (timelineItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <History size={40} className="mb-4 opacity-20" />
                <p>아직 날짜별 성장 기록이 없습니다.</p>
                <p className="text-xs mt-1">발달 체크에서 날짜를 지정하여 기록해보세요.</p>
            </div>
        );
    }

    return (
        <div className="pl-4 pr-2 py-2">
            {timelineItems.map((item, index) => {
                const Icon = CATEGORY_ICONS[item.category];
                const colorClass = CATEGORY_COLORS[item.category];
                const isLast = index === timelineItems.length - 1;

                return (
                    <div key={item.id} className="flex gap-4">
                        {/* Timeline Line & Dot */}
                        <div className="flex flex-col items-center relative">
                            <div className={`w-3 h-3 rounded-full border-2 bg-white z-10 mt-1.5 ${colorClass.split(' ')[2].replace('border-', 'border-')}`}>
                                <div className={`w-full h-full rounded-full ${colorClass.split(' ')[0].replace('text-', 'bg-')} opacity-30`}></div>
                            </div>
                            {!isLast && <div className="w-0.5 bg-gray-100 flex-1 my-1"></div>}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-8">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-gray-400 font-mono flex items-center gap-2">
                                    {item.date}
                                    <span className="text-[10px] text-gray-300 bg-gray-50 px-1.5 rounded-full font-bold">
                                        {getAgeAtDate(item.date)}
                                    </span>
                                </span>
                            </div>
                            
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                                <div className={`absolute top-0 right-0 p-2 opacity-10 ${colorClass.split(' ')[0]}`}>
                                    <Icon size={40} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${colorClass}`}>
                                            {CATEGORY_NAMES[item.category]}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">{item.detail}</p>
                                    <span className="text-[10px] font-medium text-gray-400 mt-1.5 inline-block">
                                        {item.monthTo}개월 수준
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Icon helper
const BookIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);
