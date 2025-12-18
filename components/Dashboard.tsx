
import React from 'react';
import { AppView } from '../types';

interface DashboardProps {
  onViewChange: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const stats = [
    { label: 'Active Sites', value: '2', icon: '🌐' },
    { label: 'AI Models', value: 'Gemini 3 Pro', icon: '🧠' },
    { label: 'Media Assets', value: '428', icon: '📁' },
    { label: 'Uptime', value: '99.9%', icon: '⚡' },
  ];

  const features = [
    { id: AppView.CHAT, title: 'AI Chatbot', desc: 'Manage customer queries for your shops with high reasoning.', icon: '💬', color: 'bg-blue-500' },
    { id: AppView.IMAGE_STUDIO, title: 'Product Visuals', desc: 'Generate 4K product photos and edit with natural language.', icon: '🎨', color: 'bg-purple-500' },
    { id: AppView.VIDEO_STUDIO, title: 'Marketing Video', desc: 'Create 1080p cinematic ads from simple text prompts.', icon: '📹', color: 'bg-indigo-500' },
    { id: AppView.LIVE_VOICE, title: 'Live Agent', desc: 'Real-time voice conversation with native audio intelligence.', icon: '🎙️', color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-bold mb-2">Welcome Back, Owner</h1>
        <p className="text-slate-400">Manage ArzuBazar and YourShopSera with cutting-edge Gemini AI.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-slate-500 text-sm uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => onViewChange(feature.id)}
              className="group text-left p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10"
            >
              <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="glass rounded-3xl p-8 border-indigo-500/20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Deep Insights with Thinking Mode</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Use Gemini 3 Pro with advanced reasoning to solve your most complex business challenges.
              From inventory optimization to strategic market analysis, let the AI think for you.
            </p>
            <button 
              onClick={() => onViewChange(AppView.CHAT)}
              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              Start Deep Reasoning 🚀
            </button>
          </div>
          <div className="w-full md:w-1/3 aspect-video bg-indigo-900/20 rounded-2xl border border-indigo-500/20 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🧠</span>
              </div>
              <div className="h-2 w-32 bg-indigo-500/30 rounded mb-2"></div>
              <div className="h-2 w-24 bg-indigo-500/20 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
