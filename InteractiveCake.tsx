import React, { useState, useEffect, useRef } from 'react';
import { Flame, Wind, Mic, Sparkles, Check, Scissors, Volume2 } from 'lucide-react';
import { audioEngine } from '../utils/audio';
import { fireConfettiCannon, triggerFireworks } from '../utils/confetti';

interface InteractiveCakeProps {
  personName: string;
  age: number;
}

export const InteractiveCake: React.FC<InteractiveCakeProps> = ({ personName, age }) => {
  // Cap displayed candles for visual aesthetics (1 to 10 candles max)
  const numCandles = Math.min(Math.max(1, age % 10 || 5), 8);
  const [litCandles, setLitCandles] = useState<boolean[]>(Array(numCandles).fill(true));
  const [isCakeCut, setIsCakeCut] = useState(false);
  const [isMicListening, setIsMicListening] = useState(false);
  const [micVolume, setMicVolume] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const allBlownOut = litCandles.every((lit) => !lit);

  // Check if all candles just got blown out
  useEffect(() => {
    if (allBlownOut && litCandles.length > 0) {
      audioEngine.playCandleBlowSound();
      audioEngine.playCheerSound();
      fireConfettiCannon();
      triggerFireworks();
    }
  }, [allBlownOut]);

  const blowOutCandle = (index: number) => {
    if (!litCandles[index]) return;
    setLitCandles((prev) => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
    audioEngine.playCandleBlowSound();
    if (!audioEngine.isMusicPlaying()) {
      audioEngine.startMusic();
    }
  };

  const blowOutAllCandles = () => {
    setLitCandles(Array(numCandles).fill(false));
    if (!audioEngine.isMusicPlaying()) {
      audioEngine.startMusic();
    }
  };

  const relightCandles = () => {
    setLitCandles(Array(numCandles).fill(true));
    setIsCakeCut(false);
    audioEngine.playTapSound();
  };

  // Toggle Microphone Listening for Blowing candles
  const toggleMicrophone = async () => {
    if (isMicListening) {
      stopMic();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        micStreamRef.current = stream;
        
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        setIsMicListening(true);

        const checkBlow = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setMicVolume(Math.round(avg));

          // If sound level/air blow threshold passed, blow candles!
          if (avg > 45) {
            blowOutAllCandles();
          }

          animFrameRef.current = requestAnimationFrame(checkBlow);
        };

        checkBlow();
      } catch (err) {
        console.warn("Microphone access denied or unavailable:", err);
        alert("Microphone permission was not granted. You can tap or click the candles to blow them out!");
        stopMic();
      }
    }
  };

  const stopMic = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsMicListening(false);
    setMicVolume(0);
  };

  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  const handleCutCake = () => {
    setIsCakeCut(true);
    audioEngine.playUnboxSound();
    fireConfettiCannon();
  };

  return (
    <div className="my-12 px-4 max-w-3xl mx-auto text-center">
      
      {/* Title Header */}
      <div className="mb-6">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-300 flex items-center justify-center gap-2">
          <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
          The Birthday Cake
          <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          {allBlownOut ? "✨ Make a wish! All candles blown out! ✨" : "Blow or click the candles to make a wish!"}
        </p>
      </div>

      {/* Main Interactive Cake Stage */}
      <div className="relative py-12 flex flex-col items-center justify-center min-h-[340px] bg-slate-900/60 rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md">
        
        {/* Soft Cake Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-pink-500/5 to-transparent pointer-events-none" />

        {/* CANDLES ROW */}
        <div className="flex items-end justify-center gap-3 sm:gap-5 mb-1 z-20">
          {litCandles.map((isLit, idx) => (
            <div
              key={idx}
              onClick={() => blowOutCandle(idx)}
              className="group cursor-pointer flex flex-col items-center transition-transform hover:scale-110"
              title={isLit ? "Click to blow candle" : "Candle blown out"}
            >
              {/* Flame */}
              <div className="h-8 flex items-center justify-center relative">
                {isLit ? (
                  <div className="relative flex flex-col items-center">
                    {/* Flame inner core */}
                    <div className="w-3.5 h-6 bg-amber-400 rounded-full animate-bounce shadow-[0_0_15px_#f59e0b] relative">
                      <div className="absolute inset-1 bg-yellow-200 rounded-full animate-pulse" />
                    </div>
                    {/* Smoke particle when hovering */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-amber-200 -mt-2 animate-ping">
                      💨
                    </div>
                  </div>
                ) : (
                  <div className="w-2 h-4 bg-slate-600 rounded-t-full opacity-60 flex flex-col items-center">
                    <div className="w-1 h-3 bg-slate-400/40 rounded-full animate-pulse -mt-2" />
                  </div>
                )}
              </div>

              {/* Candle Wick */}
              <div className="w-1 h-2 bg-slate-800" />

              {/* Candle Body (Striped) */}
              <div className="w-4 h-12 rounded-t-sm bg-gradient-to-b from-pink-400 via-amber-300 to-pink-500 shadow-md border-x border-pink-300/40" />
            </div>
          ))}
        </div>

        {/* CAKE TIER 1 (TOP TIER) */}
        <div className="relative w-48 sm:w-64 h-16 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 rounded-t-2xl shadow-xl border-t-4 border-yellow-200/60 flex items-center justify-center overflow-hidden z-10">
          {/* Frosting drips */}
          <div className="absolute top-0 inset-x-0 h-4 bg-white/90 rounded-b-xl shadow-xs" />
          
          {/* Cake Decorative Sprinkles */}
          <div className="flex gap-4 text-xs">
            <span>🍓</span>
            <span>🍒</span>
            <span className="font-extrabold text-slate-900 text-xs bg-amber-300/90 px-2 py-0.5 rounded-full shadow-xs">
              {age}
            </span>
            <span>🍒</span>
            <span>🍓</span>
          </div>
        </div>

        {/* CAKE TIER 2 (MIDDLE TIER) */}
        <div className="relative w-64 sm:w-80 h-20 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-t-2xl shadow-2xl border-t-4 border-amber-300/50 flex items-center justify-center overflow-hidden z-0">
          <div className="absolute top-0 inset-x-0 h-5 bg-amber-100/90 rounded-b-xl shadow-xs" />
          
          <span className="font-bold text-white tracking-widest uppercase text-xs sm:text-sm bg-slate-950/40 px-3 py-1 rounded-full border border-white/20 mt-3">
            Happy Birthday {personName}!
          </span>
        </div>

        {/* CAKE BASE STAND */}
        <div className="relative w-72 sm:w-96 h-6 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-300 rounded-b-2xl shadow-2xl border-t border-slate-400/50 -mt-1" />

        {/* Cut Slice Effect */}
        {isCakeCut && (
          <div className="mt-4 px-4 py-2 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-xs font-semibold animate-pulse flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Cake Sliced! Grab a virtual slice & enjoy! 🍰
          </div>
        )}

      </div>

      {/* Candle Controls Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        
        {/* Blow All Button */}
        <button
          onClick={blowOutAllCandles}
          disabled={allBlownOut}
          className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wind className="w-4 h-4" />
          <span>Blow Out Candles</span>
        </button>

        {/* Mic Blow Toggle */}
        <button
          onClick={toggleMicrophone}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all border shadow-lg flex items-center gap-2 ${isMicListening ? 'bg-rose-500 text-white border-rose-400 animate-pulse' : 'bg-slate-900 text-slate-200 border-white/20 hover:border-amber-400'}`}
        >
          <Mic className="w-4 h-4" />
          <span>{isMicListening ? `Mic Active (Vol: ${micVolume})` : "Use Mic to Blow"}</span>
        </button>

        {/* Cut Cake Button */}
        <button
          onClick={handleCutCake}
          className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2"
        >
          <Scissors className="w-4 h-4" />
          <span>Cut Cake 🍰</span>
        </button>

        {/* Relight Candles */}
        {allBlownOut && (
          <button
            onClick={relightCandles}
            className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-white/15 transition-all flex items-center gap-2"
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Relight Candles</span>
          </button>
        )}

      </div>

    </div>
  );
};