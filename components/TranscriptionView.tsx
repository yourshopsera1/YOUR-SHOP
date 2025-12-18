
import React, { useState } from 'react';
import { geminiService } from '../services/gemini';

const TranscriptionView: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = async () => {
          setIsLoading(true);
          try {
            const result = await geminiService.transcribeAudio(reader.result as string, 'audio/webm');
            setTranscription(result);
          } catch (e) {
            console.error(e);
          } finally {
            setIsLoading(false);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      recorder.start();
      setIsRecording(true);
    } catch (e) {
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="text-center">
        <h2 className="text-3xl font-bold mb-2">Voice Transcription</h2>
        <p className="text-slate-400">Transcribe customer voice notes or business meetings using Gemini 3 Flash.</p>
      </header>

      <div className="glass p-12 rounded-[3rem] flex flex-col items-center gap-8 border-indigo-500/10">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-2xl transition-all active:scale-90 ${
            isRecording ? 'bg-red-600 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
        >
          {isRecording ? '⏹️' : '🎤'}
        </button>
        <p className="font-bold tracking-widest text-slate-500">
          {isRecording ? 'RECORDING IN PROGRESS...' : 'CLICK TO START RECORDING'}
        </p>
      </div>

      {(isLoading || transcription) && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-indigo-400 font-bold">Transcribing...</p>
              </div>
            </div>
          )}
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Transcription Output</h3>
          <p className="text-lg leading-relaxed text-slate-200">{transcription || 'Your words will appear here...'}</p>
        </div>
      )}
    </div>
  );
};

import { useRef } from 'react';
export default TranscriptionView;
