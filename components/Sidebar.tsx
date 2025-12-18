
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: '🏠' },
    { id: AppView.CHAT, label: 'Smart Chat', icon: '💬' },
    { id: AppView.IMAGE_STUDIO, label: 'Image Studio', icon: '🖼️' },
    { id: AppView.VIDEO_STUDIO, label: 'Video Studio', icon: '🎬' },
    { id: AppView.LIVE_VOICE, label: 'Live Voice', icon: '🎙️' },
    { id: AppView.GROUNDING, label: 'Search & Maps', icon: '🗺️' },
    { id: AppView.TRANSCRIPTION, label: 'Transcription', icon: '📝' },
  ];

  return (
    <aside className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-xl">✨</div>
        <div className="hidden md:block font-bold text-lg tracking-tight">AI Control</div>
      </div>
      
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              activeView === item.id 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-950/50 rounded-xl p-3 text-xs text-slate-500">
          <p className="font-semibold text-slate-400 mb-1">Sites Linked:</p>
          <p>arzubazar.com</p>
          <p>yourshopsera.com</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
