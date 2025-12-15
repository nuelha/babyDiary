import React from 'react';
import { Calendar, Book, Syringe, Sparkles, Settings } from 'lucide-react';

export type Tab = 'calendar' | 'daily' | 'milestone' | 'vaccination' | 'settings';

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const BottomNavigation: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'calendar', label: '월력', icon: Calendar },
    { id: 'daily', label: '일력', icon: Book },
    { id: 'milestone', label: '발달', icon: Sparkles },
    { id: 'vaccination', label: '접종', icon: Syringe },
    { id: 'settings', label: '설정', icon: Settings },
  ];

  return (
    <div className="bg-white border-t border-gray-100 pb-safe fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40">
      <div className="flex justify-around items-center px-2 py-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[60px] transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon size={24} strokeWidth={isActive ? 2.5 : 2} className="mb-1" />
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};