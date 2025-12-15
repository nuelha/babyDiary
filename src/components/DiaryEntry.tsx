import React, { useState, useRef, useMemo, useEffect } from 'react';
import { DiaryEntry as DiaryEntryType, Mood, UserProfile, MilestoneCategory, Milestone } from '../types';
import { MOOD_CONFIG, MILESTONES } from '../constants';
import { getAgeString, getDDay, getMonthDifference } from '../utils/dateUtils';
import { addPhotoForDate, getPhotosForDate, deletePhoto } from '../services/storageService';
import { Camera, X, Plus, ChevronLeft, Check, Footprints, MessageCircle, Smile, Star, Sparkles, Brain, Ruler, Scale, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  date: string; // YYYY-MM-DD
  profile: UserProfile;
  initialData?: DiaryEntryType;
  existingSkills: string[];
  onSave: (entry: DiaryEntryType) => void;
  onClose: () => void;
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
  gross_motor: 'text-orange-500 bg-orange-100',
  fine_motor: 'text-purple-500 bg-purple-100',
  language: 'text-blue-500 bg-blue-100',
  social: 'text-pink-500 bg-pink-100',
  self_help: 'text-green-500 bg-green-100',
  cognitive: 'text-teal-500 bg-teal-100',
};

const CATEGORY_NAMES: Record<MilestoneCategory, string> = {
  gross_motor: '대근육',
  fine_motor: '소근육',
  language: '언어',
  social: '사회성',
  self_help: '자조',
  cognitive: '인지',
};

