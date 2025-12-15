import React, { useState } from 'react';
import { AppState } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MOOD_CONFIG } from '../constants';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface Props {
  appState: AppState;
  onDateClick: (dateStr: string) => void;
}

export const CalendarView: React.FC<Props> = ({ appState, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = monthStart; 
  const endDate = monthEnd;

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Create padding for empty grid cells at start of month
  const startDayOfWeek = getDay(monthStart); // 0 (Sun) to 6 (Sat)
  const emptyDays = Array(startDayOfWeek).fill(null);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const getEntryForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appState.entries[dateStr];
  };

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const hasTodayEntry = !!appState.entries[todayStr];

  return (
    <div className="flex-1 overflow-y-auto bg-white no-scrollbar pb-24">
      {/* Calendar Header */}
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {format(currentDate, 'yyyy년 M월', { locale: ko })}
          </h2>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
              <ChevronLeft size={20} />
            </button>
            <button onClick={handleNextMonth} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Area (Shown only if today has no entry) */}
      {!hasTodayEntry && (
        <div className="px-6 pb-6">
          <div className="p-4 bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-2xl border border-secondary/20 flex items-center justify-between">
              <div>
                  <p className="text-sm text-teal-800 font-bold mb-1">오늘의 기록을 남겨보세요</p>
                  <p className="text-xs text-teal-600">작은 순간들이 모여 추억이 됩니다.</p>
              </div>
              <button 
                  onClick={() => onDateClick(todayStr)}
                  className="bg-white p-3 rounded-full shadow-sm text-teal-500 hover:scale-110 transition"
              >
                  <Plus />
              </button>
          </div>
        </div>
      )}

      {/* Days of Week */}
      <div className="grid grid-cols-7 border-b border-gray-100 mb-0 sticky top-0 bg-white z-10">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
          <div key={day} className={`text-center text-xs font-bold py-2 ${i === 0 ? 'text-red-400' : 'text-gray-400'}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid - Gapless for connected bars */}
      <div className="grid grid-cols-7 gap-0 border-b border-gray-50">
        {emptyDays.map((_, i) => <div key={`empty-${i}`} className="h-24 bg-gray-50/20 border-r border-b border-gray-50" />)}
        
        {calendarDays.map((date: Date) => {
          const entry = getEntryForDate(date);
          const isToday = isSameDay(date, new Date());
          const dateStr = format(date, 'yyyy-MM-dd');
          const dayNum = format(date, 'd');
          const moodConfig = entry ? MOOD_CONFIG[entry.mood] : null;
          const isFuture = dateStr > todayStr;
          
          return (
            <div 
              key={date.toString()} 
              onClick={() => !isFuture && onDateClick(dateStr)}
              className={`
                relative h-24 border-b border-r border-gray-50 flex flex-col items-center pt-2 transition
                ${isFuture 
                    ? 'opacity-30 bg-gray-50 cursor-not-allowed' 
                    : 'cursor-pointer hover:bg-gray-50/50 group'}
              `}
            >
              {/* Day Number */}
              <div className={`
                w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium z-10
                ${isToday ? 'bg-primary text-white shadow-md' : 'text-gray-700'}
                ${getDay(date) === 0 ? 'text-red-400' : ''}
              `}>
                {dayNum}
              </div>
              
              {/* Photo / Content Area */}
              <div className="flex-1 w-full flex items-center justify-center py-1 z-10">
                {entry && entry.images.length > 0 ? (
                  <div className={`p-0.5 rounded-full border ${moodConfig?.color.replace('text', 'border') || 'border-transparent'}`}>
                     <img 
                        src={entry.images[0]} 
                        alt="thumbnail" 
                        className="w-8 h-8 rounded-full object-cover" 
                      />
                  </div>
                ) : entry ? (
                   // Optional: Simple dot if no image but entry exists
                   <div className={`w-1.5 h-1.5 rounded-full ${moodConfig?.color.replace('text', 'bg') || 'bg-gray-300'}`}></div>
                ) : null}
              </div>

              {/* Connected Mood Bar */}
              {entry && moodConfig && (
                <div className={`absolute bottom-0 left-0 right-0 h-2.5 opacity-80 ${moodConfig.barColor}`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};