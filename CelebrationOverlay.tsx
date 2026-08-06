import React, { useEffect } from 'react';
import { Sparkles, X, PartyPopper, Heart } from 'lucide-react';
import { triggerFireworks, fireConfettiCannon } from '../utils/confetti';
import { audioEngine } from '../utils/audio';

interface CelebrationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  personName: string;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  isOpen,
  onClose,
  personName
}) => {
  useEffect(() => {
    if (isOpen) {
      fireConfettiCannon();
      triggerFireworks();
      audioEngine.playCheerSound();
      audioEngine.playUnboxSound();

      const timer = setTimeout(() => {
        // Keeps user engaged
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-in fade-in zoom-in duration-300">
      
      {/* Sparkle background ambient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-pink-500/10 to-transparent pointer-events-none" />

      <div className="relative text-center max-w-xl w-full p-8 rounded-3xl bg-slate-900/90 border-2 border-amber-400/50 shadow-[0_0_80px_rgba(245,158,11,0.4)]">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-6xl mb-4 animate-bounce">
          🥳 🎉 🎂
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-purple-300 mb-4">
          Happy Birthday {personName}!
        </h2>

        <p className="text-base sm:text-lg text-amber-200 font-semibold max-w-md mx-auto my-4">
          May your day be filled with overwhelming happiness, sweet surprises, and unforgettable memories! ✨
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => {
              fireConfettiCannon();
              audioEngine.playCheerSound();
            }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 font-extrabold text-sm shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
          >
            <PartyPopper className="w-5 h-5" />
            <span>More Fireworks! 🎆</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full bg-slate-800 border border-white/20 text-white font-bold text-sm hover:bg-slate-700 transition-colors"
          >
            Back to Party
          </button>
        </div>

      </div>
    </div>
  );
};