
import React, { useState } from 'react';
import { geminiService } from '../services/gemini';
import { AspectRatio, ImageSize } from '../types';

const ImageStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [editPrompt, setEditPrompt] = useState('');

  const ratios: AspectRatio[] = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'];
  const sizes: ImageSize[] = ['1K', '2K', '4K'];

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const url = await geminiService.generateImage(prompt, aspectRatio, imageSize);
      setGeneratedImage(url);
    } catch (e) {
      console.error(e);
      alert("Error generating image.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async () => {
    if (!editPrompt || !generatedImage) return;
    setIsGenerating(true);
    try {
      const url = await geminiService.editImage(editPrompt, generatedImage, 'image/png');
      setGeneratedImage(url);
      setEditPrompt('');
    } catch (e) {
      console.error(e);
      alert("Error editing image.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <span>🖼️</span> Image Studio
        </h2>
        <p className="text-slate-400">Create high-quality product visuals for ArzuBazar.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-2xl space-y-4">
            <h3 className="font-semibold text-indigo-400">Settings</h3>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-500">Aspect Ratio</label>
              <div className="grid grid-cols-4 gap-2">
                {ratios.map(r => (
                  <button
                    key={r}
                    onClick={() => setAspectRatio(r)}
                    className={`text-xs py-2 rounded-lg border transition-all ${
                      aspectRatio === r ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-500">Resolution</label>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setImageSize(s)}
                    className={`text-xs py-2 rounded-lg border transition-all ${
                      imageSize === s ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl space-y-4">
            <h3 className="font-semibold">Prompt</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the product image you want..."
              className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 focus:outline-none focus:border-indigo-500 transition-all resize-none"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {isGenerating ? 'Generating...' : 'Generate Visual'} ⚡
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-square w-full glass rounded-3xl flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-800 relative">
            {isGenerating && (
              <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center flex-col gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-indigo-400 font-medium">Processing pixels...</p>
              </div>
            )}
            
            {generatedImage ? (
              <img src={generatedImage} alt="AI Generated" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-8">
                <span className="text-6xl block mb-4">🎨</span>
                <p className="text-slate-500">Your generated masterpiece will appear here</p>
              </div>
            )}
          </div>

          {generatedImage && (
            <div className="flex gap-4 items-center">
              <input 
                type="text"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Suggest edits (e.g. 'Add a retro filter', 'Change background to sunset')"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
              />
              <button 
                onClick={handleEdit}
                disabled={isGenerating}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold border border-slate-700"
              >
                Refine ✏️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageStudio;
