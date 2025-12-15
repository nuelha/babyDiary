import React, { useState } from 'react';
import { VACCINATIONS } from '../constants';
import { CompletedVaccination } from '../types';
import { Syringe, Check, Clock, ListTodo, ClipboardCheck, Calendar, X } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  birthDate: string;
  completedVaccinations: CompletedVaccination[];
  onToggleVaccination: (id: string, date?: string) => void;
}

export const VaccinationView: React.FC<Props> = ({ completedVaccinations, onToggleVaccination }) => {
  // Tabs: 'todo' (진행예정) vs 'done' (완료됨)
  const [activeTab, setActiveTab] = useState<'todo' | 'done'>('todo');
  
  // Modal State
  const [selectedVaccineId, setSelectedVaccineId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // Get list of completed IDs for easy checking
  const completedIds = completedVaccinations.map(v => v.id);

  // Filter lists based on completion status
  const todoList = VACCINATIONS.filter(v => !completedIds.includes(v.id));
  const doneList = VACCINATIONS.filter(v => completedIds.includes(v.id));

  const displayList = activeTab === 'todo' ? todoList : doneList;
  const completedCount = completedVaccinations.length;
  const totalCount = VACCINATIONS.length;

  const handleItemClick = (id: string, isCompleted: boolean) => {
      if (isCompleted) {
          // If already completed, just toggle off (remove) immediately or confirm
          if(window.confirm('접종 기록을 취소하시겠습니까?')) {
              onToggleVaccination(id);
          }
      } else {
          // If not completed, open modal to select date
          setSelectedVaccineId(id);
          setSelectedDate(format(new Date(), 'yyyy-MM-dd')); // Reset to today
      }
  };

  const confirmVaccination = () => {
      if (selectedVaccineId && selectedDate) {
          onToggleVaccination(selectedVaccineId, selectedDate);
          setSelectedVaccineId(null);
      }
  };

  const getCompletedDate = (id: string) => {
      const record = completedVaccinations.find(v => v.id === id);
      return record ? record.date : '';
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto no-scrollbar pb-24 relative">
      <div className="bg-white p-6 pb-2 shadow-sm mb-4 sticky top-0 z-10">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Syringe size={24} className="text-blue-500" /> 예방접종
        </h2>
        
        {/* Progress Bar */}
        <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">전체 접종 진행률</span>
                <span className="font-bold text-blue-500">{Math.round((completedCount/totalCount)*100)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 transition-all duration-500" style={{ width: `${(completedCount/totalCount)*100}%` }}></div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 gap-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setActiveTab('todo')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'todo' 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ListTodo size={16} /> 진행예정 ({todoList.length})
          </button>
          <button
            onClick={() => setActiveTab('done')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'done' 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ClipboardCheck size={16} /> 완료됨 ({doneList.length})
          </button>
        </div>
      </div>

      <div className="px-4 space-y-3">
         {displayList.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-sm">
             <Clock size={32} className="mb-2 opacity-20" />
             {activeTab === 'todo' ? '예정된 접종이 없습니다.' : '완료된 접종이 없습니다.'}
           </div>
         ) : (
           displayList.map(v => {
             const isCompleted = completedIds.includes(v.id);
             return (
               <div 
                  key={v.id} 
                  onClick={() => handleItemClick(v.id, isCompleted)}
                  className={`
                    flex items-center justify-between p-4 rounded-2xl border transition cursor-pointer select-none
                    ${isCompleted 
                      ? 'bg-gray-50 border-gray-100' 
                      : 'bg-white border-blue-100 shadow-sm hover:border-blue-300'}
                  `}
               >
                 <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                     <span className={`font-bold ${isCompleted ? 'text-gray-800' : 'text-gray-800'}`}>
                       {v.disease} {v.doseNumber}차
                     </span>
                     <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                         v.recommendedMonth === 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-50 text-blue-500'
                     }`}>
                       {v.recommendedMonth === 0 ? '출생 시' : `${v.recommendedMonth}개월`}
                     </span>
                   </div>
                   <p className="text-xs text-gray-400">{v.description || '필수 접종 항목'}</p>
                   {isCompleted && (
                       <p className="text-xs text-blue-500 mt-1 flex items-center gap-1 font-medium">
                           <Calendar size={10} />
                           {getCompletedDate(v.id)} 접종완료
                       </p>
                   )}
                 </div>
                 
                 <div className={`
                   w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ml-4 flex-shrink-0
                   ${isCompleted 
                     ? 'bg-blue-500 border-blue-500 text-white' 
                     : 'border-gray-200 text-transparent hover:border-blue-400'}
                 `}>
                   <Check size={14} strokeWidth={3} />
                 </div>
               </div>
             );
           })
         )}
      </div>

      {/* Date Selection Modal */}
      {selectedVaccineId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-fadeIn mb-4 sm:mb-0">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">접종일자 선택</h3>
                    <button onClick={() => setSelectedVaccineId(null)} className="p-1 rounded-full hover:bg-gray-100">
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

                <div className="flex gap-3">
                    <button 
                        onClick={() => setSelectedVaccineId(null)}
                        className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold"
                    >
                        취소
                    </button>
                    <button 
                        onClick={confirmVaccination}
                        className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-bold shadow-lg hover:bg-blue-600"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};