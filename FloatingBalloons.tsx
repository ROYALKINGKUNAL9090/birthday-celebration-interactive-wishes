import React, { useState, useEffect } from 'react';
import { Sparkles, PartyPopper, RefreshCw } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface Balloon {
  id: string;
  color: string;
  left: number; // percentage
  speed: number; // seconds duration
  size: number; // px size
  popped: boolean;
  label?: string;
}

const BALLOON_COLORS = [
  'bg-pink-500 shadow-pink-500/50',
  'bg-amber-400 shadow-amber-400/50',
  'bg-cyan-400 shadow-cyan-400/50',
  'bg-purple-500 shadow-purple-500/50',
  'bg-emerald-400 shadow-emerald-400/50',
  'bg-rose-500 shadow-rose-500/50',
  'bg-indigo-500 shadow-indigo-500/50'
];

export const FloatingBalloons: React.FC = () => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);

  const spawnBalloons = (count = 12) => {
    const newBalloons: Balloon[] = Array.from({ length: count }).map((_, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random()}`,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      left: Math.floor(Math.random() * 85) + 5, // 5% to 90%
      speed: Math.floor(Math.random() * 8) + 10, // 10s to 18s float time
      size: Math.floor(Math.random() * 20) + 48, // 48px to 68px
      popped: false,
      label: idx % 3 === 0 ? '🎉' : idx % 4 === 0 ? '🎂' : '🎈'
    }));

    setBalloons(newBalloons);
  };

  useEffect(() => {
    spawnBalloons(10);
  }, []);

  const popBalloon = (id: string) => {
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    audioEngine.playPopSound();
    setScore((s) => s + 1);
  };

  return (
    <div className="relative my-8 px-4 max-w-4xl mx-auto">
      
      {/* Balloon Game Header Bar */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-2.5 backdrop-blur-md mb-4 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎈</span>
          <span className="text-xs sm:text-sm font-bold text-slate-200">
            Pop the Balloons!
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            Popped: {score}
          </span>
        </div>

        <button
          onClick={() => spawnBalloons(12)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Release Balloons</span>
        </button>
      </div>

      {/* Floating Canvas Box */}
      <div className="relative w-full h-72 sm:h-80 bg-gradient-to-b from-slate-950/40 via-purple-950/20 to-slate-950/60 rounded-3xl border border-white/10 overflow-hidden shadow-inner flex items-center justify-center">
        
        <p className="text-xs text-slate-400 pointer-events-none select-none z-0">
          Tap floating balloons to pop them! ✨
        </p>

        {balloons.map((b) => {
          if (b.popped) return null;

          return (
            <div
              key={b.id}
              onClick={() => popBalloon(b.id)}
              className="absolute cursor-pointer transition-transform active:scale-90 z-10 animate-float"
              style={{
                left: `${b.left}%`,
                bottom: '-20%',
                animation: `floatUp ${b.speed}s linear infinite`,
              }}
            >
              {/* Balloon Shape */}
              <div
                className={`rounded-full ${b.color} shadow-lg flex items-center justify-center text-lg select-none relative`}
                style={{ width: `${b.size}px`, height: `${b.size * 1.25}px` }}
              >
                {/* Shine Highlight */}
                <div className="absolute top-2 left-2 w-3 h-4 bg-white/40 rounded-full blur-xs" />
                <span>{b.label}</span>
              </div>

              {/* Balloon String */}
              <div className="w-0.5 h-10 bg-slate-400/50 mx-auto" />
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-200px) rotate(6deg);
          }
          100% {
            transform: translateY(-450px) rotate(-6deg);
            opacity: 0.2;
          }
        }
      `}</style>

    </div>
  );
};