export const DiaryEntry: React.FC<Props> = ({ date, profile, initialData, existingSkills, onSave, onClose }) => {
  const [content, setContent] = useState(initialData?.content || '');
  const [images, setImages] = useState<string[]>(initialData?.images || []); // 이제 “photoId 배열”
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});   // photoId -> objectURL
  const [mood, setMood] = useState<Mood>(initialData?.mood || Mood.EXCELLENT);
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  
  // Growth State
  const [height, setHeight] = useState<string>(initialData?.height?.toString() || '');
  const [weight, setWeight] = useState<string>(initialData?.weight?.toString() || '');
  const [showGrowthInputs, setShowGrowthInputs] = useState(!!initialData?.height || !!initialData?.weight);

  const [newSkillInput, setNewSkillInput] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
  const monthAge = getMonthDifference(profile.birthDate);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ageString = getAgeString(profile.birthDate);
  const dDay = getDDay(profile.birthDate);

  // Filter & Group Milestones
  // 1. Exclude items already completed in history (existingSkills)
  // 2. Include items checked in THIS entry (skills) so they remain visible to toggle off
  // 3. Show all future/remaining items
  const { groupedMilestones, sortedGroupKeys } = useMemo(() => {
    // Determine which milestones to show
    const visibleMilestones = MILESTONES.filter(m => {
        // If it's checked in the current session, show it (so user can uncheck)
        if (skills.includes(m.title)) return true;
        // If it's completed in the past, hide it
        if (existingSkills.includes(m.title)) return false;
        // Otherwise show it (future/current uncompleted)
        return true;
    });

    const grouped: Record<string, Milestone[]> = {};
    visibleMilestones.forEach(m => {
        const key = m.monthFrom === m.monthTo ? `${m.monthFrom}개월` : `${m.monthFrom}~${m.monthTo}개월`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(m);
    });

    const keys = Object.keys(grouped).sort((a, b) => {
        const numA = parseInt(a.split(/개월|~/)[0]);
        const numB = parseInt(b.split(/개월|~/)[0]);
        return numA - numB;
    });

    return { groupedMilestones: grouped, sortedGroupKeys: keys };
  }, [existingSkills, skills]);

  useEffect(() => {
    let mounted = true;
    const createdUrls: string[] = [];

    (async () => {
      const photos = await getPhotosForDate(date);
      if (!mounted) return;

      const nextMap: Record<string, string> = {};
      photos.forEach(p => {
        const url = URL.createObjectURL(p.blob);
        createdUrls.push(url);
        nextMap[p.id] = url;
      });

      setImageUrls(nextMap);
    })();

    return () => {
      mounted = false;
      createdUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [date]);

  const toggleGroup = (key: string) => {
      const newSet = new Set(expandedGroups);
      if (newSet.has(key)) {
          newSet.delete(key);
      } else {
          newSet.add(key);
      }
      setExpandedGroups(newSet);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    if (images.length + e.target.files.length > 3) {
      alert("사진은 최대 3장까지만 등록 가능합니다.");
      return;
    }

    try {
      const files = Array.from(e.target.files);

      const newIds: string[] = [];
      const nextUrlMap: Record<string, string> = { ...imageUrls };

      for (const file of files) {
        const id = await addPhotoForDate(date, file);        // ✅ Blob(WebP)로 DB 저장
        newIds.push(id);

        // 미리보기 URL은 DB에서 다시 가져오지 말고 즉시 만들고 싶으면:
        // addPhotoForDate가 blob을 반환하게 바꾸면 더 깔끔하지만,
        // 지금은 getPhotosForDate로 다시 읽는 방식도 OK.
      }

      // DB에서 다시 불러와서 URL 맵 갱신(확실한 방식)
      const photos = await getPhotosForDate(date);
      photos.forEach(p => {
        if (!nextUrlMap[p.id]) nextUrlMap[p.id] = URL.createObjectURL(p.blob);
      });

      setImageUrls(nextUrlMap);
      setImages(prev => [...prev, ...newIds]);

      // input 초기화(같은 파일 다시 선택 가능)
      e.target.value = "";
    } catch (err) {
      console.error(err);
      alert("이미지 저장 중 오류가 발생했어요.");
    }
  };


  const removeImage = async (index: number) => {
    const photoId = images[index];
    try {
      await deletePhoto(photoId);

      // objectURL 해제
      const url = imageUrls[photoId];
      if (url) URL.revokeObjectURL(url);

      // state 갱신
      setImages(prev => prev.filter((_, i) => i !== index));
      setImageUrls(prev => {
        const next = { ...prev };
        delete next[photoId];
        return next;
      });
    } catch (e) {
      console.error(e);
      alert("이미지 삭제에 실패했어요.");
    }
  };


  const toggleSkill = (skillTitle: string) => {
    if (skills.includes(skillTitle)) {
      setSkills(skills.filter(s => s !== skillTitle));
    } else {
      setSkills([...skills, skillTitle]);
    }
  };

  const addCustomSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setNewSkillInput('');
  };

  const handleSave = () => {
    const entry: DiaryEntryType = {
      id: initialData?.id || Date.now().toString(),
      date,
      content,
      images,
      mood,
      skills,
      height: height ? parseFloat(height) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
    };
    onSave(entry);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/95 backdrop-blur z-20">
        <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <ChevronLeft />
        </button>
        <div className="text-center">
          <h2 className="font-bold text-lg">{date}</h2>
          <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
            {dDay} / {ageString}
          </span>
        </div>
        <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-full font-bold text-sm shadow-md">
          저장
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20 no-scrollbar">
        {/* Mood Selector */}
        <section>
          <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">아기 기분</h3>
          <div className="flex justify-between gap-2">
            {(Object.keys(MOOD_CONFIG) as Mood[]).map((m) => {
              const config = MOOD_CONFIG[m];
              const isSelected = mood === m;
              return (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`flex flex-col items-center justify-center flex-1 p-3 rounded-2xl transition-all ${
                    isSelected ? `${config.bg} ring-2 ring-offset-1 ring-${config.color.split('-')[1]}-400 scale-105` : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <config.icon className={`mb-1 ${isSelected ? config.color : 'text-gray-400'}`} size={24} />
                  <span className={`text-xs font-medium ${isSelected ? 'text-gray-800' : 'text-gray-400'}`}>{config.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Photos */}
        <section>
          <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">사진 ({images.length}/3)</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((photoId, idx) => (
              <div key={photoId} className="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden shadow-sm">
                <img src={imageUrls[photoId]} alt="diary" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {images.length < 3 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition"
              >
                <Camera size={24} />
                <span className="text-xs mt-1">추가</span>
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
          </div>
        </section>

        {/* Growth (Height/Weight) Section */}
        <section>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">신체 기록</h3>
                {!showGrowthInputs && (
                    <button 
                        onClick={() => setShowGrowthInputs(true)} 
                        className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-bold flex items-center gap-1 hover:bg-gray-200"
                    >
                        <Plus size={14} /> 입력하기
                    </button>
                )}
            </div>
            
            {showGrowthInputs && (
                <div className="flex gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 animate-fadeIn">
                    <div className="flex-1">
                        <label className="text-xs font-bold text-gray-400 mb-1 flex items-center gap-1">
                            <Ruler size={12} /> 키 (cm)
                        </label>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                            <input 
                                type="number" 
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder="0.0" 
                                className="w-full bg-transparent outline-none text-gray-800 font-bold"
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-bold text-gray-400 mb-1 flex items-center gap-1">
                            <Scale size={12} /> 몸무게 (kg)
                        </label>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                            <input 
                                type="number" 
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="0.0" 
                                className="w-full bg-transparent outline-none text-gray-800 font-bold"
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>

        {/* Content */}
        <section>
          <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">내용</h3>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 아기에게 있었던 특별한 일을 기록해보세요..."
            className="w-full h-32 p-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none transition"
          />
        </section>

        {/* Development Milestones - Grouped */}
        <section>
          <div className="flex items-center justify-between mb-3">
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">발달 체크리스트 (미래 항목 포함)</h3>
          </div>

          <div className="space-y-4">
             {sortedGroupKeys.length === 0 ? (
                 <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-xl">체크할 발달 항목이 모두 완료되었습니다.</p>
             ) : (
                 sortedGroupKeys.map((groupKey) => {
                     const isExpanded = expandedGroups.has(groupKey);
                     const items = groupedMilestones[groupKey];
                     
                     // Check if this group is the "Current Age" group for highlighting
                     const parts = groupKey.match(/(\d+)(?:~(\d+))?/);
                     let isCurrentAgeGroup = false;
                     if(parts) {
                        const from = parseInt(parts[1]);
                        const to = parts[2] ? parseInt(parts[2]) : from;
                        isCurrentAgeGroup = monthAge >= from && monthAge <= to;
                     }

                     return (
                        <div key={groupKey} className={`rounded-xl border transition-all ${isExpanded ? 'bg-white border-primary/20 shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
                            <button 
                                onClick={() => toggleGroup(groupKey)}
                                className="w-full flex items-center justify-between p-3"
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-bold ${isExpanded ? 'text-gray-800' : 'text-gray-600'}`}>{groupKey}</span>
                                    {isCurrentAgeGroup && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">현재 월령</span>}
                                </div>
                                {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                            </button>
                            
                            {isExpanded && (
                                <div className="p-3 pt-0 border-t border-gray-50 space-y-2">
                                    {items.map((milestone) => {
                                        const isChecked = skills.includes(milestone.title);
                                        const Icon = CATEGORY_ICONS[milestone.category];
                                        const colorClass = CATEGORY_COLORS[milestone.category];

                                        return (
                                            <div 
                                                key={milestone.id} 
                                                onClick={() => toggleSkill(milestone.title)}
                                                className={`p-3 flex items-start gap-3 rounded-xl border transition cursor-pointer ${
                                                    isChecked
                                                        ? 'bg-white border-primary shadow-sm'
                                                        : 'bg-white border-gray-100 hover:border-primary/30'
                                                }`}
                                            >
                                                <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
                                                    isChecked 
                                                        ? 'bg-primary border-primary text-white' 
                                                        : 'border-gray-200 bg-white'
                                                }`}>
                                                    {isChecked && <Check size={12} strokeWidth={3} />}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="font-bold text-sm text-gray-800">
                                                            {milestone.title}
                                                        </span>
                                                        {milestone.isCore && <span className="text-[10px] bg-red-50 text-red-500 px-1.5 rounded border border-red-100">핵심</span>}
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 ${colorClass}`}>
                                                            <Icon size={10} /> {CATEGORY_NAMES[milestone.category]}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 leading-snug">{milestone.detail}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                     );
                 })
             )}
          </div>

          {/* Custom Skill Input */}
          <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 mb-2">기타 항목 추가</h4>
              <div className="flex gap-2">
                <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    placeholder="리스트에 없는 스킬 (예: 엄마)"
                    className="flex-1 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-primary text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && newSkillInput && addCustomSkill(newSkillInput)}
                />
                <button
                    onClick={() => newSkillInput && addCustomSkill(newSkillInput)}
                    className="px-4 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200"
                >
                    <Plus size={20} />
                </button>
            </div>
             <div className="flex flex-wrap gap-2 mt-3">
                {/* Show custom skills that are NOT in the standard milestone list */}
                {skills.filter(s => !MILESTONES.some(m => m.title === s)).map((skill, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        {skill}
                        <button onClick={() => setSkills(skills.filter(s => s !== skill))}><X size={12} /></button>
                    </span>
                ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
