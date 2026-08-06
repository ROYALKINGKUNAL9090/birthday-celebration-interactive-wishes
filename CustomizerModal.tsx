import React, { useState } from 'react';
import { X, Sparkles, Check, Crown, Palette, User, Music, Heart, Wand2, RefreshCw, Upload, Trash2, Camera } from 'lucide-react';
import { BirthdayProfile, ThemeId } from '../types';
import { THEMES } from '../utils/theme';
import { audioEngine } from '../utils/audio';
import { generateWishWithAI, WishTone } from '../utils/aiWish';
import { compressImage } from '../utils/imageCompressor';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BirthdayProfile;
  onSaveProfile: (updated: BirthdayProfile) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<BirthdayProfile>({ ...profile });
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSave = () => {
    onSaveProfile(form);
    audioEngine.playTapSound();
    onClose();
  };

  const handleGenerateWish = async (tone: WishTone) => {
    setIsAiLoading(true);
    try {
      const generated = await generateWishWithAI(form.name, form.age, tone, form.senderName);
      setForm((prev) => ({ ...prev, message: generated }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, (dataUrl) => {
        setForm((prev) => ({ ...prev, photoUrl: dataUrl }));
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Customize Birthday Celebration
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-6">
          
          {/* Section: Person Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>Birthday Star Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="e.g. Alex"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Age Turning
                </label>
                <input
                  type="number"
                  value={form.age}
                  min={1}
                  max={120}
                  onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Sender Name (Your Name)
                </label>
                <input
                  type="text"
                  value={form.senderName}
                  onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="e.g. Bestie"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Photo Avatar
                </label>
                {form.photoUrl ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={form.photoUrl}
                      alt="Avatar preview"
                      className="w-9 h-9 rounded-full object-cover border border-amber-400 shrink-0 bg-slate-950"
                    />
                    <input
                      type="text"
                      value={form.photoUrl}
                      onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                      placeholder="Image URL"
                    />
                    <label className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer flex items-center gap-1 shrink-0" title="Upload New Image">
                      <Upload className="w-4 h-4" />
                      <input type="file" onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                    </label>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, photoUrl: '' })}
                      className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-bold text-xs shrink-0 flex items-center gap-1"
                      title="Remove Person Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border-2 border-dashed border-amber-400/60 text-amber-300 hover:bg-slate-750 font-semibold text-xs cursor-pointer flex items-center justify-center gap-2 transition-colors">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>Upload Person Photo</span>
                    <input type="file" onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Section: Hat / Crown Accessory */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Hat / Crown Accessory
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'crown', label: '👑 Crown' },
                { id: 'party-hat', label: '🥳 Party Hat' },
                { id: 'sparkle-halo', label: '✨ Halo' },
                { id: 'none', label: '❌ None' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setForm({ ...form, hatStyle: item.id as any })}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${form.hatStyle === item.id ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-white/10 hover:border-amber-400'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Themes */}
          <div>
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5 mb-2">
              <Palette className="w-4 h-4" />
              <span>Color Atmosphere & Theme</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(THEMES).map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setForm({ ...form, theme: th.id })}
                  className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${form.theme === th.id ? 'border-amber-400 bg-amber-500/20 text-amber-200' : 'border-white/10 bg-slate-800 text-slate-300 hover:bg-slate-750'}`}
                >
                  <div className="font-bold">{th.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Custom Headline & Wish Message */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Custom Wish Note
              </label>

              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleGenerateWish('heartfelt')}
                  disabled={isAiLoading}
                  className="px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[11px] font-semibold flex items-center gap-1"
                >
                  {isAiLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                  <span>Generate AI Wish</span>
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-800 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 font-extrabold text-xs shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Apply Customizations</span>
          </button>
        </div>

      </div>
    </div>
  );
};