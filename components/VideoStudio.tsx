
import React, { useState } from 'react';
import { geminiService } from '../services/gemini';

const VideoStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'generate' | 'analyze'>('generate');
  const [analysis, setAnalysis] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsProcessing(true);
    try {
      const url = await geminiService.generateVideo(prompt);
      setVideoUrl(url);
    } catch (e) {
      console.error(e);
      alert("Error generating video. Make sure you have the correct billing and API key selected.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (mode === 'analyze') {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const result = await geminiService.analyzeMedia("Analyze this video and describe the products shown.", base64, file.type);
          setAnalysis(result || '');
        } catch (err) {
          console.error(err);
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <span>🎬</span> Video Studio
          </h2>
          <p className="text-slate-400">Cinematic content for ArzuBazar marketing.</p>
        </div>
        <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
          <button 
            onClick={() => setMode('generate')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'generate' ? 'bg-indigo-600' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            Text to Video
          </button>
          <button 
            onClick={() => setMode('analyze')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'analyze' ? 'bg-indigo-600' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            Video Analysis
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl">
            <h3 className="text-xl font-bold mb-4">{mode === 'generate' ? 'Video Prompt' : 'Upload for Analysis'}</h3>
            
            {mode === 'generate' ? (
              <>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A cinematic 1080p drone shot of a luxurious fashion collection..."
                  className="w-full h-40 bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:outline-none focus:border-indigo-500 transition-all resize-none mb-6"
                />
                <button
                  onClick={handleGenerate}
                  disabled={isProcessing}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-2xl font-bold text-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-indigo-900/20"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Rendering Scene...
                    </>
                  ) : (
                    <>Generate Veo Video ✨</>
                  )}
                </button>
              </>
            ) : (
              <div className="space-y-6">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-700 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-slate-900/50 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <span className="text-4xl mb-3">📁</span>
                    <p className="mb-2 text-sm text-slate-400">Click to upload video</p>
                    <p className="text-xs text-slate-500">MP4, MOV up to 10MB</p>
                  </div>
                  <input type="file" className="hidden" accept="video/*" onChange={handleFileUpload} />
                </label>
                {analysis && (
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <h4 className="font-bold text-indigo-400 mb-2">Analysis Results</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{analysis}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-amber-900/10 border border-amber-500/20 p-6 rounded-2xl">
            <h4 className="flex items-center gap-2 font-bold text-amber-500 mb-2">
              <span>⚠️</span> Billing Notice
            </h4>
            <p className="text-xs text-amber-500/80 leading-relaxed">
              Veo 3 video generation requires a paid Google Cloud Project. Ensure your API key is associated with a billing account at <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline">ai.google.dev</a>.
            </p>
          </div>
        </div>

        <div className="aspect-video bg-slate-950 border border-slate-800 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl relative">
          {isProcessing ? (
            <div className="flex flex-col items-center text-center p-8 gap-4">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold">Bringing your imagination to life</h3>
              <p className="text-slate-500 max-w-xs">Generating high-fidelity frames. This usually takes 1-2 minutes.</p>
            </div>
          ) : videoUrl ? (
            <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
          ) : (
            <div className="text-center opacity-30 select-none">
              <span className="text-8xl block mb-6">🎥</span>
              <p className="text-xl font-medium">Render preview area</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoStudio;
