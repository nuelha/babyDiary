
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { MILESTONES } from '../constants';
import { User, Calendar, Clock, Save, Download, Check } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const SettingsView: React.FC<Props> = ({ profile, onUpdateProfile }) => {
  const [name, setName] = useState(profile.name);
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [notificationTime, setNotificationTime] = useState(profile.notificationTime);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, birthDate, notificationTime });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDownloadCsv = () => {
    // 1. Define Headers
    const headers = ['id', 'title', 'category', 'monthFrom', 'monthTo', 'isCore', 'detail', 'prerequisiteId'];

    // 2. Create Rows
    const rows = MILESTONES.map(m => [
      m.id,
      m.title,
      m.category,
      m.monthFrom,
      m.monthTo,
      m.isCore ? 'TRUE' : 'FALSE',
      `"${m.detail.replace(/"/g, '""')}"`, // Escape quotes and wrap in quotes for CSV safety
      m.prerequisiteId || ''
    ]);

    // 3. Combine to CSV String with BOM for Excel Korean support
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    // 4. Create Blob and Link
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const fileName = `babylog_milestones_${new Date().toISOString().split('T')[0]}.csv`;
    
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    
    // 5. Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto no-scrollbar pb-24">
      <div className="bg-white p-6 pb-4 shadow-sm mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <SettingsIcon /> 설정
        </h2>
      </div>

      <div className="px-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 text-sm">아기 정보 수정</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 mb-1 block">이름 (태명)</label>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <User size={18} className="text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 mb-1 block">생년월일</label>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <Calendar size={18} className="text-gray-400" />
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-800 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 text-sm">앱 설정</h3>
            
            <div>
              <label className="text-xs font-bold text-gray-400 mb-1 block">다이어리 알림 시간</label>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <Clock size={18} className="text-gray-400" />
                <input
                  type="time"
                  value={notificationTime}
                  onChange={(e) => setNotificationTime(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-800 font-medium"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-2">
                * 매일 해당 시간에 다이어리 작성 알림을 보내드립니다.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 text-sm">데이터 관리</h3>
            
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-100 transition"
            >
              <Download size={18} /> 발달 데이터 CSV 내보내기
            </button>
            <p className="text-[10px] text-gray-400 mt-2 leading-snug">
              * 현재 앱에 등록된 모든 발달 단계(Milestones) 데이터를 CSV 파일로 저장합니다. 엑셀에서 열어 확인하거나 내용을 추가할 때 활용하세요.
            </p>
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
              isSaved ? 'bg-green-500' : 'bg-primary hover:bg-red-400'
            }`}
          >
            {isSaved ? <span className="flex items-center gap-2"><Check size={20} /> 저장되었습니다</span> : <span className="flex items-center gap-2"><Save size={20} /> 저장하기</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

// Internal icon component to avoid conflict with imported 'Settings' from lucide-react in main file
const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
