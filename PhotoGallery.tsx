import React, { useState, useRef, useEffect } from 'react';
import { Camera, Plus, Trash2, Heart, Sparkles, Image as ImageIcon, ZoomIn, X } from 'lucide-react';
import { PhotoMemory } from '../types';
import { audioEngine } from '../utils/audio';
import { compressImage } from '../utils/imageCompressor';

const INITIAL_MEMORIES: PhotoMemory[] = [
  {
    id: 'm1',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop',
    caption: 'Best Birthday Moments! 🎉',
    date: 'Special Memory',
    sticker: '🥳'
  },
  {
    id: 'm2',
    url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop',
    caption: 'Celebration & Laughter 🎂',
    date: 'Good Times',
    sticker: '🌟'
  },
  {
    id: 'm3',
    url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=800&auto=format&fit=crop',
    caption: 'Sweet Birthday Treats 🍰',
    date: 'Memories',
    sticker: '💖'
  }
];

interface PhotoGalleryProps {
  memories?: PhotoMemory[];
  onUpdateMemories?: (memories: PhotoMemory[]) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ memories: propMemories, onUpdateMemories }) => {
  const [memories, setMemories] = useState<PhotoMemory[]>(propMemories && propMemories.length > 0 ? propMemories : INITIAL_MEMORIES);
  const [activePhoto, setActivePhoto] = useState<PhotoMemory | null>(null);
  const [newCaption, setNewCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal state if propMemories changes
  useEffect(() => {
    if (propMemories && propMemories.length > 0) {
      setMemories(propMemories);
    }
  }, [propMemories]);

  const updateAndNotify = (newMems: PhotoMemory[]) => {
    setMemories(newMems);
    if (onUpdateMemories) {
      onUpdateMemories(newMems);
    }
  };

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, (dataUrl) => {
        const newMem: PhotoMemory = {
          id: `m-${Date.now()}`,
          url: dataUrl,
          caption: newCaption.trim() || 'Unforgettable Birthday Memory ❤️',
          date: 'Today',
          sticker: '🎉'
        };
        const updated = [newMem, ...memories];
        updateAndNotify(updated);
        setNewCaption('');
        audioEngine.playTapSound();
      });
    }
  };

  const removePhoto = (id: string) => {
    const updated = memories.filter((m) => m.id !== id);
    updateAndNotify(updated);
    audioEngine.playTapSound();
  };

  return (
    <div className="my-12 px-4 max-w-5xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-300 flex items-center gap-2">
            <Camera className="w-6 h-6 text-amber-400" />
            Birthday Memory Gallery
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Upload and view precious photo memories of the birthday star!
          </p>
        </div>

        {/* Upload Button */}
        <div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Birthday Photo</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUploadPhoto}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Polaroid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {memories.map((mem) => (
          <div
            key={mem.id}
            className="relative bg-white text-slate-900 rounded-2xl p-3 shadow-2xl transition-transform hover:-rotate-1 hover:scale-105 duration-300 group"
          >
            {/* Washi Tape Accent */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-200/80 backdrop-blur-xs rotate-2 shadow-xs z-10" />

            {/* Sticker */}
            {mem.sticker && (
              <div className="absolute top-2 right-2 text-2xl z-20 drop-shadow-md">
                {mem.sticker}
              </div>
            )}

            {/* Photo Image Box */}
            <div
              onClick={() => setActivePhoto(mem)}
              className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 cursor-pointer group-hover:brightness-105"
            >
              <img
                src={mem.url}
                alt={mem.caption}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <ZoomIn className="w-8 h-8" />
              </div>
            </div>

            {/* Caption */}
            <div className="mt-3 px-1 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-slate-900 line-clamp-1">
                  {mem.caption}
                </p>
                {mem.date && (
                  <p className="text-[10px] text-slate-500 font-medium">
                    {mem.date}
                  </p>
                )}
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(mem.id);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full bg-slate-900 border border-white/20 rounded-3xl p-4 overflow-hidden shadow-2xl">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-2xl overflow-hidden bg-black max-h-[70vh]">
              <img
                src={activePhoto.url}
                alt={activePhoto.caption}
                className="w-full h-full object-contain mx-auto"
              />
            </div>

            <div className="mt-4 px-2 text-center">
              <h4 className="text-lg font-bold text-amber-300">
                {activePhoto.caption}
              </h4>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};