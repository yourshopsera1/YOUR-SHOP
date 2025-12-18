
import React, { useState } from 'react';
import { AppView } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatView from './components/ChatView';
import ImageStudio from './components/ImageStudio';
import VideoStudio from './components/VideoStudio';
import LiveVoice from './components/LiveVoice';
import GroundingView from './components/GroundingView';
import TranscriptionView from './components/TranscriptionView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard onViewChange={setCurrentView} />;
      case AppView.CHAT:
        return <ChatView />;
      case AppView.IMAGE_STUDIO:
        return <ImageStudio />;
      case AppView.VIDEO_STUDIO:
        return <VideoStudio />;
      case AppView.LIVE_VOICE:
        return <LiveVoice />;
      case AppView.GROUNDING:
        return <GroundingView />;
      case AppView.TRANSCRIPTION:
        return <TranscriptionView />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar activeView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto h-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
