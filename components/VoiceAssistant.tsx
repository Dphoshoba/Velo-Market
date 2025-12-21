
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { decodeBase64Audio, encodeAudioBlob, decodeAudioData } from '../services/gemini';

interface VoiceAssistantProps {
  contextPrompt: string;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ contextPrompt }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = encodeAudioBlob(inputData);
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
            (sessionRef.current as any) = { stop: () => {
                stream.getTracks().forEach(t => t.stop());
                scriptProcessor.disconnect();
                source.disconnect();
            }};
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setIsSpeaking(true);
              const ctx = outAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decodeBase64Audio(base64Audio),
                ctx,
                24000,
                1
              );
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onclose: () => stopSession(),
          onerror: (e) => console.error("Voice Error:", e)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: `You are a premium marketplace concierge for VeloMarket. 
          Respond in a warm, sophisticated, helpful tone. 
          Keep answers brief and conversational. 
          Context: ${contextPrompt}`
        }
      });
      
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      if (sessionRef.current.stop) sessionRef.current.stop();
      if (sessionRef.current.close) sessionRef.current.close();
    }
    setIsActive(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <div className={`flex items-center gap-4 bg-white p-3 rounded-full shadow-2xl border transition-all duration-500 ${isActive ? 'pr-6 ring-4 ring-indigo-50 border-indigo-200' : 'w-14 overflow-hidden'}`}>
        <button 
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
        >
          {isConnecting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : isActive ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a3 3 0 116 0 3 3 0 01-6 0z" clipRule="evenodd" /></svg>
          )}
        </button>

        {isActive && (
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 animate-pulse">
              {isSpeaking ? 'Velo is speaking...' : 'Listening...'}
            </span>
            <div className="flex gap-1 h-3 items-center">
              {[1, 2, 3, 4, 5].map(i => (
                <div 
                  key={i} 
                  className={`bg-indigo-400 rounded-full w-0.5 transition-all duration-150 ${isSpeaking || isActive ? 'animate-bounce' : 'h-1'}`}
                  style={{ 
                    height: isActive ? `${Math.random() * 100}%` : '20%',
                    animationDelay: `${i * 0.1}s` 
                  }}
                ></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
