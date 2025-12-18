
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

const LiveVoice: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);

  // Helper functions for base64 encoding/decoding and PCM handling
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      let nextStartTime = 0;
      const sources = new Set<AudioBufferSourceNode>();

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
            setIsActive(true);
          },
          onmessage: async (msg: any) => {
            if (msg.serverContent?.outputTranscription) {
              setTranscription(prev => [...prev.slice(-10), `AI: ${msg.serverContent.outputTranscription.text}`]);
            }
            if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              const base64 = msg.serverContent.modelTurn.parts[0].inlineData.data;
              nextStartTime = Math.max(nextStartTime, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(base64), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTime);
              nextStartTime += buffer.duration;
              sources.add(source);
            }
            if (msg.serverContent?.interrupted) {
              sources.forEach(s => s.stop());
              sources.clear();
              nextStartTime = 0;
            }
          },
          onclose: () => setIsActive(false),
          onerror: (err) => console.error(err),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are a friendly and professional voice assistant for ArzuBazar and ShopSera. Help users with order status and product info.',
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      alert("Failed to start voice session. Ensure microphone permissions are granted.");
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Native Voice Control</h2>
        <p className="text-slate-400">Low-latency audio interaction with Gemini 2.5</p>
      </div>

      <div className="relative">
        <div className={`absolute -inset-4 rounded-full bg-indigo-500/20 blur-2xl transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
        <button
          onClick={isActive ? stopSession : startSession}
          className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all transform active:scale-95 ${
            isActive 
              ? 'bg-red-600 shadow-[0_0_50px_rgba(220,38,38,0.5)]' 
              : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
        >
          {isActive ? (
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">⏹️</span>
              <span className="font-bold">End Session</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">🎙️</span>
              <span className="font-bold">Go Live</span>
            </div>
          )}
        </button>
      </div>

      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 min-h-[200px] max-h-[400px] overflow-y-auto flex flex-col gap-2">
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Transcription Stream</h3>
        {transcription.length === 0 ? (
          <p className="text-slate-600 italic">Conversation will appear here...</p>
        ) : (
          transcription.map((t, i) => (
            <p key={i} className="text-slate-300 animate-in fade-in slide-in-from-left-2">{t}</p>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveVoice;
