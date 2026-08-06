export type ThemeId = 'magic-gold' | 'pastel-party' | 'neon-cyber' | 'rose-romance' | 'midnight-stars';

export interface BirthdayProfile {
  name: string;
  age: number;
  photoUrl: string;
  headline: string;
  message: string;
  senderName: string;
  birthDate: string; // YYYY-MM-DD
  theme: ThemeId;
  hatStyle: 'party-hat' | 'crown' | 'sparkle-halo' | 'none';
  stickers: string[];
  memories?: PhotoMemory[];
}

export interface GiftItem {
  id: string;
  title: string;
  category: 'voucher' | 'memory' | 'wish' | 'secret';
  description: string;
  iconName: string;
  unwrapped: boolean;
  color: string;
}

export interface PhotoMemory {
  id: string;
  url: string;
  caption: string;
  date?: string;
  sticker?: string;
}

export interface AudioSettings {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  tempo: number; // BPM multiplier (e.g. 1.0)
  instrument: 'synth-bell' | 'marimba' | 'piano' | '8bit';
}