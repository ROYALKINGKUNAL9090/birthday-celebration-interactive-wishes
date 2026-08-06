import { ThemeId } from '../types';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bgGradient: string;
  cardBg: string;
  accentColor: string;
  accentText: string;
  badgeBg: string;
  borderGlow: string;
  fontFamily: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'magic-gold': {
    id: 'magic-gold',
    name: 'Royal Magic Gold 👑',
    bgGradient: 'from-amber-950 via-slate-900 to-amber-950',
    cardBg: 'bg-slate-900/80 border-amber-500/30 text-amber-50',
    accentColor: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    accentText: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    borderGlow: 'shadow-[0_0_25px_rgba(245,158,11,0.25)] border-amber-500/40',
    fontFamily: 'font-serif'
  },
  'pastel-party': {
    id: 'pastel-party',
    name: 'Pastel Fiesta 🎈',
    bgGradient: 'from-pink-900 via-purple-950 to-indigo-950',
    cardBg: 'bg-purple-950/80 border-pink-500/30 text-pink-50',
    accentColor: 'bg-pink-500 hover:bg-pink-400 text-white',
    accentText: 'text-pink-400',
    badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    borderGlow: 'shadow-[0_0_25px_rgba(236,72,153,0.25)] border-pink-500/40',
    fontFamily: 'font-sans'
  },
  'neon-cyber': {
    id: 'neon-cyber',
    name: 'Cyber Celebration ⚡',
    bgGradient: 'from-zinc-950 via-cyan-950 to-purple-950',
    cardBg: 'bg-zinc-900/90 border-cyan-500/30 text-cyan-50',
    accentColor: 'bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold',
    accentText: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    borderGlow: 'shadow-[0_0_25px_rgba(6,182,212,0.3)] border-cyan-400/50',
    fontFamily: 'font-mono'
  },
  'rose-romance': {
    id: 'rose-romance',
    name: 'Rose Gold Elegance 🌹',
    bgGradient: 'from-rose-950 via-stone-900 to-pink-950',
    cardBg: 'bg-stone-900/80 border-rose-400/30 text-rose-50',
    accentColor: 'bg-rose-400 hover:bg-rose-300 text-stone-950',
    accentText: 'text-rose-300',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    borderGlow: 'shadow-[0_0_25px_rgba(251,113,133,0.25)] border-rose-400/40',
    fontFamily: 'font-serif'
  },
  'midnight-stars': {
    id: 'midnight-stars',
    name: 'Midnight Galaxy 🌌',
    bgGradient: 'from-slate-950 via-indigo-950 to-slate-900',
    cardBg: 'bg-indigo-950/70 border-indigo-500/30 text-indigo-50',
    accentColor: 'bg-indigo-500 hover:bg-indigo-400 text-white',
    accentText: 'text-indigo-400',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    borderGlow: 'shadow-[0_0_25px_rgba(99,102,241,0.25)] border-indigo-500/40',
    fontFamily: 'font-sans'
  }
};