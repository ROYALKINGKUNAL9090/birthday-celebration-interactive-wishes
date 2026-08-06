import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Settings, Sparkles, Share2, Play, Pause, Check, X, Copy, Send, Link2, RefreshCw } from 'lucide-react';
import { audioEngine } from '../utils/audio';
import { BirthdayProfile } from '../types';
import { THEMES } from '../utils/theme';

interface HeaderProps {
  profile: BirthdayProfile;
  onOpenCustomizer: () => void;
  onTriggerCelebration: () => void;
}

export const Header: React.FC<HeaderProps> = ({ profile, onOpenCustomizer, onTriggerCelebration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showMusicMenu, setShowMusicMenu] = useState(false);
  const [instrument, setInstrument] = useState<'synth-bell' | 'marimba' | 'piano' | '8bit'>('synth-bell');
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isGeneratingShortLink, setIsGeneratingShortLink] = useState(false);

  const theme = THEMES[profile.theme];

  useEffect(() => {
    // Auto sync state
    setIsMuted(audioEngine.getMuted());
  }, []);

  const toggleMusic = () => {
    if (isPlaying) {
      audioEngine.stopMusic();
      setIsPlaying(false);
    } else {
      audioEngine.startMusic();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    audioEngine.setMuted(nextMute);
    setIsMuted(nextMute);
  };

  useEffect(() => {
    setShareUrl('');
  }, [profile]);

  const changeInstrument = (inst: 'synth-bell' | 'marimba' | 'piano' | '8bit') => {
    setInstrument(inst);
    audioEngine.setInstrument(inst);
  };

  const createShareUrl = async (): Promise<string> => {
    setIsGeneratingShortLink(true);
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.id) {
          setIsGeneratingShortLink(false);
          return `${window.location.origin}${window.location.pathname}?id=${data.id}`;
        }
      }
    } catch (err) {
      console.warn("Failed to create wish via API, using fallback", err);
    }

    setIsGeneratingShortLink(false);
    const params = new URLSearchParams();
    if (profile.name) params.append('name', profile.name);
    if (profile.age) params.append('age', profile.age.toString());
    if (profile.senderName) params.append('senderName', profile.senderName);

    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const copyToClipboardFallback = (text: string): boolean => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.warn('execCommand copy failed', err);
      return false;
    }
  };

  const handleCopyShareLink = async () => {
    setIsShareModalOpen(true);
    audioEngine.playTapSound();

    let fullUrl = shareUrl;
    if (!fullUrl) {
      fullUrl = await createShareUrl();
      setShareUrl(fullUrl);
    }

    let success = false;

    // 1. Try modern clipboard API if focused
    if (navigator.clipboard && document.hasFocus()) {
      try {
        await navigator.clipboard.writeText(fullUrl);
        success = true;
      } catch (err) {
        console.warn("navigator.clipboard writeText failed, using fallback", err);
      }
    }

    // 2. Fallback to execCommand if blocked
    if (!success) {
      success = copyToClipboardFallback(fullUrl);
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleRegenerateShortLink = async () => {
    audioEngine.playTapSound();
    const newUrl = await createShareUrl();
    setShareUrl(newUrl);
  };

  const handleNativeShare = async () => {
    const fullUrl = shareUrl || (await createShareUrl());
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Happy Birthday ${profile.name}! 🎉`,
          text: `Check out this special birthday celebration page for ${profile.name}! 🎂✨`,
          url: fullUrl
        });
      } catch (e) {
        console.warn("Native share dismissed or failed", e);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/60 border-b border-white/10 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-end gap-3">
        
        {/* Action Controls (Clean Top Right Bar) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Music Controller */}
          <div className="relative">
            <div className="flex items-center bg-slate-900/80 border border-white/15 rounded-full p-1 shadow-inner">
              <button
                onClick={toggleMusic}
                className={`p-2 rounded-full transition-all ${isPlaying ? 'bg-amber-400 text-slate-950 animate-pulse' : 'text-slate-300 hover:text-white'}`}
                title={isPlaying ? "Pause Birthday Tune" : "Play Birthday Tune"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={toggleMute}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setShowMusicMenu(!showMusicMenu)}
                className="p-2 text-slate-400 hover:text-amber-300 transition-colors hidden sm:block"
                title="Audio Instrument Settings"
              >
                <Music className="w-4 h-4" />
              </button>
            </div>

            {/* Instrument Dropdown */}
            {showMusicMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/20 rounded-2xl p-3 shadow-2xl text-xs z-50 animate-in fade-in zoom-in duration-150">
                <p className="font-semibold text-slate-400 mb-2 px-1">Sound Synth Instrument</p>
                <div className="space-y-1">
                  {(['synth-bell', 'marimba', 'piano', '8bit'] as const).map((inst) => (
                    <button
                      key={inst}
                      onClick={() => {
                        changeInstrument(inst);
                        setShowMusicMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${instrument === inst ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                      <span className="capitalize">{inst.replace('-', ' ')}</span>
                      {instrument === inst && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Party Mode Blast Button */}
          <button
            onClick={onTriggerCelebration}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-400 hover:to-indigo-400 text-white shadow-lg shadow-pink-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span className="hidden md:inline">Party Blast!</span>
          </button>

          {/* Share Link */}
          <button
            onClick={handleCopyShareLink}
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium rounded-full bg-slate-900 border border-white/15 text-slate-200 hover:border-amber-400 hover:text-amber-300 transition-all flex items-center gap-1.5"
            title="Copy Shareable Birthday Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          {/* Customize Button */}
          <button
            onClick={onOpenCustomizer}
            className={`p-2 sm:px-3 sm:py-1.5 text-xs font-medium rounded-full ${theme.accentColor} transition-all flex items-center gap-1.5 shadow-md`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Customize</span>
          </button>

        </div>
      </div>

      {/* Interactive Share Modal with Short Link Generator */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl text-slate-100">
            
            {/* Close Button */}
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Link2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white">Share Shortened Link</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    Short URL
                  </span>
                </div>
                <p className="text-xs text-slate-400">Creates a compact link preserving photos, letter & music</p>
              </div>
            </div>

            {/* Status Alert */}
            {copied && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Short link copied to clipboard! Ready to send to friends.</span>
              </div>
            )}

            {/* URL Input Box & Copy Action */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Short Shareable URL
                </label>
                <button
                  onClick={handleRegenerateShortLink}
                  disabled={isGeneratingShortLink}
                  className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline disabled:opacity-50"
                  title="Generate new short link"
                >
                  <RefreshCw className={`w-3 h-3 ${isGeneratingShortLink ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingShortLink ? 'Shortening...' : 'New Link'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={isGeneratingShortLink ? 'Generating short link...' : (shareUrl || 'Generating link...')}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-400 select-all"
                />
                <button
                  onClick={handleCopyShareLink}
                  disabled={isGeneratingShortLink}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors shadow-md"
                >
                  {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Short Link'}</span>
                </button>
              </div>
            </div>

            {/* Feature Note */}
            <div className="mb-4 p-3 rounded-xl bg-slate-950/60 border border-white/10 text-[11px] text-slate-400 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Your custom profile image, letter, photo gallery memories, and music choices are saved in this short link so your friends see everything clearly!
              </span>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${profile.name}'s Birthday Celebration! 🎉 ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </a>

              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share App</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
};