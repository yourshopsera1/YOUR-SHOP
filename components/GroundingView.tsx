
import React, { useState } from 'react';
import { geminiService } from '../services/gemini';

const GroundingView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ text: string, links: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [groundingType, setGroundingType] = useState<'search' | 'maps'>('search');

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    try {
      if (groundingType === 'search') {
        const res = await geminiService.searchGrounding(query);
        setResults(res);
      } else {
        // Maps Grounding
        const res = await geminiService.mapsGrounding(query);
        setResults(res);
      }
    } catch (e) {
      console.error(e);
      alert("Grounding request failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="text-center">
        <h2 className="text-3xl font-bold mb-2">Intelligent Grounding</h2>
        <p className="text-slate-400">Get factual, real-time data from Google Search & Maps.</p>
      </header>

      <div className="glass p-6 rounded-3xl space-y-6">
        <div className="flex gap-4 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button 
            onClick={() => setGroundingType('search')}
            className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${groundingType === 'search' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <span>🔍</span> Google Search
          </button>
          <button 
            onClick={() => setGroundingType('maps')}
            className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${groundingType === 'maps' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <span>📍</span> Google Maps
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={groundingType === 'search' ? "Search for latest market trends..." : "Find nearby competitors or warehouses..."}
            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-2xl px-6 py-5 pr-16 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 p-2.5 rounded-xl disabled:opacity-50"
          >
            {isLoading ? '...' : '✈️'}
          </button>
        </div>
      </div>

      {results && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
              {results.text}
            </div>
          </div>
          
          {results.links.length > 0 && (
            <div className="pt-6 border-t border-slate-800">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Sources</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-indigo-500 transition-colors"
                  >
                    <span className="text-indigo-400">🔗</span>
                    <span className="text-sm font-medium truncate">{link.title || link.uri}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroundingView;
