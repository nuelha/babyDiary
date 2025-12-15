import React from 'react';
import { DiaryEntry } from '../types';
import { MOOD_CONFIG } from '../constants';
import { formatDateKorean } from '../utils/dateUtils';
import { BookOpen, Image as ImageIcon, Ruler, Scale } from 'lucide-react';
import { parseISO } from 'date-fns';

interface Props {
  entries: Record<string, DiaryEntry>;
  onEntryClick: (date: string) => void;
}

export const DailyView: React.FC<Props> = ({ entries, onEntryClick }) => {
  // Sort entries by date descending
  const sortedDates = Object.keys(entries).sort().reverse();

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto no-scrollbar pb-24">
      <div className="bg-white p-6 pb-4 shadow-sm mb-4 sticky top-0 z-10">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen size={24} className="text-primary" /> 일력
        </h2>
        <p className="text-xs text-gray-400 mt-1">작성된 다이어리를 모아봅니다.</p>
      </div>

      <div className="px-4 space-y-4">
        {sortedDates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <BookOpen size={48} className="mb-4 opacity-20" />
            <p>아직 작성된 일기가 없습니다.</p>
            <p className="text-xs mt-2">오늘의 이야기를 기록해보세요!</p>
          </div>
        ) : (
          sortedDates.map((date) => {
            const entry = entries[date];
            const mood = MOOD_CONFIG[entry.mood];
            const hasImages = entry.images.length > 0;
            const hasGrowthData = !!entry.height || !!entry.weight;
            
            return (
              <div 
                key={date} 
                onClick={() => onEntryClick(date)}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 active:scale-98 transition-transform cursor-pointer"
              >
                {/* Image Section */}
                {hasImages ? (
                    <div className="relative w-full aspect-video bg-gray-100">
                        <img 
                            src={entry.images[0]} 
                            alt="Main" 
                            className="w-full h-full object-cover" 
                        />
                        {entry.images.length > 1 && (
                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                <ImageIcon size={10} />
                                +{entry.images.length - 1}
                            </div>
                        )}
                    </div>
                ) : (
                    // Placeholder for text-only entries to give them some visual weight
                    <div className="h-4 bg-primary/5 border-b border-primary/10" />
                )}

                {/* Content Section */}
                <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-gray-800">
                            {formatDateKorean(parseISO(entry.date))}
                        </span>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${mood.bg}`}>
                            <mood.icon className={mood.color} size={14} />
                            <span className={`text-xs font-bold ${mood.color}`}>{mood.label}</span>
                        </div>
                    </div>

                    {/* Growth Data Chips */}
                    {hasGrowthData && (
                      <div className="flex gap-2 mb-3">
                        {entry.height && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                             <Ruler size={10} /> {entry.height}cm
                          </span>
                        )}
                        {entry.weight && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                             <Scale size={10} /> {entry.weight}kg
                          </span>
                        )}
                      </div>
                    )}
                    
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {entry.content || "내용 없음"}
                    </p>

                    {entry.skills.length > 0 && (
                        <div className="flex gap-1 mt-3 overflow-hidden">
                            {entry.skills.slice(0, 3).map((skill, i) => (
                                <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
                                    #{skill}
                                </span>
                            ))}
                            {entry.skills.length > 3 && (
                                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
                                    +{entry.skills.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};