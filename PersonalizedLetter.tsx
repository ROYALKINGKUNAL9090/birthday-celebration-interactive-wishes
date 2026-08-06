import React, { useState, useEffect } from 'react';
import { Mail, Sparkles, Heart, Copy, Check, Wand2, RefreshCw, PenTool } from 'lucide-react';
import { BirthdayProfile } from '../types';
import { THEMES } from '../utils/theme';
import { audioEngine } from '../utils/audio';
import { generateWishWithAI, WishTone } from '../utils/aiWish';

interface PersonalizedLetterProps {
  profile: BirthdayProfile;
  onUpdateMessage: (newMessage: string) => void;
}

export const PersonalizedLetter: React.FC<PersonalizedLetterProps> = ({ profile, onUpdateMessage }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [fontStyle, setFontStyle] = useState<'font-serif' | 'font-sans' | 'font-mono'>('font-serif');
  const [copied, setCopied] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState<WishTone>('heartfelt');

  const theme = THEMES[profile.theme];

  // Typewriter effect
  useEffect(() => {
    if (!isOpen) return;

    setTypedText('');
    setIsTyping(true);
    let index = 0;
    const fullMessage = profile.message;

    const timer = setInterval(() => {
      if (index < fullMessage.length) {
        setTypedText((prev) => prev + fullMessage.charAt(index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [profile.message, isOpen]);

  const handleGenerateAIWish = async (tone: WishTone) => {
    setSelectedTone(tone);
    setIsAiLoading(true);
    audioEngine.playTapSound();

    try {
      const generated = await generateWishWithAI(profile.name, profile.age, tone, profile.senderName);
      onUpdateMessage(generated);
    } catch (err) {
      console.error("AI Wish Error:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(profile.message);
    setCopied(true);
    audioEngine.playTapSound();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-12 px-4 max-w-3xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-300 flex items-center justify-center gap-2">
          <Mail className="w-6 h-6 text-amber-400" />
          A Special Birthday Note
          <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse" />
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          A heartfelt personalized wish message written especially for {profile.name}
        </p>
      </div>

      {/* Main Letter Envelope / Card Container */}
      <div className={`relative rounded-3xl p-6 sm:p-10 ${theme.cardBg} border-2 ${theme.borderGlow} shadow-2xl backdrop-blur-md transition-all`}>
        
        {/* Envelope Seal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-center font-bold text-xs">
              💌
            </div>
            <div>
              <p className="text-xs text-slate-400">To the Birthday Star</p>
              <p className="text-sm font-bold text-amber-300">{profile.name}</p>
            </div>
          </div>

          {/* Font Selector & Copy */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFontStyle(fontStyle === 'font-serif' ? 'font-sans' : fontStyle === 'font-sans' ? 'font-mono' : 'font-serif')}
              className="px-3 py-1 rounded-full bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold"
              title="Switch Font Style"
            >
              Font Style
            </button>

            <button
              onClick={handleCopyLetter}
              className="p-2 rounded-full bg-slate-800 border border-white/10 text-slate-300 hover:text-amber-300 text-xs"
              title="Copy Letter Text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Letter Body / Typewriter Display */}
        <div className={`min-h-[160px] text-base sm:text-lg leading-relaxed text-slate-100 ${fontStyle} whitespace-pre-wrap`}>
          {typedText}
          {isTyping && <span className="inline-block w-2 h-5 bg-amber-400 ml-1 animate-pulse" />}
        </div>

        {/* Sender Signature Footer */}
        {profile.senderName && (
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-end gap-2 text-sm text-pink-300 font-semibold italic">
            <span>With love,</span>
            <span className="not-italic text-amber-300 font-bold">{profile.senderName} ❤️</span>
          </div>
        )}

        {/* AI Wish Generator Quick Toolbar */}
        <div className="mt-8 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
              <Wand2 className="w-4 h-4 text-amber-400" />
              <span>Generate AI Wish Style:</span>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {(['heartfelt', 'funny', 'poem', 'inspirational', 'short'] as WishTone[]).map((tone) => (
                <button
                  key={tone}
                  onClick={() => handleGenerateAIWish(tone)}
                  disabled={isAiLoading}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${selectedTone === tone ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-800/80 text-slate-300 border-white/10 hover:border-amber-400'}`}
                >
                  {isAiLoading && selectedTone === tone ? (
                    <RefreshCw className="w-3 h-3 animate-spin inline mr-1" />
                  ) : null}
                  <span className="capitalize">{tone}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};