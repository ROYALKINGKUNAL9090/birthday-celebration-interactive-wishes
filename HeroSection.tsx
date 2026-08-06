import React, { useRef } from 'react';
import { Camera, Crown, Sparkles, Heart, Gift, Award, PartyPopper, Trash2, Plus } from 'lucide-react';
import { BirthdayProfile } from '../types';
import { THEMES } from '../utils/theme';
import { audioEngine } from '../utils/audio';
import { triggerFireworks } from '../utils/confetti';
import { compressImage } from '../utils/imageCompressor';

interface HeroSectionProps {
  profile: BirthdayProfile;
  onUpdatePhoto: (photoUrl: string) => void;
  onOpenCustomizer: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, onUpdatePhoto, onOpenCustomizer }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = THEMES[profile.theme];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, (dataUrl) => {
        onUpdatePhoto(dataUrl);
        audioEngine.playTapSound();
        triggerFireworks();
      });
    }
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdatePhoto('');
    audioEngine.playTapSound();
  };

  return (
    <div className="relative py-8 sm:py-12 px-4 overflow-hidden">
      
      {/* Decorative Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Milestone Age Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-6 animate-bounce shadow-lg">
          <PartyPopper className="w-4 h-4 text-amber-400" />
          <span>Celebrating Turning {profile.age} Years Young! 🎈</span>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>

        {/* Profile Photo Frame with Hat Overlay */}
        <div className="relative inline-block my-4 group">
          
          {/* Hat / Crown Sticker Overlay */}
          {profile.hatStyle === 'crown' && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-5xl z-20 animate-pulse drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">
              👑
            </div>
          )}
          {profile.hatStyle === 'party-hat' && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-6xl z-20 -rotate-12 hover:rotate-0 transition-transform">
              🥳
            </div>
          )}
          {profile.hatStyle === 'sparkle-halo' && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl z-20 text-amber-300 animate-spin">
              ✨
            </div>
          )}

          {/* Golden / Glowing Photo Frame */}
          <div className={`relative p-2 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-indigo-500 p-[4px] shadow-[0_0_40px_rgba(245,158,11,0.3)] transition-transform duration-300 hover:scale-105`}>
            <div className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden bg-slate-900 border-4 border-slate-950 flex items-center justify-center">
              {profile.photoUrl ? (
                <>
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Hover Change Photo Trigger */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-xs font-semibold"
                    title="Change Photo of Birthday Person"
                  >
                    <Camera className="w-6 h-6 text-amber-300 animate-bounce" />
                    <span>Change Photo</span>
                  </button>
                </>
              ) : (
                /* Visible Photo Option Placeholder when photo is removed */
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-slate-800/90 hover:bg-slate-800 text-amber-300 transition-colors p-4 group/opt"
                  title="Upload Photo of Birthday Person"
                >
                  <div className="p-3 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 group-hover/opt:scale-110 transition-transform">
                    <Camera className="w-8 h-8 text-amber-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-100">Add Photo</span>
                  <span className="text-[10px] text-amber-300/80 font-medium">Click to upload</span>
                </button>
              )}
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Quick Action Badges */}
          <div className="absolute bottom-1 right-1 flex items-center gap-1.5 z-20">
            {profile.photoUrl && (
              <button
                onClick={handleRemovePhoto}
                className="p-2 rounded-full bg-rose-600 border border-white/20 text-white hover:bg-rose-500 transition-all shadow-xl"
                title="Remove Photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-full bg-slate-900 border border-white/20 text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition-all shadow-xl"
              title={profile.photoUrl ? "Change Photo" : "Upload Photo"}
            >
              {profile.photoUrl ? <Camera className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Personalized Main Headline */}
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight mt-4 mb-3 bg-gradient-to-r from-amber-200 via-pink-200 to-amber-400 bg-clip-text text-transparent drop-shadow-md">
          {profile.headline.replace(/\[Name\]/g, profile.name)}
        </h2>

        {/* Subtitle Message */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
          Sending warmest wishes to <span className="text-amber-300 font-bold underline decoration-amber-500/50 underline-offset-4">{profile.name}</span> on this magnificent milestone! 🌟
        </p>

        {/* Sender Sign-off Badge */}
        {profile.senderName && (
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm text-pink-300 bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-full">
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
            <span>With love from {profile.senderName}</span>
          </div>
        )}

      </div>
    </div>
  );
};